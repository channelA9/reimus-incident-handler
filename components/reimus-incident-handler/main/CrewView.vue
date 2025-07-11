<template>
  <div class="h-full w-full flex flex-col">
    <div
      :class="` transition-all ${selectedCrew != undefined ? 'h-[0px] overflow-clip' : 'h-72 border-b-4'} w-full bg-white border-black`"
    >
      <h1 class="text-xl text-center pt-2">Incident Solvers</h1>
      <div class="flex flex-row flex-wrap justify-center">
        <button
          @click="selectCrew(crew)"
          v-for="(crew, index) in props.teamMembers"
          :key="index"
          class="p-4 flex flex-col hover:bg-gray-100"
        >
          <img
            :src="getAsset(crew.assetID).icon"
            class="w-fit border-4 border-black"
          />
          <h1 class="font-black">{{ crew.name }}</h1>
        </button>
      </div>
    </div>

    <div
      :class="`${selectedCrew != undefined ? 'opacity-100' : 'opacity-0'} w-full h-full transition-all flex-grow border-black bg-white`"
    >
      <div v-if="selectedCrew != undefined">
        <button @click="clearCrew" class="underline mt-2 ml-2">Back</button>
        <h1 class="text-2xl text-center pt-2">{{ selectedCrew.name }}</h1>

        <div class="w-full flex items-center justify-evenly border-y my-2 p-4">
          <StatBar
            v-for="(statVal, statIndex) in selectedCrew.vital"
            :key="`vital-${statIndex}`"
            :stat-val="statVal"
            :stat-name="statIndex"
            :bar-width="100"
            class="text-xs"
          />
        </div>

        <div class="flex flex-row w-fit m-auto">
          <div
            v-for="(statCategory, categoryIndex) in selectedCrew.stats"
            :key="categoryIndex"
            class="flex flex-col items-start mr-4 last:mr-0"
          >
            <h1>{{ categoryIndex }}</h1>
            <StatBar
              v-for="(statVal, statIndex) in statCategory"
              :key="`${categoryIndex}-${statIndex}`"
              :bar-width="100"
              :stat-val="statVal"
              :stat-name="statIndex"
              :tiered="true"
              class="text-xs"
            />
          </div>
        </div>

        <div
          v-if="selectedCrew.relations.user"
          class="flex flex-row w-full m-auto items-center justify-evenly border-y my-2 p-4"
        >
          <div class="text-xs">
            <h2>Opinion</h2>
            <div
              :class="`relative flex ${selectedCrew.relations.user.opinion < 0 ? 'flex-row-reverse' : ''} w-[100px] h-[12px] border border-black`"
            >
              <span
                :style="{ width: `${selectedCrew.relations.user.opinion}px` }"
                class="fixed h-[10px] bg-black"
              ></span>
            </div>
          </div>

          <div class="text-xs">
            <h2>Trust</h2>
            <div
              :class="`relative flex ${selectedCrew.relations.user.trust < 0 ? 'flex-row-reverse' : ''} w-[100px] h-[12px] border border-black`"
            >
              <span
                :style="{ width: `${selectedCrew.relations.user.trust}px` }"
                class="fixed h-[10px] bg-black"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import { AssetPack, TeamMember } from "../../../util/types";
import StatBar from "../sub/StatBar.vue";

const selectedCrew = ref<TeamMember>();

const props = defineProps<{
  teamMembers: TeamMember[];
  assets: AssetPack[];
}>();

const getAsset = (assetID: number) => {
  return props.assets[assetID];
};

const selectCrew = (crew: TeamMember) => {
  selectedCrew.value = crew;
  console.log(selectedCrew.value.stats);
};

const clearCrew = () => {
  selectedCrew.value = undefined;
};
</script>
