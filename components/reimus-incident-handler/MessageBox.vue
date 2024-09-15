<template>
  <div class="w-[680px] flex flex-col bg-white border-2 border-black">
    <div class="flex w-full h-[380px] bg-black">
      <div
        class="m-auto h-[360px] w-[640px] border-b border-black bg-white"
      ></div>
    </div>
    <div ref="msgContainer" class="flex-1 overflow-auto p-4 ">
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

    <div class="flex">
      <input
        v-model="input"
        type="text"
        class="flex-1 p-4 bg-white text-black"
        :placeholder="`${disableAIinputs ? 'Others are speaking...' : 'Type your message...'}`"
        @keyup.enter="pushMsg"
        :disabled="disableAIinputs"
      />
      <button
        :class="`bg-black text-white transition-all ${disableAIinputs ? 'w-0 h-0 overflow-clip ' : 'w-[128px] p-4'}'`"
        @click="pushMsg"
        :disabled="disableAIinputs"
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
} from "../../util/types";

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
  disableAIinputs: boolean;
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
</script>
