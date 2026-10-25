"use strict";
/* MARGIN literary magazine: independently verify the imported original source over
 * local HTTP, unlike the upstream in-memory QA. This does not modify the source. */
const fs=require("node:fs");
const path=require("node:path");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const uri="http://127.0.0.1:8765/examples/previews/margin-magazine/";
const widths=[360,390,768,1024,1440,1920];
const report=[];
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try{
  for(const width of widths){
   const page=await browser.newPage();
   await page.setViewport({width,height:900,deviceScaleFactor:1});
   const errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   page.on("requestfailed",r=>errors.push(r.url()+" "+r.failure()?.errorText));
   const response=await page.goto(uri,{waitUntil:"networkidle0",timeout:25000});
   assert(response?.status()===200,"MARGIN preview not HTTP 200 @"+width);
   await page.evaluate(async()=>{
    for(const img of document.images)img.loading="eager";
    await Promise.all([...document.images].map(img=>img.decode().catch(()=>null)));
   });
   const data=await page.evaluate(()=>({
    root:document.documentElement.scrollWidth,
    client:document.documentElement.clientWidth,
    images:[...document.images].map(img=>({src:img.getAttribute("src"),loaded:img.complete&&img.naturalWidth>0})),
    h1:document.querySelectorAll("main h1").length,
    articles:document.querySelectorAll(".story-card").length
   }));
   assert(data.root<=data.client+1,"Horizontal root overflow @"+width+" "+data.root+"/"+data.client);
   assert(data.images.length===5 && data.images.every(img=>img.loaded),"Original SVG artwork broken @"+width+" "+JSON.stringify(data.images));
   assert(data.h1===1 && data.articles===4,"Invalid MARGIN content structure @"+width);
   if(width<=390){
    const toggle=await page.$(".menu-toggle");
    assert(toggle!==null,"Mobile navigation missing @"+width);
    await page.click(".menu-toggle");
    assert(await page.$eval("#mobile-nav",el=>!el.hidden),"Mobile navigation did not open @"+width);
    assert(await page.$eval(".menu-toggle",el=>el.getAttribute("aria-expanded")==="true"),"Mobile expanded state missing @"+width);
    await page.keyboard.press("Escape");
    assert(await page.$eval("#mobile-nav",el=>el.hidden),"Mobile navigation Escape failed @"+width);
   }
   assert(await page.$$eval(".story-card:not([hidden])",els=>els.length)===4,"Initial stories incorrect @"+width);
   await page.click('[data-filter="poetry"]');
   assert(await page.$$eval(".story-card:not([hidden])",els=>els.length)===1,"Poetry filter failed @"+width);
   assert(await page.$eval('[data-filter="poetry"]',el=>el.getAttribute("aria-pressed")==="true"),"Pressed state incorrect @"+width);
   await page.click('[data-filter="all"]');
   assert(await page.$$eval(".story-card:not([hidden])",els=>els.length)===4,"All pieces reset failed @"+width);
   await page.click('.story-cover[data-story="city"]');
   assert(await page.$eval("#reading-dialog",el=>el.open),"Reading dialog failed @"+width);
   assert(await page.$eval("#reader-title",el=>el.textContent.includes("city forgets")),"Reader article content missing @"+width);
   await page.keyboard.press("Escape");
   assert(await page.$eval("#reading-dialog",el=>!el.open),"Reader Escape failed @"+width);
   await page.click("#submission-info");
   assert(await page.$eval("#submissions-dialog",el=>el.open),"Submission info dialog failed @"+width);
   await page.click("#submissions-done");
   assert(await page.$eval("#submissions-dialog",el=>!el.open),"Submission dialog dismiss failed @"+width);
   await page.click('#newsletter-form button[type="submit"]');
   assert(await page.$eval("#newsletter-feedback",el=>el.dataset.state==="error"),"Newsletter missing invalid email validation @"+width);
   await page.type("#email","reader@example.com");
   await page.click('#newsletter-form button[type="submit"]');
   assert(await page.$eval("#newsletter-feedback",el=>el.dataset.state==="success"&&el.textContent.includes("no email was sent or stored")),"Newsletter demo disclaimer missing @"+width);
   assert(errors.length===0,"Runtime/request errors @"+width+": "+errors.join("; "));
   report.push({width,status:"PASS",images:data.images.length,rootOverflow:false,checks:["HTTP","SVG","mobile navigation as applicable","genre filter","reading dialog","Escape close","submission info dialog","newsletter local-only validation"]});
   console.log("PASS MARGIN HTTP interaction suite",width);
   await page.close();
  }
  const reduced=await browser.newPage();await reduced.setViewport({width:390,height:900});
  await reduced.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
  await reduced.goto(uri,{waitUntil:"load"});
  assert(await reduced.evaluate(()=>matchMedia("(prefers-reduced-motion: reduce)").matches),"Reduced motion preference unsupported");
  assert(await reduced.$eval(".reveal",el=>el.classList.contains("in-view")),"Reduced motion reveals should remain visible");
  await reduced.close();
  const out=path.join(root,"tests","screenshots","examples","margin-magazine-interactions.json");
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify({source:uri,results:report,reducedMotion:"PASS",qa:"Real localhost HTTP; not production deployment"},null,2));
  console.log("PASS MARGIN all "+report.length+" browser widths + reduced-motion");
 }finally{await browser.close();}
})().catch(e=>{console.error("FAIL",e.stack||e);process.exitCode=1});
