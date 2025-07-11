<template>
  <h2>{{ statName }}</h2>
  <div class="flex items-center">
    <div
      v-if="change == undefined"
      :style="{
        width: `${barWidth + 2}px`,
      }"
      :class="`relative flex ${statVal < 0 ? 'flex-row-reverse' : ''} h-[12px] border border-black`"
    >
      <span
        :style="{ width: `${normalizedStatVal}px` }"
        class="relative h-[10px] bg-black"
      ></span>
    </div>

    <div
      v-else
      :style="{
        width: `${barWidth + 2}px`,
      }"
      :class="`relative flex ${statVal < 0 ? 'flex-row-reverse' : ''} h-[12px] border border-white`"
    >
      <template v-if="change">
        <span
          :style="{
            width: `${normalizedStatVal + change > barWidth ? 0 : normalizedStatVal - Math.abs(change)}px`,
          }"
          class="relative h-[10px] bg-white"
        ></span>
        <span
          v-if="change >= 0"
          :style="{
            width: `${
              normalizedStatVal + change > barWidth
                ? (normalizedStatVal + change) % barWidth
                : change
            }px`,
          }"
          class="relative h-[10px] bg-green-400"
        ></span>
        <span
          v-else
          :style="{
            width: `${
              normalizedStatVal + change < 0
                ? (normalizedStatVal + change) % barWidth
                : Math.abs(change)
            }px`,
          }"
          class="relative h-[10px] bg-red-400"
        ></span>
      </template>
    </div>

    <h2 v-if="change" class="ml-1 text-sm font-light">
      {{ statVal }} > {{ change != undefined ? statVal + change : statVal }}
    </h2>
    <h2 v-if="tiered" class="ml-1 text-sm font-light">
      {{ getRank(statVal) }}
    </h2>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script setup lang="ts">
import { defineProps } from "vue";
import { Action, AssetPack, TeamMember } from "../../../util/types";

const props = defineProps<{
  barWidth: number;
  statVal: number;
  statName: string | number;
  tiered?: boolean;
  change?: number;
}>();

const calcPre = Math.abs(props.statVal % props.barWidth);
const normalizedStatVal =
  calcPre == 0 && props.statVal > 0 ? props.barWidth : calcPre;

const getRank = (val: number) => {
  switch (Math.floor(val / 100)) {
    case 0:
      return "F";
    case 1:
      return "E";
    case 2:
      return "D";
    case 3:
      return "C";
    case 4:
      return "B";
    case 5:
      return "A";
    case 6:
      return "S";
    case 7:
      return "SS";
    case 8:
      return "SSS";
    case 9:
      return "O";
  }
};
</script>
