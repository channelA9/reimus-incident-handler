<template>
  <div class="relative h-full w-full">
    <div class="sticky h-fit w-full bg-white mb-4 border-b-4 border-black top-0">
      <h1 class="text-xl pt-2 pl-2">Assign</h1>
      <div class="flex flex-row flex-wrap">
        <button
          v-for="(scheduleTask, index) in props.scheduleTasks"
          :key="index"
          @click="setAction(index)"
          class="m-2 p-2 border-2 border-black flex flex-row items-center hover:bg-gray-100"
        >
          <component :is="scheduleTask.icon" class="flex-grow"></component>
          <h2 class="m-2">{{ scheduleTask.name }}</h2>
        </button>
      </div>
    </div>
    <div class="h-fit w-[calc(100%-32px)] flex-grow bg-white m-4 border-4 border-black">
      <h1 class="text-xl p-2">Schedule</h1>
      <div class="flex flex-col flex-wrap">
        <div
          v-for="(member, memberIndex) in props.teamMembers"
          :key="memberIndex"
          class="p-4 flex flex-row hover:bg-gray-100 border-t items-center"
        >
          <div class="flex flex-col">
            <img
              :src="getAsset(member.assetID).icon"
              class="border-4 border-black w-fit h-fit"
            />
            <h1 class="font-black">{{ member.name }}</h1>
          </div>

          <div class="flex flex-row items-start justify-center m-4 border-black border-2 h-fit">
            <button v-for="(slot, slotInd) in member.dayTasks" :key="slotInd" :class="`border-r last:border-0 h-24 w-24 flex items-center justify-center ${slot == -1 ? '' : 'bg-gray-200 '}`" @click="updateSlot(memberIndex,slotInd)">
              <component :is="slot == -1 ? undefined : scheduleTasks[slot].icon" class="flex-grow"></component>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, defineEmits } from "vue";
import { Action, AssetPack, TeamMember } from "../../../util/types";
const emit = defineEmits(['updateSlot'])

const selectedAction = ref<number>(-1)
const props = defineProps<{
  assets: AssetPack[];
  teamMembers: TeamMember[];
  scheduleTasks: Action[];
}>();

const getAsset = (assetID: number) => {
  return props.assets[assetID];
};

const setAction = (action: number) => {
  selectedAction.value = action;
}

const updateSlot = (charIndex: number, actionIndex: number) => {
  console.log(charIndex)
  emit('updateSlot', charIndex, actionIndex, selectedAction.value)
}
</script>
