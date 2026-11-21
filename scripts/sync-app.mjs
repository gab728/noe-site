// Copie dans app-legal.json l'aide et la politique de confidentialité de l'app NOE (dépôt italiano-passo-passo, scripts/legal.mjs),
// pour les publier aussi sur noelang.app. À relancer quand ces textes changent dans l'app :
//   node scripts/sync-app.mjs ../italiano-passo-passo && node build.mjs
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const app = resolve(process.argv[2] || "../italiano-passo-passo");
const { LEGAL } = await import(pathToFileURL(resolve(app, "scripts/legal.mjs")).href);
writeFileSync(new URL("../app-legal.json", import.meta.url), JSON.stringify(LEGAL, null, 1) + "\n");
console.log("app-legal.json mis à jour depuis " + app);
