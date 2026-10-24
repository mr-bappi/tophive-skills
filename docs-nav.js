/* Active chapter tracking for the static developer documentation. */
(()=>{
  "use strict";
  const nav=document.querySelector(".docs-manual-menu");
  if(!nav)return;
  const links=[...nav.querySelectorAll('a[href^="#"]')];
  const sections=links.map(link=>document.getElementById(link.hash.slice(1))).filter(Boolean);
  function mark(id){
    for(const link of links){
      if(link.hash.slice(1)===id)link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    }
  }
  nav.addEventListener("click",event=>{
    const link=event.target.closest('a[href^="#"]');
    if(link)mark(link.hash.slice(1));
  });
  if(location.hash&&sections.some(s=>s.id===location.hash.slice(1)))mark(location.hash.slice(1));
  if(!("IntersectionObserver" in window))return;
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting);
    if(visible.length){
      visible.sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);
      mark(visible[0].target.id);
    }
  },{rootMargin:"-13% 0px -68% 0px",threshold:0});
  sections.forEach(section=>observer.observe(section));
})();
