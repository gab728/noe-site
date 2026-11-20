// Site de NOE (application éditée par GBH), généré à partir de site.json (domaine et adresse de contact).
//   node build.mjs   → index.html, mentions-legales.html, confidentialite.html, 404.html, robots.txt, sitemap.xml, CNAME
// Brancher le nom de domaine : renseigner "domain" dans site.json (ex. "getnoe.app"), relancer, publier.
// Exigence d'Apple : le nom complet de la société éditrice (GBH) est visible sur la page d'accueil (pied de page de chaque page).
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";

const cfg = JSON.parse(readFileSync(new URL("./site.json", import.meta.url), "utf8"));
const DOMAIN = (cfg.domain || "").trim();
const EMAIL = DOMAIN ? `contact@${DOMAIN}` : cfg.fallbackEmail;
const BASE = DOMAIN ? `https://${DOMAIN}/` : cfg.fallbackBase;
const APP = "https://gab728.github.io/italiano-passo-passo/";
const PLANE = readFileSync(new URL("./assets/plane.svg", import.meta.url), "utf8").trim();
const YEAR = new Date().getFullYear();
const UPDATED = { fr: "20 novembre 2026", en: "November 20, 2026" };

const CO = {
  name: "GBH",
  form: { fr: "Société par actions simplifiée (SAS)", en: "French simplified joint-stock company (SAS)" },
  capital: { fr: "1 000 €", en: "€1,000" },
  street: "23 rue d'Anjou", city: "75008 Paris",
  rcs: "934 041 229 R.C.S. Paris", siren: "934 041 229", siret: "934 041 229 00014", vat: "FR18934041229",
  president: "Gabriel Brami",
};

// Texte dans les deux langues ; le script de la page masque celle qui n'est pas choisie (même adresse pour les deux).
const T = (fr, en, tag = "span") => `<${tag} data-l="fr">${fr}</${tag}><${tag} data-l="en">${en}</${tag}>`;
const mail = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
const editor = {
  fr: `NOE est une application éditée par <b>GBH</b>, société par actions simplifiée au capital de 1 000 €, ${CO.street}, ${CO.city}, France — RCS Paris ${CO.siren}.`,
  en: `NOE is an app published by <b>GBH</b>, a French simplified joint-stock company (SAS) with a share capital of €1,000, ${CO.street}, ${CO.city}, France — Paris trade register ${CO.siren}.`,
};

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
<meta property="og:site_name" content="NOE">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${BASE}assets/noe-256.png">
<meta name="theme-color" content="#F4F6FA" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E1016" media="(prefers-color-scheme: dark)">
<link rel="icon" href="assets/noe-64.png" type="image/png">
<link rel="apple-touch-icon" href="assets/noe-180.png">
<link rel="preload" href="fonts/nunito-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="style.css">
${home ? `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "MobileApplication", name: "NOE", url: BASE, applicationCategory: "EducationalApplication",
    operatingSystem: "iOS, Android, Web", inLanguage: ["fr", "en", "es"], offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@type": "Organization", name: CO.name, legalName: CO.name, email: EMAIL, vatID: CO.vat,
      address: { "@type": "PostalAddress", streetAddress: CO.street, postalCode: "75008", addressLocality: "Paris", addressCountry: "FR" } },
  })}</script>` : ""}
<script>
(function () { var l = ""; try { l = localStorage.getItem("noe-lang") || ""; } catch (e) {} if (!l) l = /^fr/i.test(navigator.language || "fr") ? "fr" : "en"; document.documentElement.lang = l; })();
</script>
</head>
<body>
<a class="skip" href="#main">${T("Aller au contenu", "Skip to content")}</a>
<header class="top" id="top">
  <div class="wrap">
    <a class="logo" href="./" aria-label="NOE"><img src="assets/noe-64.png" width="34" height="34" alt="">NOE</a>
    <nav class="nav" aria-label="Navigation">
      <a class="opt" href="./#fonctionnalites">${T("L'app", "The app")}</a>
      <a class="opt" href="./#formules">${T("Formules", "Plans")}</a>
      <a class="opt" href="${APP}aide.html">${T("Aide", "Help")}</a>
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
    <p class="editor">${T(editor.fr, editor.en)}</p>
    <div class="foot-row">
      <div>© ${YEAR} GBH</div>
      <nav aria-label="Liens">
        <a href="${APP}aide.html">${T("Aide et assistance", "Help and support")}</a>
        <a href="confidentialite.html">${T("Confidentialité", "Privacy")}</a>
        <a href="mentions-legales.html">${T("Mentions légales", "Legal notice")}</a>
        <a href="./#contact">Contact</a>
      </nav>
    </div>
  </div>
</footer>
<script>
(function () {
  document.getElementById("lang").onclick = function () { var l = document.documentElement.lang === "fr" ? "en" : "fr"; document.documentElement.lang = l; try { localStorage.setItem("noe-lang", l); } catch (e) {} };
  var top = document.getElementById("top"), on = function () { top.classList.toggle("scrolled", window.scrollY > 4); };
  window.addEventListener("scroll", on, { passive: true }); on();
})();
</script>
</body>
</html>
`;
}

const facts = (l) => `
  <div><dt>${l === "fr" ? "Dénomination" : "Legal name"}</dt><dd>${CO.name}</dd></div>
  <div><dt>${l === "fr" ? "Forme" : "Legal form"}</dt><dd>${CO.form[l]}</dd></div>
  <div><dt>${l === "fr" ? "Capital social" : "Share capital"}</dt><dd>${CO.capital[l]}</dd></div>
  <div><dt>${l === "fr" ? "Siège social" : "Registered office"}</dt><dd>${CO.street}, ${CO.city}, France</dd></div>
  <div><dt>${l === "fr" ? "Immatriculation" : "Registration"}</dt><dd>${CO.rcs}</dd></div>
  <div><dt>SIRET</dt><dd>${CO.siret}</dd></div>
  <div><dt>${l === "fr" ? "N° de TVA" : "VAT number"}</dt><dd>${CO.vat}</dd></div>
  <div><dt>${l === "fr" ? "Directeur de la publication" : "Publication director"}</dt><dd>${CO.president}, ${l === "fr" ? "président" : "President"}</dd></div>
  <div><dt>Contact</dt><dd>${mail}</dd></div>`;

const shot = (i, fr, en, extra = "") => `<picture><source srcset="assets/noe-${i}.webp" type="image/webp"><img src="assets/noe-${i}.jpg" width="520" height="1130" decoding="async" alt="NOE : ${fr} / ${en}"${extra}></picture>`;

const features = [
  [2, "Des leçons courtes, corrigées tout de suite", "Short lessons, corrected instantly",
    "Chaque jour, une leçon de quelques minutes : vocabulaire dit par Lino, explications claires et exercices corrigés à la seconde.",
    "Every day, a lesson of a few minutes: vocabulary spoken by Lino, clear explanations and exercises corrected in a second."],
  [1, "Parler avec des personnages, à voix haute", "Talk out loud with characters",
    "Commander un café à Rome, réserver une chambre à Madrid : de vraies conversations, avec une voix naturelle et des corrections bienveillantes.",
    "Order a coffee in Rome, book a room in Madrid: real conversations, with a natural voice and kind corrections."],
  [3, "Un billet par jour, à ton rythme", "One ticket a day, at your own pace",
    "Un parcours progressif, de débutant à avancé, et l'actualité réécrite à ton niveau pour lire et écrire sur des sujets qui t'intéressent.",
    "A step-by-step path from beginner to advanced, plus the news rewritten at your level to read and write about topics you like."],
  [4, "Garde ta série, jour après jour", "Keep your streak, day after day",
    "Objectif du jour, série, rappels sympas et un carnet de mots toujours sous la main : l'habitude s'installe sans effort.",
    "Daily goal, streak, friendly reminders and a word notebook always at hand: the habit builds itself."],
];

const langs = [["🇮🇹", "Italien", "Italian"], ["🇪🇸", "Espagnol", "Spanish"], ["🇬🇧", "Anglais", "English"], ["🇫🇷", "Français", "French"], ["🇮🇱", "Hébreu", "Hebrew"]];

const plans = [
  ["Gratuit", "Free", "Chaque jour, sans carte bancaire", "Every day, no credit card",
    [["La leçon du jour et ses exercices", "Today's lesson and its exercises"], ["3 minutes de conversation par jour", "3 minutes of conversation a day"], ["Carnet de mots, série et rappels", "Word notebook, streak and reminders"]]],
  ["Premium", "Premium", "Pour pratiquer tous les jours", "To practise every day",
    [["Toutes les leçons et l'actualité", "All lessons and the news"], ["20 minutes de conversation par jour", "20 minutes of conversation a day"], ["Voix naturelles des personnages", "Natural character voices"]], true],
  ["Expert", "Expert", "Pour devenir vraiment fluide", "To become truly fluent",
    [["Tout Premium", "Everything in Premium"], ["60 minutes de conversation par jour", "60 minutes of conversation a day"], ["Plus de voix naturelles", "More natural voices"]]],
];

const home = page({
  file: "index.html", home: true,
  title: "NOE — Apprends une langue en parlant",
  desc: "NOE : des leçons courtes, corrigées tout de suite, et de vraies conversations à voix haute. Italien, espagnol, anglais, français et hébreu. Application éditée par GBH.",
  body: `
<section class="hero" aria-labelledby="h1">
  <div class="sky" aria-hidden="true"><i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i></div>
  <div class="wrap">
    <div class="hero-text">
      <div class="badge">${T("Bientôt sur l'App Store et Google Play", "Coming soon to the App Store and Google Play")}</div>
      <h1 id="h1">${T("Apprends une langue <span class=\"hl\">en parlant</span>.", "Learn a language <span class=\"hl\">by speaking</span>.")}</h1>
      <p class="lead">${T("Des leçons courtes, corrigées tout de suite, et de vraies conversations à voix haute avec des personnages. Lino t'accompagne à chaque étape.",
    "Short lessons, corrected instantly, and real spoken conversations with characters. Lino is with you every step of the way.")}</p>
      <div class="cta">
        <a class="btn primary" href="${APP}">${T("Essayer gratuitement", "Try it for free")}</a>
        <a class="btn" href="#fonctionnalites">${T("Découvrir l'app", "Discover the app")}</a>
      </div>
      <p class="small muted">${T("Gratuit chaque jour, sans carte bancaire. Sur le web dès maintenant.", "Free every day, no credit card. Available on the web now.")}</p>
    </div>
    <div class="hero-art">
      <div class="plane">${PLANE}</div>
      <div class="phone">${shot(5, "italien, espagnol, anglais, français et hébreu", "Italian, Spanish, English, French and Hebrew", ' fetchpriority="high"')}</div>
    </div>
  </div>
</section>

<section class="langs" aria-label="${"Langues"}">
  <div class="wrap">
    <p class="eyebrow">${T("Cinq langues à apprendre", "Five languages to learn")}</p>
    <ul>${langs.map(([f, fr, en]) => `<li><span aria-hidden="true">${f}</span>${T(fr, en)}</li>`).join("")}</ul>
    <p class="muted small">${T("L'application parle français, anglais et espagnol.", "The app is available in French, English and Spanish.")}</p>
  </div>
</section>

<section id="fonctionnalites" aria-labelledby="h-feat">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">${T("L'app", "The app")}</p>
      <h2 id="h-feat">${T("Dix minutes par jour, et ça rentre", "Ten minutes a day, and it sticks")}</h2>
    </div>
    <div class="features">
      ${features.map(([i, fr, en, dfr, den], k) => `<article class="feature${k % 2 ? " rev" : ""}">
        <div class="feature-shot">${shot(i, fr, en, ' loading="lazy"')}</div>
        <div class="feature-text"><h3>${T(fr, en)}</h3><p>${T(dfr, den)}</p></div>
      </article>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="plans-wrap" id="formules" aria-labelledby="h-plans">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">${T("Formules", "Plans")}</p>
      <h2 id="h-plans">${T("Commence gratuitement, va plus loin quand tu veux", "Start for free, go further whenever you like")}</h2>
    </div>
    <div class="plans">
      ${plans.map(([fr, en, sfr, sen, items, star]) => `<article class="plan${star ? " star" : ""}">
        <h3>${T(fr, en)}</h3><p class="muted">${T(sfr, sen)}</p>
        <ul class="ticks">${items.map(([a, b]) => `<li>${T(a, b)}</li>`).join("")}</ul>
      </article>`).join("\n      ")}
    </div>
    <p class="muted small">${T("Abonnements mensuels ou annuels, avec essai gratuit, résiliables à tout moment depuis le store ou l'app. Prix affichés dans l'app.",
    "Monthly or yearly subscriptions, with a free trial, cancel anytime from the store or the app. Prices shown in the app.")}</p>
  </div>
</section>

<section id="contact" aria-labelledby="h-contact">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">${T("Contact et assistance", "Contact and support")}</p>
      <h2 id="h-contact">${T("Une question ? On te répond.", "A question? We'll answer.")}</h2>
    </div>
    <div class="contact">
      <div class="card"><h3>${T("Écris-nous", "Email us")}</h3><p class="big">${mail}</p><p class="muted">${T("Réponse sous deux jours ouvrés.", "We reply within two business days.")}</p></div>
      <div class="card"><h3>${T("Aide en ligne", "Online help")}</h3><p>${T("Compte, abonnement, micro, rappels, suppression du compte : les réponses aux questions fréquentes.", "Account, subscription, microphone, reminders, account deletion: answers to common questions.")}</p>
        <p><a class="btn" href="${APP}aide.html">${T("Voir l'aide", "Open help")}</a></p></div>
      <div class="card"><h3>${T("Éditeur", "Publisher")}</h3><address>GBH (SAS)<br>${CO.street}<br>${CO.city}, France<br>RCS Paris ${CO.siren}</address></div>
    </div>
  </div>
</section>
`,
});

const doc = (file, title, desc, inner) => page({ file, title, desc, body: `<article class="doc"><div class="wrap">\n<p class="eyebrow">${T(`Mise à jour : ${UPDATED.fr}`, `Last updated: ${UPDATED.en}`)}</p>\n${inner}\n</div></article>` });

const legal = doc("mentions-legales.html", "Mentions légales — NOE", "Mentions légales du site et de l'application NOE, éditée par GBH.", `
  <h1>${T("Mentions légales", "Legal notice")}</h1>
  <p class="lead">${T(editor.fr, editor.en)}</p>
  <h2>${T("Éditeur", "Publisher")}</h2>
  <dl class="facts" data-l="fr">${facts("fr")}</dl>
  <dl class="facts" data-l="en">${facts("en")}</dl>
  <h2>${T("Hébergement", "Hosting")}</h2>
  <p>${T("Site : ", "Website: ")}GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, ${T("États-Unis", "United States")}.</p>
  <h2>${T("Propriété intellectuelle", "Intellectual property")}</h2>
  <p>${T("Le nom NOE, la mascotte Lino, les textes, les leçons et les visuels appartiennent à GBH. Toute reproduction sans autorisation écrite est interdite. La police Nunito est utilisée sous licence SIL Open Font License.",
    "The NOE name, the Lino mascot, texts, lessons and visuals belong to GBH. Any reproduction without written permission is prohibited. The Nunito typeface is used under the SIL Open Font License.")}</p>
  <h2>${T("Application", "App")}</h2>
  <p>${T(`Les données traitées par l'application sont décrites dans sa <a href="${APP}confidentialite.html">politique de confidentialité</a>. L'assistance est sur la <a href="${APP}aide.html">page d'aide</a>.`,
    `Data processed by the app is described in its <a href="${APP}confidentialite.html">privacy policy</a>. Support is available on the <a href="${APP}aide.html">help page</a>.`)}</p>`);

const privacy = doc("confidentialite.html", "Confidentialité — NOE", "Confidentialité du site NOE : aucun cookie, aucun suivi. Politique de l'application NOE.", `
  <h1>${T("Confidentialité", "Privacy")}</h1>
  <p class="lead">${T("Ce site ne dépose aucun cookie, n'utilise aucun outil de mesure d'audience et ne collecte aucune donnée par formulaire.", "This website sets no cookies, uses no analytics and collects no data through forms.")}</p>
  <h2>${T("L'application NOE", "The NOE app")}</h2>
  <p>${T(`Ce que l'application utilise (compte, progression, voix pour la transcription, abonnement), pourquoi, avec quels prestataires et comment tout supprimer : <a href="${APP}confidentialite.html">politique de confidentialité de l'application</a>.`,
    `What the app uses (account, progress, voice for transcription, subscription), why, with which providers and how to delete everything: <a href="${APP}confidentialite.html">app privacy policy</a>.`)}</p>
  <h2>${T("Responsable", "Data controller")}</h2>
  <p>GBH, ${T(CO.form.fr, CO.form.en)}, ${CO.street}, ${CO.city}, France. ${T("Contact : ", "Contact: ")}${mail}</p>
  <h2>${T("Données techniques du site", "Website technical data")}</h2>
  <p>${T("L'hébergeur (GitHub Pages) reçoit l'adresse IP de votre appareil pour afficher les pages et peut la garder brièvement dans ses journaux, pour la sécurité. Les polices sont hébergées sur ce site : aucun service tiers n'est appelé. Votre choix de langue reste dans votre navigateur.",
    "The host (GitHub Pages) receives your device's IP address to serve the pages and may keep it briefly in its logs for security. Fonts are hosted on this site: no third-party service is called. Your language choice stays in your browser.")}</p>
  <h2>${T("Vos droits", "Your rights")}</h2>
  <p>${T(`Accès, rectification, suppression : écrivez à ${mail}. Vous pouvez aussi saisir la CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).`,
    `Access, correction, deletion: write to ${mail}. You may also contact the French data protection authority, the CNIL (<a href="https://www.cnil.fr">cnil.fr</a>).`)}</p>`);

const notFound = page({
  file: "404.html", title: "Page introuvable — NOE", desc: "Cette page n'existe pas.",
  body: `<article class="doc"><div class="wrap"><h1>${T("Page introuvable", "Page not found")}</h1><p>${T("Cette page n'existe pas ou a été déplacée.", "This page doesn't exist or has moved.")}</p><p><a class="btn primary" href="./">${T("Retour à l'accueil", "Back to home")}</a></p></div></article>`,
}).replace(/href="\.\//g, `href="${BASE}`).replace(/(href|src)="(style\.css|assets\/[^"]+|fonts\/[^"]+|mentions-legales\.html|confidentialite\.html)"/g, `$1="${BASE}$2"`);

writeFileSync("index.html", home);
writeFileSync("mentions-legales.html", legal);
writeFileSync("confidentialite.html", privacy);
writeFileSync("404.html", notFound);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n`);
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", "mentions-legales.html", "confidentialite.html"].map((p) => `  <url><loc>${BASE}${p}</loc></url>`).join("\n")}\n</urlset>\n`);
if (DOMAIN) writeFileSync("CNAME", DOMAIN + "\n"); else if (existsSync("CNAME")) rmSync("CNAME");
writeFileSync(".nojekyll", "");
console.log(`Site construit pour ${BASE} (contact : ${EMAIL})`);
