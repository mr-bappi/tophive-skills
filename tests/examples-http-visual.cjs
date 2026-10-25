"use strict";
const path=require("node:path");
const fs=require("node:fs");
const puppeteer=require("puppeteer");
(async()=>{
 const root=path.resolve(__dirname,"..");
 const out=path.join(root,"tests","screenshots","examples","http-review");
 fs.mkdirSync(out,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try{
  const slugs=["gallery",...JSON.parse(fs.readFileSync(path.join(root,"examples","catalog.json"),"utf8")).examples.map(item=>item.slug)];
  for(const slug of slugs){
   for(const width of [390,1440]){
    const page=await browser.newPage();await page.setViewport({width,height:900,deviceScaleFactor:1});
    const url=slug==="gallery"?"http://127.0.0.1:8765/examples/":"http://127.0.0.1:8765/examples/"+slug+"/";
    const resp=await page.goto(url,{waitUntil:"networkidle0"});
    if(resp?.status()!==200)throw Error(slug+" non-200");
    if(slug!=="gallery"){
      const frame=page.frames().find(f=>f.url().includes("/examples/previews/"+slug+"/index.html"));
      if(!frame)throw Error(slug+" no iframe");
      await frame.evaluate(async()=>{await document.fonts.ready;});
      const state=await frame.evaluate(()=>({
        body:document.body.innerText.length,
        height:document.body.scrollHeight,
        background:getComputedStyle(document.body).backgroundColor,
        visibility:getComputedStyle(document.body).visibility,
        width:document.documentElement.clientWidth
      }));
      console.log(slug,width,"iframe",JSON.stringify(state));
    }
    await new Promise(resolve=>setTimeout(resolve,400));
    await page.screenshot({path:path.join(out,slug+"-"+width+".png"),fullPage:true,animations:"disabled"});
    await page.close();
   }
  }
 }finally{await browser.close()}
})().catch(e=>{console.error("FAIL",e.stack||e);process.exitCode=1});
