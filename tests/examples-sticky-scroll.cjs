"use strict";
const puppeteer=require("puppeteer");
const path=require("node:path");
const fs=require("node:fs");
const root=path.resolve(__dirname,"..");
const items=JSON.parse(fs.readFileSync(path.join(root,"examples","catalog.json"),"utf8")).examples;
const widths=[1024,1280,1440,1920];
const check=(ok,msg)=>{if(!ok)throw new Error(msg)};
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try{
  let count=0;
  for(const {slug} of items){
   for(const width of widths){
    const page=await browser.newPage();
    await page.setViewport({width,height:900,deviceScaleFactor:1});
    await page.goto("http://127.0.0.1:8765/examples/"+slug+"/",{waitUntil:"load",timeout:25000});
    const geometry=await page.evaluate(()=>{
     const el=document.querySelector(".examples-market-grid");
     const aside=document.querySelector(".examples-market-aside");
     const card=document.querySelector(".examples-purchase-card");
     const grid=el.getBoundingClientRect(),sr=aside.getBoundingClientRect(),cr=card.getBoundingClientRect();
     return {
      gridTop:window.scrollY+grid.top,gridHeight:grid.height,asideHeight:sr.height,
      cardHeight:cr.height,cardStart:window.scrollY+cr.top,
      scrollLength:document.documentElement.scrollHeight-window.innerHeight,
      position:getComputedStyle(card).position
     };
    });
    check(geometry.position==="sticky",slug+" not sticky at "+width);
    check(geometry.asideHeight>=geometry.cardHeight+200,slug+" sidebar is too short to stick at "+width+" "+JSON.stringify(geometry));
    const step1=geometry.gridTop+160;
    const step2=geometry.gridTop+285;
    check(step2<geometry.gridTop+geometry.gridHeight-geometry.cardHeight-55,slug+" inadequate sticky tracking range "+JSON.stringify(geometry));
    await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),step1);
    await pause(50);
    const first=await page.$eval(".examples-purchase-card",e=>e.getBoundingClientRect().top);
    await page.evaluate(y=>window.scrollTo({top:y,behavior:"instant"}),step2);
    await pause(50);
    const second=await page.$eval(".examples-purchase-card",e=>e.getBoundingClientRect().top);
    check(Math.abs(first-second)<=2,slug+" card moved during page scroll ("+width+"): "+first+" -> "+second);
    check(first>=19&&first<=27,slug+" card not sticking at expected 22px top ("+width+") "+first);
    if(slug==="orbitdesk"&&width===1440){
     const file=path.join(root,"tests","screenshots","marketplace","orbitdesk-sticky-1440.png");
     await page.screenshot({path:file,fullPage:false,animations:"disabled"});
     console.log("SCREENSHOT "+file);
    }
    console.log("PASS real sticky scroll "+slug+" "+width+" top "+first.toFixed(1)+"→"+second.toFixed(1));
    count++;
    await page.close();
   }
  }
  console.log("PASS "+count+" real scroll sticky card trials");
 }finally{await browser.close();}
})().catch(e=>{console.error("FAIL",e.stack||e);process.exitCode=1});
