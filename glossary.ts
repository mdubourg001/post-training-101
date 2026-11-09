// Définitions courtes des concepts de ML, affichées au survol par <Term k="…">.
// Une entrée = un concept ; le texte doit tenir en deux ou trois lignes.

export interface GlossaryEntry {
  label: string;
  def: string;
}

export const glossary: Record<string, GlossaryEntry> = {
  llm: {
    label: "LLM (Large Language Model)",
    def: "Un modèle entraîné sur d'énormes quantités de texte, qui prédit le morceau de texte suivant. Chat, code, résumé : tout part de là.",
  },
  token: {
    label: "Token",
    def: "Le morceau de texte que manipule le modèle : un mot, un bout de mot ou un symbole. Qwen3 en connaît environ 150 000.",
  },
  weights: {
    label: "Poids (weights, paramètres)",
    def: "Les nombres stockés dans le modèle, des millions à des milliards. Entraîner un modèle, c'est ajuster ces nombres.",
  },
  training: {
    label: "Entraînement",
    def: "Montrer des exemples au modèle, mesurer son erreur, et ajuster ses poids pour qu'il se trompe un peu moins. En boucle.",
  },
  pretraining: {
    label: "Pre-training",
    def: "Le premier entraînement : prédire la suite de milliers de milliards de tokens. Des mois de GPU, fait par les labs (Alibaba, Meta, Google…).",
  },
  posttraining: {
    label: "Post-training",
    def: "Tout entraînement fait après le pre-training pour orienter le modèle : un format, un ton, une tâche, un domaine.",
  },
  base: {
    label: "Modèle de base (foundation)",
    def: "Un modèle sorti du pre-training : il complète du texte, mais ne sait pas répondre à une question ni suivre une consigne.",
  },
  instruct: {
    label: "Modèle instruct (it, chat)",
    def: "Un modèle de base déjà post-entraîné pour suivre des instructions et répondre comme un assistant.",
  },
  openweight: {
    label: "Open-weight",
    def: "Un modèle dont les poids sont publiés, sous une licence qui permet de les réutiliser et de les modifier.",
  },
  frontier: {
    label: "Modèle frontière",
    def: "Les plus gros modèles du moment (Claude, GPT, Gemini…), servis par API. Très bons partout, mais chers, distants et fermés.",
  },
  finetuning: {
    label: "Fine-tuning",
    def: "Reprendre l'entraînement d'un modèle existant sur ses propres données. Le « full fine-tuning » modifie tous les poids.",
  },
  lora: {
    label: "LoRA (Low-Rank Adaptation)",
    def: "On gèle les poids d'origine et on n'entraîne que deux petites matrices ajoutées à côté. 5 à 8 fois moins de mémoire, ~95 % de l'efficacité.",
  },
  adapter: {
    label: "Adapter",
    def: "Le résultat d'un entraînement LoRA : un petit fichier (quelques dizaines de Mo) qu'on pose par-dessus le modèle d'origine, ou qu'on fusionne dedans.",
  },
  sft: {
    label: "SFT (Supervised Fine-Tuning)",
    def: "Apprendre par imitation : on montre des paires « entrée → bonne réponse » et le modèle apprend à reproduire la réponse.",
  },
  loss: {
    label: "Loss",
    def: "On regarde quelle probabilité le modèle donnait au bon token : 90 % donne une loss quasi nulle, 1 % une grosse loss. C'est sa « surprise » face à la bonne réponse, et c'est elle que l'entraînement fait baisser.",
  },
  gradient: {
    label: "Gradient",
    def: "Pour chaque poids, la direction et l'ampleur du changement qui fait baisser la loss. La « descente de gradient » suit cette direction.",
  },
  backprop: {
    label: "Rétropropagation (backpropagation)",
    def: "L'algorithme qui fait remonter l'erreur de la sortie vers l'entrée, couche par couche, pour calculer en une passe le gradient de chaque poids.",
  },
  learningrate: {
    label: "Learning rate",
    def: "La taille du pas : de combien on déplace chaque poids dans la direction du gradient. Trop grand, l'entraînement diverge ; trop petit, il n'avance pas.",
  },
  epoch: {
    label: "Epoch",
    def: "Un passage complet sur tout le dataset d'entraînement. Deux epochs : chaque exemple est vu deux fois.",
  },
  batch: {
    label: "Batch",
    def: "Un paquet d'exemples traités ensemble : on moyenne leur erreur avant de corriger les poids. Plus stable qu'exemple par exemple.",
  },
  hyperparams: {
    label: "Hyperparamètres",
    def: "Les réglages choisis par nous (rang LoRA, learning rate, batch, epochs…), par opposition aux poids, que le modèle apprend.",
  },
  distillation: {
    label: "Distillation",
    def: "Faire apprendre un petit modèle (l'élève) à partir des réponses d'un gros modèle (le professeur).",
  },
  teacher: {
    label: "Modèle professeur",
    def: "Le gros modèle qui écrit les exemples d'entraînement. Ici DeepSeek V4.1 Flash, via OpenRouter.",
  },
  heldout: {
    label: "Held-out",
    def: "Une part du dataset mise de côté, jamais montrée pendant l'entraînement. Même moule que le train : mesure ce que le modèle a appris.",
  },
  benchmark: {
    label: "Benchmark",
    def: "Un jeu d'évaluation figé, écrit par une autre source que le train. C'est l'examen qui fait foi.",
  },
  overfitting: {
    label: "Overfitting (surapprentissage)",
    def: "Le modèle récite ses exemples au lieu de généraliser : excellent sur ce qu'il a vu, moins bon sur le reste.",
  },
  fewshot: {
    label: "Few-shot",
    def: "Donner quelques exemples résolus dans le prompt, sans rien entraîner. Zero-shot : aucun exemple.",
  },
  chattemplate: {
    label: "Chat template",
    def: "Le format exact (balises, rôles system, user, assistant) dans lequel un modèle instruct attend ses conversations.",
  },
  dpo: {
    label: "DPO (Direct Preference Optimization)",
    def: "Apprendre par préférence : pour une même entrée, une réponse préférée et une rejetée. Le modèle apprend à pencher vers la première.",
  },
  kto: {
    label: "KTO",
    def: "Une variante du DPO : chaque réponse est simplement notée bonne ou mauvaise, sans besoin de paires.",
  },
  rlhf: {
    label: "RLHF (Reinforcement Learning from Human Feedback)",
    def: "Le modèle génère, un juge (appris sur des avis humains) note, le modèle se renforce sur ce qui est bien noté. RLAIF : le juge est une IA.",
  },
  grpo: {
    label: "GRPO",
    def: "Du renforcement sans juge appris : plusieurs réponses par question, notées par une règle vérifiable, comparées à la moyenne du groupe.",
  },
  rft: {
    label: "RFT (Rejection sampling Fine-Tuning)",
    def: "Le modèle génère plusieurs réponses, on garde celles qui sont justes, et on refait un SFT dessus.",
  },
  rag: {
    label: "RAG (Retrieval-Augmented Generation)",
    def: "Chercher des documents pertinents et les donner au modèle dans le prompt. Pour des connaissances qui changent, plutôt que d'entraîner.",
  },
  inference: {
    label: "Inférence",
    def: "Utiliser le modèle pour générer une réponse, par opposition à l'entraîner.",
  },
  quantization: {
    label: "Quantization",
    def: "Stocker les poids sur moins de bits (16 → 4) : un modèle 3 à 4 fois plus léger, pour une petite perte de qualité.",
  },
  mlx: {
    label: "MLX",
    def: "Le framework de machine learning d'Apple, l'équivalent de PyTorch optimisé pour les puces Apple Silicon.",
  },
  onnx: {
    label: "ONNX",
    def: "Un format standard d'export de modèles, lisible par de nombreux moteurs, dont Transformers.js dans le navigateur.",
  },
  transformersjs: {
    label: "Transformers.js",
    def: "La librairie JS de Hugging Face pour faire tourner des modèles dans le navigateur, sur WebGPU ou WebAssembly.",
  },
  webgpu: {
    label: "WebGPU",
    def: "L'API du navigateur qui donne accès au GPU de la machine, pour du rendu ou du calcul.",
  },
};
