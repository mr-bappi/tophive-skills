"use strict";
/* Capture ONE true browser render and derive matching cover + scrollable full page.
 * This guarantees exactly the same framing at hover entry, rather than swapping
 * unrelated PNG and WebP crops. Publish only verified real demo pixels. */
const path = require("node:path");
const fs = require("node:fs");
const {spawnSync} = require("node:child_process");
const puppeteer = require("puppeteer");
const root = path.resolve(__dirname,"..");
const media = path.join(root,"examples","media");
const allSlugs = JSON.parse(fs.readFileSync(path.join(root,"examples","catalog.json"),"utf8")).examples.map(item => item.slug);
const selected = process.argv.slice(2);
if(selected.some(slug=>!allSlugs.includes(slug)))throw Error("Unknown catalog slug in screenshot capture");
const slugs = selected.length ? selected : allSlugs;

const python = [
  "from PIL import Image",
  "from io import BytesIO",
  "import sys,os",
  "image=Image.open(BytesIO(sys.stdin.buffer.read())).convert('RGB')",
  "full,poster=sys.argv[1:]",
  "if image.width!=1440: raise ValueError(f'Unexpected capture width {image.width}')",
  "os.makedirs(os.path.dirname(full),exist_ok=True)",
  "image.save(full,'WEBP',quality=96,method=6)",
  "image.crop((0,0,image.width,min(1440,image.height))).save(poster,'WEBP',quality=96,method=6)",
  "print(f'{image.width}x{image.height}')"
].join("\n");

(async () => {
  const browser = await puppeteer.launch({
    headless:true,
    executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args:["--no-sandbox"]
  });
  try {
    for(const slug of slugs) {
      const page = await browser.newPage();
      await page.setViewport({width:1440,height:900,deviceScaleFactor:1});
      const errors=[];
      page.on("pageerror",err=>errors.push(err.message));
      try {
        const response = await page.goto("http://127.0.0.1:8765/examples/previews/"+slug+"/index.html",
          {waitUntil:"networkidle0",timeout:20000});
        if(response?.status()!==200)throw Error(slug+" preview did not return HTTP 200");
        await page.evaluate(async()=>{
          await document.fonts.ready;
          /* Full-page screenshot is documentation, not an animation experiment:
             reveal every section so below-fold magazine content is visible. */
          document.querySelectorAll(".reveal").forEach(el=>el.classList.add("in-view"));
          document.querySelectorAll("*").forEach(el=>{
            const style=getComputedStyle(el);
            if(style.animationName!=="none")el.style.animationPlayState="paused";
          });
          for(const image of document.images)image.loading="eager";
          await Promise.all([...document.images].map(img=>img.decode().catch(()=>null)));
        });
        const dimensions=await page.evaluate(()=>({
          width:document.documentElement.scrollWidth,
          height:document.documentElement.scrollHeight
        }));
        if(dimensions.width>1441)throw Error(slug+" root horizontal overflow at full capture");
        if(errors.length)throw Error(slug+" runtime errors: "+errors.join("; "));
        const buffer=await page.screenshot({type:"png",fullPage:true,animations:"disabled"});
        const full=path.join(media,slug+"-full.webp");
        const poster=path.join(media,slug+"-poster.webp");
        const convert=spawnSync("python3",["-c",python,full,poster],{
          input:buffer,maxBuffer:8*1024*1024,encoding:"utf8"
        });
        if(convert.status!==0)throw Error(slug+" matched image conversion failed: "+convert.stderr);
        console.log("PASS",slug,convert.stdout.trim(),
          "poster",Math.round(fs.statSync(poster).size/1024)+"KiB",
          "full",Math.round(fs.statSync(full).size/1024)+"KiB");
      } finally{await page.close();}
    }
  }finally{await browser.close();}
})().catch(e=>{console.error("FAIL",e.stack||e);process.exitCode=1;});
