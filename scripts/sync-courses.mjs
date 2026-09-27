import fs from "node:fs/promises";

const SITE = "https://multimarinedobrasil.com.br";
const READER = "https://r.jina.ai/http://";
const courses = new Map();

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
  const target = READER + url.replace(/^https?:\/\//, "https://");
  const res = await fetch(target, {
    headers: {
      "user-agent": "Mozilla/5.0 MultiMarine-Catalog-Sync/3.0",
      "accept": "text/plain, text/markdown;q=0.9, */*;q=0.8"
    }
  });
  if (!res.ok) throw new Error(`Falha ${res.status} em ${url}`);
  return res.text();
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
    if (name && link) courses.set(link, { name, url: link, slug: slug(link) });
  }

  console.log(`Página ${page}: ${courses.size} acumulados`);
  await sleep(150);
}

if (courses.size < 200) {
  throw new Error(`Catálogo incompleto: apenas ${courses.size} cursos encontrados`);
}

const list = [...courses.values()];
let done = 0;

for (const course of list) {
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
    course.image = abs(image);
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
