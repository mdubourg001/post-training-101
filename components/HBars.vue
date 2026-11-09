<script setup lang="ts">
// Barres horizontales à deux mesures : « avant » en gris clair, « après » en
// noir (blanc en mode sombre), la ligne clé en bleu. `hide-after` masque
// les valeurs « après » (pour ne pas dévoiler les résultats trop tôt).
defineProps<{
  rows: { label: string; before?: number | null; after: number; key?: boolean }[];
  max: number;
  beforeLabel: string;
  afterLabel: string;
  hideAfter?: boolean;
}>();

const fmt = (v: number) => `${v.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} %`;
</script>

<template>
  <div class="hbars">
    <div class="hbars-legend">
      <span><i class="sw sw-before"></i>{{ beforeLabel }}</span>
      <span v-if="afterLabel && !hideAfter"><i class="sw sw-after"></i>{{ afterLabel }}</span>
    </div>
    <div class="hbars-rows">
      <div class="hbars-max"><span>{{ fmt(max) }}</span></div>
      <div v-for="r in rows" :key="r.label" class="hbars-row" :class="{ 'is-key': r.key }">
        <div class="hbars-label">{{ r.label }}</div>
        <div class="hbars-track">
          <div class="hbars-line">
            <div class="bar bar-before" :style="{ width: `${((r.before ?? 0) / max) * 100}%` }"></div>
            <span class="val val-before">{{ r.before == null ? "n.d." : fmt(r.before) }}</span>
          </div>
          <div class="hbars-line" v-if="r.after && !hideAfter">
            <div class="bar bar-after" :style="{ width: `${(r.after / max) * 100}%` }"></div>
            <span class="val val-after">{{ fmt(r.after) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hbars {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  font-size: 24px;
  line-height: 1.2;
  text-align: left;
}
.hbars-legend {
  display: flex;
  gap: 36px;
  margin-bottom: 6px;
  color: var(--c-muted);
}
.sw {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-right: 10px;
  border-radius: 3px;
  vertical-align: -2px;
}
.sw-before { background: var(--c-line); }
.sw-after { background: var(--c-strong); }
.hbars-rows {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
/* Repère vertical du max de l'échelle, aligné sur le bord droit des pistes. */
.hbars-max {
  position: absolute;
  top: -6px;
  bottom: -6px;
  left: calc(320px + 24px);
  right: 0;
  border-right: 2px solid var(--c-line);
  pointer-events: none;
}
.hbars-max span {
  position: absolute;
  right: 0;
  bottom: -30px;
  transform: translateX(50%);
  font-size: 16px;
  color: var(--c-muted);
}
.hbars-row {
  display: grid;
  grid-template-columns: 320px 1fr;
  align-items: center;
  gap: 24px;
}
.is-key .hbars-label { font-weight: 700; color: var(--c-accent); }
.hbars-track { display: flex; flex-direction: column; gap: 4px; }
.hbars-line { display: flex; align-items: center; gap: 12px; height: 20px; }
.bar { height: 100%; border-radius: 0 4px 4px 0; }
.bar-before { background: var(--c-line); }
.bar-after { background: var(--c-strong); }
.is-key .bar-after { background: var(--c-accent); }
.val { font-size: 20px; white-space: nowrap; }
.val-before { color: var(--c-muted); }
.val-after { font-weight: 700; }
.is-key .val-after { color: var(--c-accent); }
</style>
