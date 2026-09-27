import fs from "node:fs/promises";

const base = "https://multimarinedobrasil.com.br/cursos/";
const courses = new Map();

function clean(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&#8211;/g, "–").replace(/&#8217;/g, "’").replace(/&#8220;/g, "“").replace(/&#8221;/g, "”").replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

for (let page = 1; page <= 17; page++) {
  const url = page === 1 ? base : `${base}page/${page}/`;
  const res = await fetch(url, { headers: { "user-agent": "MultiMarine-Catalog-Sync/1.0" } });
  if (!res.ok) throw new Error(`Falha ${res.status} em ${url}`);
  const html = await res.text();

  const patterns = [
    /<h2[^>]*class=["'][^"']*woocommerce-loop-product__title[^"']*["'][^>]*>\s*(?:<a[^>]*href=["']([^"']+)["'][^>]*>)?([\s\S]*?)(?:<\/a>)?\s*<\/h2>/gi,
    /<h2[^>]*>\s*<a[^>]*href=["']([^"']*\/product\/[^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<\/h2>/gi
  ];

  let found = 0;
  for (const re of patterns) {
    for (const m of html.matchAll(re)) {
      const link = m[1] || "";
      const name = clean(m[2] || "");
      if (name && (link.includes("/product/") || /woocommerce-loop-product__title/i.test(m[0]))) {
        courses.set(name, { name, url: link || null });
        found++;
      }
    }
  }
  console.log(`Página ${page}: ${found} encontrados`);
}

const result = [...courses.values()];
if (result.length < 200) throw new Error(`Sincronização incompleta: apenas ${result.length} cursos encontrados`);

const js = "// Gerado automaticamente. Fonte: catálogo oficial MultiMarine do Brasil.\nwindow.MULTIMARINE_COURSES = " + JSON.stringify(result, null, 2) + ";\n";
await fs.writeFile("courses-data.js", js);
console.log(`Catálogo sincronizado: ${result.length} cursos`);
