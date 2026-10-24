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
   const metrics=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,h1:document.querySelectorAll('main h1').length,cards:document.querySelectorAll('[data-library-item]').length,items:document.querySelector('[data-count-total]').textContent,filter:document.querySelectorAll('[data-category]').length}));
   assert(metrics.scroll<=metrics.client+1,'horizontal overflow '+JSON.stringify(metrics));
   assert(metrics.h1===1,'not exactly one h1');
   assert(metrics.cards===1&&metrics.items==='01','catalog did not render exactly one real skill');
   assert(metrics.filter===2,'category list incorrect');
   assert((await page.$eval('[data-library-item]',x=>x.querySelector('h3').textContent)).includes('Web & UI Design'),'wrong published skill');
   await page.type('[data-library-search]','not-present');
   assert(await page.$eval('[data-library-item]',x=>getComputedStyle(x).display==='none'),'filter should hide item');
   assert(await page.$eval('[data-library-empty]',x=>!x.hidden),'empty state missing');
   await page.click('[data-library-reset]');
   assert(await page.$eval('[data-library-empty]',x=>x.hidden),'reset did not restore list');
   await page.click('[data-category="design"]');
   assert(await page.$eval('[data-category="design"]',x=>x.getAttribute('aria-pressed'))==='true','category not selected');
   assert(await page.$eval('[data-library-item]',x=>getComputedStyle(x).display!=='none'),'Design category not showing skill');
   const install=await page.$eval('[data-library-copy]',x=>x.dataset.libraryCopy);
   assert(install==='npx skills add mr-bappi/tophive-skills -g','install command should be real');
   await page.click('[data-library-copy]');
   await page.waitForFunction(()=>document.querySelector('[data-toast]').dataset.visible==='true',{timeout:2200});
   await new Promise(resolve=>setTimeout(resolve,230));

   if(width===390){await page.click('[data-menu-toggle]');assert(await page.$eval('[data-nav]',x=>x.dataset.open)==='true','mobile menu did not open');await page.click('[data-menu-toggle]')}
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
 const page=await browser.newPage();
 await page.goto(`http://127.0.0.1:${port}/`,{waitUntil:'load'});
 assert(await page.$eval('.nav-action',x=>x.getAttribute('href'))==='library/','homepage main CTA not pointing to library');
 assert(await page.$eval('.hero-actions .btn',x=>x.getAttribute('href'))==='library/','hero CTA not pointing to library');
 await page.goto(`http://127.0.0.1:${port}/docs/`,{waitUntil:'load'});
 assert(await page.$eval('[data-nav] a',x=>x.getAttribute('href'))==='../library/','docs nav incorrect');
 await page.goto(`http://127.0.0.1:${port}/skills/tophive-design/`,{waitUntil:'load'});
 assert(await page.$eval('[data-nav] a',x=>x.getAttribute('href'))==='../../library/','skill detail nav incorrect');
 console.log('PASS cross-page library navigation');
 await page.close();await browser.close();
 console.log('SUMMARY: 6 library viewports + cross-page links; failures',errors.length);
 if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>server.close());
