<template>
  <div class="hidden fixed h-screen w-full bg-opacity-40 backdrop-blur-lg z-10">
    <div
      class="h-full w-full absolute opacity-80 bg-gradient-to-br from-black to-indigo-900 z-10"
    ></div>
  </div>
  <div class="flex h-screen bg-white font-pixel">
    <div class="flex-1 flex flex-col">
      <header class="bg-black text-white p-4">
        <h1 class="text-2xl font-black">Reimu's Incident Handler</h1>
      </header>
      <div class="flex-1 flex overflow-auto">
        <MessageBox
          :send-message="sendMessage"
          :messages="messages"
          :assets="assetPacks"
          :disable-chat-input="disableChatInput"
          :cutscene-mode="cutsceneMode"
          :view-stats="currentModifs"
          :current-speaker="currentSpeaker"
          class="flex-grow transition-all"
        />
        <div
          :class="`${cutsceneMode ? 'w-0' : 'w-1/2'} transition-all backdrop-blur-sm overflow-y-clip flex flex-col overflow-clip`"
        >
          <div class="absolute w-full h-full overflow-hidden -z-10">
            <img
              draggable="false"
              src="/assets/bgb.png"
              class="w-full h-full object-cover pixelated"
            />
          </div>
          <div class="flex h-14 bg-white text-black border-b-2 border-black">
            <button
              v-for="(view, index) in gameMenuViews"
              :key="index"
              :class="`h-14 min-w-14 p-2 flex items-center justify-center flex-col border-r-2 border-black  ${menuViewState == index ? 'bg-gray-200 hover:bg-gray-300' : 'hover:bg-gray-100'}`"
              @click="setViewIndex(index)"
            >
              <component :is="view.icon" class="flex-grow"></component>
              <div class="text-xs">{{ view.name }}</div>
            </button>
          </div>
          <div class="flex-grow h-fit overflow-y-auto overflow-x-clip">
            <SchedulerView
              v-if="menuViewState == 1"
              :team-members="teamMembers"
              :assets="assetPacks"
              :schedule-tasks="gameScheduleTaskArray"
              @update-slot="updateTaskSlot"
            />
            <CrewView
              v-if="menuViewState == 2"
              :team-members="teamMembers"
              :assets="assetPacks"
            />
            <CommissionView
              v-else-if="menuViewState == 3"
              :incidents="incidents"
              :assets="assetPacks"
              :team-members="teamMembers"
              @update-incident-assignment="updateIncidentAssignment"
            />
            <MailView
              v-else-if="menuViewState == 6"
              :incidents="incidents"
              :assets="assetPacks"
              :team-members="teamMembers"
              @update-incident-assignment="updateIncidentAssignment"
            />
            <BudgetView v-else-if="menuViewState == 8" :cash="cash" />
            <LogView :reports="reports" :assets="assetPacks" v-else-if="menuViewState == 9" />

            <PaperView v-else-if="menuViewState == 10" :article="article" />
          </div>
        </div>
        <div
          class="w-48 border-2 bg-white border-black text-black overflow-auto flex flex-col"
        >
          <!-- <h2 class="text-xl font-bold mb-4">Team</h2>
      <div v-for="(member, index) in teamMembers" :key="index" class="mb-2">
        <span class="font-bold">{{ member.name }}</span> - {{ member.role }}
      </div> -->
          <h2 class="text-xl font-bold border-b-2 border-black text-center">
            Today's Reviews
          </h2>
          <div class="flex-grow">
            <div
              v-for="(reviewItem, index) in reviews"
              :key="index"
              class="mb-2"
            >
              <div>{{ reviewItem.title }}</div>
            </div>
          </div>

          <div
            v-for="(stat, index) in gameValues"
            :key="index"
            class="border-t-2 border-black flex flex-col"
          >
            <h1 class="text-xl font-extralight border-black">
              {{ stat.name }}
            </h1>
            <span class="text-4xl font-extralight">{{ stat.ref.value }}</span>
          </div>
          <div class="h-fit flex border-t-2 border-black">
            <div
              class="h-24 w-24 border-r-2 border-black flex flex-col items-center justify-center"
            >
              <h2>Week</h2>
              <h2 class="text-4xl font-black">{{ week }}</h2>
            </div>
            <div
              class="h-24 flex flex-grow flex-col items-center justify-center"
            >
              <h2>Day</h2>
              <h2 class="text-4xl font-black">{{ day }}</h2>
            </div>
          </div>
          <button
            class="bg-black h-24 w-full flex items-center justify-center"
            :disabled="dayCycleActive"
            @click="pushDay"
          >
            <h1 class="text-4xl text-white font-light">START WEEK</h1>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, KeepAlive } from "vue";
import { Content, GenerateContentRequest } from "@google/generative-ai";
import {
  Mail,
  Group,
  JapaneseYen,
  Map,
  Store,
  Book,
  MapPinX,
  Home,
  Clock,
  Dumbbell,
  Bed,
  Briefcase,
} from "lucide-vue-next";
import {
  geminiFlash,
  geminiFlash3,
  geminiPro,
  getFormedMessages,
  nextSpeakerResConfig,
  opinionResConfig,
  perceiveGeminiFlash,
  promptGen,
  speakOrActGeminiFlash,
  speakOrActGenConfig,
} from "../../util/gemini";
import {
  TeamMember,
  AssetPack,
  Review,
  Message,
  Action,
  GameValue,
  SFX,
  Incident,
  Person,
  Task,
  PostTask,
  IncidentChunk,
  PostModif,
  Report,
  PerformanceStub
} from "../../util/types";

import MessageBox from "../../components/reimus-incident-handler/MessageBox.vue";
import PaperView from "../../components/reimus-incident-handler/main/PaperView.vue";
import CrewView from "../../components/reimus-incident-handler/main/CrewView.vue";
import CommissionView from "../../components/reimus-incident-handler/main/CommissionView.vue";
import SchedulerView from "../../components/reimus-incident-handler/main/SchedulerView.vue";
import MailView from "../../components/reimus-incident-handler/main/MailView.vue";
import BudgetView from "../../components/reimus-incident-handler/main/BudgetView.vue";
import LogView from "../../components/reimus-incident-handler/main/LogView.vue";

import bigLore from "/assets/lore/biglore.txt?raw";

import { assetPacks } from "./assetPacks";
import { system, user, reimuH, marisaK, sanaeK } from "./characterDefinitions";

import { initRel } from "./charRelationDefintions";
import { incidentTags } from "./incidentDefinitions";
import { taskArr } from "./taskDefintions";
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt";

// GenAI Contents

reimuH.relations = initRel.reimuHRelations;
marisaK.relations = initRel.marisaKRelations;
sanaeK.relations = initRel.sanaeKRelations;
const teamMembers = ref<TeamMember[]>([reimuH, marisaK, sanaeK]);

const reviews: Review[] = [
  { title: "City Council Debates New Park", score: 1000 },
  { title: "Local Business Boom", score: 980 },
  { title: "University Expands Campus", score: 100 },
];

const incidents = ref<Incident[]>([incidentTags.keineSchool1]);

const messages = ref<Message[]>([]);
const article = ref<string>("");

const disableChatInput = ref<boolean>(true);
const cutsceneMode = ref<boolean>(true);

const currentMinMessage = ref<number>(4);
const currentGroup = ref<Person[]>([reimuH, marisaK, sanaeK]);
const currentSpeaker = ref<Person>(reimuH);
const currentSituation = ref<string>("");
const currentIntention = ref<string>("");
const currentModifs = ref<PostModif[]>([]);

// eslint-disable-next-line @typescript-eslint/ban-types
const completeCall = ref<Function>();
// Cross-AI/Util
const cash = ref<number>(15000);
const solvedIncidents = ref<number>(1);
const popularity = ref<number>(1);
const reports = ref<Report[]>([]);

const week = ref<number>(1);
const day = ref<number>(1);
const dayEventQueue = ref();

// Utility
const menuViewState = ref<number>(0);
const dayCycleActive = ref<boolean>(false);

const gameMenuViews: Action[] = [
  { name: "Home", icon: Home },
  { name: "Schedule", icon: Clock },
  { name: "Crew", icon: Group },
  { name: "Requests", icon: JapaneseYen },
  { name: "Map", icon: Map },
  { name: "Location", icon: MapPinX },
  { name: "Mail", icon: Mail },
  { name: "Store", icon: Store },
  { name: "Budget", icon: Book },
  { name: "Log", icon: Book },
];

const gameScheduleTaskArray: Task[] = taskArr;

const gameValues: GameValue[] = [
  { name: "Yen", ref: cash },
  { name: "Incidents Solved", ref: solvedIncidents },
];

let sounds: SFX;

// AI Functions
onMounted(() => {
  initSequence();
  sounds = {
    chat: new Audio("../assets/sfx/chat.wav"),
    bigchat: new Audio("../assets/sfx/chatheavy.wav"),
    uiClick: new Audio("../assets/sfx/click.wav"),
  };
});

const pushMessage = (
  sender: Person | TeamMember,
  content: string,
  delay?: number
) => {
  if (delay) {
    setTimeout(() => {
      messages.value.push({
        sender: sender,
        content: content,
      });
      // sounds.chat.play()
    }, delay);
  } else if (!delay) {
    messages.value.push({
      sender: sender,
      content: content,
    });
  }
};

const updateLatest = (newChunk: string | undefined) => {
  if (newChunk != undefined) {
    const index = messages.value.length - 1;
    messages.value[index].content += newChunk;
    if (newChunk.length > 10) sounds.bigchat.play();
    else sounds.chat.play();
  }
};

const generateArticle = async (
  prompt: string | GenerateContentRequest
): Promise<void> => {
  console.log("generating");
  article.value = "";

  const result = await geminiFlash.generateContent(prompt);
  const text: string = result.response.text();
  article.value = text;
};

const conversate = async (speaker: Person) => {
  const formedMessages: Content[] = getFormedMessages(messages.value, speaker);
  const bigP = new promptGen();
  //world lore
  bigP.addModelComponent(bigLore);
  //char inf
  bigP.addModelComponent(
    `${speaker.name} Background: ${assetPacks[speaker.assetID].lore}`
  );
  bigP.addModelComponent(
    `${speaker.name} Personality: ${JSON.stringify(speaker.stats.personality)}`
  );
  // char intention
  bigP.addUserComponent(
    `Note that ${speaker.name}'s current goal in this conversation is to do the following: {${currentIntention.value}}.`
  );
  // situation
  bigP.addUserComponent(`Situation: ${currentSituation.value}`);
  // speaking with
  bigP.addModelComponent(
    `Here is who ${speaker.name} is currently speaking with.`
  );
  // also speaking with user in chat
  bigP.addModelComponent(`${user.name} Background: ${assetPacks[0].lore}`);
  // other char descs
  currentGroup.value.forEach((char, _) => {
    if (char != speaker) {
      const rel = speaker.relations[char.name];
      bigP.addModelComponent(
        `${char.name} { ${char.name} Background: ${assetPacks[char.assetID].lore}
        ${char.name} Personality: ${JSON.stringify(char.stats.personality)}
        ${rel ? `${speaker.name}'s relation with ${char.name}: { opinion: ${rel.opinion} trust: ${rel.trust} memory: ${rel.memory}}'` : ""} }`
      );
    }
  });
  // msg history
  bigP.addModelComponent(`Chat history so far:`);
  bigP.addChunk(formedMessages);

  // final failsafe
  bigP.addUserComponent(`(OOC: Now generate ${speaker.name}'s next reply)`);
  // conduct logic
  const responseDichotomy = await aiChatActionOrSpeak(speaker);

  if (responseDichotomy?.act) {
    // send action, then check if speak proceeds
    aiChatSendAction(bigP).finally(() => {
      if (responseDichotomy.speak) {
        bigP.addUserComponent(
          "SYSTEM: " + messages.value[messages.value.length - 1].content
        );
        // push in the latest message to the object as user to avoid blank gen from Gemini
        setTimeout(() => {
          aiChatSendDialog(bigP).finally(() => {
            aiChatCheckObjective(formedMessages);
          });
        }, 2000);
      } else {
        aiChatCheckObjective(formedMessages);
      }
    });
  } else if (responseDichotomy?.speak) {
    aiChatSendDialog(bigP).finally(() => {
      aiChatCheckObjective(formedMessages);
    });
  }
};

const groupConversate = async () => {
  currentSpeaker.value = await aiChatDetermineNextSpeaker();
  if (currentSpeaker.value.name != user.name) {
    conversate(currentSpeaker.value);
  } else {
    console.log("AAAA");
    disableChatInput.value = false;
  }
};

const sendMessage = async (input: string): Promise<void> => {
  if (input.trim()) {
    disableChatInput.value = true;
    const newMessage: Message = {
      sender: user,
      content: input,
    };
    messages.value.push(newMessage);
    input = "";

    // conv
    if (currentGroup.value.length > 1) {
      groupConversate();
    } else conversate(currentSpeaker.value);

    // this might be needed as a fallback
    // await new Promise((r) => setTimeout(r, 1000));
    // disableChatInput.value = false;
  }
};

const aiChatSendAction = async (promptObj: promptGen) => {
  promptObj.setSystemPrompt(`
    Generate the 3rd person description of the actions only. DO NOT affix the name of your character, as the system already handles this.
    Playing the role of a THIRD-PERSON narrator for a text-based game with
    flowing, and detailed in-character dialogue, do the following without writing actions for
    ${currentSpeaker.value.name} since they are not a person or living thing but a text-based storywriter. Before using any generic nouns like 'she' or 'he', use ${currentSpeaker.value.name}'s first name at least once for clarity.
    Make sure to create flavorful description and naturally flowing prose that progresses the character's intention: ${currentIntention.value}. The user's response is always as ${`the player`}.
    Your response will always be a detailed description of ${currentSpeaker.value.name}'s next action in THIRD PERSON, based off the action that ${`the player`} has provided in their most recent
    reply and with the character's intention in mind. This means you will only write in third person with NO DIALOGUE for ${currentSpeaker.value.name} or ${currentSpeaker.value.name}.
    `);
  const bigPrompt: GenerateContentRequest = promptObj.finalRequest;
  const result = await geminiPro.generateContentStream(bigPrompt);
  pushMessage(system, "");

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();

    console.log(chunkText);
    updateLatest(chunkText);
  }
};

const aiChatSendDialog = async (promptObj: promptGen) => {
  promptObj.setSystemPrompt(`Playing the role of a first-person chatter for a text-based game with
    flowing, and detailed in-character dialogue, do the following without writing actions for
    ${currentSpeaker.value.name} since they are not a person or living thing but a text-based storywriter. Generate ${currentSpeaker.value.name}'s raw dialog only with no formatting.
    Make sure to create flavorful dialogue and naturally flowing prose that progresses the character's intention: ${currentIntention.value}. The user's response is always as ${`the player`}.
    Your response will always be as ${currentSpeaker.value.name}, based off the action that ${`the player`} has provided in their most recent
    reply and with the character's intention in mind. This means you will only write dialogue in ${currentSpeaker.value.name}'s perspective, never detailing from ${currentSpeaker.value.name}'s POV or their actions.
    You can either write short responses or entire monologues when you deem appropriate. For example, when a question is asked, if ${currentSpeaker.value.name} can answer it, then they will give a lengthy response explaining it in exposition.
    `);
  const bigPrompt: GenerateContentRequest = promptObj.finalRequest;

  const result = await geminiPro.generateContentStream(bigPrompt);
  pushMessage(currentSpeaker.value, "");

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    updateLatest(chunkText);
  }
};

const aiReactSchedule = async (charInd?: number) => {
  const promptObj = new promptGen();
  const v = charInd ? charInd : 0;
  const character = teamMembers.value[v];

  //world lore
  promptObj.addModelComponent(bigLore);
  //char inf
  promptObj.addModelComponent(
    `${character.name} Background: ${assetPacks[character.assetID].lore}`
  );
  promptObj.addModelComponent(
    `${character.name} Personality: ${JSON.stringify(character.stats.personality)}`
  );
  // schedule
  let aiRegimenString: string = "";
  character.dayTasks.forEach((i, d) => {
    aiRegimenString += `Day ${d + 1}:  ${i == -1 ? "Freetime" : gameScheduleTaskArray[i].name} `;
  });
  // incident
  const incidentReportString = character.assignedIncident
    ? `This is your assigned incident for the week, ${character.name.split(" ")[0]}. ` +
      ` Request Name: ${character.assignedIncident.request_head}` +
      ` Request Details: ${character.assignedIncident.request_desc}` +
      ` Requester: ${character.assignedIncident.requester.name}` +
      ` Difficulty: ${character.assignedIncident.power}` +
      ` Pay: ${character.assignedIncident.pay}`
    : `I didn't assign you to any incident for this week, ${character.name.split(" ")[0]}`;
  promptObj.addUserComponent(incidentReportString);

  promptObj.addUserComponent(
    `Other than the incident, this is your schedule for the week, ${character.name.split(" ")[0]}. {${aiRegimenString}}`
  );

  promptObj.setSystemPrompt(`Playing the role of a first-person chatter for a text-based game with
    flowing, and detailed in-character dialogue, do the following without writing actions for
    ${character.name} since they are not a person or living thing but a text-based storywriter. Generate ${character.name}'s raw dialog only with no formatting.
    Make sure to create flavorful dialogue and naturally flowing prose that progresses the character's intention: ${currentIntention.value}. The user's response is always as ${`the player`}.
    Your response will always be as ${character.name}, based off their reaction to the schedule the player made for them. Note they will be following it regardless of opinion. Anything can be said, though try to keep it short so the reader can read over it in around 2 seconds.`);
  promptObj.setGenConfig({
    temperature: 0.75,
    maxOutputTokens: 200,
  });
  const bigPrompt: GenerateContentRequest = promptObj.finalRequest;
  const result = await geminiFlash.generateContentStream(bigPrompt);
  pushMessage(character, "");

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    updateLatest(chunkText);
  }
  await result.response.finally(() => {
    // iterate through other crew
    if (teamMembers.value[v + 1]) aiReactSchedule(v + 1);
  });
};

const aiActiveCrewSequenceDialog = async (
  crew: TeamMember[],
  sequenceDesc: string,
  sequenceResult: string,
  charInd?: number
) => {
  const promptObj = new promptGen();
  const v = charInd ? charInd : 0;
  const character = crew[v];

  //world lore
  promptObj.addModelComponent(bigLore);
  //char inf
  promptObj.addModelComponent(
    `${character.name} Background: ${assetPacks[character.assetID].lore}`
  );
  promptObj.addModelComponent(
    `${character.name} Personality: ${JSON.stringify(character.stats.personality)}`
  );
  // incident
  const incidentReportString = character.assignedIncident
    ? `Incident context:` +
      ` Request Name: ${character.assignedIncident.request_head}` +
      ` Request Details: ${character.assignedIncident.request_desc}`
    : ``;
  promptObj.addUserComponent(incidentReportString);
  // with
  if (crew.length > 1) {
    promptObj.addModelComponent(
      "These are your teammates in solving the incident:"
    );
    crew.forEach((teammate, _) => {
      const rel = character.relations[teammate.name];
      if (teammate != character) {
        promptObj.addModelComponent(
          `${teammate.name} { ${teammate.name} Background: ${assetPacks[teammate.assetID].lore}
        ${teammate.name} Personality: ${JSON.stringify(teammate.stats.personality)}
        ${rel ? `${character.name}'s relation with ${teammate.name}: { opinion: ${rel.opinion} trust: ${rel.trust} memory: ${rel.memory}}'` : ""} }`
        );
      }
    });

    // sequence info
    const sequenceInfo = character.assignedIncident
      ? `You and your teammates next problem: ${sequenceDesc}` +
        ` (OOC: The result of their actions will be: ${sequenceResult}) Generate what ${character.name} says. `
      : ``;
    promptObj.addUserComponent(sequenceInfo);
  }

  promptObj.setSystemPrompt(
    `ONLY generate ${character.name.split(".")[0]}'s SHORT dialog (less than 10 words) of what they said before doing something. NO third person writing or formatting (no quotes). Have this dialog give some insight as to why they did what they did.`
  );
  promptObj.setGenConfig({
    temperature: 1,
    maxOutputTokens: 40,
  });
  const bigPrompt: GenerateContentRequest = promptObj.finalRequest;
  const result = await geminiFlash.generateContentStream(bigPrompt);
  pushMessage(character, "");

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    updateLatest(chunkText);
  }
  await result.response.finally(() => {
    // iterate through other crew
    if (teamMembers.value[v + 1])
      aiActiveCrewSequenceDialog(crew, sequenceDesc, sequenceResult, v + 1);
  });
};

const aiChatCheckObjective = async (msgs: Content[]) => {
  if (messages.value.length >= currentMinMessage.value) {
    const bigPrompt: GenerateContentRequest = {
      systemInstruction: `${currentSpeaker.value.name}'s current intention in this conversation is to do the following: {${currentIntention.value}}. Based on the conversation that has occurred so far,
    determine if the intention has been achieved based on ${currentSpeaker.value.name}'s judgement of the situation in relation to their intention`,
      contents: msgs,
    };

    const result = await perceiveGeminiFlash.generateContent(bigPrompt);
    const perception = result.response.text();
    const jsonPerception = JSON.parse(`${perception}`);
    if (jsonPerception.complete != undefined && jsonPerception.complete) {
      console.log("valid");
      if (completeCall.value != undefined) {
        completeCall.value();
      }
    } else if (currentGroup.value.length > 1) {
      groupConversate();
    }
  }
};

const aiChatActionOrSpeak = async (selected: Person) => {
  const formedMessages: Content[] = getFormedMessages(messages.value, selected);

  const decisionP = new promptGen();
  decisionP.setSystemPrompt(`Based on the conversation so far:
    Your task is generate according to the schema: { act: boolean, speak: boolean } to determine whether ${selected.name} will do an action (such that it is an important action/detail that necessitates 3rd-person roleplay speak (ex: ${selected.name} walks down the aisle), and/or whether they will just speak.
    Note that if the character does act, it will always be before they speak. Keep it varied, don't always use one of either if they appear too much in pattern. Both values should always be defined.`);
  //char inf
  decisionP.addModelComponent(
    `${currentSpeaker.value.name} Background: ${assetPacks[currentSpeaker.value.assetID].lore}`
  );
  decisionP.addModelComponent(
    `${currentSpeaker.value.name} Personality: ${JSON.stringify(currentSpeaker.value.stats.personality)}`
  );

  // char intention
  decisionP.addUserComponent(
    `Note that ${selected.name}'s current goal in this conversation is to do the following: {${currentIntention.value}}.`
  );

  // chathist
  decisionP.addModelComponent(`Chat history so far:`);
  decisionP.addChunk(formedMessages);

  decisionP.setGenConfig(speakOrActGenConfig);
  const dPrompt: GenerateContentRequest = decisionP.finalRequest;
  console.log(dPrompt);
  const result = await geminiFlash.generateContentStream(dPrompt);
  const perception = (await result.response).text();
  console.log(perception);

  const jsonPerception = JSON.parse(`${perception}`);
  console.log(jsonPerception);
  if (jsonPerception.speak != undefined && jsonPerception.act != undefined) {
    const res: { speak: boolean; act: boolean } = jsonPerception;
    console.log(jsonPerception);
    return res;
  } else {
    // err handle
  }
};

// has the members currently in "currentGroup" and determines which of them will speak.
const aiChatDetermineNextSpeaker = async () => {
  const formedMessages: Content[] = getFormedMessages(messages.value, system);

  const decisionP = new promptGen();
  decisionP.setSystemPrompt(`Based on the conversation so far:
    Your task is to determine who will speak next by providing the array index of the character who will speak next. If the user hasn't spoken in some time, give it back to them. However, if not, allow all characters to shine equally depending on context`);

  // char intention
  decisionP.addUserComponent(
    `Note that the current situation is as follows: {${currentSituation.value}}.`
  );

  // chathist
  decisionP.addModelComponent(`Chat history so far:`);
  decisionP.addChunk(formedMessages);

  // active characters in group conversation, stringified. Note the user is also added, so we need to handle +1 when returning for the offset
  let charSelectString = "[user";
  currentGroup.value.forEach((c) => {
    charSelectString += `, ${c.name}`;
  });
  charSelectString += " ]";

  decisionP.addModelComponent(
    `Pick the index in the JS array of the character who will speak next: ${charSelectString}`
  );
  decisionP.setGenConfig(nextSpeakerResConfig);
  const dPrompt: GenerateContentRequest = decisionP.finalRequest;

  const result = await geminiFlash3.generateContent(dPrompt);
  const perception = (await result.response).text();

  console.log(perception);

  const jsonPerception = JSON.parse(`${perception}`);
  if (jsonPerception.nextSpeakerIndex != undefined) {
    const res: { nextSpeakerIndex: number } = jsonPerception;
    console.log(res.nextSpeakerIndex);
    if (res.nextSpeakerIndex == 0) return user;
    // since the user doesn't exist in the currentGroup array, offset by 1 if it isn't user to account
    else return currentGroup.value[res.nextSpeakerIndex - 1];
  } else {
    // err handle
    return user;
  }
};

// const getNextSpeaker = async (current: TeamMember): TeamMember => {
//   if (currentGroup.value.length == 1) {
//     currentSpeaker;
//   } else {
//   }
// };

// game cycle

const startWeek = () => {
  // post cycles
  messages.value = [];
  pushMessage(
    system,
    "You hand out the plans for the week. Everyone looks them over."
  );
  aiReactSchedule();

  setTimeout(() => {
    pushMessage(system, "And so the week begins...");
    setTimeout(iterateRegimen, 1000);
  }, 5000);
};


const iterateRegimen = () => {
  const weekArr: PostTask[][] = [[], [], [], [], [], []];
  // timers for week
  const timePerAction = 700;
  const intermissionTime = 1000;
  // timers for incident
  const timePerSequence = 1200;
  // this will replace the "incidents" after the end the cycle
  const updatedIncidents: Incident[] = [];

  // for final reports
  let revenue = 0;
  let expenses = 0;
  const teamMemberPerformanceArray: PerformanceStub[] = []

  // for each character, calculate their task results first
  teamMembers.value.forEach((member, _) => {
    teamMemberPerformanceArray.push({teamMember: member, days: []})
    const record = teamMemberPerformanceArray[teamMemberPerformanceArray.length-1]

    member.dayTasks.forEach((taskId, dayIndex) => {
      const memberFirstName = member.name.split(" ")[0];
      if (taskId != -1) {
        const taskCont = gameScheduleTaskArray[taskId];

        const viewModifs: PostModif[] = [];
        let taskDesc = `${memberFirstName} couldn't do ${taskCont.name} due to a lack of money!`;
        let successF = false;
        let critF = false;
        // check if meets the rest/health minimums in a cycle so that we can change the task if a fail
        // rather than using else statements here, we can just set the taskdefs depending on situation if there is a fail anywhere
        if (cash.value >= taskCont.cost.money) {
          taskDesc = `${memberFirstName} is too weak to do ${taskCont.name}!`;
          if (member.vital.health >= taskCont.cost.health) {

            // add to viewModif so it can be seen on each task view
            if (taskCont.cost.health != 0)
              viewModifs.push({
                statName: "health",
                initialVal: member.vital.health,
                changeVal: -taskCont.cost.health,
              });

            taskDesc = `${memberFirstName} is too tired to do ${taskCont.name}!`;
            if (member.vital.rest >= taskCont.cost.rest) {

              // add to viewModif so it can be seen on each task view
            if (taskCont.cost.rest != 0)
              viewModifs.push({
                statName: "health",
                initialVal: member.vital.rest,
                changeVal: -taskCont.cost.rest,
              });

              // subtract all costs
              member.vital.health -= taskCont.cost.health;
              member.vital.rest -= taskCont.cost.rest;
              cash.value -= taskCont.cost.money;
              expenses +=  taskCont.cost.money;

              let failChance = taskCont.baseFail;
              let critChance = taskCont.baseCrit;
              // adjust final crit and fail by relevant skills
              taskCont.chanceModifs.forEach((modif, _) => {
                const modifKey = modif.category.split(".");
                const charStatMatch =
                  modifKey[0] == "vital"
                    ? member.vital[modifKey[1]]
                    : member.stats[modifKey[0]][modifKey[1]];
                if (charStatMatch >= modif.cutoffs[3]) {
                  critChance += 4;
                  failChance -= 5;
                } else if (charStatMatch >= modif.cutoffs[2]) {
                  critChance += 1;
                  failChance -= 2;
                } else if (charStatMatch <= modif.cutoffs[0]) {
                  critChance -= 4;
                  failChance += 5;
                } else if (charStatMatch <= modif.cutoffs[1]) {
                  critChance -= 1;
                  failChance += 2;
                }
              });

              const success =
                Math.round(Math.random() * 100) > failChance ? true : false;
              const crit =
                Math.round(Math.random() * 100) <= critChance ? true : false;

              // can't quickly think of one for this
              let v = 2;
              if (success) {
                if (crit) v = 3;
              } else {
                v = 1;
                if (crit) v = 0;
              }
              // select a description from one of the many
              const taskStatusDescs = taskCont.descs[v];
              // determine modifs, add to char bucket
              const valCategory = success
                ? crit
                  ? "crit_success"
                  : "success"
                : crit
                  ? "crit_fail"
                  : "fail";

              // stat calc collective

              taskCont.statModifs.forEach((modifer, _) => {
                // add traits modifs to character stats
                const category = modifer.category;
                const statAdjustValue = modifer[valCategory];
                let modifName = "";
                let preStat = cash.value;
                console.log(`PRE: ${preStat}`);
                if (category == "money") {
                  // potentially adjust this later to increment money value in time with the timeouts
                  modifName = "Yen";
                  cash.value += statAdjustValue;
                  revenue += statAdjustValue;

                } else {
                  const cat = category.split(".");

                  // preStat is purely for passing to viewModifs
                  preStat =
                    cat[0] == "vital"
                      ? member.vital[cat[1]]
                      : member.stats[cat[0]][cat[1]];
                  modifName = cat[1];

                  if (cat[0] == "vital")
                    member.vital[cat[1]] += statAdjustValue;
                  else member.stats[cat[0]][cat[1]] += statAdjustValue;
                }
                console.log(`POST: ${preStat + statAdjustValue}`);
                viewModifs.push({
                  statName: modifName,
                  initialVal: preStat,
                  changeVal: statAdjustValue,
                });
              });

              taskDesc = taskStatusDescs[
                randomInteger(0, taskStatusDescs.length - 1)
              ].replace("CHAR", memberFirstName);

              successF = success;
              critF = crit;
            }
          }
        }

        // push task into the day chat string for the week
        const postTaskObj: PostTask = {
          desc: taskDesc,
          person: member,
          success: successF,
          crit: critF,
          postModifs: viewModifs,
        }
        weekArr[dayIndex].push(postTaskObj);
        record.days.push(postTaskObj);
      }
    });
  });

  // now iterate through days consecutively
  let dayOffsetter = 0;

  weekArr.forEach((dayActionsArray, dayIndex) => {
    // string is offset to day 2, since day 1 of each week is the planning day
    setTimeout(() => {
      pushMessage(system, `Day ${dayIndex + 2}`);
      cutsceneMode.value = true;
    }, dayOffsetter);

    dayActionsArray.forEach((actionObj, i) => {
      setTimeout(
        () => {
          pushMessage(system, `${actionObj.desc}`);
          currentSpeaker.value = actionObj.person
          currentModifs.value = actionObj.postModifs;
        },
        dayOffsetter + (i + 1) * timePerAction
      );
    });
    setTimeout(() => {
      day.value += 1;
      currentSpeaker.value = system
      currentModifs.value = [];
    }, dayOffsetter);
    dayOffsetter += timePerAction * dayActionsArray.length + intermissionTime;
  });

  // clear out all the modif systems
  setTimeout(() => {
    currentModifs.value = [];
  }, dayOffsetter);

  // handle the incidents (oh my god the logic spam)

  incidents.value.forEach((incident, id) => {
    const expectedScore = Math.floor(incident.sequence.length);
    let totalScore = 0;

    // handle ignored incident requests
    if (incident.agentsAssigned == 0) {
      incident.weeksToSolve -= 1;
      if (incident.weeksToSolve > 0) updatedIncidents.push(incident);
      else if (incident.unlockOnIgnore) {
        incident.unlockOnIgnore.forEach((fromIgnoreIncident, _) => {
          updatedIncidents.push(fromIgnoreIncident);
        });
      }
    } else {
      // gather involved crew
      const involvedMembers: TeamMember[] = teamMembers.value.filter(
        (member) => {
          if (member.assignedIncident == incident) return member;
        }
      );

      // show new incident begin
      setTimeout(() => {
        messages.value = [];

        pushMessage(system, incident.name);
      }, dayOffsetter);

      // iterate through the sequences inside the incident
      incident.sequence.forEach((incidentSequence, sequenceIndex) => {
        // calculate chance of success based on my nonsense formula
        // combine weights, convert to percentage,
        let sequenceExpectedWeight = 0;
        let sequenceRealWeight = 0;

        // calculate weights by analyzing each statCheck
        incidentSequence.statCheck.forEach((statChecker, _) => {
          // determine categorizer
          const category = statChecker.category.split(".");
          let groupTotal = 0;
          involvedMembers.forEach((m, _) => {
            groupTotal +=
              category[0] == "vital"
                ? m.vital[category[1]]
                : m.stats[category[0]][category[1]];
          });

          // add to total weight
          sequenceExpectedWeight += statChecker.weight;

          // add to real weight depending on surpassing/adherence to threshold
          const bar =
            statChecker.threshold +
            randomInteger(-statChecker.variance, statChecker.variance);
          if (groupTotal >= bar) {
            // caculate excess, which adds excess weight over the expected weight for chance of crit or compensating for other worse stats
            const excess = Math.min(
              (groupTotal - bar) % statChecker.over_step,
              statChecker.max_over
            );

            sequenceRealWeight += statChecker.weight + excess;
          }
        });

        const sequenceResult = Math.floor(
          (sequenceRealWeight / sequenceExpectedWeight) * 100
        );

        // <50 crit fail | <100 fail | <=100 success | >=150 crit success
        const outcomeDesc =
          sequenceResult < 100
            ? sequenceResult < 50
              ? "CRITICAL FAIL"
              : "FAIL"
            : sequenceResult >= 150
              ? "CRITICAL SUCCESS"
              : "SUCCESS";
        totalScore +=
          sequenceResult < 100
            ? sequenceResult < 50
              ? -3
              : 0
            : sequenceResult >= 150
              ? 2
              : 1;

        // print out sequence results
        setTimeout(
          () => {
            pushMessage(system, `${incidentSequence.challenge}`);
            // aiActiveCrewSequenceDialog(
            //   involvedMembers,
            //   incidentSequence.challenge,
            //   outcomeDesc
            // );
          },
          dayOffsetter +
            timePerSequence * (sequenceIndex + 1) * involvedMembers.length +
            1
        );
      });

      dayOffsetter +=
        timePerSequence *
          incident.sequence.length *
          (involvedMembers.length + 1) +
        intermissionTime;
    }

    // determine overall result

    // <50 crit fail | <100 fail | <=100 success | >=150 crit success
    const incidentScore = Math.floor((totalScore / expectedScore) * 100);
    const incidentWin = incidentScore >= 100 ? true : false;

    // handle incident progression logic
    // clone mission if valid
    if (incident.repeatable != undefined && incident.repeatable == true) {
      incident.agentsAssigned = 0;
      updatedIncidents.push(incident);
    }

    // handle winstates
    if (incidentWin) {
      setTimeout(() => {
        cash.value += incident.pay;
        revenue +=  incident.pay;

        popularity.value += incident.reputation;
        pushMessage(
          system,
          `+¥${incident.pay} | +${incident.reputation} reputation`
        );
      }, dayOffsetter);

      if (incident.unlockOnSuccess) {
        incident.unlockOnSuccess.forEach((newIncident) => {
          updatedIncidents.push(newIncident);
        });
      }
    } else {
      setTimeout(() => {
        pushMessage(system, `-${incident.reputation} reputation`);
        popularity.value -= Math.floor(incident.reputation / 2);
      }, dayOffsetter);

      if (incident.unlockOnFail) {
        incident.unlockOnFail.forEach((newIncident) => {
          updatedIncidents.push(newIncident);
        });
      }
    }

    setTimeout(() => {
      pushMessage(
        system,
        `${incidentWin ? "The incident was successfully handled!" : "The incident was not solved!"}`
      );
    }, dayOffsetter);

    dayOffsetter += intermissionTime;

  });

  // post-week fixed expense
  cash.value -= 2000
  expenses += 2000


  // push the report, now that incidents AND tasks have been handled
  reports.value.push({
    week: week.value,
    earning: revenue,
    losses: expenses,
    weekPerformance: teamMemberPerformanceArray
  })

  // final
  setTimeout(() => {
      messages.value = [];
      pushMessage(
        system,
        `Week ${week.value} has concluded. Time to prepare for the next week!`
      );

      disableChatInput.value = false;
      cutsceneMode.value = false;
      
      day.value = 1;
    }, dayOffsetter);

  // final
  setTimeout(() => {
    week.value += 1;
    dayCycleActive.value = false;
    incidents.value = updatedIncidents;
    teamMembers.value.forEach((m) => {
      m.assignedIncident = undefined;
    });
  }, dayOffsetter);
};

// other utility

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const setViewIndex = (ind: number) => {
  menuViewState.value = ind;
  sounds.uiClick.play();
};

const getAsset = (assetID: number) => {
  return assetPacks[assetID].icon;
};

const pushDay = () => {
  if (!dayCycleActive.value) {
    dayCycleActive.value = true;
    disableChatInput.value = true;
    startWeek();
  }
};

const updateTaskSlot = (
  charIndex: number,
  taskIndex: number,
  taskV: number
) => {
  const updatedDayTasks = [...teamMembers.value[charIndex].dayTasks];
  updatedDayTasks[taskIndex] = taskV;

  teamMembers.value[charIndex].dayTasks = updatedDayTasks;
};

const updateIncidentAssignment = (incidentIndex: number, charIndex: number) => {
  const c = teamMembers.value[charIndex];
  const t = incidents.value[incidentIndex];
  if (c.assignedIncident) {
    c.assignedIncident.agentsAssigned -= 1;
  }
  if (c.assignedIncident == t) {
    c.assignedIncident = undefined;
  } else {
    c.assignedIncident = t;
    t.agentsAssigned += 1;
  }
  console.log(teamMembers.value[charIndex]);
};

/// EVENTS

const initSequence = () => {
  disableChatInput.value = true;
  dayCycleActive.value = false;
  cutsceneMode.value = true;
  currentSpeaker.value = reimuH;
  currentIntention.value =
    "Get the newcomer to agree to a business deal wherein he will create and handle a dispatch business that organizes incident handlers and deals with commissions from the local Human Village and across Gensokyo.";
  currentSituation.value = ` The player, a newcomer to Gensokyo, has inexplicably ended up in the Hakurei Shrine, face to face with Reimu Hakurei. Reimu had placed an advertisement in the Human Village a while back looking for someone capable of handling her imagined operation, ie becoming her 'Incident Handler', a dispatcher of sorts.`;
  completeCall.value = firstArticle;
  pushMessage(
    system,
    "You approach the entrance to the Hakurei Shrine. You see Reimu outside, sweeping the floor around a dusty donation box."
  );
  pushMessage(reimuH, "...", 1000);
  pushMessage(system, "Reimu seems to notice your presence.", 2000);
  pushMessage(reimuH, "Hey!", 4000);
  pushMessage(reimuH, "Are you here for my request?", 5000);
  pushMessage(
    system,
    "Ah, yes... her 'request'. You definitely trekked all the way here from the Human Village for that, right? Best to ask her about it.",
    6000
  );
  setTimeout(() => {
    disableChatInput.value = false;
    cutsceneMode.value = false;
  }, 6100);
};

const firstArticle = () => {
  // note dialogue isn't cleared
  currentSpeaker.value = reimuH;
  currentIntention.value = "To hear the player's perception of this article.";
  currentSituation.value = ` After having met and introduced himself to the player, Ryan Klei seeks to gauge his ability to review content and think critically, since the player will be reviewing articles from writers from now on.`;

  const articlePrompt: GenerateContentRequest = {
    systemInstruction: `Generate a detailed and informative beginner's guide that summarizes this entire history. Also use Markdown for headers, tables, italic, and any other formatting.`,
    contents: [{ role: "user", parts: [{ text: bigLore }] }],
    generationConfig: {
      maxOutputTokens: 1400,
      temperature: 0.85,
    },
  };
  pushMessage(
    system,
    "Reimu pauses for a moment, remembering something.",
    1000
  );
  pushMessage(
    reimuH,
    "Ah, sorry. Give me a moment to get something, will you?",
    2000
  );
  pushMessage(
    system,
    "Reimu excuses herself and steps away from you for a moment, taking the time to grab something from another room.",
    4000
  );
  setTimeout(() => {
    messages.value = [];
    dayCycleActive.value = false;
  }, 10100);
  pushMessage(
    system,
    "Reimu steps out of the shrine and hands you something. Your whole layout changes.",
    10200
  );
  pushMessage(reimuH, "Okay. Now that we've got everything set up...", 12000);
  pushMessage(system, "Reimu looks at you eagerly.", 13000);
  pushMessage(reimuH, "Go ahead figure the rest out.", 15000);

  setTimeout(() => {
    disableChatInput.value = false;
    cutsceneMode.value = false;
  }, 15000);
};
</script>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}

.crisp-edges {
  image-rendering: crisp-edges;
}
</style>
