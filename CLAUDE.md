# Post-training 101 (Regex vibes)

Talk Slidev en français (~30 min) pour des ingénieurs non spécialistes du ML : post-entraîner un petit LLM open-weight à écrire des regex JavaScript depuis une description en anglais.

## Sources

- **Le contenu découle du post de blog** `../../others/maximedubourg.com/assets/posts/post-training-a-language-model-locally.md`. C'est la source de vérité du récit : en cas de divergence, le post fait foi, et une modification du propos du post doit se refléter ici.
- Les chiffres et le détail de l'expérience viennent de son dépôt, `../../others/post-training/` : `README.md` (étapes et bilan), `results/scores.jsonl` (scores de chaque run), `configs/`.
- Un deck plus détaillé et plus ancien existe dans `../../others/post-training/slides/slides.md` (DPO, GRPO, RFT), hors charte ekino.
- La démo est https://regex-vibes.netlify.app (code dans `../../others/post-training/playground/`).

## Périmètre

- Seul le SFT avec LoRA est présenté comme méthode retenue. Les essais DPO, GRPO et RFT ne sont pas abordés, sauf la mention des familles de méthodes.
- Pour chaque grande partie : d'abord des principes généraux, puis notre cas des regex.
- Peu de texte par slide, des schémas plutôt que du code, apparitions étapées (`v-click`, `<v-clicks>`).

## Forme

- Thème `slidev-theme-eloc` (https://github.com/zthxxx/slides/tree/master/packages/slidev-theme-eloc) : une idée par slide, peu de mots, gros texte centré, canevas de 1580 px. Mieux vaut ajouter une slide que charger une slide existante.
- Palette neutre définie dans `style.css` (`--c-muted`, `--c-line`, `--c-surface`, `--c-strong`, `--c-accent`), redéfinie pour le mode sombre (touche D) : une seule donnée en bleu (`accent`) par slide.
- `<Term k="…">mot</Term>` (`components/Term.vue`) souligne un concept de ML et affiche sa définition au survol. Les définitions sont dans `glossary.ts` : ajouter une entrée avant d'utiliser une nouvelle clé.
- Schémas : envelopper dans `.schema` (remet les tailles du thème à l'échelle), puis `flow` / `node`, `cells` / `cell`, `stats` + `big`, `tokens` / `tok`. `components/HBars.vue` (barres à deux mesures) et `components/LoraDiagram.vue` complètent.
- Ponctuation française (espace avant `:` `;` `?` `!` `%`), `&nbsp;` quand un retour à la ligne isolerait la ponctuation.

## Commandes

- `pnpm install && pnpm dev` pour présenter
- `pnpm exec slidev export --format png --output verif` pour exporter chaque slide en PNG et vérifier le rendu
