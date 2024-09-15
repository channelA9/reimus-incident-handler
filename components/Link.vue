<template>
  <a :class="`${isActive ? 'bg-white' : ' text-white'} text-xl`" class="flex items-center justify-center w-16 h-16">
    <slot />
  </a>
</template>

<script lang="ts" setup>
import { usePageContext } from "vike-vue/usePageContext";
import { computed, useAttrs } from "vue";

const pageContext = usePageContext();
const { href } = useAttrs() as {href: string}

const isActive = computed(() => {
  const { urlPathname } = pageContext;
  return href === "/" ? urlPathname === href : urlPathname.startsWith(href);
});
</script>

<style scoped>
a.active {
  background-color: #fff;
}
</style>
