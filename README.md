# Site de GBH

Site de la société GBH (SAS, RCS Paris 934 041 229), éditeur de l'application NOE.
Pages statiques, sans cookie ni dépendance externe, publiées par GitHub Pages.

- Modifier les textes : `build.mjs`, puis `node build.mjs` (régénère les pages).
- Brancher un nom de domaine : renseigner `"domain"` dans `site.json` (ex. `"gbh-holding.fr"`), relancer `node build.mjs`, publier.
  L'adresse de contact devient alors `contact@<domaine>` et le fichier `CNAME` est créé.
