"use strict";
// Examples gallery and detail page browser checks; run with Puppeteer available in NODE_PATH.
const fs = require("node:fs");
const path = require("node:path");
const {pathToFileURL} = require("node:url");
const puppeteer = require("puppeteer");
const root = path.resolve(__dirname,"..");
const widths = [360,390,768,1024,1440,1920];
const pages = [
  ["gallery","examples/index.html"],
  ["flowbridge","examples/flowbridge/index.html"],
  ["roomflow","examples/roomflow/index.html"],
  ["orbitdesk","examples/orbitdesk/index.html"],
  ["margin-magazine","examples/margin-magazine/index.html"],
];
const out = path.join(root,"tests","screenshots","examples");
const record = [];
function check(ok,message){if(!ok)throw Error(message)}
(async()=>{
  fs.mkdirSync(out,{recursive:true});
  const browser = await puppeteer.launch({
    headless:true,
    executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args:["--no-sandbox"],
  });
  try{
    for(const [name,relative] of pages){
      for(const width of widths){
        const page = await browser.newPage();
        await page.setViewport({width,height:900,deviceScaleFactor:1});
        const failures=[];
        page.on("pageerror",e=>failures.push("JS "+e.message));
        page.on("requestfailed",r=>failures.push("Network "+r.url()));
        try {
          await page.goto(pathToFileURL(path.join(root,relative)).href,{waitUntil:"load"});
          await page.evaluate(async()=>{
            for(const image of document.images) image.loading="eager";
            await Promise.all([...document.images].map(img=>img.decode().catch(()=>null)));
          });
          const result=await page.evaluate(()=>({
            scroll:document.documentElement.scrollWidth,
            client:document.documentElement.clientWidth,
            heading:document.querySelectorAll("main h1").length,
            broken:[...document.images].filter(img=>img.hasAttribute("src")&&img.complete&&img.naturalWidth===0).map(img=>img.src),
            nav:!!document.querySelector('[data-shared-header="true"] [data-nav]'),
            footer:!!document.querySelector("footer"),
          }));
          check(result.scroll<=result.client+1,name+" horizontal root overflow at "+width+": "+result.scroll);
          check(result.heading===1,name+" missing or duplicate H1");
          check(result.nav&&result.footer,name+" shared chrome missing");
          check(!result.broken.length,name+" broken images "+result.broken.join(","));
          check(!failures.length,name+" runtime errors "+failures.join("; "));
          if(width===390){
            await page.click("[data-menu-toggle]");
            check(await page.$eval("[data-nav]",el=>el.dataset.open)==="true",name+" mobile menu failed");
            await page.click("[data-menu-toggle]");
            check(await page.$eval("[data-nav]",el=>el.dataset.open)!=="true",name+" mobile menu closure failed");
          }
          if(name!=="gallery"){
            check(await page.$$(".examples-case-aside, .examples-case-labels").then(nodes=>nodes.length)===0,name+" redundant header clutter remains");
            check(await page.$eval(".examples-preview",el=>el.getBoundingClientRect().top)<460,name+" preview pushed too far below the fold");
            const expected=name;
            const frame=page.frames().find(f=>f.url().includes("/examples/previews/"+expected+"/index.html"));
            check(!!frame,name+" iframe did not load real index.html");
            const content=await frame.evaluate(()=>document.body.innerText);
            check(content.length>150&&!content.includes("Index of /"),name+" iframe not displaying actual application");
            await page.click('[data-ex-size="mobile"]');
            check(await page.$eval("[data-ex-preview]",el=>el.dataset.previewSize)==="mobile",name+" mobile toggle missing");
            await page.click('[data-ex-size="desktop"]');
            check(await page.$eval("[data-ex-preview]",el=>el.dataset.previewSize)==="desktop",name+" desktop toggle missing");
            check(await page.$eval("[data-ex-prompt]",el=>el.value.length>200),name+" recreation prompt missing");
            check(await page.$eval("#recreate",el=>el.tagName==="SECTION"&&getComputedStyle(el).display!=="none"),name+" visible prompt section missing");
            check(await page.$eval("#recreate textarea",el=>el.getBoundingClientRect().height>=110),name+" prompt should be readable without any click");
            check(await page.$eval("#features",el=>document.querySelector("#recreate").compareDocumentPosition(el)&Node.DOCUMENT_POSITION_FOLLOWING),name+" prominent prompt should precede feature details");
            await page.click("[data-ex-copy]");
            await page.waitForFunction(() => { const notice=document.querySelector("[data-ex-toast]"); return notice && !notice.hidden && notice.textContent.length>0; }, {timeout:1800});
            check(await page.$eval("[data-ex-toast]",el=>!el.hidden&&el.textContent.length>0),name+" prompt copy feedback missing");
          }else{
            check(await page.$eval("main",el=>el.querySelectorAll("section").length===0),"Examples must not contain hero/promotional sections");
            check(await page.$$eval(".ex-card-full",imgs=>imgs.length===4&&imgs.every(img=>!img.hasAttribute("src"))),"Full-page assets should load only on hover");
            check(await page.$eval(".ex-grid",el=>getComputedStyle(el).gridTemplateColumns.trim().split(/\s+/).length)===(width>=1640?4:width>1040?3:width>640?2:1),"Responsive gallery grid columns mismatch at "+width);
            check(await page.$eval(".ex-card-art",el=>el.getBoundingClientRect().top)<400,"Cards must be visible without scrolling past a hero");
            check(await page.$$eval("[data-ex-item]:not([hidden])",items=>items.length)===4,"Gallery should start with four real cards");
            check(await page.$eval("[data-ex-total-label]",el=>el.textContent.includes("04 EXAMPLES")),"Catalog count mismatch");
            check(await page.$eval("[data-ex-sort-group]",el=>el.hidden),"Sorting adds unnecessary clutter with only four examples");
            check(await page.$eval("[data-ex-load-wrap]",el=>el.hidden),"Load more must be hidden with only four examples");
            await page.click('[data-ex-filter="dashboards"]');
            check(await page.$$eval("[data-ex-item]:not([hidden])",items=>items.length)===1,"Dashboard filter failed");
            await page.type("[data-ex-search]","flowbridge");
            check(await page.$eval("[data-ex-empty]",el=>!el.hidden),"Empty state missing");
            await page.click("[data-ex-reset]");
            check(await page.$$eval("[data-ex-item]:not([hidden])",items=>items.length)===4,"Filter/search reset failed");
            await page.type("[data-ex-search]","orbitdesk");
            check(await page.$$eval("[data-ex-item]:not([hidden])",items=>items.length)===1,"OrbitDesk catalog search failed");
            await page.click("[data-ex-clear]");
            await page.type("[data-ex-search]","margin");
            check(await page.$$eval("[data-ex-item]:not([hidden])",items=>items.length)===1,"MARGIN catalog search failed");
            await page.click("[data-ex-clear]");
            await page.click('[data-ex-filter="websites"]');
            check(await page.$$eval("[data-ex-item]:not([hidden])",items=>items.length)===3,"Websites category count must include MARGIN");
            await page.click('[data-ex-filter="all"]');
            if(width===1440){
              await page.$eval("[data-ex-search]",el=>el.blur());
              await page.keyboard.press("/");
              check(await page.$eval("[data-ex-search]",el=>document.activeElement===el),"Search slash shortcut failed");
            }
          }
          if(width===390||width===1440)await page.screenshot({path:path.join(out,name+"-"+width+".png"),fullPage:true,animations:"disabled"});
          record.push({page:name,width,status:"PASS"});
          console.log("PASS",name,width);
        }finally{await page.close()}
      }
    }
    const nojs=await browser.newPage();
    await nojs.setJavaScriptEnabled(false);
    await nojs.setViewport({width:390,height:900});
    await nojs.goto(pathToFileURL(path.join(root,"examples/index.html")).href,{waitUntil:"load"});
    check(await nojs.$$eval("[data-ex-item]:not([hidden])",items=>items.length)===4,"Static cards must remain visible with JS disabled");
    check(await nojs.$$eval("[data-ex-item] h3 a",links=>links.every(link=>link.href.endsWith("/index.html")||link.href.endsWith("/"))),"Static detail links missing");
    await nojs.close();
    console.log("PASS gallery without JavaScript");
    fs.writeFileSync(path.join(out,"results.json"),JSON.stringify({status:"PASS",total:record.length,views:widths,records:record},null,2));
    console.log("SUMMARY",record.length,"browser viewport runs passed");
  }finally{await browser.close()}
})().catch(error=>{console.error("FAIL",error.stack||error);process.exitCode=1});
