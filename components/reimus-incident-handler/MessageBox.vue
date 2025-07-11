<template>
  <div
    :class="`w-[680px] flex flex-col ${cutsceneMode ? 'bg-black ' : 'bg-white '} border-2 border-black`"
  >
    <div class="relative flex w-full h-[380px] bg-black">
      <div
        class="relative m-auto h-[360px] w-[640px] border-b border-black bg-white overflow-clip"
      >
        <img
          src="/assets/bgs/hakurei.png"
          class="absolute object-cover"
          draggable="false"
        />
        <img
          src="/assets/livescreensprites/240x320reimu.gif"
          class="absolute object-cover translate-y-[41px] translate-x-[390px]"
          draggable="false"
        />
      </div>
      <div v-if="viewStats && viewStats.length > 0" class="absolute right-16 m-auto min-w-[240px] text-white flex flex-col">
        <h2>{{  currentSpeaker.name.split(' ')[0] }}</h2>
        <StatBar
          v-for="(stat,ind) in viewStats"
          :key="`change-${stat.statName}-${currentSpeaker.name}${ind}`"
          :stat-val="stat.initialVal"
          :stat-name="stat.statName"
          :bar-width="100"
          :change="stat.changeVal"
          class="text-xs"
        />
      </div>
    </div>
    <div
      v-if="!cutsceneMode"
      ref="msgContainer"
      class="flex-1 overflow-auto p-4"
    >
      <div
        v-for="(msg, index) in props.messages"
        :key="index"
        class="p-2 border-b border-gray-300 flex"
      >
        <img
          v-if="msg.sender.assetID >= 0"
          :src="getAsset(msg.sender.assetID)"
          class="crisp-edges border border-black w-12 h-12"
        />
        <div
          :class="`flex flex-col ml-2 ${msg.sender.assetID == -1 ? 'text-gray-800' : ''}`"
        >
          <span v-if="msg.sender.assetID >= 0" class="font-bold text-xs">{{
            msg.sender.name
          }}</span>
          <span class="font-light">{{ msg.content }}</span>
        </div>
      </div>
    </div>
    <div v-else class="w-1/2 mx-auto">
      <div
        :class="`w-full flex flex-col ml-2 text-2xl text-center items-center ${getLastMessage().sender.assetID == -1 ? 'text-gray-300' : 'text-gray-200'}`"
      >
        <span v-if="getLastMessage().sender.assetID >= 0" class="text-xl">{{
          getLastMessage().sender.name
        }}</span>
        <span class="font-light">{{ getLastMessage().content }}</span>
      </div>
    </div>

    <div v-if="!cutsceneMode" class="flex">
      <input
        v-model="input"
        type="text"
        class="flex-1 p-4 bg-white text-black"
        :placeholder="`${disableChatInput ? 'Others are speaking...' : 'Type your message...'}`"
        :disabled="disableChatInput"
        @keyup.enter="pushMsg"
      />
      <button
        :class="`bg-black text-white transition-all ${disableChatInput ? 'w-0 h-0 overflow-clip ' : 'w-[128px] p-4'}'`"
        :disabled="disableChatInput"
        @click="pushMsg"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, watch, nextTick } from "vue";

import {
  TeamMember,
  AssetPack,
  Message,
  Action,
  GameValue,
  PostModif,
  Person,
} from "../../util/types";

import { system } from "../../pages/reimus-incident-handler/characterDefinitions";
import StatBar from "./sub/StatBar.vue";

const pushMsg = () => {
  props.sendMessage(input.value);
  input.value = "";
  scrollToBottom();
};

onMounted(() => {
  watch(
    () => props.messages,
    () => {
      scrollToBottom();
    },
    { deep: true }
  );
  watch(
    () => props.messages,
    () => {
      scrollToBottom();
    }
  );
});

const props = defineProps<{
  sendMessage: (str: string) => void;
  messages: Message[];
  assets: AssetPack[];
  disableChatInput: boolean;
  cutsceneMode: boolean;
  viewStats: PostModif[];
  currentSpeaker: Person;
}>();

const input = ref<string>("");
const msgContainer = ref<HTMLElement | null>(null);

function scrollToBottom() {
  nextTick(() => {
    if (msgContainer.value) {
      msgContainer.value.scrollTo({
        top: msgContainer.value.scrollHeight,

        behavior: "smooth",
      });
    }
  });
}

const getAsset = (assetID: number) => {
  return props.assets[assetID].icon;
};

const getLastMessage = () => {
  if (props.messages[props.messages.length - 1] != undefined)
    return props.messages[props.messages.length - 1];
  else
    return {
      sender: system,
      content: "",
    };
};
</script>
