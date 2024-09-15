<template>
  <div class="h-full w-full">
    <div
      class="sticky h-fit w-full bg-white mb-4 border-b-4 border-black top-0"
    >
      <h1 class="text-xl pt-2 pl-2">Assign Incident</h1>
      <div class="flex flex-row flex-wrap">
        <button
          v-for="(crew, index) in props.teamMembers"
          :key="index"
          class="p-2 flex flex-col hover:bg-gray-100"
          @click="updateIncident(index)"
        >
          <img
            :src="getAsset(crew.assetID).icon"
            class="border border-black h-24"
          />
          <h1 class="font-black">{{ crew.name }}</h1>
          <div class="flex flex-col items-start">
            <h2 v-if="!crew.assignedIncident" class="text-xs">Not Assigned</h2>
            <h2 v-else class="text-xs">{{ crew.assignedIncident.name }}</h2>
          </div>
        </button>
      </div>
    </div>
    <div class="h-fit bg-white m-4 border-4 border-black">
      <h1 class="text-xl p-4">Commission Board</h1>
      <div class="flex flex-row flex-wrap">
        <button
          v-for="(incident, index) in props.incidents"
          :key="index"
          :class="`w-full flex flex-col items-center ${activeIndex == index ? 'bg-gray-100 hover:bg-gray-200 border-black border-b' : 'hover:bg-gray-50'} border-t p-4`"
          @click="setActiveIndex(index)"
        >
          <div class="w-full flex flex-row items-center">
            <img
              :src="getAsset(incident.requester.assetID).icon"
              class="h-[48px] border border-black mr-2"
            />
            <h1 class="font-black text-lg mr-8">
              {{ incident.requester.name }}
            </h1>
            <h1 class="font-light text-lg flex-grow text-left">
              {{ incident.request_head }}
            </h1>
            <h1 class="text-gray-500">{{ incident.location }}</h1>
          </div>
          <div v-if="activeIndex == index" class="flex mt-2 w-full flex-col">
            <p class="text-gray-500 pr-4 text-left">
              {{ incident.request_desc }}
            </p>
            <div class="flex flex-row border-t mt-2">
              <div
                class="flex flex-row flex-grow items-center text-black p-2 pl-0"
              >
                <slot
                  v-for="(member, index) in props.teamMembers"
                  :key="`${incident.name}-${index}`"
                >
                  <img
                    v-if="member.assignedIncident == incident"
                    :src="getAsset(member.assetID).icon"
                    class="border border-black h-12 opacity-50 mr-2"
                  />
                </slot>
              </div>
              <div class="flex flex-row text-black">
                <div class="flex flex-col p-2 border-r">
                  <h1>Difficulty</h1>
                  <h2 class="text-lg">{{ incident.power }}</h2>
                </div>
                <div class="flex flex-col p-2 border-r">
                  <h1>Min/Rec/Max</h1>
                  <h2 class="text-lg">
                    {{
                      `${incident.minAgents} / ${incident.recAgents} / ${incident.maxAgents}`
                    }}
                  </h2>
                </div>
                <div class="flex flex-col p-2 border-r">
                  <h1>Commission</h1>
                  <h2 class="text-lg">{{ incident.pay }}</h2>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, defineEmits } from "vue";
import { AssetPack, Incident, TeamMember } from "../../../util/types";

const emit = defineEmits(["updateIncidentAssignment"]);

const activeIndex = ref<number>(-1);

const setActiveIndex = (id: number) => {
  if (activeIndex.value == id) activeIndex.value = -1;
  else activeIndex.value = id;
};

const props = defineProps<{
  incidents: Incident[];
  assets: AssetPack[];
  teamMembers: TeamMember[];
}>();

const getAsset = (assetID: number) => {
  return props.assets[assetID];
};

const updateIncident = (charIndex: number) => {
  emit("updateIncidentAssignment", activeIndex.value, charIndex);
};
</script>
