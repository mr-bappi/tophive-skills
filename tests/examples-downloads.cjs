"use strict";
/* End-to-end verified browser download of the exact original source ZIP bytes. */
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const target=path.join(root,"tests","screenshots","marketplace","actual-downloads");
fs.mkdirSync(target,{recursive:true});
const entries=JSON.parse(fs.readFileSync(path.join(root,"examples","catalog.json"),"utf8")).examples;
const digest=file=>crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try{
  for(const item of entries){
   const page=await browser.newPage();
   const cdp=await page.createCDPSession();
   await cdp.send("Page.setDownloadBehavior",{behavior:"allow",downloadPath:target});
   await page.goto("http://127.0.0.1:8765/examples/"+item.slug+"/",{waitUntil:"load"});
   const expected=path.join(root,"examples","downloads",item.slug+"-source.zip");
   const downloaded=path.join(target,item.slug+"-source.zip");
   for(const selector of [".examples-free-button"]){
    try{fs.unlinkSync(downloaded)}catch{}
    await page.click(selector);
    let completed=false;
    for(let retry=0;retry<70;retry++){
     if(fs.existsSync(downloaded)&&fs.statSync(downloaded).size>0 &&
        !fs.readdirSync(target).some(f=>f.endsWith(".crdownload"))){completed=true;break}
     await sleep(100);
    }
    assert(completed,item.slug+" download not completed from "+selector);
    assert(digest(downloaded)===digest(expected),item.slug+" downloaded ZIP does not match original verified source from "+selector);
    console.log("PASS exact ZIP download "+item.slug+" "+selector+" "+fs.statSync(downloaded).size+" bytes");
   }
   assert(await page.$$eval(".examples-header-download,.examples-pro-preview",nodes=>nodes.length)===0,
     item.slug+" obsolete header CTA or Pro teaser returned");
   await page.close();
  }
 }finally{await browser.close()}
})().catch(error=>{console.error("FAIL",error.stack||error);process.exitCode=1});
