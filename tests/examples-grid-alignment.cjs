"use strict";
const path=require("node:path");
const {pathToFileURL}=require("node:url");
const puppeteer=require("puppeteer");
const root=path.resolve(__dirname,"..");
const widths=[360,390,768,1024,1280,1440,1664,1920];
const close=(a,b)=>Math.abs(a-b)<=1.5;
(async()=>{
 const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
 try {
  for(const width of widths){
   const page=await browser.newPage();
   await page.setViewport({width,height:900,deviceScaleFactor:1});
   await page.goto(pathToFileURL(path.join(root,"examples/index.html")).href,{waitUntil:"load"});
   const data=await page.evaluate(()=>{
     const rect=el=>{const b=el.getBoundingClientRect();return {left:b.left,right:b.right,width:b.width};};
     const header=document.querySelector(".site-header .wrap");
     const listing=document.querySelector(".ex-listing > .wrap");
     const footer=document.querySelector(".site-footer .wrap");
     const grid=document.querySelector(".ex-grid");
     const first=document.querySelector(".ex-card");
     const padding=getComputedStyle(listing);
     return {
       header:rect(header), listing:rect(listing),footer:rect(footer),grid:rect(grid),first:rect(first),
       paddingLeft:parseFloat(padding.paddingLeft),paddingRight:parseFloat(padding.paddingRight),
       rootScroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth
     };
   });
   const fail=(message)=>{throw Error(message+" @"+width+"px "+JSON.stringify(data));};
   if(data.rootScroll>data.client+1)fail("root overflow");
   if(data.listing.width>1241)fail("noncanonical shell wider than 1240px");
   if(!close(data.header.left,data.listing.left)||!close(data.footer.left,data.listing.left))fail("misaligned shell left edge");
   if(!close(data.header.width,data.listing.width)||!close(data.footer.width,data.listing.width))fail("inconsistent shell width");
   if(data.grid.left<data.listing.left+data.paddingLeft-1.5||data.grid.right>data.listing.right-data.paddingRight+1.5)fail("grid escapes padded shell");
   if(data.first.left<data.grid.left-1.5||data.first.right>data.grid.right+1.5)fail("card escapes grid");
   console.log("PASS grid shell",width,"shell",Math.round(data.listing.width),"grid",Math.round(data.grid.width));
   await page.close();
  }
 } finally{await browser.close();}
})().catch(err=>{console.error("FAIL",err.message);process.exitCode=1;});
