<template>
  <div
    class="relative p-8 mx-24 my-8 bg-white border-2 border-black drop-shadow-lg h-fit transition-all"
  >
    <h1 class="text-4xl font-black mb-2">{{ `BUDGET` }}</h1>
    <div class="mb-4">
      <h2 class="text-xl font-black mb-2">BALANCE</h2>
      <h2 class="text-6xl font-black">
        ¥{{ cash }}
      </h2>
    </div>
    
    <div class="mb-4">
      <h2 class="text-xl font-black mb-2">FIXED COSTS</h2>
    </div>
    <div class="mb-4">
      <h2 class="text-xl font-black mb-2">DISCRETIONARY</h2>
    </div>
    <div class="fixed -top-1 -rotate-[2deg] right-4 whitespace-pre-wrap bg-gray-50 border-2 border-black drop-shadow-lg w-64 h-64"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, watch } from "vue";
import { ArrowLeft, ArrowRight } from "lucide-vue-next";
import { parseMarkdown } from "mrkdwny";
import { Report, AssetPack } from "../../../util/types";

const props = defineProps<{
  cash: number;
}>();

// onMounted(() => {
//   watch(
//     () => props.article,
//     () => {
//       if (props.article.length > 0) {
//         articleReady.value = false;
//         setTimeout(() => {
//           articleReady.value = true;
//         }, 1000);
//       }
//     },
//     { deep: true }
//   );
// });

const getAsset = (assetID: number) => {
  return props.assets[assetID];
};
</script>
