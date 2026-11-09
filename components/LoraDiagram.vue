<script setup lang="ts">
// W gelé + B × A entraîné. Dimensions d'une couche de Qwen3-0.6B (1024), rang 16.
</script>

<template>
  <svg viewBox="0 0 460 240" class="lora" role="img" aria-label="Matrice W gelée, plus le produit de deux matrices fines B et A entraînées">
    <text x="85" y="18" text-anchor="middle" class="caption">1024 × 1024 ≈ 1 M de poids</text>
    <rect x="10" y="30" width="150" height="150" rx="8" class="frozen" />
    <text x="85" y="112" text-anchor="middle" class="name">W</text>
    <text x="85" y="205" text-anchor="middle" class="label">gelée</text>

    <text x="192" y="113" text-anchor="middle" class="op">+</text>

    <rect x="222" y="30" width="20" height="150" rx="4" class="trained" />
    <text x="232" y="205" text-anchor="middle" class="label">B</text>
    <text x="262" y="113" text-anchor="middle" class="op">×</text>
    <rect x="282" y="95" width="150" height="20" rx="4" class="trained" />
    <text x="357" y="84" text-anchor="middle" class="label">A</text>

    <text x="330" y="205" text-anchor="middle" class="label">entraînées</text>
    <text x="330" y="226" text-anchor="middle" class="caption">2 × 1024 × 16 ≈ 33 k poids</text>
  </svg>
</template>

<style scoped>
.lora { width: 100%; height: auto; }
.frozen { fill: var(--c-surface); stroke: var(--c-line); stroke-width: 1.5; }
.trained { fill: var(--c-accent); }
.name { font-size: 28px; font-weight: 700; fill: currentColor; }
.label { font-size: 14px; font-weight: 700; fill: currentColor; }
.op { font-size: 26px; fill: currentColor; }
.caption { font-size: 12px; fill: var(--c-muted); }
</style>
