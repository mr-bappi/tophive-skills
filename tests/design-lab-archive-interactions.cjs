"use strict";
/* Actual localhost HTTP interaction checks for two new Design Lab sources.
 * Browser QA is independent of the archived author's test report. */
const puppeteer=require("puppeteer");
const path=require("node:path");
const fs=require("node:fs");
const root=path.resolve(__dirname,"..");
const widths=[360,390,768,1024,1440,1920];
const base="http://127.0.0.1:8765/examples/previews/";
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const results=[];

(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try{
  for(const slug of ["sentrix","little-fern"]){
   for(const width of widths){
    const page=await browser.newPage();
    await page.setViewport({width,height:900,deviceScaleFactor:1});
    const failures=[];
    page.on("pageerror",e=>failures.push(e.message));
    page.on("requestfailed",r=>failures.push("Network "+r.url()));
    try{
     const resp=await page.goto(base+slug+"/",{waitUntil:"networkidle0",timeout:30000});
     assert(resp?.status()===200,slug+" not served over real localhost HTTP @"+width);
     const geo=await page.evaluate(()=>({
      scroll:document.documentElement.scrollWidth,
      client:document.documentElement.clientWidth,
      h1:document.querySelectorAll("h1").length
     }));
     assert(geo.scroll<=geo.client+1,slug+" root overflow @"+width+" "+JSON.stringify(geo));
     assert(geo.h1===1,slug+" invalid H1 @"+width);
     if(slug==="sentrix"){
      if(width<=860){
       await page.click(".mobile-toggle");
       assert(await page.$eval("#mobile-nav",el=>!el.hidden),"SENTRIX mobile navigation not opening @"+width);
       await page.keyboard.press("Escape");
       assert(await page.$eval("#mobile-nav",el=>el.hidden),"SENTRIX Escape menu close failed @"+width);
      }
      const tabs=await page.$$('[data-scenario]');
      assert(tabs.length===3,"SENTRIX requires three actual scenario tabs");
      await page.click('[data-scenario="deploy"]');
      assert(await page.$eval("#scenario-title",e=>e.textContent.includes("production deployment")),"SENTRIX deploy incident not updating");
      await page.focus('[data-scenario="deploy"]');
      await page.keyboard.press("ArrowRight");
      assert(await page.$eval('[data-scenario="access"]',e=>e.getAttribute("aria-selected")==="true"),"SENTRIX keyboard scenario not selecting access");
      assert(await page.$eval("#scenario-title",e=>e.textContent.includes("permission change")),"SENTRIX access scenario title did not update");
      await page.click("#add-note");
      assert(await page.$eval("#add-note",e=>e.disabled),"SENTRIX duplicate response note not disabled");
      assert(await page.$eval("#brief-status",e=>e.textContent.includes("NOTE ADDED")),"SENTRIX response brief status missing");
      await page.click("#reset-scenario");
      assert(await page.$eval("#add-note",e=>!e.disabled),"SENTRIX reset failed");
      await page.click(".faq details:first-child summary");
      assert(await page.$eval(".faq details:first-child",e=>e.open),"SENTRIX native FAQ not opening");
      assert(await page.$$eval("script[src^='http']",els=>els.length)===0,"External runtime dependency in SENTRIX");
     }else{
      if(width<=860){
       await page.click(".menu-toggle");
       assert(await page.$eval(".menu-toggle",el=>el.getAttribute("aria-expanded")==="true"),"Little Fern mobile menu failed @"+width);
       await page.keyboard.press("Escape");
       assert(await page.$eval(".menu-toggle",el=>el.getAttribute("aria-expanded")==="false"),"Little Fern menu Escape failed @"+width);
      }
      await page.click("#sun-button");
      assert(await page.$eval("#sun-button",el=>el.getAttribute("aria-pressed")==="true"),"Little Fern sunshine toggle failed");
      assert(await page.$eval("#sun-feedback",el=>el.textContent.includes("sped-up illustration")),"Little Fern no accelerated-science note");
      await page.click('[data-filter="space"]');
      assert(await page.$$eval(".adventure-card:not([hidden])",es=>es.length)===1,"Little Fern Space filter incorrect");
      await page.click('[data-filter="all"]');
      assert(await page.$$eval(".adventure-card:not([hidden])",es=>es.length)===3,"Little Fern filter reset failed");
      await page.click('[data-lesson="space"]');
      assert(await page.$eval("#learning-dialog",el=>el.open),"Little Fern lesson dialog absent");
      await page.click("#quiz-start");
      await page.click('[data-answer="0"]');
      assert(await page.$eval("#answer-feedback",el=>el.textContent.length>5),"Little Fern wrong-answer feedback missing");
      await page.click('[data-answer="1"]');
      assert(await page.$eval("#mission-button",el=>!el.hidden),"Little Fern mission not unlocked by correct answer");
      await page.click("#mission-button");
      assert(await page.$eval("#dialog-title",el=>el.textContent.includes("explorer")),"Little Fern mission panel missing");
      await page.click("#finish-lesson");
      assert(await page.$eval("#learning-dialog",el=>!el.open),"Little Fern lesson not closing");
      await page.click("#experiment-button");
      assert(await page.$eval("#experiment-start",el=>el.disabled),"Little Fern adult checklist is not gated");
      const count=await page.$$eval(".check-list input",a=>a.length);
      assert(count===5,"Little Fern supplies checklist has wrong length "+count);
      for(let i=0;i<5;i++)await page.click("#supply-"+i);
      assert(await page.$eval("#experiment-start",el=>!el.disabled),"Little Fern experiment did not enable when all supplies checked");
      await page.click("#experiment-start");
      assert(await page.$eval("#dialog-title",el=>el.textContent.includes("prediction")),"Little Fern experiment instructions did not open");
      await page.click("#finish-experiment");
      assert(await page.$eval("#learning-dialog",el=>!el.open),"Little Fern experiment modal did not close");
      if(width===1440){
       await page.click('[data-save="space"]');
       assert(await page.$eval('[data-save="space"]',el=>el.getAttribute("aria-pressed")==="true"),"Little Fern save state failed");
       await page.reload({waitUntil:"load"});
       assert(await page.$eval('[data-save="space"]',el=>el.getAttribute("aria-pressed")==="true"),"Little Fern browser-local persistence failed");
      }
     }
     assert(failures.length===0,slug+" console/request failures @"+width+": "+failures.join("; "));
     console.log("PASS "+slug+" actual HTTP interactions @ "+width+"px");
     results.push({slug,width,status:"PASS",http:resp.status()});
    }finally{await page.close()}
   }
  }
  const out=path.join(root,"tests","screenshots","examples","new-design-lab-trials.json");
  fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify({viewports:widths,results,scope:"Chromium localhost HTTP browser, fictional prototypes"},null,2));
  console.log("PASS all "+results.length+" actual source browser interaction trials");
 }finally{await browser.close()}
})().catch(e=>{console.error("FAIL",e.stack||e);process.exitCode=1});
