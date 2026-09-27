import fs from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://felipewebp.github.io/multimarinebrasil";
const OFFICIAL_LOGO = ORIGIN + "/assets/multimarine-logo.png";
const COURSES_FILE = "courses-data.js";

const raw = await fs.readFile(COURSES_FILE, "utf8");
const start = raw.indexOf("[");
const end = raw.lastIndexOf("]");
if (start < 0 || end < 0) throw new Error("courses-data.js inválido");
const courses = JSON.parse(raw.slice(start, end + 1));

const esc = (s = "") => String(s)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const clean = (s = "") => String(s).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const category = (name = "") => {
  const s = String(name).toLowerCase();
  if (/taifeiro|saloneiro|cozinheiro|hotelaria|garçom|garcom|camareir|hospedagem/.test(s)) return "Hotelaria";
  if (/nr\s?\d|seguran|riscos|incêndio|incendio|inflam|atmosfera|emergência|emergencia|resgate|brigada|extintor|bloqueio|epi|trabalho em altura|espaço confinado/.test(s)) return "Segurança";
  if (/offshore|petróleo|petroleo|plataforma|api|guindaste|guindar|marít|marit/.test(s)) return "Offshore";
  if (/odont|saúde|saude|imunização|imunizacao|maqueiro|enferm/.test(s)) return "Saúde";
  if (/administr|atendimento|almox|office|vendas|rh|recursos humanos|financeir|contabil/.test(s)) return "Administrativo";
  return "Industrial";
};

const type = (course) => {
  const s = (course.name + " " + (course.description || "")).toLowerCase();
  if (/reciclagem/.test(s)) return ["RECICLAGEM", "recycle"];
  if (/\bnr\s*\d|norma regulamentadora|epi|segurança do trabalho|seguranca do trabalho/.test(s)) return ["NR / SEGURANÇA", "nr"];
  if (/instrutor|inspetor|inspeção|inspecao|supervisor|gestor|laudo|especialização|especializacao|aperfeiçoamento|aperfeicoamento/.test(s)) return ["APERFEIÇOAMENTO", "improve"];
  if (/formação|formacao|qualificação|qualificacao|profissionalizante/.test(s)) return ["QUALIFICAÇÃO", "qual"];
  return ["CAPACITAÇÃO", "cap"];
};

const fallback = {
  Offshore: "https://commons.wikimedia.org/wiki/Special:FilePath/OSV_Fast_Giant.jpg",
  Segurança: "https://commons.wikimedia.org/wiki/Special:FilePath/Boom_Deployment_from_Platform_Hondo_(51854566094).jpg",
  Industrial: "https://commons.wikimedia.org/wiki/Special:FilePath/OSV_Avery_Island_at_C-Port_2.jpg",
  Saúde: "https://commons.wikimedia.org/wiki/Special:FilePath/Basic_first_aid_training_130219-N-PF210-358.jpg",
  Administrativo: "https://commons.wikimedia.org/wiki/Special:FilePath/A_typical_office_computer.png",
  Hotelaria: "https://commons.wikimedia.org/wiki/Special:FilePath/Kitchen_training_150915-N-MI079-001.jpg"
};

const image = c => c.image || fallback[category(c.name)] || fallback.Industrial;
const whatsapp = c => "https://wa.me/5522996172167?text=" + encodeURIComponent("Olá, gostaria de informações sobre o curso " + c.name);

const siteCommon = '<link rel="stylesheet" href="' + ORIGIN + '/site-common.css">';

const footer = () => [
  '<footer class="mm-footer">',
    '<div class="mm-footer-grid">',
      '<div>',
        '<div class="mm-footer-logo-box"><img class="mm-footer-logo" src="' + OFFICIAL_LOGO + '" alt="MultiMarine do Brasil"></div>',
        '<p>Qualificação profissional, treinamentos e soluções para o mercado offshore e industrial em Macaé/RJ.</p>',
      '</div>',
      '<div>',
        '<span class="mm-footer-label">ONDE ESTAMOS</span>',
        '<address>Rua Vereador Abreu Lima, 342<br>Centro · Macaé/RJ</address>',
        '<a class="mm-footer-map" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Rua%20Vereador%20Abreu%20Lima%2C%20342%2C%20Centro%2C%20Maca%C3%A9%2C%20RJ">ABRIR NO GOOGLE MAPS ↗</a>',
      '</div>',
      '<div>',
        '<span class="mm-footer-label">ATENDIMENTO</span>',
        '<div class="mm-footer-actions">',
          '<a href="tel:+552220235871">(22) 2023-5871</a>',
          '<a href="https://wa.me/5522996172167" target="_blank" rel="noopener">(22) 99617-2167 · WhatsApp</a>',
          '<a href="' + ORIGIN + '/cursos.html">Catálogo de cursos</a>',
          '<a href="' + ORIGIN + '/orientador.html">Orientador de qualificação</a>',
          '<a href="' + ORIGIN + '/duvidas.html">Dúvidas frequentes</a>',
          '<a href="' + ORIGIN + '/solucoes.html">Soluções</a>',
        '</div>',
      '</div>',
    '</div>',
    '<div class="mm-footer-bottom"><span>Site desenvolvido por FelipeWeb</span><span>© 2026 MultiMarine do Brasil</span><a href="' + ORIGIN + '/politica-privacidade.html">Política de privacidade</a></div>',
  '</footer>'
].join("");

const contactBlock = () => [
  '<section class="mm-contact-panel">',
    '<div class="mm-contact-grid">',
      '<div class="mm-contact-copy">',
        '<span class="kicker">MULTIMARINE DO BRASIL · MACAÉ/RJ</span>',
        '<h2>Onde estamos.</h2>',
        '<p>Rua Vereador Abreu Lima, 342 · Centro · Macaé/RJ. Fale com a equipe para confirmar turma, requisitos, modalidade, disponibilidade e atendimento.</p>',
        '<div class="mm-contact-links">',
          '<a href="tel:+552220235871">(22) 2023-5871 ↗</a>',
          '<a href="https://wa.me/5522996172167" target="_blank" rel="noopener">(22) 99617-2167 · WhatsApp ↗</a>',
          '<a href="https://www.google.com/maps/search/?api=1&query=Rua%20Vereador%20Abreu%20Lima%2C%20342%2C%20Centro%2C%20Maca%C3%A9%2C%20RJ" target="_blank" rel="noopener">Abrir no Google Maps ↗</a>',
        '</div>',
      '</div>',
      '<iframe class="mm-map-frame" title="Localização da MultiMarine do Brasil em Macaé" src="https://www.google.com/maps?q=Rua%20Vereador%20Abreu%20Lima%2C%20342%2C%20Centro%2C%20Maca%C3%A9%2C%20RJ&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    '</div>',
  '</section>'
].join("");

const lead = '<script src="' + ORIGIN + '/lead-popup.js"></script>';

const backScript = [
  '<script>',
  '(()=>{const b=document.getElementById("backCatalog");try{const st=JSON.parse(sessionStorage.getItem("mmCatalogReturn")||"null");',
  'if(b&&st&&st.url)b.href=st.url;}catch{}})();',
  '</script>'
].join("");

const headCommon = () => [
  '<meta name="viewport" content="width=device-width,initial-scale=1">',
  '<meta name="robots" content="index,follow,max-image-preview:large">',
  siteCommon,
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">'
].join("");

const courseHtml = c => {
  const cat = category(c.name);
  const t = type(c);
  const desc = clean(c.description || "Formação profissional da MultiMarine do Brasil. Consulte a equipe sobre turma, requisitos, modalidade, carga horária e disponibilidade.");
  const canonical = ORIGIN + "/cursos/" + c.slug + "/";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": c.name,
    "description": desc,
    "provider": {"@type": "Organization", "name": "MultiMarine do Brasil", "url": ORIGIN + "/"},
    "image": image(c),
    "url": canonical
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type":"ListItem","position":1,"name":"MultiMarine do Brasil","item":ORIGIN + "/"},
      {"@type":"ListItem","position":2,"name":"Cursos","item":ORIGIN + "/cursos.html"},
      {"@type":"ListItem","position":3,"name":c.name,"item":canonical}
    ]
  };
  return [
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">',
    '<title>' + esc(c.name) + ' | MultiMarine do Brasil</title>',
    '<meta name="description" content="' + esc(desc.slice(0,155)) + '">',
    '<link rel="canonical" href="' + canonical + '">',
    '<meta property="og:type" content="website"><meta property="og:site_name" content="MultiMarine do Brasil">',
    '<meta property="og:title" content="' + esc(c.name) + ' | MultiMarine do Brasil">',
    '<meta property="og:description" content="' + esc(desc.slice(0,180)) + '">',
    '<meta property="og:image" content="' + esc(image(c)) + '"><meta name="twitter:card" content="summary_large_image">',
    headCommon(),
    '<script type="application/ld+json">' + JSON.stringify(schema) + '</script>',
    '<script type="application/ld+json">' + JSON.stringify(breadcrumb) + '</script>',
    '</head><body>',
    '<header class="top"><a class="brand brand-mm" href="' + ORIGIN + '/"><img class="brand-logo-mm" src="' + OFFICIAL_LOGO + '" alt="MultiMarine do Brasil"></a><a id="backCatalog" class="back" href="' + ORIGIN + '/cursos.html">← CATÁLOGO</a></header>',
    '<section class="hero"><div class="hero-inner"><div class="crumb">MULTIMARINE · ' + esc(cat.toUpperCase()) + ' · MACAÉ/RJ</div>',
    '<div class="badge ' + t[1] + '">' + t[0] + '</div><h1>' + esc(c.name) + '</h1><p>' + esc(desc.slice(0,450)) + '</p>',
    '<div class="actions"><a class="btn primary" href="' + whatsapp(c) + '" target="_blank" rel="noopener">QUERO INFORMAÇÕES ↗</a><a class="btn ghost" href="' + ORIGIN + '/cursos.html">VER OUTROS CURSOS</a></div></div></section>',
    '<main class="wrap"><div class="grid"><article class="panel"><img class="cover" src="' + esc(image(c)) + '" alt="' + esc(c.name) + '">',
    '<div class="badge ' + t[1] + '">' + t[0] + '</div><h2>Sobre esta formação</h2><p class="desc">' + esc(desc) + '</p>',
    '<div class="facts"><div class="fact"><small>TIPO DE FORMAÇÃO</small><strong>' + t[0] + '</strong></div>',
    '<div class="fact"><small>CARGA HORÁRIA</small><strong>' + esc(c.hours || "Consultar") + '</strong></div>',
    '<div class="fact"><small>INVESTIMENTO</small><strong>' + esc(c.price || "Consultar") + '</strong></div>',
    '<div class="fact"><small>ÁREA</small><strong>' + esc(cat) + '</strong></div></div></article>',
    '<aside class="cta-box"><h3>Quer confirmar esta turma?</h3><p>Consulte disponibilidade, modalidade, requisitos, datas e condições diretamente com a equipe.</p><a class="btn primary" href="' + whatsapp(c) + '" target="_blank" rel="noopener">FALAR NO WHATSAPP ↗</a></aside></div>',
    '<section class="final"><h2>Seu próximo passo começa aqui.</h2><p>Explore outras formações ou peça orientação para encontrar o caminho mais adequado ao seu objetivo.</p></section></main>',
    contactBlock(), footer(), backScript, lead, '</body></html>'
  ].join("");
};

const meta = {
  offshore:["Cursos Offshore em Macaé","Treinamentos ligados a operações marítimas, petróleo e gás e qualificação para o universo offshore."],
  seguranca:["Cursos de Segurança do Trabalho e NRs","Treinamentos relacionados à segurança, prevenção, normas regulamentadoras e preparação para atividades de risco."],
  industrial:["Cursos Industriais em Macaé","Formações e capacitações para manutenção, operação, máquinas, elétrica, mecânica e atividades industriais."],
  saude:["Cursos na Área da Saúde","Formações e capacitações para profissionais que buscam desenvolvimento na área da saúde e atendimento."],
  hotelaria:["Cursos de Hotelaria Offshore","Formações para cozinha, hotelaria, apoio e serviços em operações offshore."],
  administrativo:["Cursos Administrativos","Formações para administração, atendimento, logística e áreas de apoio às operações."]
};

const categoryHtml = key => {
  const list = courses.filter(c => category(c.name).toLowerCase() === key);
  const title = meta[key][0];
  const desc = meta[key][1];
  const items = list.map((c) => {
    const t = type(c);
    return '<article class="category-card"><img src="' + esc(image(c)) + '" alt="' + esc(c.name) + '" loading="lazy"><div class="badge ' + t[1] + '">' + t[0] + '</div><h2>' + esc(c.name) + '</h2><p>' + esc(clean(c.description || "Consulte a equipe MultiMarine.").slice(0,150)) + '</p><a href="' + ORIGIN + '/cursos/' + c.slug + '/">VER CURSO ↗</a></article>';
  }).join("");
  const itemList = list.filter(c => c.slug).map((c,i) => ({
    "@type":"ListItem","position":i+1,
    "url":ORIGIN + "/cursos/" + c.slug + "/",
    "item":{"@type":"Course","name":c.name,"description":clean(c.description || "Curso e treinamento MultiMarine.").slice(0,150),"provider":{"@type":"Organization","name":"MultiMarine do Brasil","url":ORIGIN + "/"}}
  }));
  const schema = JSON.stringify({"@context":"https://schema.org","@type":"ItemList","itemListElement":itemList});
  return [
    '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">',
    '<title>' + esc(title) + ' | MultiMarine do Brasil</title>',
    '<meta name="description" content="' + esc(desc) + '"><link rel="canonical" href="' + ORIGIN + '/cursos/' + key + '/">',
    headCommon(), '<script type="application/ld+json">' + schema + '</script>',
    '</head><body>',
    '<header class="top"><a class="brand brand-mm" href="' + ORIGIN + '/"><img class="brand-logo-mm" src="' + OFFICIAL_LOGO + '" alt="MultiMarine do Brasil"></a><a class="back" href="' + ORIGIN + '/cursos.html">← TODOS OS CURSOS</a></header>',
    '<section class="hero"><div class="hero-inner"><span class="kicker">CATÁLOGO · MACAÉ/RJ</span><h1>' + esc(title) + '</h1><p>' + esc(desc) + ' Encontre sua formação e fale com a equipe para confirmar turma, modalidade e disponibilidade.</p></div></section>',
    '<main class="wrap"><div class="category-grid">' + items + '</div></main>',
    contactBlock(), footer(), lead, '</body></html>'
  ].join("");
};

await fs.rm("cursos", {recursive:true, force:true});

for (const c of courses) {
  if (!c.slug) continue;
  const dir = path.join("cursos", c.slug);
  await fs.mkdir(dir, {recursive:true});
  await fs.writeFile(path.join(dir, "index.html"), courseHtml(c), "utf8");
}

for (const key of Object.keys(meta)) {
  const dir = path.join("cursos", key);
  await fs.mkdir(dir, {recursive:true});
  await fs.writeFile(path.join(dir, "index.html"), categoryHtml(key), "utf8");
}

const urls = [
  ORIGIN + "/",
  ORIGIN + "/cursos.html",
  ORIGIN + "/offshore.html",
  ORIGIN + "/empresas.html",
  ORIGIN + "/solucoes.html",
  ORIGIN + "/orientador.html",
  ORIGIN + "/duvidas.html",
  ORIGIN + "/politica-privacidade.html",
  ...Object.keys(meta).map(k => ORIGIN + "/cursos/" + k + "/"),
  ...courses.filter(c => c.slug).map(c => ORIGIN + "/cursos/" + c.slug + "/")
];

const sitemapBody = [...new Set(urls)].map(u => "<url><loc>" + u + "</loc></url>").join("");
await fs.writeFile(
  "sitemap.xml",
  '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + sitemapBody + "</urlset>",
  "utf8"
);
await fs.writeFile("robots.txt", "User-agent: *\nAllow: /\nSitemap: " + ORIGIN + "/sitemap.xml\n", "utf8");

console.log("Build SEO concluído: " + courses.length + " páginas de curso + " + Object.keys(meta).length + " categorias.");
