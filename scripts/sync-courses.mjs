import fs from "node:fs/promises";

const SITE = "https://multimarinedobrasil.com.br";
const READER = "https://r.jina.ai/";
const courses = new Map();
const existingRaw = await fs.readFile("courses-data.js", "utf8").catch(() => "");
const existingStart = existingRaw.indexOf("[");
const existingEnd = existingRaw.lastIndexOf("]");
const existingCourses = existingStart >= 0 && existingEnd >= 0 ? JSON.parse(existingRaw.slice(existingStart, existingEnd + 1)) : [];
const existingBySlug = new Map(existingCourses.filter(c => c.slug).map(c => [c.slug, c]));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function abs(u) {
  if (!u) return null;
  try { return new URL(u, SITE).href; } catch { return null; }
}

function clean(s = "") {
  return s
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`]/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "’")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

async function reader(url) {
  const target = READER + url;
  const res = await fetch(target, {
    headers: {
      "user-agent": "Mozilla/5.0 MultiMarine-Catalog-Sync/3.0",
      "accept": "text/plain, text/markdown;q=0.9, */*;q=0.8"
    }
  });
  if (!res.ok) throw new Error(`Falha ${res.status} em ${url}`);
  return res.text();
}


const CURATED_IMAGES = {
  "almoxarife-48h":"https://www.grupomegabox.com.br/imagens_megabox/hero-1.jpg",
  "curso-de-conhecimentos-basicos-sobre-logistica-distribuicao-e-transporte-de-cargas-30h":"https://images.pexels.com/photos/5100048/pexels-photo-5100048.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "curso-instrutor-de-empilhadeira-e-transpaleteira":"https://images.pexels.com/photos/5100049/pexels-photo-5100049.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "nr-11-empilhadeira":"https://images.pexels.com/photos/5100048/pexels-photo-5100048.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "curso-de-mecanica-industrial-60h":"https://cdn.shopify.com/s/files/1/0597/2511/9675/files/Industrial_Machinery_Mechanic.jpg?v=1679419245",
  "mecanica-industrial-40h":"https://s0.rbk.ru/rbcplus_pics/media/img/7/09/296183825744097.jpg",
  "curso-robo-mecanico-industrial":"https://cdn.shopify.com/s/files/1/0597/2511/9675/files/Industrial_Machinery_Mechanic.jpg?v=1679419245",
  "curso-alinhamento-acoplamentos":"https://s0.rbk.ru/rbcplus_pics/media/img/7/09/296183825744097.jpg",
  "curso-pintura-industrial-200h":"https://images.pexels.com/photos/5657436/pexels-photo-5657436.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "curso-inspecao-soldagem-polietileno":"https://commons.wikimedia.org/wiki/Special:FilePath/NAVSCIATTS%27_Students_Learn_Welding_Techniques_160818-N-JK586-001.jpg",
  "curso-solda-aluminotermica-exotermica-16h":"https://commons.wikimedia.org/wiki/Special:FilePath/NMCB_1_Welding_Training_(8783811).jpg",
  "inspecao-de-solda":"https://commons.wikimedia.org/wiki/Special:FilePath/NAVSCIATTS%27_Students_Learn_Welding_Techniques_160818-N-JK586-001.jpg",
  "curso-de-guindaste-120h":"https://commons.wikimedia.org/wiki/Special:FilePath/NMCB-5_Equipment_Operator_Conducts_Crane_Familiarization_Training_(9878736).jpg",
  "curso-instrutor-de-ponte-rolante-talha-e-monovias":"https://commons.wikimedia.org/wiki/Special:FilePath/NMCB-5_Equipment_Operator_Conducts_Crane_Familiarization_Training_(9878736).jpg",
  "curso-operador-ponte-rolante":"https://commons.wikimedia.org/wiki/Special:FilePath/NMCB-5_Equipment_Operator_Conducts_Crane_Familiarization_Training_(9878736).jpg",
  "curso-operador-de-talha-eletrica":"https://commons.wikimedia.org/wiki/Special:FilePath/NMCB-5_Equipment_Operator_Conducts_Crane_Familiarization_Training_(9878736).jpg",
  "curso-de-nr-10":"https://www.delmar.edu/degrees/electrician/_images/electrician-masked.jpeg",
  "curso-nr-10-nivel-basico":"https://images.pexels.com/photos/21812143/pexels-photo-21812143.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "treinamento-de-instalacoes-eletricas-energizadas":"https://images.pexels.com/photos/10871737/pexels-photo-10871737.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "curso-de-nr-12-anexo-02-e-09":"https://cdn.shopify.com/s/files/1/0597/2511/9675/files/Industrial_Machinery_Mechanic.jpg?v=1679419245",
  "curso-nr-12-nivel-basico":"https://cdn.shopify.com/s/files/1/0597/2511/9675/files/Industrial_Machinery_Mechanic.jpg?v=1679419245",
  "curso-de-nr-20-seguranca-e-saude-no-trabalho-com-inflamaveis-e-combustiveis-40h":"https://commons.wikimedia.org/wiki/Special:FilePath/MWSS-172_practices_firefighting_skills_in_Central_Training_Area_(9795764).jpg",
  "curso-de-nr-23-protecao-contra-incendios-40h":"https://commons.wikimedia.org/wiki/Special:FilePath/MWSS-172_practices_firefighting_skills_in_Central_Training_Area_(9795736).jpg",
  "curso-de-nr33-seguranca-e-saude-no-trabalho-em-espacos-confinados-40h":"https://relyon.com/images/zgIAAEgAAABVAAAA0QAAAIoCAACKAgAA.webp",
  "curso-nova-nr-35":"https://viendaotao.vn/wp-content/uploads/2024/06/image2-1.png",
  "nr-37-60h":"https://molgroup.info/images/site/mgio/about/company-overview-parallax.jpg",
  "curso-de-petroleo-e-gas-20h":"https://molgroup.info/images/site/mgio/about/company-overview-parallax.jpg",
  "plataformista-40h":"https://www.ilrestodelcarlino.it/image-service/version/c%3AMzY5YzgyNWEtNjRmMC00%3ANGUxNTEx/ravenna-ccs-hub-il-progetto-di-eni-e-snam-per-una-filiera-italiana-nella-decarbonizzazione.webp?f=16%3A9&q=1&w=1560",
  "curso-lei-lucas-primeiros-socorros":"https://commons.wikimedia.org/wiki/Special:FilePath/Basic_first_aid_training_130219-N-PF210-358.jpg",
  "treinamento-primeiros-socorros":"https://commons.wikimedia.org/wiki/Special:FilePath/Paramedic_training_in_Telangana_Rebellion.jpg",
  "treinamento-primeiros-socorros-2":"https://commons.wikimedia.org/wiki/Special:FilePath/Basic_first_aid_training_130219-N-PF210-358.jpg",
  "curso-de-nocoes-basicas-em-maqueiro-40h":"https://commons.wikimedia.org/wiki/Special:FilePath/Paramedic_training_in_Telangana_Rebellion.jpg",
  "curso-de-tecnicas-de-coleta-de-sangue-60h":"https://www.saneikai-hp.jp/data/media/blog252.jpg",
  "capacitacao-em-imunizacao-da-teoria-a-pratica":"https://www.saneikai-hp.jp/data/media/blog252.jpg",
  "atendimento-humanizado-na-saude":"https://www.saneikai-hp.jp/data/media/blog252.jpg",
  "curso-de-cozinheiro-taifeiro-60h":"https://commons.wikimedia.org/wiki/Special:FilePath/Kitchen_training_150915-N-MI079-001.jpg",
  "recepcionista-de-hotel-25h":"https://images.pexels.com/photos/36684286/pexels-photo-36684286.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "administracoes-de-hoteis-45h":"https://commons.wikimedia.org/wiki/Special:FilePath/Kitchen_training_150915-N-MI079-001.jpg",
  "assistente-administrativo":"https://commons.wikimedia.org/wiki/Special:FilePath/A_typical_office_computer.png",
  "atendimento-ao-publico-40h":"https://commons.wikimedia.org/wiki/Special:FilePath/A_typical_office_computer.png",
  "curso-de-auxiliar-de-servicos-gerais-40h":"https://commons.wikimedia.org/wiki/Special:FilePath/A_typical_office_computer.png"
};

function pickImage(course) {
  const s = clean((course.name || "") + " " + (course.description || "")).toLowerCase();
  const pools = {
    fire: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/MWSS-172_practices_firefighting_skills_in_Central_Training_Area_(9795764).jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Diego_Garcia_Safety_Fair_2021_(6694263).jpg"
    ],
    welding: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/NAVSCIATTS%27_Students_Learn_Welding_Techniques_160818-N-JK586-001.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/NMCB_1_Welding_Training_(8783811).jpg"
    ],
    crane: ["https://commons.wikimedia.org/wiki/Special:FilePath/NMCB-5_Equipment_Operator_Conducts_Crane_Familiarization_Training_(9878736).jpg"],
    logistics: [
      "https://images.pexels.com/photos/5100048/pexels-photo-5100048.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/5100049/pexels-photo-5100049.jpeg?auto=compress&cs=tinysrgb&w=1600"
    ],
    health: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Basic_first_aid_training_130219-N-PF210-358.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Paramedic_training_in_Telangana_Rebellion.jpg"
    ],
    kitchen: ["https://commons.wikimedia.org/wiki/Special:FilePath/Kitchen_training_150915-N-MI079-001.jpg"],
    agriculture: ["https://commons.wikimedia.org/wiki/Special:FilePath/Agriculture_Training_Center_(5683690897).jpg"],
    beauty: ["https://commons.wikimedia.org/wiki/Special:FilePath/Beauty_salon.jpg"],
    electrical: ["https://commons.wikimedia.org/wiki/Special:FilePath/Electrician_Training_class_in_Neelum_by_SDO.jpg"],
    mechanical: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Engine.room.of.lifeboat.17-31.arp.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/HMS_Ocelot_1962_engine_room_looking_forward.JPG"
    ],
    offshore: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Toisa_Perseus%26Discoverer_Enterprise.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/Iraqi_OSV_Al_Basra_(401).jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/%C3%96lbohrplattform.jpg"
    ],
    safety: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Worker_without_proper_safety_equipment.jpg",
      "https://commons.wikimedia.org/wiki/Special:FilePath/MWSS-172_practices_firefighting_skills_in_Central_Training_Area_(9795736).jpg"
    ],
    office: ["https://commons.wikimedia.org/wiki/Special:FilePath/A_typical_office_computer.png"]
  };
  let k = "offshore";
  if (/incêndio|incendio|fogo|brigada|extintor|firefighting/.test(s)) k = "fire";
  else if (/solda|soldagem|soldador|welding|plasma/.test(s)) k = "welding";
  else if (/guindaste|guindar|crane|cesto aéreo|plataforma elevatória/.test(s)) k = "crane";
  else if (/empilhadeira|logística|logistica|almoxarif|estoque|armazen|movimentação de carga/.test(s)) k = "logistics";
  else if (/enferm|maqueiro|primeiros socorros|primeiro socorro|bls|saúde|saude|odont|imuniza|paraméd/.test(s)) k = "health";
  else if (/cozinheiro|taifeiro|hotel|hospedagem|alimentos e bebidas|culinária|culinaria|garçom|garcom/.test(s)) k = "kitchen";
  else if (/agricultura|agrícola|agricola|rural|cultivo|jardinagem|agro/.test(s)) k = "agriculture";
  else if (/estética|estetica|beleza|cosmet|cabelo|manicure|pedicure/.test(s)) k = "beauty";
  else if (/elétrica|eletrica|eletricidade|eletricista|elétrico|eletrico|comandos elétricos/.test(s)) k = "electrical";
  else if (/mecânica|mecanica|mecânico|mecanico|motor|caldeira|hidráulica|hidraulica|tubula|manutenção|manutencao/.test(s)) k = "mechanical";
  else if (/administr|gestão|gestao|financeir|contabil|contábil|rh|recursos humanos|marketing|secretari/.test(s)) k = "office";
  else if (/nr\s?\d|segurança|seguranca|riscos|emergência|emergencia|espaço confinado|inflamáveis|inflamaveis|epi|trabalho em altura|bloqueio|sinalização/.test(s)) k = "safety";
  const p = pools[k];
  let h = 0; for (const ch of (course.slug || course.name || "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return p[h % p.length];
}

function slug(url) {
  return new URL(url).pathname.split("/").filter(Boolean).pop() || "";
}

for (let page = 1; page <= 17; page++) {
  const url = page === 1 ? `${SITE}/cursos/` : `${SITE}/cursos/page/${page}/`;
  const md = await reader(url);

  const re = /\[([^\]]+)\]\((https?:\/\/multimarinedobrasil\.com\.br\/product\/[^)]+)\)/gi;
  for (const m of md.matchAll(re)) {
    const name = clean(m[1]);
    const link = abs(m[2]);
    if (name && link) {
    const courseSlug = slug(link);
    const previous = existingBySlug.get(courseSlug);
    courses.set(link, {
      ...(previous || {}),
      name: previous?.name || name,
      url: link,
      slug: courseSlug
    });
  }
  }

  console.log(`Página ${page}: ${courses.size} acumulados`);
  await sleep(150);
}

if (courses.size < 200) {
  throw new Error(`Catálogo incompleto: apenas ${courses.size} cursos encontrados`);
}

const list = [...courses.values()];
let done = 0;

const newCourses = list.filter(course => !existingBySlug.has(course.slug));
console.log("Cursos novos a detalhar: " + newCourses.length + ". Cursos existentes serão preservados.");

for (const course of list) {
  if (existingBySlug.has(course.slug)) {
    course.image = CURATED_IMAGES[course.slug] || course.image || pickImage(course);
    course.description = course.description || "";
    course.hours = course.hours || "";
    course.price = course.price || "";
    done++;
    if (done % 50 === 0) console.log("Preservados: " + done + "/" + list.length);
    continue;
  }
  try {
    const md = await reader(course.url);

    const h1 = (md.match(/^#\s+(.+)$/m) || [])[1];
    const image = (md.match(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/i) || [])[1] || null;

    let description = "";
    const descMatch = md.match(/(?:^|\n)#{1,3}\s*Descri(?:ç|c)(?:ã|a)o\s*\n([\s\S]*?)(?=\n#{1,3}\s|\n---|$)/i);
    if (descMatch) description = clean(descMatch[1]);

    if (!description) {
      const paragraphs = md
        .split(/\n\s*\n/)
        .map(clean)
        .filter((x) => x.length > 80 && !/^https?:/i.test(x));
      description = paragraphs.slice(0, 2).join(" ");
    }

    const hours = (md.match(/(?:carga hor[áa]ria|dura[çc][ãa]o)\s*(?:total)?\s*[:–-]?\s*([0-9]+(?:[.,][0-9]+)?\s*(?:horas?|h))/i) || [])[1] || "";
    const price = (md.match(/R\$\s*[0-9.]+(?:,[0-9]{2})?/i) || [])[0] || "";

    course.name = clean(h1 || course.name).replace(/\s*[|–-]\s*MultiMarine.*$/i, "").trim();
    course.image = CURATED_IMAGES[course.slug] || pickImage(course);
    course.description = description;
    course.hours = hours;
    course.price = price;
  } catch (e) {
    console.log(`Aviso em ${course.url}: ${e.message}`);
  }

  done++;
  if (done % 10 === 0) console.log(`Detalhes: ${done}/${list.length}`);
  await sleep(150);
}

const js =
  "// Catálogo sincronizado da MultiMarine do Brasil.\n" +
  "// Fonte: catálogo público oficial da MultiMarine do Brasil.\n" +
  "window.MULTIMARINE_COURSES = " +
  JSON.stringify(list, null, 2) +
  ";\n";

await fs.writeFile("courses-data.js", js);
console.log(`Catálogo completo sincronizado: ${list.length} cursos.`);
