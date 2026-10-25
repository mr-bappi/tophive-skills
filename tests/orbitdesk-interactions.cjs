"use strict";
/* Real localhost (HTTP) OrbitDesk prototype acceptance checks. */
const puppeteer = require("puppeteer");
const fs = require("node:fs");
const path = require("node:path");
const ROOT = path.resolve(__dirname,"..");
const url = "http://127.0.0.1:8765/examples/previews/orbitdesk/";
const check=(yes,msg)=>{if(!yes)throw Error(msg);};
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 const passed=[];
 try{
  for(const width of [390,1440]){
   const page=await browser.newPage();
   await page.setViewport({width,height:850,deviceScaleFactor:1});
   const failures=[];
   page.on("pageerror",e=>failures.push(e.message));
   const response=await page.goto(url,{waitUntil:"load"});
   check(response?.status()===200,`OrbitDesk preview HTTP status invalid at ${width}`);
   check(await page.$eval("#board-view",el=>!el.hidden),`Board not initially visible ${width}`);
   check(await page.$$eval(".task-card",els=>els.length)===5,`Initial sample tasks invalid ${width}`);
   check(await page.$eval("#task-summary",el=>el.textContent.includes("5 sample notes")),`Initial task summary invalid ${width}`);
   const dims=await page.evaluate(()=>({client:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   check(dims.scroll<=dims.client+1,`OrbitDesk root horizontal overflow at ${width}: ${JSON.stringify(dims)}`);
   if(width===390){
     await page.click(".menu-toggle");
     check(await page.$eval("#mobile-nav",el=>!el.hidden),"Mobile menu failed to open");
     await page.keyboard.press("Escape");
     check(await page.$eval("#mobile-nav",el=>el.hidden),"Mobile menu Escape failed");
     check(await page.$eval(".menu-toggle",el=>document.activeElement===el),"Focus not restored to mobile menu toggle");
   }
   await page.click('[data-view="list"]');
   check(await page.$eval("#list-view",el=>!el.hidden),"List view failed to open");
   check(await page.$eval("#board-view",el=>el.hidden),"Board not hidden when list shown");
   await page.select("#stage-1-list","review");
   check(await page.$eval("#task-summary",el=>el.textContent.includes("2 ready to share")),"Stage change failed");
   await page.click('[data-view="board"]');
   check(await page.$eval("#board-view",el=>!el.hidden),"Board view failed to restore");
   check(await page.$eval("#stage-1-board",el=>el.value)==="review","Task stage not synchronized across views");
   await page.click("#add-note");
   check(await page.$eval("#note-dialog",el=>el.open),"New note dialog did not open");
   await page.click('#note-form button[type="submit"]');
   check(await page.$eval("#note-title",el=>el.getAttribute("aria-invalid"))==="true","Required title validation missing");
   await page.type("#note-title","OrbitDesk QA test note");
   await page.click('#note-form button[type="submit"]');
   check(await page.$eval("#note-dialog",el=>!el.open),"Dialog did not close after note creation");
   check(await page.$eval("#task-summary",el=>el.textContent.includes("6 sample notes")),"New note missing from board");
   check(await page.$eval("#add-note",el=>document.activeElement===el),"Focus not restored after dialog");
   const firstFaq=await page.$(".faq-items details summary");
   check(!!firstFaq,"FAQ item missing");
   await firstFaq.click();
   check(await page.$eval(".faq-items details",el=>el.open),"FAQ accordion did not open");
   check(!failures.length,`OrbitDesk runtime error at ${width}: ${failures.join("; ")}`);
   passed.push({width,status:"PASS",checks:["localhost HTTP","board/list","stage persistence","note validation","note creation","focus","FAQ","responsive overflow"]});
   console.log("PASS OrbitDesk working interactions",width);
   await page.close();
  }
  const file=path.join(ROOT,"tests","screenshots","examples","orbitdesk-interactions.json");
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,JSON.stringify({source:url,records:passed},null,2));
 }finally{await browser.close();}
})().catch(err=>{console.error("FAIL",err.stack||err);process.exitCode=1;});
