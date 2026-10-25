"use strict";
/* Synthetic 30-item stress test. No mock examples are written to the website. */
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const puppeteer = require("puppeteer");

const root = path.resolve(__dirname,"..");
const html = fs.readFileSync(path.join(root,"examples/index.html"),"utf8");
const block = html.match(/<!-- EXAMPLES:CARDS:START -->([\s\S]*?)<!-- EXAMPLES:CARDS:END -->/);
if (!block) throw Error("Missing generated Examples card markers");
const originalCards = block[1].match(/<article class="ex-card"[\s\S]*?<\/article>/g);
const realCount=JSON.parse(fs.readFileSync(path.join(root,"examples/catalog.json"),"utf8")).examples.length;
if (!originalCards || originalCards.length !== realCount) throw Error("Fixture source does not match actual real Examples catalog");

function fixtureCard(index) {
  const n = String(index).padStart(2,"0");
  const source = originalCards[(index-1)%originalCards.length];
  if (index <= originalCards.length) return source;
  const category=index<=13?"dashboards":"websites";
  return source
    .replace(/data-category="[^"]+"/,`data-category="${category}"`)
    .replace(/data-ex-tone="[^"]+"/,`data-ex-tone="${category==="dashboards"?"dashboard":"website"}"`)
    .replace(/data-ex-name="[^"]+"/,`data-ex-name="Fixture ${n}"`)
    .replace(/data-ex-rank="\d+"/,`data-ex-rank="${index}"`)
    .replace(/data-ex-terms="[^"]+"/,`data-ex-terms="fixture scenario ${n} test example"`)
    .replace(/<h3><a href="[^"]+">[^<]+<\/a><\/h3>/,`<h3><a href="flowbridge/">Fixture ${n}</a></h3>`);
}
const cards = Array.from({length:30},(_,i)=>fixtureCard(i+1)).join("\n");
const fixture = html.replace(block[0],`<!-- EXAMPLES:CARDS:START -->\n${cards}\n<!-- EXAMPLES:CARDS:END -->`)
  .replace(String(realCount).padStart(2,"0")+" EXAMPLES","30 EXAMPLES")
  .replace('All examples <span>'+String(realCount).padStart(2,"0")+'</span>','All examples <span>30</span>')
  .replace('Dashboards <span>01</span>','Dashboards <span>08</span>')
  .replace('Websites <span>'+String(realCount-1).padStart(2,"0")+'</span>','Websites <span>22</span>')
  .replace('data-ex-page-size="9"','data-ex-page-size="9"');

const types = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".png":"image/png",".webp":"image/webp",".svg":"image/svg+xml",".json":"application/json"};
const server = http.createServer((req,res) => {
  const uri = new URL(req.url,"http://localhost");
  let pathname = decodeURIComponent(uri.pathname);
  if (pathname==="/examples/" || pathname==="/examples/index.html") {
    res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});
    res.end(fixture);
    return;
  }
  let filePath = path.resolve(root,"."+pathname);
  if (!filePath.startsWith(root + path.sep)) {res.writeHead(403);res.end();return;}
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath=path.join(filePath,"index.html");
  if (!fs.existsSync(filePath)) {res.writeHead(404);res.end();return;}
  res.writeHead(200,{"Content-Type":types[path.extname(filePath)] || "application/octet-stream"});
  fs.createReadStream(filePath).pipe(res);
});
const check=(ok,msg)=>{if(!ok)throw Error(msg)};
const visible=page=>page.$$eval("[data-ex-item]:not([hidden])",els=>els.map(el=>el.dataset.exName));

(async()=>{
  await new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
  const address=server.address();
  const browser=await puppeteer.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",args:["--no-sandbox"]});
  let assertions=0;
  function expect(result,message){check(result,message);assertions++}
  try {
    for(const width of [390,1440]){
      const page=await browser.newPage();
      await page.setViewport({width,height:900});
      const errors=[];
      page.on("pageerror",e=>errors.push(e.message));
      await page.goto(`http://127.0.0.1:${address.port}/examples/`,{waitUntil:"load"});
      expect((await visible(page)).length===9,`Initial page size 9 @ ${width}`);
      expect(await page.$eval("[data-ex-sort-group]",el=>!el.hidden),`Sorting visible for large collection @ ${width}`);
      expect(await page.$eval("[data-ex-load-wrap]",el=>!el.hidden),`Load more visible @ ${width}`);
      expect(await page.$eval("[data-ex-list]",el=>el.dataset.exLayout)==="dense",`Dense grid enabled @ ${width}`);
      expect(await page.$eval("[data-ex-results]",el=>el.textContent.includes("9 of 30")),`Accurate progress text @ ${width}`);
      let viewport=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));
      expect(viewport.scroll<=viewport.width+1,`No overflow at 30 cards @ ${width}: ${JSON.stringify(viewport)}`);
      await page.click("[data-ex-load-more]");
      expect((await visible(page)).length===18,`First load: 18 cards @ ${width}`);
      await page.click("[data-ex-load-more]");
      expect((await visible(page)).length===27,`Second load: 27 cards @ ${width}`);
      await page.click("[data-ex-load-more]");
      expect((await visible(page)).length===30,`Third load: 30 cards @ ${width}`);
      expect(await page.$eval("[data-ex-load-wrap]",el=>el.hidden),`Hide exhausted Load more @ ${width}`);
      await page.click('[data-ex-filter="websites"]');
      expect((await visible(page)).length===9,`Category filtering resets visible limit @ ${width}`);
      expect(await page.$eval("[data-ex-results]",el=>el.textContent.includes("9 of 22")),`Category count correct @ ${width}`);
      await page.select("[data-ex-sort]","za");
      const names = await visible(page);
      const sorted = [...names].sort((a,b)=>b.localeCompare(a));
      expect(JSON.stringify(names)===JSON.stringify(sorted),`Name Z-A sorting @ ${width}`);
      await page.type("[data-ex-search]","scenario 25");
      expect((await visible(page)).length===1,`Token search in 30-item catalogue @ ${width}`);
      await page.click("[data-ex-clear]");
      expect((await visible(page)).length===9,`Clear filters resets to default 9 @ ${width}`);
      expect(await page.$eval("[data-ex-sort]",el=>el.value)==="featured",`Clear filters resets sort @ ${width}`);
      expect(errors.length===0,`No runtime errors @ ${width}: ${errors.join("; ")}`);
      await page.close();
    }
    console.log("PASS 30-item temporary stress:",assertions,"assertions at 390px and 1440px");
  }finally{await browser.close();server.close();}
})().catch(err=>{console.error("FAIL",err.stack||err);server.close();process.exitCode=1});
