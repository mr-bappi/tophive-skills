"use strict";
/* Verify visual continuity at the exact moment a poster swaps to the animated
   full page. Uses actual rendered Chromium pixels, not just CSS assertions. */
const path=require("node:path");
const fs=require("node:fs");
const {spawnSync}=require("node:child_process");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const out=path.join(root,"tests","screenshots","examples","hover-stability");
fs.mkdirSync(out,{recursive:true});
const entries=JSON.parse(fs.readFileSync(path.join(root,"examples","catalog.json"),"utf8")).examples;
const check=(condition,message)=>{if(!condition)throw Error(message);};

const compare=`
from PIL import Image,ImageChops,ImageStat
import sys
before=Image.open(sys.argv[1]).convert('RGB')
after=Image.open(sys.argv[2]).convert('RGB')
if before.size!=after.size: raise ValueError('Card viewport dimension changed')
mae=sum(ImageStat.Stat(ImageChops.difference(before,after)).mean)/3.0
print(f'{mae:.3f}')
if mae>=2.0: sys.exit(1)
`;

(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try{
  const page=await browser.newPage();
  await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
  await page.goto("http://127.0.0.1:8765/examples/",{waitUntil:"networkidle0"});
  for(const {slug,name} of entries){
   const selector='.ex-card[data-ex-name="'+name+'"]';
   await page.mouse.move(1,1);
   await page.$eval(selector,el=>el.scrollIntoView({block:"center"}));
   const screen=await page.$(selector+" .ex-card-screen");
   const before=path.join(out,slug+"-before.png");
   const after=path.join(out,slug+"-hover-start.png");
   await screen.screenshot({path:before,animations:"disabled"});
   await page.hover(selector+" .ex-card-art");
   await page.waitForFunction(sel=>document.querySelector(sel)?.dataset.exScrollReady==="true",{timeout:10000},selector);
   const sizes=await page.$eval(selector,card=>{
     const thumb=card.querySelector(".ex-card-thumb");
     const full=card.querySelector(".ex-card-full");
     const a=thumb.getBoundingClientRect(),b=full.getBoundingClientRect();
     const animation=full.getAnimations()[0];
     if(animation){animation.pause();animation.currentTime=0;}
     return {
       posterWidth:thumb.naturalWidth,
       fullWidth:full.naturalWidth,
       displayWidth:a.width,
       fullDisplayWidth:b.width,
       posterY:a.top,
       fullY:b.top,
       posterHeight:a.height,
       fullHeight:b.height,
       fit:getComputedStyle(thumb).objectFit
     };
   });
   check(sizes.posterWidth===sizes.fullWidth,slug+" source widths are mismatched: "+JSON.stringify(sizes));
   check(Math.abs(sizes.displayWidth-sizes.fullDisplayWidth)<1,slug+" visual image zoom changed");
   check(Math.abs(sizes.posterY-sizes.fullY)<1,slug+" image starts from different vertical position");
   check(sizes.posterHeight>=sizes.fullDisplayWidth*.7,slug+" poster does not cover card viewport");
   await screen.screenshot({path:after,animations:"disabled"});
   const result=spawnSync("python3",["-c",compare,before,after],{encoding:"utf8"});
   check(result.status===0,slug+" initial hover frame changed pixel appearance: "+result.stdout+" "+result.stderr);
   console.log("PASS "+slug+" same-scale/same-position + hover first frame pixel MAE "+result.stdout.trim());
  }
  await page.close();
 }finally{await browser.close();}
})().catch(err=>{console.error("FAIL",err.stack||err);process.exitCode=1});
