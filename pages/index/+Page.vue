<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="h-fit prose prose-invert">
    <div v-html="md"></div>
  </div>
</template>

<script setup lang="ts">
import { parseMarkdown } from 'mrkdwny';
import { ref } from 'vue';
const md = ref(parseMarkdown(`
# Welcome to 4AETORO
`).html)

</script>
