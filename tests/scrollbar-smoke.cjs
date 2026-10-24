const path=require('node:path');
const {pathToFileURL}=require('node:url');
const puppeteer=require('puppeteer');
const root=path.resolve(__dirname,'..');
const pages=[['home','index.html'],['library','library/index.html'],['docs','docs/index.html'],['detail','skills/tophive-design/index.html']];
const widths=[390,1024,1440],errors=[];
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
 for(const [name,relative] of pages){
  for(const width of widths){
   const page=await browser.newPage();
   await page.setViewport({width,height:900,deviceScaleFactor:1});
   try{
    await page.goto(pathToFileURL(path.join(root,relative)).href,{waitUntil:'load'});
    const original=await page.evaluate(()=>{
     const header=document.querySelector('.site-header'),brand=header.querySelector('.brand').getBoundingClientRect(),nav=header.querySelector('.nav-action').getBoundingClientRect();
     return {scrollbarGutter:getComputedStyle(document.documentElement).scrollbarGutter,
      scrollHeight:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,
      clientWidth:document.documentElement.clientWidth,left:brand.left,ctaRight:nav.right,
      headerWidth:header.getBoundingClientRect().width};
    });
    if(original.scrollbarGutter!=='stable')throw Error('Scrollbar lane not reserved '+JSON.stringify(original));
    if(original.scrollWidth>original.clientWidth+1)throw Error('Horizontal overflow '+JSON.stringify(original));
    await page.evaluate(()=>{
     document.querySelector('main').style.setProperty('display','none','important');
     document.querySelector('footer').style.setProperty('display','none','important');
    });
    const short=await page.evaluate(()=>({
     scrollHeight:document.documentElement.scrollHeight,
     brandLeft:document.querySelector('.site-header .brand').getBoundingClientRect().left,
     ctaRight:document.querySelector('.site-header .nav-action').getBoundingClientRect().right,
     clientWidth:document.documentElement.clientWidth
    }));
    if(short.scrollHeight>901)throw Error('Simulated short page remains scrollable '+short.scrollHeight);
    if(Math.abs(short.brandLeft-original.left)>1||Math.abs(short.ctaRight-original.ctaRight)>1||short.clientWidth!==original.clientWidth)
     throw Error('Page jumped without scrollbar '+JSON.stringify({original,short}));
    await page.evaluate(()=>{
     document.querySelector('main').style.removeProperty('display');
     document.querySelector('footer').style.removeProperty('display');
     document.documentElement.style.overflow='hidden';
    });
    const hidden=await page.evaluate(()=>({
     brandLeft:document.querySelector('.site-header .brand').getBoundingClientRect().left,
     clientWidth:document.documentElement.clientWidth
    }));
    if(Math.abs(hidden.brandLeft-original.left)>1||hidden.clientWidth!==original.clientWidth)
     throw Error('Scroll-lock caused layout shift '+JSON.stringify({original,hidden}));
    console.log('PASS scrollbar stable',name,width);
   }catch(e){errors.push(name+' '+width+': '+e.message);console.error('FAIL',name,width,e.message)}
   await page.close();
  }
 }
 await browser.close();
 console.log('SUMMARY',pages.length*widths.length,'route/viewport scrollbar checks; failures',errors.length);
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
