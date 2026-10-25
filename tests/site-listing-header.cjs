"use strict";
/* Regression: Library and Examples must use ONE canonical listing header/toolbar.
 * Their content renderer (table/gallery) intentionally differs. */
const fs=require("node:fs");
const path=require("node:path");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const base="http://127.0.0.1:8765";
const widths=[360,390,768,1024,1280,1440,1920];
const cases=[["library","/library/","01 SKILL"],["examples","/examples/","04 EXAMPLES"]];
const assert=(ok,msg)=>{if(!ok)throw Error(msg)};
const near=(a,b,tolerance=1)=>Math.abs(a-b)<=tolerance;
const out=path.join(root,"tests","screenshots","listing-shell");
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try {
  for(const width of widths){
   const measures=[];
   for(const [name,route,count] of cases){
    const page=await browser.newPage();
    await page.setViewport({width,height:900,deviceScaleFactor:1});
    const errs=[];page.on("pageerror",e=>errs.push(e.message));
    const response=await page.goto(base+route,{waitUntil:"networkidle0",timeout:18000});
    assert(response?.status()===200,name+" HTTP response @"+width);
    const state=await page.evaluate(()=>{
      const box=selector=>{const el=document.querySelector(selector);if(!el)return null;const rect=el.getBoundingClientRect();return {left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom,width:rect.width,height:rect.height};};
      const font=selector=>{const e=document.querySelector(selector);if(!e)return null;const s=getComputedStyle(e);return {size:s.fontSize,weight:s.fontWeight,tracking:s.letterSpacing,line:s.lineHeight,padding:s.padding,border:s.borderWidth,borderColor:s.borderColor,radius:s.borderRadius,color:s.color};};
      const nav=document.querySelector('[data-shared-header]');
      const label=document.querySelector(".site-listing-count");
      const links=[...nav.querySelectorAll("nav a")].map(a=>a.textContent.trim());
      const fonts=[...document.querySelectorAll('link[rel="stylesheet"]')].map(a=>a.getAttribute("href"));
      return {
       container:box(".site-listing-container"),head:box(".site-listing-head"),title:box(".site-listing-title h1"),
       total:box(".site-listing-count"),toolbar:box(".site-listing-toolbar"),
       actions:box(".site-listing-actions"),search:box(".site-listing-actions .site-search"),
       summary:box(".site-listing-summary"),results:box(".site-listing-results"),
       header:box("[data-shared-header]"),footer:box(".site-footer .footer-wrap"),
       titleFont:font(".site-listing-title h1"),countFont:font(".site-listing-count"),
       toolbarCss:font(".site-listing-toolbar"),summaryFont:font(".site-listing-summary-text"),
       countText:label?.textContent.trim(),filtersHidden:getComputedStyle(document.querySelector(".site-listing-filters")).display==="none",
       headerLinks:links.join("|"),root:document.documentElement.scrollWidth,client:document.documentElement.clientWidth,
       stylesheets:fonts.filter(s=>s.includes("site-listing.css"))
      };
    });
    assert(state.container&&state.toolbar&&state.search&&state.summary&&state.title,name+" missing shared listing header @"+width);
    assert(state.stylesheets.length===1,name+" doesn't import exactly one shared listing stylesheet");
    assert(state.countText===count,name+" incorrect count badge "+state.countText);
    assert(state.root<=state.client+1,name+" horizontal overflow @"+width);
    assert(!errs.length,name+" JS errors @"+width+": "+errs.join("; "));
    if(width>1080){
     assert(near(state.search.right,state.toolbar.right,1.5),name+" Search not right-aligned @"+width);
    } else {
     assert(state.search.width>=190,name+" Search too small @"+width);
    }
    if(width<=640){
     assert(near(state.search.left,state.toolbar.left,2),name+" mobile Search should span toolbar width");
     assert(near(state.search.right,state.toolbar.right,2),name+" mobile Search not full-width");
    }
    if((width===390||width===1440)){
     /* Full-page QA captures must eagerly decode below-fold lazy thumbnails. */
     await page.evaluate(async()=>{
      for(const img of document.images)img.loading="eager";
      await Promise.all([...document.images].map(img=>img.decode().catch(()=>null)));
     });
     const unloaded=await page.$$eval("img[src]",imgs=>imgs.filter(img=>!img.naturalWidth).map(img=>img.currentSrc));
     assert(!unloaded.length,name+" broken screenshot assets: "+unloaded.join(", "));
     await page.screenshot({path:path.join(out,name+"-"+width+".png"),fullPage:true,animations:"disabled"});
    }
    measures.push({name,...state});
    await page.close();
   }
   const a=measures[0],b=measures[1];
   for(const key of ["container","head","toolbar","header"]){
    for(const field of ["top","left","right","width"]){
     assert(near(a[key][field],b[key][field],1.5),
       "Listing "+key+" "+field+" misaligned @"+width+" Library="+a[key][field]+" Examples="+b[key][field]);
    }
   }
   for(const field of ["top","left","height"]){
    assert(near(a.title[field],b.title[field],1.5),"Title "+field+" misaligned @"+width);
   }
   assert(near(a.total.top,b.total.top,1.5),"Count badge vertically misaligned @"+width);
   for(const key of ["titleFont","countFont","toolbarCss","summaryFont"]){
    assert(JSON.stringify(a[key])===JSON.stringify(b[key]),"Different shared header visual "+key+" @"+width);
   }
   assert(a.headerLinks===b.headerLinks,"Site nav differs between listing pages");
   if(width>1080){
     for(const field of ["top","right","width"]){
      assert(near(a.search[field],b.search[field],1.5),"Search geometry differs on desktop @"+width+" "+field);
     }
   }
   assert(!a.filtersHidden&&!b.filtersHidden,"Library and Examples must both show category pills, even when only one category exists");
   assert(near(a.search.right,b.search.right,1.5),"Category filter presence must not shift desktop Search placement @"+width);
   console.log("PASS shared listing header alignment "+width);
  }
  const category=await browser.newPage();
  await category.setViewport({width:1440,height:900});
  await category.setRequestInterception(true);
  category.on("request",async req=>{
   if(req.url().endsWith("/catalog.json")){
    const data=JSON.parse(fs.readFileSync(path.join(root,"catalog.json"),"utf8"));
    data.skills.push({slug:"test-only",name:"Fixture Skill",description:"Test-only",category:"Engineering",version:"0.0.0",install:"test only"});
    await req.respond({status:200,contentType:"application/json",body:JSON.stringify(data)});
   }else await req.continue();
  });
  await category.goto(base+"/library/",{waitUntil:"networkidle0"});
  assert(await category.$eval("[data-library-total-label]",el=>el.textContent.trim())==="02 SKILLS","Dynamic Library total badge not updated");
  const libraryStyle=await category.$eval(".site-listing-filters button[aria-pressed=true]",el=>({
   bg:getComputedStyle(el).backgroundColor,border:getComputedStyle(el).borderRadius,color:getComputedStyle(el).color,
   padding:getComputedStyle(el).padding
  }));
  await category.goto(base+"/examples/",{waitUntil:"networkidle0"});
  const galleryStyle=await category.$eval(".site-listing-filters button[aria-pressed=true]",el=>({
   bg:getComputedStyle(el).backgroundColor,border:getComputedStyle(el).borderRadius,color:getComputedStyle(el).color,
   padding:getComputedStyle(el).padding
  }));
  assert(JSON.stringify(libraryStyle)===JSON.stringify(galleryStyle),
   "Library and Examples category pills have drifted: "+JSON.stringify({libraryStyle,galleryStyle}));
  console.log("PASS multi-category filter visual parity and dynamic total badge");
  await category.close();
 }finally{await browser.close()}
})().catch(e=>{console.error("FAIL",e.stack||e);process.exitCode=1});
