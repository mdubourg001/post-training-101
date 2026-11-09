---
theme: eloc
title: Apprendre à un petit LLM à écrire des regex
info: Post-training 101 (Regex vibes), talk interne, novembre 2026
mdc: true
---

<div class="title-hero">
<div class="title-hero-text">

## Apprendre à un petit LLM<br>à écrire des regex

_Post-training 101_

</div>
<figure class="title-hero-fig">
  <iframe src="/figures/llm-token-prediction.html" title="Un modèle de langage qui prédit le token suivant" loading="lazy"></iframe>
</figure>
</div>

<style>
.slidev-layout .title-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  align-items: center;
  align-self: stretch;
  gap: 64px;
  text-align: left;
}
.slidev-layout .title-hero-text h2 {
  margin: 0;
  font-size: 72px;
  line-height: 1.15;
}
.slidev-layout .title-hero-text p {
  margin: 0.6em 0 0;
  color: var(--c-muted);
}
.slidev-layout .title-hero-fig {
  margin: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border: 2px solid var(--c-line);
  border-radius: 16px;
  box-shadow: 0 24px 60px -30px rgb(0 0 0 / 0.35);
}
.slidev-layout .title-hero-fig iframe {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>

---

#### Pourquoi s'y intéresser maintenant ?

<v-clicks>

- On utilise des <b>modèles <Term k="frontier">frontière</Term></b> pour tout
- L'<Term k="openweight">open-weight</Term> et l'<Term k="inference">inférence</Term> locale deviennent **viables**
- Le <Term k="posttraining">post-training</Term> est à l'intersection des deux

</v-clicks>

<p v-click class="caption">Un constat entendu dans plusieurs talks à dotAI, Paris, octobre 2026.</p>

---

#### Au programme

1. L'objectif
2. Les bases : LLM, poids, post-training
3. Choisir le modèle
4. Construire le dataset
5. L'entraînement : SFT et LoRA
6. Le bilan
7. Démo

---

<p class="part">01</p>

## L'objectif

---

### But : entraîner un **petit** <Term k="llm">LLM</Term><br>à écrire des regex<br>depuis une description en anglais<span v-click>,<br/>dans un navigateur</span>

---

<div class="schema flow">
  <div class="node">
    <span class="label">Entrée</span>
    <p class="mt-4!">french phone numbers like 06 12 34 56 78 or 0612345678</p>
  </div>
  <div class="arrow">→</div>
  <div v-click class="node node--strong" style="flex: 0.7">
    <span class="label">Petit LLM</span>
    <p class="mt-4!">Qwen3, 1,7 milliard de <Term k="weights">poids</Term></p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node">
    <span class="label">Sortie</span>
    <p class="mt-4!"><code>/^0[1-9](?: ?\d{2}){4}$/</code></p>
  </div>
</div>

---

#### Pourquoi les regex ?

<v-clicks>

- **Étroit** : une seule chose à savoir faire
- **Court** : une ligne en sortie
- **Vérifiable** : on exécute la regex, elle passe ou non
- **Utile** : tout les devs en utilisent (et personne n'aime les écrire)

</v-clicks>

---

#### On part d'où ?

<br />

<p class="big accent">~3 %</p>

<p class="big-sub">de bonnes réponses pour Qwen3-1.7B,<br>avant tout entraînement (pas ouf)</p>

---

<p class="part">02</p>

## Les bases

---

#### Un LLM prédit le token suivant

<div class="schema flow mt-6" style="align-items: center">
  <div style="flex: 1.25">
    <span class="label mb-4">Le texte en <Term k="token">tokens</Term></span>
    <div class="tokens" style="flex-wrap: nowrap">
      <span class="tok">french</span><span class="tok">phone</span><span class="tok">numbers</span><span class="tok">→</span>
    </div>
  </div>
  <div class="arrow">→</div>
  <div v-click class="node node--strong" style="flex: 0.9">
    <span class="label mb-4">Les <Term k="weights">poids</Term></span>
    <div class="weights">
      <span>0,12</span><span>-1,03</span><span>0,88</span><span>0,07</span><span>…</span>
      <span>-0,56</span><span>0,31</span><span>-0,09</span><span>1,24</span><span>…</span>
      <span>0,93</span><span>-0,27</span><span>0,44</span><span>-0,78</span><span>…</span>
      <span>…</span><span>…</span><span>…</span><span>…</span><span>…</span>
    </div>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after style="flex: 1.1">
    <span class="label mb-4">Le prochain token</span>
    <div class="probs">
      <div class="prob prob--top"><code>/^0</code><div class="prob-bar" style="width: 62%"></div><span>62 %</span></div>
      <div class="prob"><code>/\d</code><div class="prob-bar" style="width: 21%"></div><span>21 %</span></div>
      <div class="prob"><code>Sure</code><div class="prob-bar" style="width: 9%"></div><span>9 %</span></div>
    </div>
  </div>
</div>

<p v-click class="caption mt-16">On ajoute le token au texte, et on recommence jusqu'à un token de fin.</p>

---

<p class="big">1,7 milliard</p>

<p class="big-sub">de <Term k="weights">poids</Term> dans Qwen3-1.7B</p>

<p v-click class="caption">Ni règles, ni code : tout le savoir du modèle est dans ces nombres.</p>

---

### <Term k="training">Entraîner</Term>,<br>c'est ajuster ces nombres

---

#### Une boucle, des millions de fois

<div class="schema flow mt-8">
  <div v-click class="node">
    <span class="label">01</span>
    <h3 class="mt-3">Prédire</h3>
    <p>Le modèle propose une suite.</p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node">
    <span class="label">02</span>
    <h3 class="mt-3">Mesurer</h3>
    <p>La <Term k="loss">loss</Term> : à quel point la bonne réponse le <i>surprend</i>.</p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node">
    <span class="label">03</span>
    <h3 class="mt-3">Corriger</h3>
    <p>Le <Term k="gradient">gradient</Term> dit dans quel sens bouger chaque poids.</p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node node--strong">
    <span class="label">04</span>
    <h3 class="mt-3">Recommencer</h3>
    <p>Exemple après exemple.</p>
  </div>
</div>

---

#### Pre-training, puis post-training

<div class="schema flow mt-8">
  <div class="node flex flex-col gap-3">
    <span class="label"><Term k="pretraining">Pre-training</Term></span>
    <p>Prédire la suite de <b>milliers de milliards</b> de tokens.</p>
    <p class="caption">Nécessite : des mois, des milliers de GPU.</p>
    <p class="mt-auto! accent"><b>→ <Term k="base">modèle de base</Term></b></p>
  </div>
  <div class="arrow">→</div>
  <div v-click class="node flex flex-col gap-3">
    <span class="label">Post-training du labo</span>
    <p>Suivre des instructions, répondre comme un assistant.</p>
    <p class="mt-auto! accent"><b>→ <Term k="instruct">modèle instruct</Term></b></p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node node--strong flex flex-col gap-3">
    <span class="label">Notre post-training</span>
    <p>Écrire des regex, au bon format, de façon fiable.</p>
    <p class="caption">Nécessite : ~9 000 exemples, 2 h sur un Mac.</p>
    <p class="mt-auto!"><b>→ modèle spécialisé</b></p>
  </div>
</div>

---

#### Le pre-training c'est apprendre au modèle à parler,<br>le post-training c'est le spécialiser.

<p v-click class="caption"><Term k="posttraining">Post-training</Term> : ajuster les poids d'un modèle existant<br>pour l'orienter vers un style, un format, un ton ou une tâche.</p>

---

<p class="part">03</p>

## Choisir le modèle

---

#### En général, quatre questions

<v-clicks>

- **La tâche** : étroite ou qui demande de raisonner ?
- **L'exécution** : serveur, laptop, navigateur, mobile ?
- **Le budget** : pour entraîner, puis pour chaque requête ?
- **La licence** : poids publiés et réutilisables ?

</v-clicks>

<p v-click class="caption">Où chercher : huggingface.co/models, ollama.com/library,<br>github.com/xigh/open-weight-models</p>

---

#### Nos quatre contraintes

<v-clicks>

- <Term k="openweight">Open-weight</Term>
- Une variante <Term k="instruct">instruct</Term>
- Exportable en <Term k="onnx">ONNX</Term> pour <Term k="transformersjs">Transformers.js</Term>, ~1 Go
- Entraînable sur un Mac de 24 Go, avec <Term k="mlx">MLX</Term>

</v-clicks>

---

#### Mémoire pour entraîner 1 milliard de poids

<div class="schema mt-10">
  <div class="vbars">
    <div class="vbar">
      <span class="vbar-value">14 à 16 Go</span>
      <div class="vbar-fill" style="height: 80%"></div>
    </div>
    <div v-click class="vbar">
      <span class="vbar-value accent">2 à 2,5 Go</span>
      <div class="vbar-fill" style="height: 13%; background: var(--c-accent)"></div>
    </div>
  </div>
  <div class="vbars-labels">
    <div><b>Full <Term k="finetuning">fine-tuning</Term></b><p class="caption">tous les poids</p></div>
    <div v-click="1"><b><Term k="lora">LoRA</Term></b><p class="caption">un petit patch, ~95 % de l'efficacité</p></div>
  </div>
</div>

<p class="caption mt-6">Source : hf-accelerate/model-memory-usage, ordres de grandeur</p>

---

#### Plein de candidats !<br />On ne peut pas deviner le gagnant : on mesure{.text-center}

<div class="schema mt-4 w-2/3! mb-10 border rounded p-12">
<HBars
  :max="100"
  hide-after
  before-label="Brut (few-shot)"
  after-label="Après SFT"
  :rows="[
    { label: 'Gemma3-1B', before: 3.3, after: 14.0 },
    { label: 'Granite-4.0-350M', before: 3.5, after: 17.5 },
    { label: 'Llama-3.2-1B', before: 5.5, after: 18.3 },
    { label: 'Qwen2.5-Coder-0.5B', before: 5.3, after: 18.8 },
    { label: 'MiniCPM5-1B', before: 8.0, after: 21.3 },
    { label: 'Qwen3-0.6B', before: 2.8, after: 22.8 },
    { label: 'Qwen3.5-0.8B', before: 2.8, after: 26.0 },
    { label: 'Qwen3-1.7B', before: null, after: 26.5, key: true },
  ]"
/>
</div>

<p class="caption text-sm">Regex entièrement justes sur 400 besoins réels (regex101), avant entraînement</p>

---

#### Tester petit, puis monter en taille

<v-clicks>

- Un entraînement qui marche **passe à l'échelle** dans sa famille
- **Qwen3-0.6B** pour itérer : 1 h par run
- **Qwen3-1.7B** pour la version finale : 2 h 15

</v-clicks>

---

<p class="part">04</p>

## Le dataset

---

#### Un bon dataset, en général

<v-clicks>

- **Qualité avant quantité** : quelques milliers d'exemples suffisent
- **Des réponses vérifiées** : le modèle imite aussi les erreurs
- **Des entrées réalistes** : comme en production
- **De la diversité** : catégories, difficultés, formulations

</v-clicks>

<p v-click class="caption">« Less Is More for Alignment », LIMA, 2023</p>

---

#### Un exemple, c'est une fixture de test

```json
{
  "description": "french phone numbers like 06 12 34 56 78 or 0612345678",
  "regex": "/^0[1-9](?: ?\\d{2}){4}$/",
  "should_match": ["06 12 34 56 78", "0612345678", "01 23 45 67 89"],
  "should_not_match": ["6 12 34 56 78", "00 12 34 56 78", "06-12-34-56-78"]
}
```

<div class="schema mt-16">
  <p v-click>On le garde seulement si…</p>
  <div class="cells mt-6" style="grid-template-columns: repeat(3, 1fr)">
    <div v-click class="cell">
      <span class="label">01</span>
      <p class="mt-2">la regex <b>compile</b></p>
    </div>
    <div v-click class="cell">
      <span class="label">02</span>
      <p class="mt-2">elle <b>matche</b> tout <code>should_match</code></p>
    </div>
    <div v-click class="cell">
      <span class="label">03</span>
      <p class="mt-2">elle <b>rejette</b> tout <code>should_not_match</code></p>
    </div>
  </div>
</div>

<p v-click class="caption mt-8"><code>/.*/</code> passe tous les positifs, d'où l'importance de <code>should_not_match</code>.</p>

---

#### Un gros modèle écrit les exercices, Node fait le tri

<div class="schema flow mt-8">
  <div class="node">
    <h3>Taxonomie</h3>
    <p>20 catégories, 3&nbsp;niveaux de difficulté.</p>
  </div>
  <div class="arrow">→</div>
  <div v-click class="node node--strong">
    <h3><Term k="teacher">Professeur</Term></h3>
    <p>DeepSeek V4.1 Flash écrit description, regex et tests.</p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node">
    <h3>Garde-fous</h3>
    <p>Exécutés dans Node&nbsp;: tests, regex mutées, doublons.</p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node node--surface">
    <h3>Dataset</h3>
    <p>Seulement ce qui passe tout.</p>
  </div>
</div>

---

<div class="schema stats">
  <div>
    <span class="label">Besoins générés (DeepSeek)</span>
    <p class="big" style="font-size: 120px">27 460</p>
  </div>
  <div class="arrow" style="padding-bottom: 30px">→</div>
  <div v-click>
    <span class="label">Exemples gardés (36 %)</span>
    <p class="big" style="font-size: 120px">9 819</p>
  </div>
  <div v-click class="arrow" style="padding-bottom: 30px">→</div>
  <div v-after>
    <span class="label">Coût total</span>
    <p class="big accent" style="font-size: 120px">6 $</p>
  </div>
</div>

---

#### Des entrées qui ressemblent à la vraie vie

<v-clicks>

> « Accept a positive whole number (ex: 4567): one or more digits… »

> « six pairs of hexadecimal digits sparated by hyphens »

> « css length w uint px em rem % vh vw no spaces decimal ok »

> « email »

</v-clicks>

<style>
.slidev-layout blockquote { margin: 12px 0; font-size: 34px; }
</style>

---

#### Trois jeux de données, trois usages

<div class="schema cells mt-8" style="grid-template-columns: repeat(3, 1fr)">
  <div v-click class="cell">
    <span class="label">Train, 8 810</span>
    <h3 class="mt-3">Les exercices</h3>
    <p>Ce que le modèle étudie.</p>
  </div>
  <div v-click class="cell">
    <span class="label"><Term k="heldout">Held-out</Term>, 471</span>
    <h3 class="mt-3">Le partiel blanc</h3>
    <p>Jamais étudié, mais sorti du même moule.</p>
  </div>
  <div v-click class="cell">
    <span class="label"><Term k="benchmark">Benchmarks</Term>, 1 030</span>
    <h3 class="mt-3">L'examen</h3>
    <p>Écrits par d'autres : Claude, GPT, et 400 besoins réels de regex101.</p>
  </div>
</div>

---

<p class="part">05</p>

## L'entraînement

---

#### <Term k="lora">LoRA</Term> : un patch plutôt qu'une réécriture

<div class="schema mt-4" style="max-width: 900px">
  <LoraDiagram />
</div>

<p v-click class="caption mt-4"><b>1,7 %</b> des poids entraînés. Le résultat : un <Term k="adapter">adapter</Term> de quelques dizaines de Mo.<br>~95% d'efficacité par rapport a un full fine-tuning.</p>

---

#### Trois familles de post-training

<div class="schema cells mt-8" style="grid-template-columns: repeat(3, 1fr)">
  <div v-click class="cell">
    <span class="label">Imiter</span>
    <h3 class="mt-3">« Fais comme ça. »</h3>
    <p class="caption"><Term k="sft">SFT</Term>, <Term k="distillation">distillation</Term>, <Term k="rft">RFT</Term></p>
  </div>
  <div v-click class="cell">
    <span class="label">Préférer</span>
    <h3 class="mt-3">« Plutôt ça que ça. »</h3>
    <p class="caption"><Term k="dpo">DPO</Term>, <Term k="kto">KTO</Term></p>
  </div>
  <div v-click class="cell">
    <span class="label">Essayer et être noté</span>
    <h3 class="mt-3">« Essaie, je te note. »</h3>
    <p class="caption"><Term k="rlhf">RLHF</Term>, RLAIF, <Term k="grpo">GRPO</Term></p>
  </div>
</div>

---

#### La méthode dépend du besoin

| Besoin                                   | Méthode                                            |
| ---------------------------------------- | -------------------------------------------------- |
| Des connaissances qui changent souvent   | Pas de post-training : du <Term k="rag">RAG</Term> |
| Un domaine ou un vocabulaire spécifique  | Pre-training continu, puis SFT                     |
| **Un format, un ton, une tâche précise** | **<span class="accent">SFT avec LoRA</span>**      |
| Réduire les réponses indésirables        | DPO ou KTO                                         |
| Raisonnement, maths, code, agents        | GRPO, récompense vérifiable                        |
| Un petit modèle qui raisonne mieux       | Distillation depuis un gros modèle                 |

---

#### Le SFT : imiter la bonne réponse, token par token

<div class="schema mt-6">
  <div class="tokens" style="flex-wrap: nowrap; justify-content: center">
    <span class="tok tok--muted">[user] french phone numbers…</span>
    <span class="tok tok--answer">/^</span><span class="tok tok--answer">0</span><span class="tok tok--next">?</span>
  </div>
  <p class="caption mt-3!" style="text-align: center">Le prompt et le début de la bonne réponse sont donnés : le modèle doit deviner la suite.</p>
  <div class="flow mt-10" style="text-align: left">
    <div v-click class="node" style="flex: 1.35">
      <span class="label">01 · Prédire</span>
      <div class="probs sft-probs mt-4!">
        <div class="prob"><code>\d</code><div class="prob-bar" style="width: 55%"></div><span>55 %</span></div>
        <div class="prob"><code>6</code><div class="prob-bar" style="width: 20%"></div><span>20 %</span></div>
        <div class="prob"><code>[1-9]</code><div class="prob-bar" style="width: 12%"></div><span>12 %</span></div>
      </div>
    </div>
    <div v-click class="arrow">→</div>
    <div v-after class="node">
      <span class="label">02 · S'étonner</span>
      <p class="mt-4!">La bonne réponse était <code>[1-9]</code>, à 12&nbsp;% seulement.</p>
      <p class="mt-3">Loss&nbsp;: <b class="accent">2,1</b></p>
    </div>
    <div v-click class="arrow">→</div>
    <div v-after class="node">
      <span class="label">03 · Corriger</span>
      <p class="mt-4!">Le gradient ajuste un peu les poids&nbsp;: <code>[1-9]</code> ↑, <code>\d</code> ↓</p>
    </div>
    <div v-click class="arrow">↻</div>
    <div v-after class="node node--strong">
      <span class="label">04 · Recommencer</span>
      <p class="mt-4!">Token suivant, exemple suivant&nbsp;: 8&nbsp;810 exemples, vus 2&nbsp;fois.</p>
    </div>
  </div>
</div>

<p v-click class="caption mt-10">Seule la réponse est notée, le prompt sert de contexte.<br>La même boucle que le pre-training, sur nos données à nous.</p>

<style>
.sft-probs .prob { grid-template-columns: 120px 1fr max-content; gap: 12px; }
.sft-probs code { white-space: nowrap; }
</style>

---

#### En pratique : une boucle, quelques réglages

```python {1-2|3|5-8|10|all}
model = load("Qwen/Qwen3-0.6B")            # un modèle instruct
model.freeze()                             # W ne bouge plus
add_lora(model, rank=16)                   # B × A : 1,7 % des poids

for epoch in range(2):                     # chaque exemple vu deux fois
    for batch in dataset.batches(8):       # 8 exemples à la fois
        loss = model.loss(batch, only_answer=True)
        loss.backward(); optimizer.step()  # corriger B et A

save_adapter(model, "adapters/sft-0.6b")   # quelques dizaines de Mo
```

<p class="caption mt-6">Pseudo-code. En vrai : <code>mlx_lm.lora --config sft.yaml</code><br>et les <Term k="hyperparams">hyperparamètres</Term> dans le YAML (<Term k="epoch">epochs</Term>, <Term k="batch">batch</Term>, rang, learning rate).</p>

---

#### Du Mac au navigateur

<div class="schema flow mt-8">
  <div class="node">
    <span class="label">01</span>
    <h3 class="mt-3">Entraîner</h3>
    <p>Un adapter LoRA, avec MLX.</p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node">
    <span class="label">02</span>
    <h3 class="mt-3">Fusionner</h3>
    <p>L'adapter rejoint les poids.</p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node">
    <span class="label">03</span>
    <h3 class="mt-3">Exporter</h3>
    <p>En ONNX, <Term k="quantization">quantizé</Term> en 4 bits.</p>
  </div>
  <div v-click class="arrow">→</div>
  <div v-after class="node node--strong">
    <span class="label">04</span>
    <h3 class="mt-3">Servir</h3>
    <p>Transformers.js sur <Term k="webgpu">WebGPU</Term>.</p>
  </div>
</div>

<p v-click class="caption mt-12">2 h 15 d'entraînement, 7,1 Go de mémoire au pic, 1,43 Go à télécharger.</p>

---

<p class="part">06</p>

## Le bilan

---

#### Le SFT apprend la tâche

<div class="schema stats mt-6">
  <div>
    <span class="label">Qwen3-0.6B brut</span>
    <p class="big" style="font-size: 130px">2,8 %</p>
  </div>
  <div v-click class="arrow" style="padding-bottom: 30px">→</div>
  <div v-after>
    <span class="label">0.6B après SFT</span>
    <p class="big" style="font-size: 130px">72 %</p>
  </div>
  <div v-click class="arrow" style="padding-bottom: 30px">→</div>
  <div v-after>
    <span class="label">1.7B après SFT</span>
    <p class="big accent" style="font-size: 130px">77 %</p>
  </div>
</div>

<p class="caption mt-12">Regex entièrement justes sur le held-out (442 cas)</p>

---

#### Sur des demandes jamais vues

<div class="schema stats mt-6" style="gap: 200px">
  <div>
    <p class="big accent">7/10</p>
    <p class="mt-4">demandes simples</p>
  </div>
  <div v-click>
    <p class="big">2/10</p>
    <p class="mt-4">demandes plus complexes</p>
  </div>
</div>

<p class="caption mt-24!" v-click>Mais toujours <b>~70% des tests qui passent sur les échecs, même sur les cas difficiles.</b></p> 

---

#### Constat : hors du moule, ça se complique

| SFT Qwen3-1.7B | Held-out | Benchmark Claude | Benchmark regex101                   | <Term k="frontier">Modèle frontière</Term> |
| -------------- | -------- | ---------------- | ------------------------------------ | ------------------------------------------ |
| Simples        | 88 %     | 73 %             | **<span class="accent">46 %</span>** | 100 partout %                              |
| Intermédiaires | 77 %     | 38 %             | 14 %                                 | 100 partout %                              |
| Difficiles     | 57 %     | 11 %             | 10 %                                 | 100 partout %                              |

<p v-click class="caption mt-10">Le held-out mesure ce que le modèle a appris <b>du professeur</b>.<br>Sur de vraies demandes : moins d'une sur deux sur les besoins simples.</p>

---

#### Les mêmes candidats, après le même SFT{.text-center}

<div class="schema mt-4 w-2/3! mb-10 border rounded p-12">
<HBars
  :max="100"
  before-label="Brut (few-shot)"
  after-label="Après SFT (moyenne)"
  :rows="[
    { label: 'Gemma3-1B', before: 3.3, after: 14.0 },
    { label: 'Granite-4.0-350M', before: 3.5, after: 17.5 },
    { label: 'Llama-3.2-1B', before: 5.5, after: 18.3 },
    { label: 'Qwen2.5-Coder-0.5B', before: 5.3, after: 18.8 },
    { label: 'MiniCPM5-1B', before: 8.0, after: 21.3 },
    { label: 'Qwen3-0.6B', before: 2.8, after: 22.8 },
    { label: 'Qwen3.5-0.8B', before: 2.8, after: 26.0 },
    { label: 'Qwen3-1.7B', before: null, after: 26.5, key: true },
  ]"
/>
</div>

<p class="caption text-sm">Regex entièrement justes sur 400 besoins réels (regex101), même SFT pour tous</p>

---

#### Ce qui a bien marché

<v-clicks>

- **Le SFT** : de 2,5 % à 77 %
- **Les tests comme vérité** : pas besoin de juge
- **Le coût** : 6 $ de données, un Mac, aucun GPU loué
- **La taille** : 0,6 → 1,7 milliard rapporte plus que changer de méthode
- **Le navigateur** : privé, gratuit à chaque requête

</v-clicks>

---

#### Ce qui n'a pas marché

<v-clicks>

- **Les cas réels** : ~26.5% en moyenne sur les cas regex101
- **Les cas difficiles** : la qualité s'effondre
- **Le style du professeur** : −16 points hors de son moule (<Term k="overfitting">overfitting</Term>)
- **Des erreurs silencieuses** : presque justes, ~70&nbsp;% des tests passent
- **Plus de données difficiles dans le train** : aucun déblocage

</v-clicks>

---

#### Ce qu'on aurait pu mieux faire

<v-clicks>

- **Mélanger plusieurs professeurs dans le train** pour diluer leur style
- Viser d'abord les besoins **simples et intermédiaires**
- Utiliser un modèle plus gros (ex. Qwen3 4B)

</v-clicks>

---

<p class="part">07</p>

## Démo

_[regex-vibes.netlify.app](https://regex-vibes.netlify.app/)_

---

### Un petit modèle bien entraîné<br>va déjà très loin.

<p v-click class="caption">Pas besoin d'un <Term k="frontier">modèle frontière</Term> pour tout.</p>

---

## Merci

_Des questions ?_
