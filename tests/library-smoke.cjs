const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const puppeteer=require('puppeteer');
const root=path.resolve(__dirname,'..'),errors=[];
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.png':'image/png','.zip':'application/zip','.md':'text/plain','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=path.join(root,pathname.endsWith('/')?pathname+'index.html':pathname);
 if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);res.end('Not found');return}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
 fs.createReadStream(file).pipe(res);
});
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const port=server.address().port;
 const browser=await puppeteer.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',args:['--no-sandbox']});
 for(const width of [360,390,768,1024,1440,1920]){
  const page=await browser.newPage();await page.setViewport({width,height:900,deviceScaleFactor:1});
  const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));page.on('response',res=>{if(res.status()>=400)pageErrors.push(`${res.status()} ${res.url()}`)});
  try{
   await page.goto(`http://127.0.0.1:${port}/library/`,{waitUntil:'networkidle0',timeout:14000});
   const metrics=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,h1:document.querySelectorAll('main h1').length,cards:document.querySelectorAll('[data-library-item]').length,items:document.querySelector('[data-results-count]').textContent,filterHidden:document.querySelector('[data-category-container]').hidden}));
   assert(metrics.scroll<=metrics.client+1,'horizontal overflow '+JSON.stringify(metrics));
   assert(metrics.h1===1,'not exactly one h1');
   assert(metrics.cards===1&&metrics.items==='Showing 1 skill','catalog did not render exactly one real skill');
   assert(await page.$eval('table.directory-table',e=>!!e.querySelector('thead th')),'semantic table absent');
   assert(!metrics.filterHidden,'Single Design category should remain visible for global listing consistency');
   assert(await page.$$eval('[data-category]',buttons=>buttons.map(button=>button.textContent.trim()).join('|'))==='All skills01|Design01','Single-category pills and counts incorrect');
   assert(await page.$eval('[data-category="all"]',button=>button.getAttribute('aria-pressed'))==='true','All skills active state missing');
   assert((await page.$eval('[data-library-item]',x=>x.querySelector('.directory-name').textContent)).includes('Web & UI Design'),'wrong published skill');
   await page.type('[data-library-search]','not-present');
   assert(await page.$eval('[data-library-item]',x=>getComputedStyle(x).display==='none'),'filter should hide item');
   assert(await page.$eval('[data-library-empty]',x=>!x.hidden),'empty state missing');
   await page.click('[data-library-reset]');
   assert(await page.$eval('[data-library-empty]',x=>x.hidden),'reset did not restore list');
   assert(await page.$eval('[data-category-container]',x=>getComputedStyle(x).display!=='none'),'Single-category filter must stay visible');
   await page.click('[data-category="design"]');
   assert(await page.$eval('[data-category="design"]',x=>x.getAttribute('aria-pressed'))==='true','Single Design filter did not activate');
   assert(await page.$eval('[data-results-count]',x=>x.textContent)==='Showing 1 skill','Design filter result count incorrect');
   await page.type('[data-library-search]','not-present');
   assert(await page.$eval('[data-library-empty]',x=>!x.hidden),'Search inside Design filter failed');
   await page.click('[data-library-reset]');
   assert(await page.$eval('[data-category="all"]',x=>x.getAttribute('aria-pressed'))==='true','Category/search reset did not restore all');
   assert(await page.$eval('[data-library-item]',x=>getComputedStyle(x).display!=='none'),'Reset did not recover listing');
   const install=await page.$eval('[data-library-copy]',x=>x.dataset.libraryCopy);
   assert(install==='npx skills add mr-bappi/tophive-skills -g','install command should be real');
   await page.click('[data-library-copy]');
   await page.waitForFunction(()=>document.querySelector('[data-toast]').dataset.visible==='true',{timeout:2200});
   await new Promise(resolve=>setTimeout(resolve,230));

   if(width===390){await page.click('[data-menu-toggle]');assert(await page.$eval('[data-nav]',x=>x.dataset.open)==='true','mobile menu did not open');await page.click('[data-menu-toggle]')}
   await page.$eval('[data-toast]',el=>el.dataset.visible='false');
   await new Promise(resolve=>setTimeout(resolve,300));
   await page.mouse.move(2,2);
   if(width===1440||width===390){
    const out=path.join(root,'tests/screenshots','library-'+width+'.png');
    fs.mkdirSync(path.dirname(out),{recursive:true});
    await page.screenshot({path:out,fullPage:true,animations:'disabled'});console.log('SCREENSHOT',out)
   }
   assert(pageErrors.length===0,'browser errors '+pageErrors.join(' | '));
   console.log('PASS library',width);
  }catch(e){errors.push(width+': '+e.message);console.log('FAIL library',width,e.message)}
  await page.close();
 }
 // Multi-category fixture is test-only: verify filter controls appear when needed.
 const multi=await browser.newPage();
 await multi.setRequestInterception(true);
 multi.on('request',async req=>{
  if(req.url().endsWith('/catalog.json')){
   const data=JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8'));
   data.skills.push({slug:'test-audit',name:'Fixture Audit',description:'Test-only engineering checks',category:'Engineering',version:'0.0.0',install:'npx skills add test-only'});
   await req.respond({status:200,contentType:'application/json',body:JSON.stringify(data)});
  }else await req.continue();
 });
 await multi.goto(`http://127.0.0.1:${port}/library/`,{waitUntil:'networkidle0'});
 assert(await multi.$eval('[data-category-container]',x=>!x.hidden),'Two-category filter should appear');
 assert(await multi.$$eval('[data-category]',bs=>bs.map(b=>b.textContent.trim()).join('|'))==='All skills02|Design01|Engineering01','Multi-category pills and their counts incorrect');
 await multi.click('[data-category="engineering"]');
 assert(await multi.$eval('[data-results-count]',x=>x.textContent)==='Showing 1 skill','Engineering filter not working');
 assert(await multi.$eval('[data-category="engineering"]',x=>x.getAttribute('aria-pressed'))==='true','Filter aria-pressed not updated');
 assert(await multi.$eval('[data-library-item]',x=>getComputedStyle(x).display==='none'),'Wrong category row remains visible');
 await multi.click('[data-category="all"]');
 assert(await multi.$eval('[data-results-count]',x=>x.textContent)==='Showing 2 skills','All category not restored');
 assert(await multi.$eval('[data-library-total-label]',x=>x.textContent)==='02 SKILLS','Shared total badge did not reflect loaded catalog');
 console.log('PASS multi-category test fixture');
 await multi.close();
 // Without JavaScript, the truthful first skill remains navigable.
 const nojs=await browser.newPage();
 await nojs.setJavaScriptEnabled(false);
 await nojs.goto(`http://127.0.0.1:${port}/library/`,{waitUntil:'load'});
 assert(await nojs.$eval('[data-library-item]',x=>!!x.querySelector('.directory-name')),'No-JS first skill missing');
 assert(await nojs.$eval('[data-category-container]',x=>x.hidden),'No-JS category filter should be hidden');
 console.log('PASS no-JS static listing');
 await nojs.close();
 const page=await browser.newPage();
 await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'load'});
 assert(await page.$eval('.nav-action',x=>new URL(x.href).pathname)==='/library/','homepage main CTA not pointing to library');
 assert(await page.$eval('.hero-actions .btn',x=>new URL(x.href).pathname)==='/library/','hero CTA not pointing to library');
 await page.goto(`http://127.0.0.1:${port}/docs/`,{waitUntil:'load'});
 assert(await page.$eval('[data-nav] a',x=>new URL(x.href).pathname)==='/library/','docs nav incorrect');
 await page.goto(`http://127.0.0.1:${port}/skills/tophive-design/`,{waitUntil:'load'});
 assert(await page.$eval('[data-nav] a',x=>new URL(x.href).pathname)==='/library/','skill detail nav incorrect');
 console.log('PASS cross-page library navigation');
 await page.close();
 // One visual header contract, tested across all four static pages and breakpoints.
 for(const width of [390,1440]){
  let reference=null;
  for(const route of ['/','/library/','/docs/','/skills/tophive-design/']){
   const view=await browser.newPage();
   await view.setViewport({width,height:850});
   await view.goto('http://127.0.0.1:'+port+route,{waitUntil:'load'});
   const state=await view.evaluate(()=>{
    const header=document.querySelector('[data-shared-header]');
    if(!header)return null;
    const cs=getComputedStyle(header);
    const b=getComputedStyle(header.querySelector('.brand'));
    const cta=getComputedStyle(header.querySelector('.nav-action'));
    return {height:Math.round(header.getBoundingClientRect().height),
      bg:cs.backgroundColor,color:cs.color,
      brandSize:b.fontSize,brandWeight:b.fontWeight,
      ctaPadding:cta.padding,ctaRadius:cta.borderRadius,
      navText:[...header.querySelectorAll('nav a')].map(a=>a.textContent.trim()).join('|'),
      ctaText:header.querySelector('.nav-action').textContent.trim()};
   });
   assert(!!state,'Shared header missing on '+route);
   if(!reference)reference=state;
   else assert(JSON.stringify(state)===JSON.stringify(reference),'Global header style drift at '+width+' '+route+' expected '+JSON.stringify(reference)+' actual '+JSON.stringify(state));
   await view.close();
  }
  console.log('PASS identical global header',width,'4 pages');
 }
 await browser.close();
 console.log('SUMMARY: 6 viewports, 1 multi-category fixture, no-JS fallback, navigation; failures',errors.length);
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
