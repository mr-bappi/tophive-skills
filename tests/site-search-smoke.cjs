"use strict";
/* TOPHIVE Skills — ONE Search visual/control system across Home, Library, Examples.
 * Verify CSS computed metrics, placement, slash/Escape, live filtering, and mobile. */
const path=require("node:path");
const fs=require("node:fs");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const base="http://127.0.0.1:8765/";
const pages=[
  {id:"home",route:"",input:"[data-search]",query:"zz-not-found",empty:"[data-empty]"},
  {id:"library",route:"library/",input:"[data-library-search]",query:"zz-not-found",empty:"[data-library-empty]"},
  {id:"examples",route:"examples/",input:"[data-ex-search]",query:"zz-not-found",empty:"[data-ex-empty]"}
];
const widths=[360,390,768,1024,1440,1920];
const assert=(condition,message)=>{if(!condition)throw Error(message)};
const close=(a,b,tolerance=1)=>Math.abs(a-b)<=tolerance;
const out=path.join(root,"tests","screenshots","search-system");

(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await puppeteer.launch({
   headless:true,
   executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
   args:["--no-sandbox"]
 });
 const designTokens=[];
 let checked=0;
 try{
  for(const route of pages){
   for(const width of widths){
    const page=await browser.newPage();
    await page.setViewport({width,height:900,deviceScaleFactor:1});
    const failures=[];
    page.on("pageerror",error=>failures.push(error.message));
    page.on("requestfailed",request=>failures.push(request.url()));
    try{
      const response=await page.goto(base+route.route,{waitUntil:"load",timeout:20000});
      assert(response?.status()===200,route.id+" not HTTP 200 @"+width);
      const css=await page.evaluate(()=>{
        const search=document.querySelector(".site-search");
        const input=search?.querySelector("input[data-site-search]");
        const icon=search?.querySelector(".site-search-icon");
        const kbd=search?.querySelector("kbd");
        if(!search||!input||!icon||!kbd)return null;
        const b=search.getBoundingClientRect();
        const style=getComputedStyle(search);
        const inner=getComputedStyle(input);
        const iconRect=icon.getBoundingClientRect();
        const f=el=>{const rect=el.getBoundingClientRect();return {x:rect.x,y:rect.y,right:rect.right,bottom:rect.bottom,width:rect.width,height:rect.height};};
        const filter=document.querySelector(".ex-filter-scroll");
        const main=document.querySelector(".ex-toolbar");
        return {
          height:b.height,width:b.width,
          border:style.borderWidth+" "+style.borderStyle+" "+style.borderColor,
          radius:style.borderRadius,background:style.backgroundColor,
          padding:style.paddingLeft,color:style.color,
          inputBorder:inner.borderWidth,inputHeight:input.getBoundingClientRect().height,
          fontSize:inner.fontSize,placeholder:input.placeholder,
          iconWidth:iconRect.width,iconHeight:iconRect.height,
          iconView:icon.getAttribute("viewBox"),kbdDisplay:getComputedStyle(kbd).display,
          root:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,
          oldFields:document.querySelectorAll(".searchbox,.directory-search,.ex-search").length,
          search:f(search),filter:filter?f(filter):null,toolbar:main?f(main):null
        };
      });
      assert(css!==null,route.id+" canonical search missing @"+width);
      assert(close(css.height,44),route.id+" height mismatch "+css.height+" @"+width);
      assert(css.radius==="8px",route.id+" radius mismatch "+css.radius+" @"+width);
      assert(css.border.startsWith("1px solid"),route.id+" border mismatch @"+width);
      assert(css.background==="rgb(255, 255, 255)",route.id+" background mismatch @"+width);
      assert(css.padding==="13px",route.id+" padding mismatch @"+width);
      assert(css.fontSize==="13px"&&css.inputBorder==="0px",route.id+" input mismatch @"+width);
      assert(css.iconWidth===18&&css.iconHeight===18,route.id+" icon size mismatch @"+width);
      assert(css.iconView==="0 0 24 24",route.id+" icon shape drift @"+width);
      assert(css.oldFields===0,route.id+" legacy search still in use @"+width);
      assert(css.root<=css.client+1,route.id+" horizontal overflow "+css.root+"/"+css.client+" @"+width);
      assert(css.search.width>=190,route.id+" search too narrow "+css.search.width+" @"+width);
      if(route.id==="examples"){
        if(width>1080){
          assert(close(css.search.y,css.filter.y,5),route.id+" search not inline with categories @"+width+" "+JSON.stringify(css));
          assert(css.search.x>css.filter.x,route.id+" desktop search not on the right @"+width);
        }else{
          assert(css.search.y>=css.filter.bottom+7,route.id+" stacked toolbar wrong @"+width+" "+JSON.stringify(css));
        }
      }
      const signature=[css.height,css.border,css.radius,css.background,css.padding,css.fontSize,css.inputBorder,css.iconView,css.iconWidth].join("|");
      designTokens.push({page:route.id,width,signature});
      await page.$eval("body",el=>el.focus());
      await page.keyboard.press("/");
      assert(await page.$eval(route.input,el=>document.activeElement===el),route.id+" '/' failed @"+width);
      const focus=await page.$eval(".site-search",el=>({
        border:getComputedStyle(el).borderWidth,
        ring:getComputedStyle(el).boxShadow,
        inner:getComputedStyle(el.querySelector("input")).borderWidth
      }));
      assert(focus.ring!=="none"&&focus.border==="1px"&&focus.inner==="0px",route.id+" double focus ring or none @"+width);
      await page.type(route.input,route.query);
      assert(await page.$eval(route.empty,el=>!el.hidden),route.id+" live filtering/empty state failed @"+width);
      await page.keyboard.press("Escape");
      assert(await page.$eval(route.input,el=>el.value===""),route.id+" Escape not cleared @"+width);
      assert(await page.$eval(route.empty,el=>el.hidden),route.id+" Escape not restored results @"+width);
      await page.keyboard.press("Escape");
      assert(await page.$eval(route.input,el=>document.activeElement!==el),route.id+" second Escape did not blur @"+width);
      assert(failures.length===0,route.id+" JS/network errors @"+width+": "+failures.join("; "));
      if((width===390||width===1440)&&route.id==="examples")
        await page.screenshot({path:path.join(out,"examples-"+width+".png"),fullPage:true,animations:"disabled"});
      if((width===390||width===1440)&&route.id==="library")
        await page.screenshot({path:path.join(out,"library-"+width+".png"),fullPage:true,animations:"disabled"});
      console.log("PASS shared search",route.id,width);
      checked++;
    } finally {await page.close();}
   }
  }
  const reference=designTokens[0].signature;
  assert(designTokens.every(e=>e.signature===reference),"Canonical design tokens drift across routes/sizes: "+JSON.stringify(designTokens));
  console.log("PASS single search design identical across all "+checked+" page/viewport combinations");
 }finally{await browser.close();}
})().catch(error=>{console.error("FAIL",error.stack||error);process.exitCode=1;});
