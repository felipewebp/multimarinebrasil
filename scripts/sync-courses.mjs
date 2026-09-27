import fs from "node:fs/promises";

const base = "https://multimarinedobrasil.com.br/cursos/";
const courses = new Map();

function clean(s) {
  return s
    .replace(/<script[\\s\\S]*?<\\/script>/gi, " ")
    .replace(/<style[\\s\\S]*?<\\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "’").replace(/&#8220;/g, "“").replace(/&#8221;/g, "”")
    .replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&#8212;/g, "—")
    .replace(/\\s+/g, " ").trim();
}
function abs(u) {
  if (!u) return null;
  try { return new URL(u, "https://multimarinedobrasil.com.br").href; } catch { return null; }
}
function first(re, html) { const m = html.match(re); return m ? clean(m[1]) : ""; }

for (let page = 1; page <= 17; page++) {
  const url = page === 1 ? base : `${base}page/${page}/`;
  const res = await fetch(url, { headers: { "user-agent": "MultiMarine-Catalog-Sync/2.0" } });
  if (!res.ok) throw new Error(`Falha ${res.status} em ${url}`);
  const html = await res.text();
  const re = /<h2[^>]*class=["'][^"']*woocommerce-loop-product__title[^"']*["'][^>]*>\\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\\s\\S]*?)<\\/a>\\s*<\\/h2>/gi;
  for (const m of html.matchAll(re)) {
    const name = clean(m[2]); const link = abs(m[1]);
    if (name && link) courses.set(link, { name, url: link });
  }
  console.log(`Página ${page}: ${courses.size} acumulados`);
}

if (courses.size < 200) throw new Error(`Catálogo incompleto: apenas ${courses.size} cursos encontrados`);

const list = [...courses.values()];
let done = 0;
for (const course of list) {
  try {
    const res = await fetch(course.url, { headers: { "user-agent": "MultiMarine-Catalog-Sync/2.0" } });
    if (!res.ok) throw new Error(String(res.status));
    const html = await res.text();

    const ogImage = first(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i, html);
    const title = first(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i, html) || course.name;
    const desc = first(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i, html);

    const contentMatch = html.match(/<div[^>]+class=["'][^"']*(?:woocommerce-product-details__short-description|woocommerce-Tabs-panel--description|product-content|entry-content)[^"']*["'][^>]*>([\\s\\S]*?)<\\/div>/i);
    const content = contentMatch ? clean(contentMatch[1]) : desc;

    const hours = (content.match(/(?:carga hor[áa]ria|dura[çc][ãa]o|duração)[:\\s-]*([0-9]+(?:[.,][0-9]+)?\\s*(?:horas?|h))/i) || [])[1] || "";
    const price = (html.match(/(?:R\\$\\s*[0-9.]+(?:,[0-9]{2})?)/i) || [])[0] || "";

    course.name = title.replace(/\\s*[|–-]\\s*MultiMarine.*$/i, "").trim();
    course.image = abs(ogImage);
    course.description = content || desc || "";
    course.hours = hours;
    course.price = price;
  } catch (e) {
    course.description = course.description || "";
    console.log(`Aviso em ${course.url}: ${e.message}`);
  }
  done++;
  if (done % 10 === 0) console.log(`Detalhes: ${done}/${list.length}`);
}

for (const course of result) {
  try {
    const res = await fetch(course.url, {headers: {"user-agent": "MultiMarine-Catalog-Sync/2.0"}});
    if (!res.ok) continue;
    const html = await res.text();
    const image = (html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || [])[1] || "";
    const desc = (html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) || [])[1] || "";
    course.image = image ? new URL(image, "https://multimarinedobrasil.com.br").href : null;
    course.description = desc.replace(/\\s+/g, " ").trim();
  } catch {}
}
const js = "// Catálogo sincronizado da MultiMarine do Brasil.\nwindow.MULTIMARINE_COURSES = " + JSON.stringify(result, null, 2) + ";\n";
await fs.writeFile("courses-data.js", js);
console.log(`Catálogo completo sincronizado: ${list.length} cursos.`);
