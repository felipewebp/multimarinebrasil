(()=>{const KEY="mm_lead_popup_v2",SKIP=1000*60*60*24*7;const seen=()=>{const t=Number(localStorage.getItem(KEY)||0);return t>0&&Date.now()-t<SKIP};if(seen())return;
const css=`
.mm-lead-overlay{position:fixed;inset:0;background:rgba(3,14,24,.7);backdrop-filter:blur(5px);z-index:200;display:none;align-items:center;justify-content:center;padding:18px;overscroll-behavior:contain}
.mm-lead-overlay.open{display:flex}
.mm-lead{position:relative;width:min(900px,100%);display:grid;grid-template-columns:.82fr 1.18fr;background:#fff;box-shadow:0 30px 80px rgba(0,0,0,.28);overflow:hidden;border-radius:8px}
.mm-lead-side{padding:38px;background:#08243b;color:#fff;position:relative}
.mm-lead-kicker{font:800 10px Inter;letter-spacing:.18em;color:#69b8ee}
.mm-lead-side h2{font:700 38px/1 Space Grotesk;margin:16px 0;color:#fff}
.mm-lead-side p{font:13px/1.7 Inter;color:#bfd0dc}
.mm-lead-side ul{list-style:none;padding:0;margin:25px 0 0}
.mm-lead-side li{font:11px/1.55 Inter;color:#dce7ee;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.12)}
.mm-lead-side li:before{content:"✓";color:#69b8ee;font-weight:900;margin-right:9px}
.mm-lead-form{padding:34px;overflow:auto}
.mm-lead-close{position:absolute;right:14px;top:12px;width:34px;height:34px;border:0;background:transparent;font-size:24px;color:#718494;cursor:pointer}
.mm-lead-form h3{font:700 25px Space Grotesk;color:#08243b;margin:0 0 8px;padding-right:30px}
.mm-lead-form>p{font-size:11px;line-height:1.6;color:#6c7e8f;margin:0 0 22px}
.mm-lead-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.mm-lead-field{display:grid;gap:6px}
.mm-lead-field.full{grid-column:1/-1}
.mm-lead-field label{font:800 8px Inter;letter-spacing:.12em;color:#718494}
.mm-lead-field input,.mm-lead-field select{width:100%;min-height:44px;border:1px solid #d9e3e9;padding:11px 12px;border-radius:4px;font:500 12px Inter;color:#173047;background:#fff}
.mm-lead-consent{display:flex;gap:8px;align-items:flex-start;margin:13px 0;color:#6b7e8d;font-size:9px;line-height:1.5}
.mm-lead-consent input{margin-top:2px;flex:0 0 auto}
.mm-lead-submit{width:100%;border:0;background:#dd0f0f;color:#fff;padding:15px 18px;border-radius:4px;font:800 10px Inter;letter-spacing:.09em;cursor:pointer}
.mm-lead-note{font-size:8px!important;color:#8293a0!important;margin-top:10px!important}
.mm-lead-hp{position:absolute;left:-10000px;opacity:0}
@media(max-width:720px){
  .mm-lead-overlay{padding:10px;align-items:flex-end}
  .mm-lead{width:min(520px,100%);display:block;max-height:76dvh;border-radius:12px;overflow:hidden}
  .mm-lead-side{display:none}
  .mm-lead-form{padding:18px 18px calc(16px + env(safe-area-inset-bottom));max-height:76dvh;overflow-y:auto;-webkit-overflow-scrolling:touch}
  .mm-lead-close{right:9px;top:8px;width:36px;height:36px}
  .mm-lead-form h3{font-size:21px;line-height:1.08;margin-bottom:6px}
  .mm-lead-form>p{font-size:10px;line-height:1.45;margin:0 0 14px;max-width:92%}
  .mm-lead-grid{grid-template-columns:1fr 1fr;gap:9px}
  .mm-lead-field.full{grid-column:1/-1}
  .mm-lead-field label{font-size:7px}
  .mm-lead-field input,.mm-lead-field select{min-height:40px;padding:9px 10px;font-size:11px}
  .mm-lead-consent{font-size:8px;line-height:1.4;margin:10px 0}
  .mm-lead-submit{padding:13px 14px;font-size:9px}
  .mm-lead-note{font-size:7px!important;line-height:1.35!important;margin-top:8px!important}
}
@media(max-width:420px){
  .mm-lead{max-height:72dvh}
  .mm-lead-form{padding:16px 14px calc(14px + env(safe-area-inset-bottom))}
  .mm-lead-grid{grid-template-columns:1fr}
  .mm-lead-field.full{grid-column:auto}
  .mm-lead-form h3{font-size:19px}
  .mm-lead-form>p{display:none}
  .mm-lead-consent{margin:8px 0}
}
`;
const style=document.createElement("style");style.textContent=css;document.head.appendChild(style);
const overlay=document.createElement("div");overlay.className="mm-lead-overlay";overlay.innerHTML=`
<div class="mm-lead" role="dialog" aria-modal="true" aria-labelledby="mmLeadTitle">
<section class="mm-lead-side"><span class="mm-lead-kicker">ATENDIMENTO MULTIMARINE</span><h2>Descubra o próximo passo.</h2><p>Receba uma orientação inicial sobre cursos, qualificação e treinamentos para seu objetivo.</p><ul><li>Escolha pela sua área ou objetivo</li><li>Entenda quais formações podem fazer sentido</li><li>Fale diretamente com a equipe</li></ul></section>
<section class="mm-lead-form"><button class="mm-lead-close" type="button" aria-label="Fechar">×</button><h3 id="mmLeadTitle">Quero receber orientação</h3><p>Preencha só o necessário. A equipe recebe seu pedido no WhatsApp.</p>
<form id="mmLeadForm"><input class="mm-lead-hp" name="website" tabindex="-1" autocomplete="off">
<div class="mm-lead-grid"><div class="mm-lead-field"><label>NOME</label><input name="nome" required autocomplete="name" placeholder="Seu nome"></div><div class="mm-lead-field"><label>WHATSAPP</label><input name="telefone" required autocomplete="tel" inputmode="tel" placeholder="(22) 99999-9999"></div><div class="mm-lead-field full"><label>E-MAIL (OPCIONAL)</label><input name="email" type="email" autocomplete="email" placeholder="voce@email.com"></div><div class="mm-lead-field full"><label>SEU OBJETIVO</label><select name="objetivo"><option>Quero trabalhar no offshore</option><option>Quero fazer um curso</option><option>Quero atualizar uma certificação</option><option>Quero qualificar minha equipe</option><option>Ainda não sei qual curso fazer</option></select></div></div>
<label class="mm-lead-consent"><input type="checkbox" name="consent" required> <span>Autorizo o contato para retorno sobre minha solicitação. Consulte a <a href="politica-privacidade.html" target="_blank" rel="noopener" style="color:#0568bf">política de privacidade</a>.</span></label>
<button class="mm-lead-submit" type="submit">FALAR COM A EQUIPE ↗</button><p class="mm-lead-note">Ao enviar, o WhatsApp será aberto com os dados informados.</p></form></section></div>`;
document.body.appendChild(overlay);
const form=overlay.querySelector("#mmLeadForm"),close=()=>{overlay.classList.remove("open");document.body.style.overflow=""};
const mmAttribution=()=>{const p=new URLSearchParams(location.search);const keys=["utm_source","utm_medium","utm_campaign","utm_term","utm_content"];const vals=keys.map(k=>p.get(k)).filter(Boolean);return "Origem: "+(vals.length?vals.join(" | "):(document.referrer||"acesso direto"));};
const open=()=>{if(seen())return;overlay.classList.add("open");document.body.style.overflow="hidden";localStorage.setItem(KEY,String(Date.now()));setTimeout(()=>overlay.querySelector('[name="nome"]')?.focus(),80)};
overlay.querySelector(".mm-lead-close").addEventListener("click",close);overlay.addEventListener("click",e=>{if(e.target===overlay)close});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&overlay.classList.contains("open"))close()});
setTimeout(open,11000);let armed=false;window.addEventListener("scroll",()=>{if(armed||seen())return;armed=true;if(scrollY>document.documentElement.scrollHeight*.38)open()},{passive:true});
form.addEventListener("submit",e=>{e.preventDefault();if(form.website.value)return;const d=new FormData(form),ctx=document.title,t=`Olá! Vim pelo site da MultiMarine. Nome: ${d.get("nome")}. Telefone/WhatsApp: ${d.get("telefone")}. E-mail: ${d.get("email")||"não informado"}. Objetivo: ${d.get("objetivo")}. Página: ${ctx}. ${mmAttribution()}.`;window.open("https://wa.me/5522996172167?text="+encodeURIComponent(t),"_blank","noopener");close();localStorage.setItem(KEY,String(Date.now()));});
})();