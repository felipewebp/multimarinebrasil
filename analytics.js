(()=>{window.dataLayer=window.dataLayer||[];const push=(name,detail={})=>window.dataLayer.push({event:name,...detail,page:location.pathname,title:document.title});push('mm_page_view');
document.addEventListener('click',e=>{
 const a=e.target.closest('a,button');if(!a)return;
 const href=a.getAttribute('href')||'';
 if(href.includes('wa.me/'))push('mm_whatsapp_click',{label:(a.textContent||'').trim().slice(0,80)});
 if(a.matches('[data-trail-add]'))push('mm_trilha_add',{slug:a.dataset.trailAdd||'',name:a.dataset.trailName||''});
 if(href.includes('orientador.html'))push('mm_orientador_start');
 if(href.includes('empresas.html#solicitar'))push('mm_corporate_brief_start');
 if(a.matches('[data-q]'))push('mm_quick_search',{query:a.dataset.q||''});
});
document.addEventListener('submit',e=>{const f=e.target;if(f.matches('#mmLeadForm'))push('mm_lead_popup_submit');if(f.matches('#corporateForm,.contact-card form'))push('mm_corporate_submit')});
})();