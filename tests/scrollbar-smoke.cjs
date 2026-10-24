const path=require('node:path');
const {pathToFileURL}=require('node:url');
const puppeteer=require('puppeteer');
const root=path.resolve(__dirname,'..');
const pages=[['home','index.html'],['library','library/index.html'],['docs','docs/index.html'],['detail','skills/tophive-design/index.html']];
const widths=[390,1024,1440,1600,1920],errors=[];
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
 for(const [name,relative] of pages){
  for(const width of widths){
   const page=await browser.newPage();
   await page.setViewport({width,height:900,deviceScaleFactor:1});
   try{
    await page.goto(pathToFileURL(path.join(root,relative)).href,{waitUntil:'load'});
    const original=await page.evaluate(()=>{
     const html=document.documentElement;
     const header=document.querySelector('.site-header');
     const frameWidth=parseFloat(getComputedStyle(document.body,'::before').width);
     const frameLeft=(document.body.getBoundingClientRect().width-frameWidth)/2;
     const markerLeft=parseFloat(getComputedStyle(header,'::before').left);
     const markerRight=parseFloat(getComputedStyle(header,'::after').right);
     const navWidth=header.querySelector('.nav-wrap').getBoundingClientRect().width;
     const probe=document.createElement('div');
     probe.style.cssText='position:absolute;top:-9999px;left:-9999px;width:100px;height:100px;overflow:scroll;scrollbar-width:auto;visibility:hidden';
     const inner=document.createElement('div');inner.style.height='200px';probe.append(inner);
     html.append(probe);const nativeWidth=probe.offsetWidth-probe.clientWidth;probe.remove();
     return {nativeWidth,frameWidth,frameLeft,markerLeft,markerRight,navWidth,
      classic:html.dataset.classicScrollbar==='true',gutter:getComputedStyle(html).scrollbarGutter,
      width:html.clientWidth,bodyWidth:document.body.getBoundingClientRect().width,
      left:document.querySelector('.site-header .brand').getBoundingClientRect().left,
      cta:document.querySelector('.site-header .nav-action').getBoundingClientRect().right,
      scrollWidth:html.scrollWidth
     };
    });
    if(original.classic!==(original.nativeWidth>0))throw Error('Mode detection incorrect: '+JSON.stringify(original));
    if(original.gutter!==(original.classic?'stable':'auto'))throw Error('Wrong gutter for platform: '+JSON.stringify(original));
    if(!original.classic&&Math.abs(original.width-original.bodyWidth)>1)throw Error('Blank strip on overlay platform '+JSON.stringify(original));
    if(original.scrollWidth>original.width+1)throw Error('Horizontal overflow '+JSON.stringify(original));
    // The approved Grid Ruler MUST surround the same constrained 1240px
    // layout at every desktop width; outside whitespace is intentional.
    if(width>=1440){
      if(Math.abs(original.navWidth-1240)>1)
        throw Error('Approved content width changed '+JSON.stringify(original));
      if(Math.abs(original.frameWidth-original.navWidth)>1)
        throw Error('Decorative frame detached from 1240px content '+JSON.stringify(original));
      if(Math.abs(original.frameLeft-(original.width-original.navWidth)/2)>1)
        throw Error('Grid frame not centered around content '+JSON.stringify(original));
      if(Math.abs(original.frameLeft-original.markerLeft)>1||
         Math.abs(original.frameLeft-original.markerRight)>1)
        throw Error('Header ruler nodes no longer align with rails '+JSON.stringify(original));
    }
    await page.evaluate(()=>{
     document.querySelector('main').style.setProperty('display','none','important');
     document.querySelector('footer').style.setProperty('display','none','important');
    });
    const short=await page.evaluate(()=>({
      scrollHeight:document.documentElement.scrollHeight,
      clientWidth:document.documentElement.clientWidth,
      left:document.querySelector('.site-header .brand').getBoundingClientRect().left,
      cta:document.querySelector('.site-header .nav-action').getBoundingClientRect().right
    }));
    if(short.scrollHeight>901)throw Error('Short page remains scrollable: '+short.scrollHeight);
    if(Math.abs(short.left-original.left)>1||Math.abs(short.cta-original.cta)>1||short.clientWidth!==original.width)
      throw Error('Page shifted when scrollbar no longer needed '+JSON.stringify({original,short}));
    await page.evaluate(()=>{
     document.querySelector('main').style.removeProperty('display');
     document.querySelector('footer').style.removeProperty('display');
     document.documentElement.style.overflow='hidden';
    });
    const scrollLocked=await page.evaluate(()=>({
      left:document.querySelector('.site-header .brand').getBoundingClientRect().left,
      width:document.documentElement.clientWidth
    }));
    if(Math.abs(scrollLocked.left-original.left)>1||scrollLocked.width!==original.width)
      throw Error('Scroll lock changed layout '+JSON.stringify({original,scrollLocked}));
    await page.evaluate(()=>{
     document.documentElement.style.overflow='';
     document.documentElement.dataset.classicScrollbar='true';
    });
    const reserved=await page.evaluate(()=>({
      gutter:getComputedStyle(document.documentElement).scrollbarGutter,
      brandLeft:document.querySelector('.site-header .brand').getBoundingClientRect().left
    }));
    if(reserved.gutter!=='stable')throw Error('Traditional scrollbar fallback missing');
    await page.evaluate(()=>{
     document.querySelector('main').style.setProperty('display','none','important');
     document.querySelector('footer').style.setProperty('display','none','important');
    });
    const reservedShort=await page.evaluate(()=>({
      brandLeft:document.querySelector('.site-header .brand').getBoundingClientRect().left,
      gutter:getComputedStyle(document.documentElement).scrollbarGutter
    }));
    if(Math.abs(reserved.brandLeft-reservedShort.brandLeft)>1)
      throw Error('Traditional gutter jump '+JSON.stringify({reserved,reservedShort}));
    console.log('PASS scrollbar adapts',name,width,'platform '+(original.classic?'classic':'overlay'));
   }catch(e){errors.push(name+' '+width+': '+e.message);console.error('FAIL',name,width,e.message)}
   await page.close();
  }
 }
 await browser.close();
 console.log('SUMMARY',pages.length*widths.length,'route/viewport scrollbar checks; failures',errors.length);
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
