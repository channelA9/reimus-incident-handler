import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
  SchemaType,
  Content,
  GenerationConfig,
} from "@google/generative-ai";
import { Message, Person } from "./types";
const aiKEY = import.meta.env.GEMINI_API_KEY
// do not build until we can separate local AI keys from our own backend keys if we dev a system for this

const genAI = new GoogleGenerativeAI(aiKEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings,
});

export const geminiPro = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  safetySettings,
});

// created a separate to handle different generation stream
export const perceiveGeminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  safetySettings,
  generationConfig: {
    temperature: 1,
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        complete: { type: SchemaType.BOOLEAN },
      },
    },
  },
});

export const geminiFlash3 = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings,
});

export const speakOrActGeminiFlash = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  safetySettings,
  generationConfig: {},
});

export const getFormedMessages = (
  messages: Message[],
  currentSpeaker: Person
) => {
  const formedMessages: Content[] = [];

  messages.forEach((msg, _) => {
    formedMessages.push({
      role: msg.sender.name == "PLAYER" ? "user" : "model",
      parts: [
        {
          text: `${msg.sender.name !== currentSpeaker.name ? `${msg.sender.name}:` : ""} ${msg.content}`,
        },
      ],
    });
  });

  return formedMessages;
};



export class promptGen {
  prompt: Content[];
  sysInst: string;
  genConfig: GenerationConfig;
  constructor() {
    this.prompt = [];
    this.sysInst = "";
    this.genConfig = {
      maxOutputTokens: 1000,
      temperature: 0.85,
    };
  }

  addModelComponent(str: string) {
    this.prompt.push({
      role: "model",
      parts: [
        {
          text: str,
        },
      ],
    });
  }

  addUserComponent(str: string) {
    this.prompt.push({
      role: "user",
      parts: [
        {
          text: str,
        },
      ],
    });
  }

  addChunk(chunk: Content[]) {
    this.prompt = [...this.prompt, ...chunk];
  }

  setSystemPrompt(str: string) {
    this.sysInst = str;
  }

  setGenConfig(newConfig: GenerationConfig) {
    this.genConfig = newConfig;
  }

  get finalRequest() {
    return {
      systemInstruction: this.sysInst,
      contents: this.prompt,
      generationConfig: this.genConfig,
    };
  }
}

// gen configs
export const speakOrActGenConfig: GenerationConfig = {
  temperature: 1,
  responseMimeType: "application/json",
  responseSchema: {
    type: SchemaType.OBJECT,
    properties: {
      speak: { type: SchemaType.BOOLEAN },
      act: { type: SchemaType.BOOLEAN },
    },
  },
};

export const opinionResConfig: GenerationConfig = {
  temperature: 1,
  responseMimeType: "application/json",
  responseSchema: {
    type: SchemaType.OBJECT,
    properties: {
      opinion: { type: SchemaType.NUMBER },
      trust: { type: SchemaType.NUMBER },
    },
  },
};


export const nextSpeakerResConfig: GenerationConfig = {
  temperature: 1,
  responseMimeType: "application/json",
  responseSchema: {
    type: SchemaType.OBJECT,
    properties: {
      nextSpeakerIndex: { type: SchemaType.NUMBER },
    },
  },
};