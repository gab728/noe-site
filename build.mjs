// Site de NOE (application éditée par GBH) — noelang.app.
//   node build.mjs   → index.html, aide.html, confidentialite.html, mentions-legales.html, 404.html, robots.txt, sitemap.xml, CNAME
// Trois langues (français, anglais, espagnol) à la même adresse : le texte des trois est dans la page, le script masque les autres.
// Exigence d'Apple : le nom complet de la société éditrice (GBH) est visible sur chaque page (pied de page), aide et contact publics.
// L'aide et la confidentialité viennent de l'app (app-legal.json, mis à jour par scripts/sync-app.mjs).
import { readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";

const cfg = JSON.parse(readFileSync(new URL("./site.json", import.meta.url), "utf8"));
const LEGAL = JSON.parse(readFileSync(new URL("./app-legal.json", import.meta.url), "utf8"));
const DOMAIN = (cfg.domain || "").trim();
const EMAIL = DOMAIN ? `contact@${DOMAIN}` : cfg.fallbackEmail;
const BASE = DOMAIN ? `https://${DOMAIN}/` : cfg.fallbackBase;
const APP = "https://gab728.github.io/Italiano-passo-passo/";
const PLANE = readFileSync(new URL("./assets/plane.svg", import.meta.url), "utf8").trim();
const YEAR = new Date().getFullYear();
const L3 = ["fr", "en", "es"];

const CO = {
  name: "GBH", street: "23 rue d'Anjou", city: "75008 Paris", siren: "934 041 229", siret: "934 041 229 00014",
  rcs: "934 041 229 R.C.S. Paris", vat: "FR18934041229", president: "Gabriel Brami",
  form: { fr: "Société par actions simplifiée (SAS)", en: "French simplified joint-stock company (SAS)", es: "Sociedad por acciones simplificada (SAS) francesa" },
  capital: { fr: "1 000 €", en: "€1,000", es: "1.000 €" },
};

// Texte dans les trois langues (l'espagnol reprend l'anglais s'il manque).
const T = (fr, en, es = en, tag = "span") => `<${tag} data-l="fr">${fr}</${tag}><${tag} data-l="en">${en}</${tag}><${tag} data-l="es">${es}</${tag}>`;
const mail = `<a href="mailto:${EMAIL}">${EMAIL}</a>`;
const fixApp = (h) => h.replaceAll(LEGAL.CONTACT, EMAIL).replace(/confidentialite\.html#(en|es)/g, "confidentialite.html");
const editor = {
  fr: `NOE est une application éditée par <b>GBH</b>, société par actions simplifiée au capital de 1 000 €, ${CO.street}, ${CO.city}, France — RCS Paris ${CO.siren}.`,
  en: `NOE is an app published by <b>GBH</b>, a French simplified joint-stock company (SAS) with a share capital of €1,000, ${CO.street}, ${CO.city}, France — Paris trade register ${CO.siren}.`,
  es: `NOE es una aplicación editada por <b>GBH</b>, sociedad por acciones simplificada francesa con un capital de 1.000 €, ${CO.street}, ${CO.city}, Francia — Registro Mercantil de París ${CO.siren}.`,
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
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#EAF3FF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E1016" media="(prefers-color-scheme: dark)">
<link rel="icon" href="assets/noe-64.png" type="image/png">
<link rel="apple-touch-icon" href="assets/noe-180.png">
<link rel="preload" href="fonts/nunito-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="style.css">
${home ? `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org", "@type": "MobileApplication", name: "NOE", url: BASE, applicationCategory: "EducationalApplication",
    operatingSystem: "iOS, Android, Web", inLanguage: L3, offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    publisher: { "@type": "Organization", name: CO.name, legalName: CO.name, email: EMAIL, vatID: CO.vat,
      address: { "@type": "PostalAddress", streetAddress: CO.street, postalCode: "75008", addressLocality: "Paris", addressCountry: "FR" } },
  })}</script>` : ""}
<script>
/* Langue : #en ou #es dans l'adresse, sinon le dernier choix, sinon celle du navigateur (français par défaut). */
(function () { var d = document.documentElement, h = (location.hash.match(/^#(fr|en|es)$/) || [])[1], l = h || ""; try { l = l || localStorage.getItem("noe-lang") || ""; } catch (e) {}
  if (!l) { var n = (navigator.language || "fr").slice(0, 2).toLowerCase(); l = n === "fr" || n === "es" ? n : "en"; } d.lang = l; d.className = "js"; })();
</script>
</head>
<body>
<a class="skip" href="#main">${T("Aller au contenu", "Skip to content", "Ir al contenido")}</a>
<header class="top" id="top">
  <div class="wrap">
    <a class="logo" href="./" aria-label="NOE"><img src="assets/noe-64.png" width="34" height="34" alt="">NOE</a>
    <nav class="nav" aria-label="Navigation">
      <a class="opt" href="./#comment">${T("Comment ça marche", "How it works", "Cómo funciona")}</a>
      <a class="opt" href="./#formules">${T("Formules", "Plans", "Planes")}</a>
      <a class="opt" href="aide.html">${T("Aide", "Help", "Ayuda")}</a>
    </nav>
    <div class="langs-switch" role="group" aria-label="Langue · Language · Idioma">
      ${L3.map((l) => `<button type="button" data-set="${l}" lang="${l}">${l.toUpperCase()}</button>`).join("")}
    </div>
    <a class="btn primary sm try" href="${APP}">${T("Essayer", "Try it", "Probar")}</a>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-brand"><img src="assets/noe-64.png" width="40" height="40" alt=""><div><b>NOE</b><br>${T("Apprends une langue en parlant.", "Learn a language by speaking.", "Aprende un idioma hablando.")}</div></div>
    <p class="editor">${T(editor.fr, editor.en, editor.es)}</p>
    <div class="foot-row">
      <div>© ${YEAR} GBH · ${mail}</div>
      <nav aria-label="Liens">
        <a href="aide.html">${T("Aide et assistance", "Help and support", "Ayuda y soporte")}</a>
        <a href="confidentialite.html">${T("Confidentialité", "Privacy", "Privacidad")}</a>
        <a href="mentions-legales.html">${T("Mentions légales", "Legal notice", "Aviso legal")}</a>
      </nav>
    </div>
  </div>
</footer>
<script>
(function () {
  var d = document.documentElement, bs = document.querySelectorAll("[data-set]");
  function mark() { for (var i = 0; i < bs.length; i++) bs[i].setAttribute("aria-pressed", bs[i].getAttribute("data-set") === d.lang ? "true" : "false"); }
  for (var i = 0; i < bs.length; i++) bs[i].onclick = function () { d.lang = this.getAttribute("data-set"); try { localStorage.setItem("noe-lang", d.lang); } catch (e) {} mark(); };
  mark();
  var top = document.getElementById("top"), on = function () { top.classList.toggle("scrolled", window.scrollY > 4); };
  window.addEventListener("scroll", on, { passive: true }); on();
  /* Apparition au défilement (le contenu reste visible sans JavaScript ou si l'observateur manque). */
  var els = document.querySelectorAll("[data-r]");
  if (!("IntersectionObserver" in window)) { for (var j = 0; j < els.length; j++) els[j].classList.add("in"); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  for (var k = 0; k < els.length; k++) io.observe(els[k]);
})();
</script>
</body>
</html>
`;
}

const shot = (i, alt, extra = "") => `<picture><source srcset="assets/noe-${i}.webp" type="image/webp"><img src="assets/noe-${i}.jpg" width="520" height="1130" decoding="async" alt="${alt}"${extra}></picture>`;
const icon = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const I = {
  globe: icon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>'),
  book: icon('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>'),
  mic: icon('<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>'),
  car: icon('<path d="M5 16l1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.5"/><circle cx="7.5" cy="18" r=".6"/><circle cx="16.5" cy="18" r=".6"/>'),
  note: icon('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
  news: icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h6M7 13h10M7 16h8"/>'),
  bell: icon('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>'),
  wifi: icon('<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8"/>'),
  spark: icon('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18"/>'),
};

const langs = [["🇮🇹", "Italien", "Italian", "Italiano"], ["🇪🇸", "Espagnol", "Spanish", "Español"], ["🇬🇧", "Anglais", "English", "Inglés"], ["🇫🇷", "Français", "French", "Francés"], ["🇮🇱", "Hébreu", "Hebrew", "Hebreo"]];
const hellos = [["Ciao!", "it"], ["¡Hola!", "es"], ["Hello!", "en"], ["Bonjour !", "fr"], ["שָׁלוֹם", "he"]];

const steps = [
  [I.globe, "Choisis ta langue", "Pick your language", "Elige tu idioma",
    "Italien, espagnol, anglais, français ou hébreu, du tout début jusqu'au niveau avancé.", "Italian, Spanish, English, French or Hebrew, from the very beginning to advanced.", "Italiano, español, inglés, francés o hebreo, desde cero hasta nivel avanzado."],
  [I.book, "Une leçon courte par jour", "One short lesson a day", "Una lección corta al día",
    "Quelques minutes : les mots dits par Lino, une explication claire, des exercices corrigés tout de suite.", "A few minutes: words spoken by Lino, a clear explanation, exercises corrected instantly.", "Unos minutos: palabras dichas por Lino, una explicación clara, ejercicios corregidos al instante."],
  [I.mic, "Parle à voix haute", "Speak out loud", "Habla en voz alta",
    "Discute avec des personnages comme dans la vraie vie. Ils te répondent et te corrigent avec bienveillance.", "Chat with characters like in real life. They answer and kindly correct you.", "Conversa con personajes como en la vida real. Te responden y te corrigen con amabilidad."],
];

const features = [
  [2, "Des leçons courtes, corrigées tout de suite", "Short lessons, corrected instantly", "Lecciones cortas, corregidas al instante",
    "Vocabulaire dit par Lino, phrases à trous, traductions : chaque réponse est corrigée à la seconde, avec un indice si tu bloques.",
    "Vocabulary spoken by Lino, fill-in-the-blanks, translations: every answer is corrected in a second, with a hint if you get stuck.",
    "Vocabulario dicho por Lino, frases para completar, traducciones: cada respuesta se corrige al momento, con una pista si te atascas."],
  [1, "De vraies conversations, à voix haute", "Real conversations, out loud", "Conversaciones reales, en voz alta",
    "Commander un café à Rome, réserver une chambre à Madrid, parler de ta journée : tu parles, le personnage te répond avec une voix naturelle.",
    "Order a coffee in Rome, book a room in Madrid, talk about your day: you speak, the character answers with a natural voice.",
    "Pedir un café en Roma, reservar una habitación en Madrid, hablar de tu día: tú hablas y el personaje responde con una voz natural."],
  [3, "Un parcours qui avance avec toi", "A path that moves with you", "Un recorrido que avanza contigo",
    "Chaque jour, ton billet pour la leçon suivante. Le parcours va du débutant à l'avancé et revient sur les mots que tu oublies.",
    "Every day, your ticket to the next lesson. The path goes from beginner to advanced and brings back the words you forget.",
    "Cada día, tu billete para la siguiente lección. El recorrido va de principiante a avanzado y repasa las palabras que olvidas."],
  [4, "Une série qui donne envie de revenir", "A streak that keeps you coming back", "Una racha que da ganas de volver",
    "Objectif du jour, série de jours d'affilée, petites fêtes quand tu réussis : l'habitude s'installe sans effort.",
    "Daily goal, day streak, little celebrations when you succeed: the habit builds itself.",
    "Objetivo del día, racha de días seguidos, pequeñas celebraciones cuando aciertas: el hábito se crea sin esfuerzo."],
];

const extras = [
  [I.car, "Mode voiture", "Car mode", "Modo coche", "Révise à voix haute pendant tes trajets, sans toucher l'écran.", "Practise out loud on the road, without touching the screen.", "Repasa en voz alta durante tus trayectos, sin tocar la pantalla."],
  [I.news, "L'actualité à ton niveau", "News at your level", "Noticias a tu nivel", "Des articles du jour réécrits pour ton niveau, à lire et à commenter.", "Today's articles rewritten for your level, to read and discuss.", "Artículos del día reescritos para tu nivel, para leer y comentar."],
  [I.note, "Carnet de mots", "Word notebook", "Cuaderno de palabras", "Les mots que tu ne connais pas sont gardés, toujours sous la main.", "Words you don't know are saved, always at hand.", "Las palabras que no conoces se guardan, siempre a mano."],
  [I.spark, "Révisions sur mesure", "Tailored reviews", "Repasos a medida", "Des exercices faits pour toi, sur tes erreurs, et tes traductions corrigées.", "Exercises made for you, on your mistakes, and your translations corrected.", "Ejercicios hechos para ti, sobre tus errores, y tus traducciones corregidas."],
  [I.bell, "Rappels sympas", "Friendly reminders", "Recordatorios simpáticos", "Un petit mot à l'heure que tu choisis, et rien dès que tu t'es entraîné.", "A short nudge at the time you choose, and nothing once you've practised.", "Un mensajito a la hora que elijas, y nada si ya has practicado."],
  [I.wifi, "Partout, même hors ligne", "Everywhere, even offline", "En todas partes, incluso sin conexión", "Ta progression suit ton compte sur tous tes appareils et se synchronise au retour du réseau.", "Your progress follows your account on every device and syncs when you're back online.", "Tu progreso te sigue en todos tus dispositivos y se sincroniza al volver la conexión."],
];

const plans = [
  ["Gratuit", "Free", "Gratis", "Chaque jour, sans carte bancaire", "Every day, no credit card", "Cada día, sin tarjeta",
    [["Une leçon par jour", "One lesson a day", "Una lección al día"], ["3 minutes de conversation par jour", "3 minutes of conversation a day", "3 minutos de conversación al día"], ["Un article d'actualité par semaine", "One news article a week", "Un artículo de actualidad por semana"], ["Carnet de mots, série et rappels", "Word notebook, streak and reminders", "Cuaderno, racha y recordatorios"]]],
  ["Premium", "Premium", "Premium", "Pour progresser tous les jours", "To improve every day", "Para progresar cada día",
    [["Toutes les leçons, sans limite", "All lessons, unlimited", "Todas las lecciones, sin límite"], ["20 minutes de conversation par jour", "20 minutes of conversation a day", "20 minutos de conversación al día"], ["Voix naturelles des personnages", "Natural character voices", "Voces naturales de los personajes"], ["Mode voiture, mains libres", "Hands-free car mode", "Modo coche, manos libres"], ["L'actualité et les révisions chaque jour", "News and reviews every day", "Noticias y repasos cada día"], ["Toutes les langues incluses", "All languages included", "Todos los idiomas incluidos"]], true],
  ["Expert", "Expert", "Experto", "Pour parler longtemps, chaque jour", "To speak at length, every day", "Para hablar mucho, cada día",
    [["Tout Premium", "Everything in Premium", "Todo Premium"], ["60 minutes de conversation par jour", "60 minutes of conversation a day", "60 minutos de conversación al día"], ["Plus de minutes en voix naturelles", "More minutes with natural voices", "Más minutos con voces naturales"]]],
];

const faq = [
  ["NOE est-il vraiment gratuit ?", "Is NOE really free?", "¿NOE es realmente gratis?",
    "Oui. La formule gratuite donne chaque jour une leçon et quelques minutes de conversation, sans carte bancaire et sans limite de durée. Premium et Expert sont là pour aller plus vite.",
    "Yes. The free plan gives you a lesson and a few minutes of conversation every day, with no credit card and no time limit. Premium and Expert are there to go faster.",
    "Sí. El plan gratuito te da cada día una lección y unos minutos de conversación, sin tarjeta y sin límite de tiempo. Premium y Experto están para avanzar más rápido."],
  ["À partir de quel niveau ?", "What level do I need?", "¿Desde qué nivel?",
    "Aucun : on peut commencer de zéro (l'hébreu commence même par l'alphabet). Le parcours monte ensuite jusqu'à un niveau avancé.",
    "None: you can start from scratch (Hebrew even starts with the alphabet). The path then goes up to an advanced level.",
    "Ninguno: puedes empezar desde cero (el hebreo empieza incluso por el alfabeto). Después el recorrido sube hasta un nivel avanzado."],
  ["Faut-il parler à voix haute ?", "Do I have to speak out loud?", "¿Hay que hablar en voz alta?",
    "C'est conseillé, c'est ce qui fait progresser le plus vite. Mais tu peux aussi écrire tes réponses, par exemple dans les transports.",
    "It's recommended, it's what makes you improve fastest. But you can also type your answers, on public transport for example.",
    "Es lo recomendable, es lo que más te hace progresar. Pero también puedes escribir tus respuestas, por ejemplo en el transporte."],
  ["Sur quels appareils ?", "On which devices?", "¿En qué dispositivos?",
    "Sur le web dès maintenant, et bientôt sur iPhone et Android. Ta progression suit ton compte sur tous tes appareils.",
    "On the web now, and soon on iPhone and Android. Your progress follows your account on all your devices.",
    "En la web ya, y pronto en iPhone y Android. Tu progreso te sigue en todos tus dispositivos."],
  ["Comment résilier un abonnement ?", "How do I cancel a subscription?", "¿Cómo cancelo una suscripción?",
    "À tout moment, depuis ton profil dans l'app, ou depuis les réglages d'abonnement de l'App Store ou de Google Play si tu t'es abonné là. Tu gardes l'accès jusqu'à la fin de la période payée.",
    "Anytime, from your profile in the app, or from the App Store or Google Play subscription settings if you subscribed there. You keep access until the end of the paid period.",
    "Cuando quieras, desde tu perfil en la app, o desde los ajustes de suscripción de App Store o Google Play si te suscribiste allí. Conservas el acceso hasta el final del periodo pagado."],
  ["Que faites-vous de mes données ?", "What do you do with my data?", "¿Qué hacéis con mis datos?",
    "Uniquement faire fonctionner tes cours : pas de publicité, pas de revente. Tu peux supprimer ton compte et toutes tes données depuis l'app, en un geste.",
    "Only run your lessons: no ads, no reselling. You can delete your account and all your data from the app in one tap.",
    "Solo hacer funcionar tus clases: sin publicidad ni reventa. Puedes borrar tu cuenta y todos tus datos desde la app, en un gesto."],
];

const home = page({
  file: "index.html", home: true,
  title: "NOE — Apprends une langue en parlant",
  desc: "NOE : des leçons courtes corrigées tout de suite et de vraies conversations à voix haute. Italien, espagnol, anglais, français et hébreu. Gratuit chaque jour. Application éditée par GBH.",
  body: `
<section class="hero" aria-labelledby="h1">
  <div class="sky" aria-hidden="true"><i class="cloud c1"></i><i class="cloud c2"></i><i class="cloud c3"></i><i class="cloud c4"></i></div>
  <div class="wrap">
    <div class="hero-text">
      <div class="badge rise" style="--d:0s">${T("Bientôt sur l'App Store et Google Play", "Coming soon to the App Store and Google Play", "Pronto en App Store y Google Play")}</div>
      <h1 id="h1" class="rise" style="--d:.08s">${T('Apprends une langue <span class="hl">en parlant</span>.', 'Learn a language <span class="hl">by speaking</span>.', 'Aprende un idioma <span class="hl">hablando</span>.')}</h1>
      <p class="lead rise" style="--d:.16s">${T("Dix minutes par jour : une leçon courte, corrigée tout de suite, et de vraies conversations à voix haute avec des personnages. Lino t'accompagne à chaque étape.",
    "Ten minutes a day: a short lesson, corrected instantly, and real spoken conversations with characters. Lino is with you every step of the way.",
    "Diez minutos al día: una lección corta, corregida al instante, y conversaciones reales en voz alta con personajes. Lino te acompaña en cada paso.")}</p>
      <div class="cta rise" style="--d:.24s">
        <a class="btn primary" href="${APP}">${T("Essayer gratuitement", "Try it for free", "Probar gratis")}</a>
        <a class="btn" href="#comment">${T("Comment ça marche", "How it works", "Cómo funciona")}</a>
      </div>
      <p class="small muted rise" style="--d:.32s">${T("Gratuit chaque jour, sans carte bancaire. Sur le web dès maintenant.", "Free every day, no credit card. On the web right now.", "Gratis cada día, sin tarjeta. Ya disponible en la web.")}</p>
    </div>
    <div class="hero-art">
      <div class="plane-wrap"><div class="plane">${PLANE}</div></div>
      <div class="phone">${shot(5, "NOE : italien, espagnol, anglais, français et hébreu", ' fetchpriority="high"')}</div>
      ${hellos.map(([w, l], i) => `<span class="hello h${i + 1}" lang="${l}" aria-hidden="true">${w}</span>`).join("")}
    </div>
  </div>
</section>

<section class="langs" aria-label="Langues">
  <div class="wrap" data-r>
    <p class="eyebrow">${T("Cinq langues à apprendre", "Five languages to learn", "Cinco idiomas para aprender")}</p>
    <ul>${langs.map(([f, fr, en, es], i) => `<li style="--i:${i}"><span aria-hidden="true">${f}</span>${T(fr, en, es)}</li>`).join("")}</ul>
    <p class="muted small">${T("L'application parle français, anglais et espagnol.", "The app speaks French, English and Spanish.", "La app está en francés, inglés y español.")}</p>
  </div>
</section>

<section id="comment" aria-labelledby="h-how">
  <div class="wrap">
    <div class="section-head" data-r>
      <p class="eyebrow">${T("Comment ça marche", "How it works", "Cómo funciona")}</p>
      <h2 id="h-how">${T("Trois étapes, dix minutes par jour", "Three steps, ten minutes a day", "Tres pasos, diez minutos al día")}</h2>
    </div>
    <ol class="steps">
      ${steps.map(([ic, a, b, c, da, db, dc], i) => `<li class="step" data-r style="--d:${i * 0.1}s"><span class="step-n">${i + 1}</span><div class="ico">${ic}</div><h3>${T(a, b, c)}</h3><p>${T(da, db, dc)}</p></li>`).join("\n      ")}
    </ol>
  </div>
</section>

<section id="fonctionnalites" class="feat-sec" aria-labelledby="h-feat">
  <div class="wrap">
    <div class="section-head" data-r>
      <p class="eyebrow">${T("L'app", "The app", "La app")}</p>
      <h2 id="h-feat">${T("Tout pour oser parler", "Everything you need to dare to speak", "Todo para atreverte a hablar")}</h2>
    </div>
    <div class="features">
      ${features.map(([i, a, b, c, da, db, dc], k) => `<article class="feature${k % 2 ? " rev" : ""}" data-r>
        <div class="feature-shot">${shot(i, `NOE : ${a}`, ' loading="lazy"')}</div>
        <div class="feature-text"><span class="num">0${k + 1}</span><h3>${T(a, b, c)}</h3><p>${T(da, db, dc)}</p></div>
      </article>`).join("\n      ")}
    </div>
    <div class="extras">
      ${extras.map(([ic, a, b, c, da, db, dc], i) => `<article class="extra" data-r style="--d:${(i % 3) * 0.08}s"><div class="ico">${ic}</div><h3>${T(a, b, c)}</h3><p>${T(da, db, dc)}</p></article>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="plans-wrap" id="formules" aria-labelledby="h-plans">
  <div class="wrap">
    <div class="section-head" data-r>
      <p class="eyebrow">${T("Formules", "Plans", "Planes")}</p>
      <h2 id="h-plans">${T("Commence gratuitement, va plus loin quand tu veux", "Start for free, go further whenever you like", "Empieza gratis y llega más lejos cuando quieras")}</h2>
    </div>
    <div class="plans">
      ${plans.map(([a, b, c, sa, sb, sc, items, star], i) => `<article class="plan${star ? " star" : ""}" data-r style="--d:${i * 0.1}s">
        ${star ? `<span class="plan-tag">${T("Le plus choisi", "Most popular", "El más elegido")}</span>` : ""}
        <h3>${T(a, b, c)}</h3><p class="muted">${T(sa, sb, sc)}</p>
        <ul class="ticks">${items.map(([x, y, z]) => `<li>${T(x, y, z)}</li>`).join("")}</ul>
      </article>`).join("\n      ")}
    </div>
    <p class="muted small" data-r>${T("Abonnements mensuels ou annuels, avec essai gratuit, sans engagement : résiliables à tout moment depuis l'app, l'App Store ou Google Play. Les prix sont affichés dans l'app.",
    "Monthly or yearly subscriptions with a free trial and no commitment: cancel anytime from the app, the App Store or Google Play. Prices are shown in the app.",
    "Suscripciones mensuales o anuales con prueba gratuita y sin permanencia: cancela cuando quieras desde la app, App Store o Google Play. Los precios se muestran en la app.")}</p>
  </div>
</section>

<section id="faq" aria-labelledby="h-faq">
  <div class="wrap narrow">
    <div class="section-head" data-r>
      <p class="eyebrow">FAQ</p>
      <h2 id="h-faq">${T("Questions fréquentes", "Frequently asked questions", "Preguntas frecuentes")}</h2>
    </div>
    <div class="faq">
      ${faq.map(([a, b, c, da, db, dc]) => `<details data-r><summary>${T(a, b, c)}</summary><p>${T(da, db, dc)}</p></details>`).join("\n      ")}
    </div>
    <p class="faq-more" data-r>${T(`D'autres questions ? <a href="aide.html">Toute l'aide</a> ou ${mail}.`, `More questions? <a href="aide.html">Full help</a> or ${mail}.`, `¿Más preguntas? <a href="aide.html">Toda la ayuda</a> o ${mail}.`)}</p>
  </div>
</section>

<section class="band" id="contact" aria-labelledby="h-band">
  <div class="wrap" data-r>
    <div class="band-plane" aria-hidden="true">${PLANE.replace(/role="img"[^>]*aria-label="[^"]*"/, 'aria-hidden="true"')}</div>
    <h2 id="h-band">${T("Prêt à parler ?", "Ready to speak?", "¿Listo para hablar?")}</h2>
    <p>${T("Ta première leçon prend cinq minutes. Lino t'attend.", "Your first lesson takes five minutes. Lino is waiting.", "Tu primera lección dura cinco minutos. Lino te espera.")}</p>
    <div class="cta center"><a class="btn sun" href="${APP}">${T("Commencer gratuitement", "Start for free", "Empezar gratis")}</a></div>
    <p class="band-contact">${T("Une question, un partenariat, la presse : ", "Questions, partnerships, press: ", "Preguntas, colaboraciones, prensa: ")}${mail}</p>
  </div>
</section>
`,
});

// Pages de texte en trois langues : un bloc par langue, le script affiche celle choisie.
const docPage = (file, title, desc, blocks) => page({ file, title, desc, body: `<article class="doc"><div class="wrap">\n${L3.map((l) => `<div data-l="${l}" lang="${l}">${blocks[l]}</div>`).join("\n")}\n</div></article>` });
const sections = (secs) => secs.map(([h, html]) => `<h2>${h}</h2>\n${fixApp(html)}`).join("\n");
const LAST = { fr: "Dernière mise à jour", en: "Last updated", es: "Última actualización" };

const help = docPage("aide.html", "Aide et assistance — NOE", "Aide de NOE : connexion, micro, voix, rappels, abonnement, progression, suppression du compte. Contact : " + EMAIL, Object.fromEntries(L3.map((l) => {
  const H = LEGAL.HELP[l];
  const contactBox = { fr: ["Nous écrire", "Réponse sous deux jours ouvrés."], en: ["Email us", "We reply within two business days."], es: ["Escríbenos", "Respondemos en dos días laborables."] }[l];
  return [l, `<p class="eyebrow">${{ fr: "Assistance", en: "Support", es: "Soporte" }[l]}</p><h1>${H.title}</h1><p class="lead">${fixApp(H.intro)}</p>
<div class="help-contact"><div><b>${contactBox[0]}</b><br><span class="big">${mail}</span><br><span class="muted">${contactBox[1]}</span></div></div>
${sections(H.sections)}`];
})));

const SITE_PRIV = {
  fr: ["Ce site (noelang.app)", "Ce site ne dépose aucun cookie et n'utilise aucun outil de mesure d'audience. L'hébergeur (GitHub Pages) reçoit l'adresse IP de votre appareil pour afficher les pages et peut la garder brièvement dans ses journaux, pour la sécurité. Les polices sont hébergées sur ce site. Votre choix de langue reste dans votre navigateur."],
  en: ["This website (noelang.app)", "This website sets no cookies and uses no analytics. The host (GitHub Pages) receives your device's IP address to serve the pages and may keep it briefly in its logs for security. Fonts are hosted on this site. Your language choice stays in your browser."],
  es: ["Este sitio (noelang.app)", "Este sitio no usa cookies ni herramientas de medición de audiencia. El alojamiento (GitHub Pages) recibe la dirección IP de tu dispositivo para mostrar las páginas y puede guardarla brevemente en sus registros, por seguridad. Las fuentes se alojan en este sitio. Tu elección de idioma se queda en tu navegador."],
};
const privacy = docPage("confidentialite.html", "Politique de confidentialité — NOE", "Politique de confidentialité de NOE : données utilisées, finalités, prestataires, durées, droits et suppression du compte.", Object.fromEntries(L3.map((l) => {
  const P = LEGAL.PRIVACY[l];
  return [l, `<p class="eyebrow">${LAST[l]} : ${LEGAL.UPDATED[l]}</p><h1>${P.title}</h1><p class="lead">${fixApp(P.intro)}</p>
${sections(P.sections)}
<h2>${SITE_PRIV[l][0]}</h2><p>${SITE_PRIV[l][1]}</p>`];
})));

const factRows = (l) => {
  const k = { fr: ["Dénomination", "Forme", "Capital social", "Siège social", "Immatriculation", "N° de TVA", "Directeur de la publication", "président"],
    en: ["Legal name", "Legal form", "Share capital", "Registered office", "Registration", "VAT number", "Publication director", "President"],
    es: ["Denominación", "Forma jurídica", "Capital social", "Domicilio social", "Registro", "N.º de IVA", "Director de la publicación", "presidente"] }[l];
  return `<dl class="facts">
  <div><dt>${k[0]}</dt><dd>${CO.name}</dd></div><div><dt>${k[1]}</dt><dd>${CO.form[l]}</dd></div><div><dt>${k[2]}</dt><dd>${CO.capital[l]}</dd></div>
  <div><dt>${k[3]}</dt><dd>${CO.street}, ${CO.city}, ${l === "es" ? "Francia" : "France"}</dd></div><div><dt>${k[4]}</dt><dd>${CO.rcs} · SIRET ${CO.siret}</dd></div>
  <div><dt>${k[5]}</dt><dd>${CO.vat}</dd></div><div><dt>${k[6]}</dt><dd>${CO.president}, ${k[7]}</dd></div><div><dt>Contact</dt><dd>${mail}</dd></div></dl>`;
};
const LG = {
  fr: { t: "Mentions légales", ed: "Éditeur", host: "Hébergement", hostTxt: "GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.", ip: "Propriété intellectuelle",
    ipTxt: "Le nom NOE, la mascotte Lino, les textes, les leçons et les visuels appartiennent à GBH. Toute reproduction sans autorisation écrite est interdite. La police Nunito est utilisée sous licence SIL Open Font License." },
  en: { t: "Legal notice", ed: "Publisher", host: "Hosting", hostTxt: "GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States.", ip: "Intellectual property",
    ipTxt: "The NOE name, the Lino mascot, texts, lessons and visuals belong to GBH. Any reproduction without written permission is prohibited. The Nunito typeface is used under the SIL Open Font License." },
  es: { t: "Aviso legal", ed: "Editor", host: "Alojamiento", hostTxt: "GitHub, Inc. (GitHub Pages), 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, Estados Unidos.", ip: "Propiedad intelectual",
    ipTxt: "El nombre NOE, la mascota Lino, los textos, las lecciones y los elementos visuales pertenecen a GBH. Queda prohibida cualquier reproducción sin autorización escrita. La fuente Nunito se usa bajo la licencia SIL Open Font License." },
};
const legal = docPage("mentions-legales.html", "Mentions légales — NOE", "Mentions légales de NOE, application éditée par GBH (SAS, RCS Paris 934 041 229).", Object.fromEntries(L3.map((l) => [l,
  `<p class="eyebrow">NOE · GBH</p><h1>${LG[l].t}</h1><p class="lead">${editor[l]}</p><h2>${LG[l].ed}</h2>${factRows(l)}<h2>${LG[l].host}</h2><p>${LG[l].hostTxt}</p><h2>${LG[l].ip}</h2><p>${LG[l].ipTxt}</p>`])));

const notFound = page({
  file: "404.html", title: "Page introuvable — NOE", desc: "Cette page n'existe pas.",
  body: `<article class="doc center-doc"><div class="wrap"><div class="lost" aria-hidden="true">${PLANE.replace(/role="img"[^>]*aria-label="[^"]*"/, 'aria-hidden="true"')}</div><h1>${T("Lino s'est perdu", "Lino got lost", "Lino se ha perdido")}</h1><p>${T("Cette page n'existe pas ou a été déplacée.", "This page doesn't exist or has moved.", "Esta página no existe o se ha movido.")}</p><p><a class="btn primary" href="./">${T("Retour à l'accueil", "Back to home", "Volver al inicio")}</a></p></div></article>`,
}).replace(/href="\.\//g, `href="${BASE}`).replace(/(href|src)="(style\.css|assets\/[^"]+|fonts\/[^"]+|aide\.html|mentions-legales\.html|confidentialite\.html)"/g, `$1="${BASE}$2"`);

writeFileSync("index.html", home);
writeFileSync("aide.html", help);
writeFileSync("confidentialite.html", privacy);
writeFileSync("mentions-legales.html", legal);
writeFileSync("404.html", notFound);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${BASE}sitemap.xml\n`);
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${["", "aide.html", "confidentialite.html", "mentions-legales.html"].map((p) => `  <url><loc>${BASE}${p}</loc></url>`).join("\n")}\n</urlset>\n`);
if (DOMAIN) writeFileSync("CNAME", DOMAIN + "\n"); else if (existsSync("CNAME")) rmSync("CNAME");
writeFileSync(".nojekyll", "");
console.log(`Site construit pour ${BASE} (contact : ${EMAIL})`);
