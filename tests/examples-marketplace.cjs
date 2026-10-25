"use strict";
/* Market-ready free product page browser acceptance test.
 * Real local ZIPs; Pro is intentionally unavailable without fake payment routes. */
const fs=require("node:fs");
const path=require("node:path");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const items=JSON.parse(fs.readFileSync(path.join(root,"examples","catalog.json"),"utf8")).examples;
const products=JSON.parse(fs.readFileSync(path.join(root,"examples","product-details.json"),"utf8")).items;
const widths=[360,390,768,1024,1440,1920];
const out=path.join(root,"tests","screenshots","marketplace");
const assert=(ok,message)=>{if(!ok)throw Error(message)};
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 let pass=0;
 try{
  for(const {slug,name} of items){
   for(const width of widths){
    const page=await browser.newPage();
    await page.setViewport({width,height:900,deviceScaleFactor:1});
    const errors=[];
    page.on("pageerror",e=>errors.push(e.message));
    const uri="http://127.0.0.1:8765/examples/"+slug+"/";
    try{
     const response=await page.goto(uri,{waitUntil:"networkidle0",timeout:25000});
     assert(response?.status()===200,slug+" product route HTTP !=200");
     const details=await page.evaluate(()=>{
      const rect=el=>el?.getBoundingClientRect().toJSON();
      const pay=document.querySelector(".examples-market-aside");
      const features=document.querySelector("#features");
      const area=document.querySelector(".examples-market-grid");
      const iframe=document.querySelector("iframe");
      return {
       viewport:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth,
       headTop:rect(document.querySelector(".examples-case-heading"))?.top,
       previewTop:rect(document.querySelector(".examples-preview"))?.top,
       asideTop:rect(pay)?.top,featuresTop:rect(features)?.top,
       asideWidth:rect(pay)?.width,gridColumns:getComputedStyle(area).gridTemplateColumns.split(/\s+/).length,
       price:document.querySelector(".examples-offer-price")?.innerText,
       freeButtons:document.querySelectorAll("a.examples-free-button[href$='-source.zip'][download]").length,
       download:document.querySelector(".examples-free-button")?.getAttribute("href"),
       redundantHeader:document.querySelectorAll(".examples-header-download,.examples-header-action,.examples-heading-free,.examples-intro-pills").length,
       futureTeasers:document.querySelectorAll(".examples-pro-preview").length,
       unwantedCopy:/pro edition|future offering|coming later|add to cart/i.test(document.querySelector(".examples-purchase-card")?.innerText||""),
       featureCount:document.querySelectorAll(".examples-feature-grid .examples-feature").length,
       fileCount:document.querySelectorAll(".examples-file,#included,.examples-file-grid").length,
       techNames:[...document.querySelectorAll(".examples-tech-pill")].map(el=>el.textContent.trim()),
       techWithIcons:[...document.querySelectorAll(".examples-tech-pill")].every(el=>!!el.querySelector(".examples-tech-icon svg")),
       techTop:rect(document.querySelector(".examples-tech-row"))?.top,
       promptTop:rect(document.querySelector("#recreate"))?.top,
       promptTag:document.querySelector("#recreate")?.tagName,
       promptVisible:getComputedStyle(document.querySelector("#recreate")).display!=="none",
       promptHeight:rect(document.querySelector("#recreate textarea"))?.height,
       accordionState:[...document.querySelectorAll(".examples-market-accordion")].map(el=>el.open),
       qa:document.querySelector("#testing .examples-testing-content")?.textContent.length,
       prompt:document.querySelector("[data-ex-prompt]")?.value.length,
       cardPosition:getComputedStyle(document.querySelector(".examples-purchase-card")).position,
       productId:document.querySelector(".examples-market-aside")?.dataset.exProductId,
       analyticsPublic:document.querySelectorAll("[data-ex-analytics]").length,
       title:document.querySelector("main h1")?.textContent,
       iframeSrc:iframe?.getAttribute("src"),
       hasFakeSales:/120,000\+|verified customers|trusted by.*customers/i.test(document.querySelector("main")?.textContent)
      };
     });
     assert(details.scroll<=details.viewport+1,slug+" horizontal overflow @"+width+" "+details.scroll+"/"+details.viewport);
     assert(details.previewTop<470,slug+" preview pushed too far below fold @"+width+" "+details.previewTop);
     assert(details.title.toLowerCase().includes(name.toLowerCase()),slug+" wrong title");
     assert(details.freeButtons===1,slug+" must have exactly one working Free ZIP CTA in the download card");
     assert(details.download==="../downloads/"+slug+"-source.zip",slug+" real ZIP link missing from card");
     assert(details.redundantHeader===0,slug+" redundant header Free download/badge remains");
     assert(details.futureTeasers===0&&!details.unwantedCopy,slug+" non-existent Pro/Coming later marketing remains");
     assert(details.price.includes("$0")&&details.price.toLowerCase().includes("free"),slug+" incorrect free price");
     assert(details.featureCount===products[slug].features.length,slug+" feature mismatch");
     assert(details.fileCount===0,slug+" public file inventory/What's included must be absent");
     assert(details.productId===slug&&details.analyticsPublic===0,slug+" future analytics identity invalid or unverified public counters exposed");
     assert(details.techNames.join("|")===products[slug].stack.join("|")&&details.techWithIcons,slug+" real tech icons and names incorrect");
     assert(details.techTop<details.previewTop,slug+" Built with icons must be near the template header");
     assert(details.promptTag==="SECTION"&&details.promptVisible&&details.promptHeight>=110,slug+" recreation prompt must be visible without a disclosure click");
     assert(details.promptTop<details.featuresTop,slug+" prompt should be easy to discover before feature list");
     assert(details.accordionState.length===1&&details.accordionState.every(open=>!open),slug+" only QA/testing should be collapsed");
     assert(details.qa>100&&details.prompt>200,slug+" old evidence or recreation prompt lost");
     assert(!details.hasFakeSales,slug+" unsupported sales metric");
     if(width<=980){
       assert(details.asideTop<details.featuresTop,slug+" mobile download card not before features");
       assert(details.cardPosition==="static",slug+" mobile download card should not block reading");
     }
     if(width>980){
       assert(details.gridColumns===2,slug+" desktop purchase sidebar not beside feature content");
       assert(details.cardPosition==="sticky",slug+" desktop download card should be sticky");
     }
     const frame=page.frames().find(f=>f.url().includes("/examples/previews/"+slug+"/index.html"));
     assert(frame,slug+" real interactive preview not loaded @"+width);
     assert((await frame.evaluate(()=>document.body.innerText)).length>150,slug+" iframe blank");
     await page.click('[data-ex-size="mobile"]');
     assert(await page.$eval("[data-ex-preview]",el=>el.dataset.previewSize==="mobile"),slug+" mobile viewport switch broken");
     await page.click('[data-ex-size="desktop"]');
     assert(await page.$eval("[data-ex-preview]",el=>el.dataset.previewSize==="desktop"),slug+" desktop viewport switch broken");
     await page.click("[data-ex-copy]");
     await page.waitForFunction(()=>{const t=document.querySelector("[data-ex-toast]");return t&&!t.hidden&&t.textContent.length>5;},{timeout:3500});
     await page.click("#testing summary");
     assert(await page.$eval("#testing",el=>el.open),slug+" QA disclosure not expandable");
     assert(errors.length===0,slug+" JS errors: "+errors.join("; "));
     if((width===390||width===1440)){
      await page.click("#testing summary");
      await page.evaluate(async()=>{
        for(const image of document.images)image.loading="eager";
        await Promise.all([...document.images].map(img=>img.decode().catch(()=>null)));
        document.querySelector("[data-ex-toast]").hidden=true;
        window.scrollTo({top:0,behavior:"instant"});
      });
      await page.screenshot({path:path.join(out,slug+"-"+width+".png"),fullPage:true,animations:"disabled"});
     }
     console.log("PASS Free product",slug,width);
     pass++;
    }finally{await page.close()}
   }
  }
  console.log("PASS",pass,"real product-page viewport trials; truthful header tech icons, visible recreation prompt, no file inventory, sticky desktop download and real previews");
 }finally{await browser.close()}
})().catch(e=>{console.error("FAIL",e.stack||e);process.exitCode=1});
