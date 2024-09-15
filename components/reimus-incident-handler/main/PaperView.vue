<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import { parseMarkdown } from "mrkdwny";

const props = defineProps<{
  article: string;
}>();

const articleReady = ref<boolean>(false);

onMounted(() => {
  watch(
    () => props.article,
    () => {
      if (props.article.length > 0) {
        articleReady.value = false;
        setTimeout(() => {
          articleReady.value = true;
        }, 1000);
      }
    },
    { deep: true }
  );
});
</script>

<template>
  <div
    :class="[
      articleReady ? '' : `translate-x-[-400%]`,
      ` p-8 m-24 bg-white drop-shadow-lg border min-h-[120vh] h-fit transition-all `,
    ]"
  >
    <h2 class="text-xl font-black mb-4">DRAFT</h2>
    <div
      class="whitespace-pre-wrap"
      v-html="parseMarkdown(props.article).html"
    ></div>
  </div>
</template>
