const fs=require("node:fs");
const path=require("node:path");
const url=require("node:url");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const errors=[];
function check(ok,message){if(!ok)throw Error(message)}
(async()=>{
const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
for(const [pageName,relative] of [["home","index.html"],["detail","skills/tophive-design/index.html"],["docs","docs/index.html"]]){
 for(const width of [360,390,768,1024,1440,1920]){
 const page=await browser.newPage();await page.setViewport({width,height:900,deviceScaleFactor:1});
 const runtime=[];
 page.on("pageerror",e=>runtime.push("JS "+e.message));
 page.on("requestfailed",r=>runtime.push("request "+r.url()));
 try{
 await page.goto(url.pathToFileURL(path.join(root,relative)).href,{waitUntil:"load"});
 const vals=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,view:document.documentElement.clientWidth,h1:document.querySelectorAll("main h1").length,header:!!document.querySelector(".site-header"),footer:!!document.querySelector("footer")}));
 check(vals.scroll<=vals.view+1,"Horizontal overflow "+JSON.stringify(vals));
 check(vals.h1===1,"Expected exactly one H1 "+vals.h1);
 check(vals.header&&vals.footer,"Missing shared header/footer");
 // The structural grid is decorative and shared, not a new page layout.
 const frame=await page.evaluate(()=>{
  const rail=getComputedStyle(document.body,'::before');
  const left=getComputedStyle(document.querySelector('.site-header'),'::before');
  const right=getComputedStyle(document.querySelector('.site-header'),'::after');
  return {width:parseFloat(rail.width),borderLeft:rail.borderLeftWidth,
   borderRight:rail.borderRightWidth,events:rail.pointerEvents,
   leftNode:left.content,rightNode:right.content};
 });
 check(frame.width>=300||width<350,"Structural frame too narrow "+JSON.stringify(frame));
 check(frame.borderLeft==="1px"&&frame.borderRight==="1px","Structural rails missing");
 check(frame.events==="none","Decorative rails must not block UI");
 check(frame.leftNode!=="none"&&frame.rightNode!=="none","Header intersections missing");
 if(width===390){
 const toggle=await page.$("[data-menu-toggle]");
 await toggle.click();
 check(await page.$eval("[data-nav]",el=>el.dataset.open)==="true","Mobile menu failed to open");
 await toggle.click();
 check(await page.$eval("[data-nav]",el=>el.dataset.open)!=="true","Mobile menu failed to close");
 }
 if(pageName==="docs"){
   check(await page.$eval("#install h2",el=>el.textContent.trim())==="For coding agents.","CLI install must be clearly labeled");
   check(await page.$$eval(".docs-manual-menu a",els=>els.length)===5,"Five anchored guide sections required");
   check(await page.$$eval(".docs-manual .codebox [data-copy-install]",els=>els.length)===2,"Both copy controls required");
   check(await page.$eval("main h1",el=>el.textContent.includes("Make skills")),"New documentation intro not rendered");
   check(await page.$eval("#chatgpt .docs-download",el=>el.getAttribute("href"))==="../downloads/tophive-design-skill.zip","Skill ZIP path changed");
   check(await page.$eval(".docs-cli-command code",el=>el.textContent.trim())==="npx skills add mr-bappi/tophive-skills -g","Install command incorrect");
   if(width===1440){
     check(await page.$eval("#install",el=>el.getBoundingClientRect().top)<780,"Install not visible on first screen");
     check(await page.$eval(".site-header",el=>el.getBoundingClientRect().height)<=70,"Global header height drift");
   }
   if(width===390){
     check(await page.$eval(".docs-manual-menu",el=>getComputedStyle(el).overflowX)==="auto","Mobile Docs navigation must scroll");
     const cli=await page.evaluate(()=>{
       const code=document.querySelector(".docs-cli-command code").getBoundingClientRect();
       const button=document.querySelector(".docs-cli-command button").getBoundingClientRect();
       const container=document.querySelector(".docs-cli-command").getBoundingClientRect();
       return {codeRight:code.right,containerRight:container.right,codeBottom:code.bottom,buttonTop:button.top};
     });
     check(cli.codeRight<=cli.containerRight-9,"Mobile install command extends outside panel");
     check(cli.buttonTop>=cli.codeBottom-1,"Mobile Copy overlaps the command "+JSON.stringify(cli));
     await page.click(".docs-manual-menu a[href='#chatgpt']");
     check(await page.$eval(".docs-manual-menu a[href='#chatgpt']",el=>el.getAttribute("aria-current"))==="location","Docs chapter selection state absent");
   }
   if(width===1440){
     await page.click(".docs-cli-command [data-copy-install]");
     await page.waitForFunction(()=>document.querySelector("[data-toast]").dataset.visible==="true",{timeout:1500});
     check(await page.$eval("[data-toast]",el=>el.textContent.length)>0,"CLI copy feedback missing");
     await page.$eval("[data-toast]",el=>el.dataset.visible="false");
   }
 }
 if(pageName==="detail"){
   check(await page.$$eval(".workflow-row",els=>els.length)===3,"Real three workflow routes are missing");
   check(await page.$eval("main h1",el=>el.textContent.includes("UI Design")),"Skill title absent");
   check(await page.$eval(".install-box [data-copy-install]",el=>el.getAttribute("aria-label")?.includes("installation command")),"Install copy lacks accessible name");
   if(width===1440){
     check(await page.$eval(".detail-main",el=>el.getBoundingClientRect().top)<500,"Skill details hidden too far below header");
     check(await page.$eval(".site-header",el=>el.getBoundingClientRect().height)<=70,"Shared header too tall");
   }
 }
 if(pageName==="home"){
 check(await page.$eval("main h1",el=>el.textContent).then(t=>t.includes("Give your agents")&&t.includes("better instincts")),"Original editorial hero not restored");
 check(await page.$eval(".hero-actions .btn",el=>el.getAttribute("href"))==="library/","Hero should link to minimalist skills library");

 await page.type("[data-search]","not-a-skill");
 check(await page.$eval("[data-empty]",el=>el.hidden)===false,"No matches notice missing");
 check(await page.$eval("[data-skill-item]",el=>getComputedStyle(el).display)==="none","Filtered item remains visible");
 await page.$eval("[data-search]",el=>{el.value="design";el.dispatchEvent(new Event("input",{bubbles:true}))});
 check(await page.$eval("[data-empty]",el=>el.hidden)===true,"Search did not recover");
 check(await page.$eval("[data-skill-item]",el=>getComputedStyle(el).display)!=="none","Filtered item did not return");
 if(width===1440){await page.click('[data-mode="ui"]');check((await page.$eval("[data-mode-label]",el=>el.textContent))==="PRODUCT_UI","Mode switch failed");}
 }
 check(runtime.length===0,runtime.join(" | "));
 if(width===1440||width===390){
 const dir=path.join(root,"tests/screenshots");fs.mkdirSync(dir,{recursive:true});
 const target=path.join(dir,pageName+"-"+width+".png");
 await page.screenshot({path:target,fullPage:pageName==="home",animations:"disabled"});
 console.log("SCREENSHOT",target);
 }
 console.log("PASS",pageName,width);
 }catch(e){errors.push(pageName+" "+width+" "+e.message);console.error("FAIL",pageName,width,e.message)}
 await page.close();
 }
}
for(const rel of ["assets/icon-256.png","downloads/tophive-design-skill.zip","skills/tophive-design/SKILL.md","catalog.json"]){check(fs.existsSync(path.join(root,rel)),"Missing file "+rel)}
await browser.close();
console.log("SUMMARY",18,"viewport tests, failures:",errors.length);
if(errors.length){process.exitCode=1;}
})().catch(e=>{console.error(e);process.exitCode=1});
