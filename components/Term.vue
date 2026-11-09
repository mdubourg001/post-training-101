<script setup lang="ts">
// Un concept de ML souligné en pointillé ; au survol, sa définition courte
// (glossary.ts), comme l'aperçu d'un lien sur Wikipédia.
// <Term k="weights">poids</Term>, ou <Term k="weights" /> pour afficher le libellé.
import { computed, ref } from "vue";
import { glossary } from "../glossary";

const props = defineProps<{ k: string }>();

const entry = computed(() => glossary[props.k]);
const open = ref(false);
const above = ref(false);
const alignRight = ref(false);
const root = ref<HTMLElement>();

if (!glossary[props.k]) console.warn(`[Term] terme inconnu : ${props.k}`);

function show() {
  const el = root.value;
  const page = el?.closest(".slidev-page") as HTMLElement | null;
  if (el && page) {
    const r = el.getBoundingClientRect();
    const p = page.getBoundingClientRect();
    above.value = (r.top - p.top) / p.height > 0.55;
    alignRight.value = (r.left - p.left) / p.width > 0.6;
  }
  open.value = true;
}
</script>

<template>
  <span
    ref="root"
    class="term"
    tabindex="0"
    @mouseenter="show"
    @mouseleave="open = false"
    @focus="show"
    @blur="open = false"
  >
    <slot>{{ entry?.label ?? k }}</slot>
    <span
      v-if="entry"
      v-show="open"
      role="tooltip"
      :class="['term-pop', { 'is-above': above, 'is-right': alignRight }]"
    >
      <span class="term-label">{{ entry.label }}</span>
      <span class="term-def">{{ entry.def }}</span>
    </span>
  </span>
</template>

<style scoped>
.term {
  position: relative;
  display: inline;
  cursor: help;
  text-decoration: underline dotted 2px;
  text-decoration-color: var(--c-muted);
  text-underline-offset: 0.2em;
  outline: none;
}

.term-pop {
  position: absolute;
  z-index: 50;
  top: calc(100% + 10px);
  left: 0;
  display: block;
  width: 520px;
  padding: 18px 22px;
  border-radius: 10px;
  background: var(--c-strong);
  color: var(--c-on-strong);
  font-size: 22px;
  font-style: normal;
  font-family: "Inter", "Roboto", sans-serif;
  font-weight: 400;
  line-height: 1.4;
  text-align: left;
  text-transform: none;
  white-space: normal;
  letter-spacing: 0;
  pointer-events: none;
}

.term-pop.is-above {
  top: auto;
  bottom: calc(100% + 10px);
}

.term-pop.is-right {
  left: auto;
  right: 0;
}

.term-label {
  display: block;
  margin-bottom: 6px;
  opacity: 0.6;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.term-def {
  display: block;
}
</style>
