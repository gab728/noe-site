// Génère les pages du site de GBH à partir de site.json (domaine et adresse de contact).
//   node build.mjs            → index.html, mentions-legales.html, confidentialite.html, 404.html, robots.txt, sitemap.xml, CNAME
// Pour brancher le nom de domaine : renseigner "domain" dans site.json (ex. "gbh-holding.fr"), relancer, publier.
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";

const cfg = JSON.parse(readFileSync(new URL("./site.json", import.meta.url), "utf8"));
const DOMAIN = (cfg.domain || "").trim();
const EMAIL = DOMAIN ? `contact@${DOMAIN}` : cfg.fallbackEmail;
const BASE = DOMAIN ? `https://${DOMAIN}/` : cfg.fallbackBase;
const NOE = "https://gab728.github.io/italiano-passo-passo/";
const YEAR = new Date().getFullYear();
const UPDATED = { fr: "20 novembre 2026", en: "November 20, 2026" };

const CO = {
  name: "GBH",
  form: { fr: "Société par actions simplifiée (SAS)", en: "Simplified joint-stock company (SAS)" },
  capital: { fr: "1 000 €", en: "€1,000" },
  street: "23 rue d'Anjou", city: "75008 Paris", country: { fr: "France", en: "France" },
  rcs: "934 041 229 R.C.S. Paris", siren: "934 041 229", siret: "934 041 229 00014", vat: "FR18934041229",
  created: { fr: "7 octobre 2024", en: "October 7, 2024" },
  president: "Gabriel Brami",
};

// Un texte dans les deux langues ; le script de la page masque celle qui n'est pas choisie.
const t = (fr, en, tag = "span") => `<${tag} data-l="fr">${fr}</${tag}><${tag} data-l="en">${en}</${tag}>`;
const T = (fr, en) => t(fr, en);

const mail = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
const addr = `${CO.street}, ${CO.city}, ${T("France", "France")}`;

function page({ file, title, desc, body, home = false }) {
  const url = BASE + (file === "index.html" ? "" : file);
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}assets/noe-256.png">
<meta name="theme-color" content="#F6F4EF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0F1115" media="(prefers-color-scheme: dark)">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/noe-180.png">
<link rel="preload" href="fonts/nunito-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="style.css">
${home ? `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "Organization", name: CO.name, legalName: CO.name, url: BASE, email: EMAIL,
    address: { "@type": "PostalAddress", streetAddress: CO.street, postalCode: "75008", addressLocality: "Paris", addressCountry: "FR" },
    vatID: CO.vat, foundingDate: "2024-10-07", identifier: [{ "@type": "PropertyValue", propertyID: "SIREN", value: "934041229" }],
    founder: { "@type": "Person", name: CO.president },
    owns: { "@type": "MobileApplication", name: "NOE", applicationCategory: "EducationalApplication", operatingSystem: "iOS, Android, Web", url: NOE },
  })}</script>` : ""}
<script>
/* Langue : français par défaut, anglais pour les visiteurs dont le navigateur n'est pas en français. Même adresse pour les deux. */
(function () { var l = "fr"; try { l = localStorage.getItem("gbh-lang") || ""; } catch (e) {} if (!l) l = /^fr/i.test(navigator.language || "fr") ? "fr" : "en"; document.documentElement.lang = l; })();
</script>
</head>
<body>
<a class="skip" href="#main">${T("Aller au contenu", "Skip to content")}</a>
<header class="top" id="top">
  <div class="wrap">
    <a class="logo" href="./" aria-label="GBH"><span class="logo-mark" aria-hidden="true">GBH</span>GBH</a>
    <nav class="nav" aria-label="${"Navigation"}">
      <a class="opt" href="./#activites">${T("Activités", "What we do")}</a>
      <a class="opt" href="./#noe">NOE</a>
      <a href="./#contact">Contact</a>
      <button class="lang" type="button" id="lang" aria-label="Changer de langue / Change language">${T("EN", "FR")}</button>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="wrap">
    <div>© ${YEAR} GBH · SAS · RCS Paris ${CO.siren}</div>
    <nav aria-label="${"Liens légaux"}">
      <a href="mentions-legales.html">${T("Mentions légales", "Legal notice")}</a>
      <a href="confidentialite.html">${T("Confidentialité", "Privacy")}</a>
      <a href="./#contact">Contact</a>
    </nav>
  </div>
</footer>
<script>
(function () {
  var b = document.getElementById("lang");
  b.onclick = function () { var l = document.documentElement.lang === "fr" ? "en" : "fr"; document.documentElement.lang = l; try { localStorage.setItem("gbh-lang", l); } catch (e) {} };
  var top = document.getElementById("top"), on = function () { top.classList.toggle("scrolled", window.scrollY > 4); };
  window.addEventListener("scroll", on, { passive: true }); on();
})();
</script>
</body>
</html>
`;
}

const icon = {
  stake: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
  advice: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a7 7 0 0 0-4 12.7V18h8v-2.3A7 7 0 0 0 12 3z"/><path d="M9.5 21h5"/></svg>',
  app: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M10.5 18.5h3"/></svg>',
};

const facts = (lang) => `
  <div><dt>${lang === "fr" ? "Dénomination" : "Legal name"}</dt><dd>${CO.name}</dd></div>
  <div><dt>${lang === "fr" ? "Forme" : "Legal form"}</dt><dd>${CO.form[lang]}</dd></div>
  <div><dt>${lang === "fr" ? "Capital social" : "Share capital"}</dt><dd>${CO.capital[lang]}</dd></div>
  <div><dt>${lang === "fr" ? "Siège social" : "Registered office"}</dt><dd>${CO.street}, ${CO.city}, ${CO.country[lang]}</dd></div>
  <div><dt>${lang === "fr" ? "Immatriculation" : "Registration"}</dt><dd>${CO.rcs}</dd></div>
  <div><dt>SIRET</dt><dd>${CO.siret}</dd></div>
  <div><dt>${lang === "fr" ? "N° de TVA" : "VAT number"}</dt><dd>${CO.vat}</dd></div>
  <div><dt>${lang === "fr" ? "Président" : "President"}</dt><dd>${CO.president}</dd></div>`;

const shots = [
  ["Parler avec des personnages, à voix haute", "Talking out loud with characters"],
  ["Des leçons courtes, corrigées tout de suite", "Short lessons, corrected instantly"],
  ["Une leçon par jour, à son rythme", "One lesson a day, at your own pace"],
  ["Une série de jours d'affilée", "A daily streak"],
];

const home = page({
  file: "index.html", home: true,
  title: "GBH — Investissement, conseil et édition d'applications · Paris",
  desc: "GBH est une société par actions simplifiée basée à Paris. Elle investit dans des entreprises, accompagne des dirigeants et édite NOE, l'application pour apprendre les langues en parlant.",
  body: `
<section class="hero" aria-labelledby="h1">
  <div class="wrap">
    <div>
      <div class="eyebrow">${T("Société française · Paris", "French company · Paris")}</div>
      <h1 id="h1">${t('Investir, conseiller, <span class="hl">créer des applications</span>.', 'Investing, advising, <span class="hl">building apps</span>.')}</h1>
      <p class="lead">${T("GBH est une société par actions simplifiée basée à Paris. Elle prend des participations dans des entreprises, accompagne des dirigeants sur leurs sujets financiers et stratégiques, et conçoit ses propres produits numériques, dont <b>NOE</b>, l'application pour apprendre les langues en parlant.",
    "GBH is a French simplified joint-stock company based in Paris. It invests in companies, advises business leaders on financial and strategic matters, and builds its own digital products, including <b>NOE</b>, the app for learning languages by speaking.")}</p>
      <div class="cta">
        <a class="btn primary" href="#noe">${T("Découvrir NOE", "Discover NOE")}</a>
        <a class="btn" href="#contact">${T("Nous contacter", "Contact us")}</a>
      </div>
    </div>
    <aside class="hero-card" aria-label="${"Identité de la société"}">
      <div class="eyebrow">${T("Identité de la société", "Company details")}</div>
      <dl class="facts" data-l="fr">${facts("fr")}</dl>
      <dl class="facts" data-l="en">${facts("en")}</dl>
    </aside>
  </div>
</section>

<section id="activites" aria-labelledby="h-act">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">${T("Activités", "What we do")}</div>
      <h2 id="h-act">${T("Trois métiers, une même exigence", "Three activities, one standard")}</h2>
    </div>
    <div class="grid3">
      <article class="card"><div class="ico">${icon.stake}</div><h3>${T("Participations", "Investments")}</h3>
        <p>${T("Prise, détention et gestion de participations, majoritaires ou minoritaires, dans des sociétés en France et à l'étranger, avec un horizon de long terme.",
    "Acquiring, holding and managing majority or minority stakes in companies in France and abroad, with a long-term view.")}</p></article>
      <article class="card"><div class="ico">${icon.advice}</div><h3>${T("Conseil", "Advisory")}</h3>
        <p>${T("Accompagnement des dirigeants sur leurs questions financières et stratégiques : pilotage, financement, organisation, projets de croissance.",
    "Supporting business leaders on financial and strategic matters: performance management, financing, organisation and growth projects.")}</p></article>
      <article class="card"><div class="ico">${icon.app}</div><h3>${T("Édition d'applications", "App publishing")}</h3>
        <p>${T("Conception, développement et publication d'applications mobiles et web. Notre première application, NOE, aide à apprendre une langue en parlant.",
    "Designing, building and publishing mobile and web apps. Our first app, NOE, helps people learn a language by speaking it.")}</p></article>
    </div>
  </div>
</section>

<section class="noe" id="noe" aria-labelledby="h-noe">
  <div class="wrap">
    <div class="noe-head">
      <img src="assets/noe-256.png" width="96" height="96" alt="${"Icône de l'application NOE"}">
      <div>
        <div class="eyebrow">${T("Notre application", "Our app")}</div>
        <h2 id="h-noe">${T("NOE — apprendre une langue en parlant", "NOE — learn a language by speaking")}</h2>
      </div>
    </div>
    <div class="noe-body">
      <div>
        <div class="badge">${T("Bientôt sur l'App Store et Google Play", "Coming soon to the App Store and Google Play")}</div>
        <p>${T("NOE propose chaque jour une leçon courte, des exercices corrigés tout de suite et de vraies conversations à voix haute avec des personnages. Lino, notre mascotte, accompagne l'élève à chaque étape.",
    "Every day, NOE offers a short lesson, instantly corrected exercises and real spoken conversations with characters. Lino, our mascot, is there at every step.")}</p>
        <ul class="ticks">
          <li>${T("Cinq langues à apprendre : italien, espagnol, anglais, français et hébreu.", "Five languages to learn: Italian, Spanish, English, French and Hebrew.")}</li>
          <li>${T("Application disponible en français, en anglais et en espagnol.", "App available in French, English and Spanish.")}</li>
          <li>${T("Une formule gratuite chaque jour, sans carte bancaire ; des abonnements Premium et Expert pour aller plus loin.", "A free plan every day, no credit card needed; Premium and Expert subscriptions to go further.")}</li>
          <li>${T("Progression enregistrée dans le compte de l'élève, sur tous ses appareils.", "Progress saved to the learner's account, across all their devices.")}</li>
        </ul>
        <div class="links">
          <a href="${NOE}">${T("Essayer NOE sur le web", "Try NOE on the web")}</a>
          <a href="${NOE}aide.html">${T("Aide et assistance", "Help and support")}</a>
          <a href="${NOE}confidentialite.html">${T("Confidentialité de l'app", "App privacy policy")}</a>
        </div>
      </div>
      <div class="shots" role="list" aria-label="${"Captures d'écran de NOE"}">
        ${shots.map(([fr, en], i) => `<picture role="listitem"><source srcset="assets/noe-${i + 1}.webp" type="image/webp"><img src="assets/noe-${i + 1}.jpg" width="520" height="1130" decoding="async" alt="NOE : ${fr} / ${en}"></picture>`).join("\n        ")}
      </div>
    </div>
  </div>
</section>

<section id="contact" aria-labelledby="h-contact">
  <div class="wrap">
    <div class="section-head">
      <div class="eyebrow">Contact</div>
      <h2 id="h-contact">${T("Écrivez-nous", "Get in touch")}</h2>
      <p class="muted">${T("Une question sur nos activités, un partenariat ou l'application NOE : nous répondons sous deux jours ouvrés.", "A question about our activities, a partnership or the NOE app: we reply within two business days.")}</p>
    </div>
    <div class="contact">
      <div class="card"><h3>${T("Par e-mail", "By email")}</h3><p class="big">${mail}</p></div>
      <div class="card"><h3>${T("Par courrier", "By post")}</h3><address class="big">GBH<br>${CO.street}<br>${CO.city}<br>France</address></div>
    </div>
  </div>
</section>
`,
});

const legal = page({
  file: "mentions-legales.html",
  title: "Mentions légales — GBH",
  desc: "Mentions légales du site de GBH : éditeur, directeur de la publication, hébergeur.",
  body: `
<article class="doc"><div class="wrap">
  <div class="eyebrow">${T(`Mise à jour : ${UPDATED.fr}`, `Last updated: ${UPDATED.en}`)}</div>
  <h1>${T("Mentions légales", "Legal notice")}</h1>
  <h2>${T("Éditeur du site", "Website publisher")}</h2>
  <dl class="facts" data-l="fr">${facts("fr")}</dl>
  <dl class="facts" data-l="en">${facts("en")}</dl>
  <p style="margin-top:16px">${T("Contact : ", "Contact: ")}${mail}</p>
  <h2>${T("Directeur de la publication", "Publication director")}</h2>
  <p>${T(`${CO.president}, président de GBH.`, `${CO.president}, President of GBH.`)}</p>
  <h2>${T("Hébergeur", "Hosting provider")}</h2>
  <p>GitHub, Inc. (GitHub Pages)<br>88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, ${T("États-Unis", "United States")}<br><a href="https://github.com">github.com</a></p>
  <h2>${T("Application NOE", "NOE app")}</h2>
  <p>${T(`L'application NOE est éditée par GBH. Ses conditions et sa politique de confidentialité sont décrites sur <a href="${NOE}confidentialite.html">la page de confidentialité de NOE</a> ; l'assistance est sur <a href="${NOE}aide.html">la page d'aide</a>.`,
    `The NOE app is published by GBH. Its terms and privacy policy are described on <a href="${NOE}confidentialite.html">the NOE privacy page</a>; support is available on <a href="${NOE}aide.html">the help page</a>.`)}</p>
  <h2>${T("Propriété intellectuelle", "Intellectual property")}</h2>
  <p>${T("Les textes, logos, visuels et la mascotte Lino présentés sur ce site appartiennent à GBH. Toute reproduction sans autorisation écrite est interdite. La police Nunito est utilisée sous licence SIL Open Font License.",
    "The texts, logos, visuals and the Lino mascot shown on this site belong to GBH. Any reproduction without written permission is prohibited. The Nunito typeface is used under the SIL Open Font License.")}</p>
</div></article>`,
});

const privacy = page({
  file: "confidentialite.html",
  title: "Confidentialité — GBH",
  desc: "Politique de confidentialité du site de GBH : aucun cookie, aucun suivi.",
  body: `
<article class="doc"><div class="wrap">
  <div class="eyebrow">${T(`Mise à jour : ${UPDATED.fr}`, `Last updated: ${UPDATED.en}`)}</div>
  <h1>${T("Confidentialité", "Privacy")}</h1>
  <p class="lead">${T("Ce site ne dépose aucun cookie, n'utilise aucun outil de mesure d'audience et ne collecte aucune donnée personnelle par formulaire.", "This website sets no cookies, uses no analytics and collects no personal data through forms.")}</p>
  <h2>${T("Responsable", "Data controller")}</h2>
  <p>GBH, ${CO.form.fr}, ${addr}. ${T("Contact : ", "Contact: ")}${mail}</p>
  <h2>${T("Données techniques", "Technical data")}</h2>
  <p>${T("Comme tout site web, l'hébergeur (GitHub Pages) reçoit l'adresse IP de votre appareil pour afficher les pages et peut la conserver brièvement dans ses journaux techniques, pour la sécurité du service. Les polices d'écriture sont hébergées sur ce site : aucun service tiers n'est appelé.",
    "Like any website, the hosting provider (GitHub Pages) receives your device's IP address to serve the pages and may keep it briefly in technical logs for security purposes. Fonts are hosted on this site: no third-party service is called.")}</p>
  <p>${T("Votre choix de langue (français ou anglais) est gardé dans votre navigateur ; il n'est envoyé à personne.", "Your language choice (French or English) is kept in your browser; it is not sent to anyone.")}</p>
  <h2>${T("Si vous nous écrivez", "If you email us")}</h2>
  <p>${T("Nous utilisons votre message et votre adresse uniquement pour vous répondre, et nous les supprimons quand l'échange est terminé, sauf obligation légale de conservation.", "We use your message and address only to reply, and delete them once the conversation is over, unless the law requires us to keep them.")}</p>
  <h2>${T("Vos droits", "Your rights")}</h2>
  <p>${T(`Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant à ${mail}. Vous pouvez aussi saisir la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).`,
    `You can request access to, correction or deletion of your data by writing to ${mail}. You may also contact the French data protection authority, the CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).`)}</p>
  <h2>${T("Application NOE", "NOE app")}</h2>
  <p>${T(`Les données utilisées par l'application NOE sont décrites dans sa propre <a href="${NOE}confidentialite.html">politique de confidentialité</a>.`, `The data used by the NOE app is described in its own <a href="${NOE}confidentialite.html">privacy policy</a>.`)}</p>
</div></article>`,
});

const notFound = page({
  file: "404.html",
  title: "Page introuvable — GBH",
  desc: "Cette page n'existe pas.",
  body: `<article class="doc"><div class="wrap"><h1>${T("Page introuvable", "Page not found")}</h1><p>${T("Cette page n'existe pas ou a été déplacée.", "This page doesn't exist or has moved.")}</p><p><a class="btn primary" href="./">${T("Retour à l'accueil", "Back to home")}</a></p></div></article>`,
}).replace(/href="\.\//g, `href="${BASE}`).replace(/(href|src)="(style\.css|favicon\.svg|assets\/[^"]+|fonts\/[^"]+|mentions-legales\.html|confidentialite\.html)"/g, `$1="${BASE}$2"`);

writeFileSync("index.html", home);
writeFileSync("mentions-legales.html", legal);
writeFileSync("confidentialite.html", privacy);
writeFileSync("404.html", notFound);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n`);
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", "mentions-legales.html", "confidentialite.html"].map((p) => `  <url><loc>${BASE}${p}</loc></url>`).join("\n")}\n</urlset>\n`);
if (DOMAIN) writeFileSync("CNAME", DOMAIN + "\n"); else if (existsSync("CNAME")) rmSync("CNAME");
writeFileSync(".nojekyll", "");
console.log(`Site construit pour ${BASE} (contact : ${EMAIL})`);
