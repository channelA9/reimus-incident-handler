<template>
  <div
    :class="` transition-all h-fit border-2 border-t-0 w-fit mx-auto bg-white border-black`"
  >
    <h1 class="text-xl text-center p-2">Weekly Reports</h1>
    <div class="flex flex-row">
      <button
        @click="moveReport(-1)"
        class="p-2 flex flex-col hover:bg-gray-100"
      >
        <ArrowLeft />
      </button>
      <h1 class="font-black text-4xl flex-grow text-center ">{{ selWeek + 1 }}</h1>
      <button
        @click="moveReport(1)"
        class="p-2 flex flex-col hover:bg-gray-100"
      >
        <ArrowRight />
      </button>
    </div>
  </div>

  <div
    v-if="report != undefined"
    class="relative p-8 mx-24 my-8 bg-white border-2 border-black drop-shadow-lg h-fit transition-all"
  >
    <h1 class="text-4xl font-black mb-2">{{ `WEEK ${selWeek + 1} REPORT` }}</h1>
    <div class="mb-4">
      <h2 class="text-xl font-black mb-2">{{`${report.earning - report.losses < 0 ? 'LOSSES' : 'PROFITS'}`}}</h2>
      <h2 :class="`text-4xl font-black ${report.earning - report.losses < 0 ? 'text-red-500' : 'text-black'}`">
        {{ `${report.earning - report.losses < 0 ? '-' : ''}¥${Math.abs(report.earning - report.losses)}` }}
      </h2>
    </div>
    <div class="mb-4">
      <h2 class="text-xl font-black mb-2">PERFORMANCE</h2>
      <div class="flex flex-col">
        <div
          v-for="(persPerformance, memberIndex) in report.weekPerformance"
          :key="`persPerformance-${memberIndex}`"
          class="flex flex-row items-center"
        >
          <div
            class="flex flex-row items-start justify-center mb-1 mr-2 border-black border-2 overflow-clip h-fit rotate-[0deg] rounded-full"
          >
            <div
              v-for="(slot, slotInd) in persPerformance.days"
              :key="slotInd"
              :class="`border-r border-black last:border-0 w-6 h-6 flex items-center justify-center ${slot.success ? (slot.crit ? 'bg-white' : 'bg-gray-300') : slot.crit ? 'bg-gray-600' : 'bg-gray-400'}`"
            >
          <h1 class="text-3xl">{{ slot.success ? `` : `×`}}</h1></div>
          </div>
          <h1 class="">
            {{ persPerformance.teamMember.name.split(" ")[0] }}
          </h1>
        </div>
      </div>
    </div>
    <div class="mb-4">
      <h2 class="text-xl font-black mb-2">NOTES</h2>
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
  reports: Report[];
  assets: AssetPack[];
}>();

const selWeek = ref<number>(
  props.reports.length > 0 ? props.reports.length - 1 : 0
);
const report = ref<Report | undefined>(
  props.reports.length > 0 ? props.reports[props.reports.length - 1] : undefined
);


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

const moveReport = (int: number) => {
  const newInd = selWeek.value + int;
  if (newInd <= -1) {
    selWeek.value = props.reports.length - 1;
  } else if (newInd >= props.reports.length) {
    selWeek.value = 0;
  } else selWeek.value = newInd;
  updateReport();
};

const updateReport = () => {
  report.value = props.reports[selWeek.value];
};

const getAsset = (assetID: number) => {
  return props.assets[assetID];
};
</script>
