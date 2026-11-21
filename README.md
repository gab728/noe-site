# Site de NOE — noelang.app

Site de l'application NOE, éditée par GBH (SAS, RCS Paris 934 041 229). Pages statiques en français, anglais et espagnol, sans cookie ni dépendance externe, publiées par GitHub Pages sur noelang.app.

- Textes et sections : `build.mjs`, puis `node build.mjs` (régénère les pages). Styles et animations : `style.css`.
- Aide et confidentialité : reprises de l'app (`app-legal.json`). Après un changement dans l'app : `node scripts/sync-app.mjs ../italiano-passo-passo && node build.mjs`.
- Domaine et contact : `site.json` (`domain` → fichier `CNAME` et adresse `contact@<domaine>`).

Adresses à donner à Apple et Google : site https://noelang.app/, assistance https://noelang.app/aide.html, confidentialité https://noelang.app/confidentialite.html.
