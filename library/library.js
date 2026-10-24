(()=>{'use strict';
const root=document.querySelector('[data-library-items]'),search=document.querySelector('[data-library-search]'),filters=document.querySelector('[data-categories]');if(!root||!search||!filters)return;
const $=q=>document.querySelector(q);
const params=new URLSearchParams(location.search),state={q:params.get('q')||'',category:params.get('category')||'all'};
let skills=[],toastId;
const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=String(text);return el};
function rows(){return [...root.querySelectorAll('[data-library-item]')]}
function url(){if(location.protocol==='file:')return;const u=new URL(location.href);if(state.q)u.searchParams.set('q',state.q);else u.searchParams.delete('q');if(state.category!=='all')u.searchParams.set('category',state.category);else u.searchParams.delete('category');history.replaceState(null,'',u.pathname+u.search+u.hash)}
function renderFilters(){
 const counts=new Map();for(const s of skills){const key=String(s.category||'Uncategorized');counts.set(key,(counts.get(key)||0)+1)}
 if(!counts.size)return;
 if(state.category!=='all'&&![...counts.keys()].some(c=>c.toLowerCase()===state.category))state.category='all';
 filters.replaceChildren();
 const items=[['All skills','all',skills.length],...[...counts].sort((a,b)=>a[0].localeCompare(b[0])).map(([c,n])=>[c,c.toLowerCase(),n])];
 for(const [label,key,n] of items){const b=make('button','library-category');b.type='button';b.dataset.category=key;b.setAttribute('aria-pressed',String(state.category===key));b.append(make('span','',label),make('span','category-count',String(n).padStart(2,'0')));filters.append(b)}
}
function build(s){
 const slug=String(s.slug);if(!/^[a-z0-9-]+$/.test(slug))return;
 const a=make('article','library-skill');a.dataset.libraryItem='';a.dataset.categoryName=String(s.category);
 a.dataset.searchKey=[s.name,s.description,s.category,slug,...(Array.isArray(s.tags)?s.tags:[])].join(' ').toLowerCase();
 const main=make('div','library-skill-main'),icon=make('div','library-icon'),img=make('img');
 img.src='../assets/icon-256.png';img.alt='';img.width=52;img.height=52;icon.append(img);
 const info=make('div','library-skill-content'),top=make('div','library-item-top');
 top.append(make('span','library-skill-category',String(s.category).toUpperCase()+' / SKILL'),make('span','library-source-label','● SOURCE AVAILABLE'));
 const h3=make('h3'),link=make('a');link.href='../skills/'+slug+'/';link.append(document.createTextNode(s.name+' '),make('span','','↗'));h3.append(link);
 const tags=make('div','library-tags');for(const tag of (Array.isArray(s.tags)?s.tags:[s.category]).slice(0,4))tags.append(make('span','',tag));
 info.append(top,h3,make('p','',s.description),tags);main.append(icon,info);
 const version=make('div','library-skill-version');version.append(make('span','library-version','v'+s.version),make('span','library-version-sub','SKILL.md'));
 const actions=make('div','library-skill-actions'),view=make('a','library-view-link','View details ↗');view.href=link.href;
 const copy=make('button','library-install-copy','⧉  Copy install');copy.type='button';copy.dataset.libraryCopy=String(s.install||'');copy.setAttribute('aria-label','Copy install command for '+s.name);
 actions.append(view,copy);a.append(main,version,actions);root.append(a);
}
function update(){
 const q=state.q.trim().toLowerCase();let found=0;
 for(const row of rows()){const match=(state.category==='all'||String(row.dataset.categoryName).toLowerCase()===state.category)&&(!q||String(row.dataset.searchKey).toLowerCase().includes(q));row.hidden=!match;if(match)found++}
 const n=rows().length;filters.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===state.category)));
 $('[data-count-total]').textContent=String(n).padStart(2,'0');
 $('[data-results-count]').textContent=found+' '+(found===1?'skill':'skills')+' available';
 $('[data-library-showing]').textContent='SHOWING '+String(found).padStart(2,'0')+' OF '+String(n).padStart(2,'0');
 $('[data-library-empty]').hidden=found!==0;
}
function reset(){state.q='';state.category='all';search.value='';url();update();search.focus()}
search.value=state.q;search.addEventListener('input',()=>{state.q=search.value;url();update()});
filters.addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;state.category=b.dataset.category;url();update()});
$('[data-library-reset]').addEventListener('click',reset);
document.addEventListener('keydown',e=>{const typing=e.target.closest('input,textarea,[contenteditable]');if(e.key==='/'&&!typing&&!e.metaKey&&!e.ctrlKey&&!e.altKey){e.preventDefault();search.focus()}if(e.key==='Escape'&&document.activeElement===search){if(search.value)reset();else search.blur()}});
function toast(message){const el=$('[data-toast]');el.textContent=message;el.dataset.visible='true';clearTimeout(toastId);toastId=setTimeout(()=>{el.dataset.visible='false'},2200)}
async function copy(text){try{await navigator.clipboard.writeText(text);toast('Install command copied');return}catch(e){}const t=make('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();toast(ok?'Install command copied':'Copy from the skill page')}
root.addEventListener('click',e=>{const b=e.target.closest('[data-library-copy]');if(b){e.preventDefault();copy(b.dataset.libraryCopy)}});
update();
if(location.protocol!=='file:')fetch('../catalog.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()}).then(data=>{
 skills=Array.isArray(data.skills)?data.skills.filter(x=>x.slug&&x.name&&x.category&&x.version):[];
 if(!skills.length)return;
 root.replaceChildren();for(const item of skills)build(item);renderFilters();url();update();
}).catch(()=>{});
})();
