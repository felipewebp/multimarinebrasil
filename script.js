const nav=document.querySelector('#nav'),menu=document.querySelector('.menu'),links=document.querySelector('.nav-links');window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));menu.addEventListener('click',()=>links.classList.toggle('open'));document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(e=>obs.observe(e));
const heroVideo=document.querySelector('.hero-video');if(heroVideo){heroVideo.addEventListener('canplay',()=>heroVideo.classList.add('ready'),{once:true});heroVideo.addEventListener('error',()=>heroVideo.classList.remove('ready'));}

/* Atribuição leve: mantém contexto de origem nos contatos via WhatsApp sem exigir CRM. */
(function mmWaAttribution(){
  const qs=new URLSearchParams(location.search);
  const keys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term'];
  const params=keys.filter(k=>qs.get(k)).map(k=>k+'='+qs.get(k));
  const source=params.join(' | ')||document.referrer||'acesso direto';
  document.querySelectorAll('a[href*="wa.me/"]').forEach(a=>{
    if(a.dataset.mmWaAttribution)return;
    a.dataset.mmWaAttribution='1';
    a.addEventListener('click',()=>{
      try{
        const u=new URL(a.href);
        const current=u.searchParams.get('text')||'';
        const note='\n\nOrigem: '+document.title+'\nFonte: '+source;
        if(!current.includes('Origem:')) u.searchParams.set('text',current+note);
        a.href=u.toString();
      }catch{}
    });
  });
})();
