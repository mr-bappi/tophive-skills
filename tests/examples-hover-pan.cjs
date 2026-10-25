"use strict";
const path=require("node:path");
const fs=require("node:fs");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const names=JSON.parse(fs.readFileSync(path.join(root,"examples","catalog.json"),"utf8")).examples.map(item=>item.name);
const expect=(ok,message)=>{if(!ok)throw Error(message);};
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try{
  const page=await browser.newPage();
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto("http://127.0.0.1:8765/examples/",{waitUntil:"load"});
  expect(await page.evaluate(()=>matchMedia("(hover: hover) and (pointer: fine)").matches),"Desktop does not report hover support");
  expect(await page.$$eval(".ex-card-full",(imgs,total)=>imgs.length===total&&imgs.every(img=>!img.hasAttribute("src")),names.length),"Full-page assets should not download before hover");
  for(const name of names){
   const cardSelector='.ex-card[data-ex-name="'+name+'"]';
   await page.hover(cardSelector+" .ex-card-art");
   await page.waitForFunction((sel)=>{
    const card=document.querySelector(sel);
    return card?.dataset.exScrollReady==="true"&&card.querySelector(".ex-card-full")?.dataset.exStatus==="ready";
   },{timeout:9000},cardSelector);
   const details=await page.$eval(cardSelector,card=>{
      const img=card.querySelector(".ex-card-full");
      const screen=card.querySelector(".ex-card-screen");
      const animation=img.getAnimations()[0];
      const travel=parseFloat(card.style.getPropertyValue("--ex-pan-travel"));
      const duration=parseFloat(card.style.getPropertyValue("--ex-pan-duration"));
      const height=(img.naturalHeight/img.naturalWidth)*screen.clientWidth;
      const startAnimation=getComputedStyle(img).animationName;
      if(animation){animation.currentTime=duration*1000*.95;animation.pause();}
      const matrix=getComputedStyle(img).transform;
      const y=matrix==="none"?0:new DOMMatrixReadOnly(matrix).m42;
      return {travel,duration,height,windowHeight:screen.clientHeight,animation:startAnimation,renderedY:y,src:img.currentSrc};
   });
   expect(details.travel>25,name+" capture has insufficient scrollable height");
   expect(details.animation==="ex-full-page-pan",name+" hover animation missing: "+JSON.stringify(details));
   expect(details.renderedY<-details.travel*.86,name+" pan cannot show lower sections: "+JSON.stringify(details));
   expect(details.duration>=5&&details.duration<=30,name+" invalid motion timing");
   console.log("PASS hover "+name+" "+Math.round(details.travel)+"px scroll in "+details.duration+"s");
  }
  expect(errors.length===0,"Gallery errors: "+errors.join("; "));
  await page.close();
  const reduced=await browser.newPage();await reduced.setViewport({width:1440,height:900});
  await reduced.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}]);
  await reduced.goto("http://127.0.0.1:8765/examples/",{waitUntil:"load"});
  await reduced.hover(".ex-card-art");
  expect(await reduced.$$eval(".ex-card-full",imgs=>imgs.every(img=>!img.hasAttribute("src"))),"Reduced motion must avoid loading animated full-page screenshots");
  console.log("PASS reduced-motion static covers");
  await reduced.close();
 }finally{await browser.close();}
})().catch(error=>{console.error("FAIL",error.stack||error);process.exitCode=1});
