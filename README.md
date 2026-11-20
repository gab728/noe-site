# Site de NOE

Site de l'application NOE, éditée par GBH (SAS, RCS Paris 934 041 229).
Pages statiques, sans cookie ni dépendance externe, publiées par GitHub Pages.

- Modifier les textes : `build.mjs`, puis `node build.mjs` (régénère les pages).
- Brancher un nom de domaine : renseigner `"domain"` dans `site.json` (ex. `"getnoe.app"`), relancer `node build.mjs`, publier.
  L'adresse de contact devient alors `contact@<domaine>` et le fichier `CNAME` est créé.
