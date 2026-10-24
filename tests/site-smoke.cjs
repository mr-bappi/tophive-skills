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
 if(width===390){
 const toggle=await page.$("[data-menu-toggle]");
 await toggle.click();
 check(await page.$eval("[data-nav]",el=>el.dataset.open)==="true","Mobile menu failed to open");
 await toggle.click();
 check(await page.$eval("[data-nav]",el=>el.dataset.open)!=="true","Mobile menu failed to close");
 }
 if(pageName==="home"){
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
