import { FunctionalComponent, Ref } from "vue";

export interface Vital extends Record<string, number> {
  health: number;
  rest: number;
}
interface Spiritual extends Record<string, number> {
  mastery: number;
  energy: number;
  strength: number;
}

interface Danmaku extends Record<string, number> {
  accuracy: number;
  density: number;
  speed: number;
  variety: number;
}

interface Skills extends Record<string, number> {
  music: number;
  cooking: number;
  gardening: number;
  building: number;
}

interface Personality extends Record<string, number> {
  expression: number;
  morals: number;
  sensitivity: number;
  flexibility: number;
  sociability: number;
  logicality: number;
  creativity: number;
  pride: number;
}

interface Status extends Record<string, number> {
  popularity: number;
  money: number;
}

export interface Stats
  extends Record<string, Spiritual | Danmaku | Skills | Personality | Status> {
  spiritual: Spiritual;
  danmaku: Danmaku;
  skills: Skills;
  personality: Personality;
  status: Status;
}

export interface Relations {
  [key: string]: {
    person: Person;
    opinion: number;
    trust: number;
    memory: string;
  };
}

export interface Person {
  name: string;
  role: string;
  assetID: number;
  relations: Relations;
  stats: Stats;
}

export interface TeamMember extends Person {
  morale: number;
  rank: number;
  dayTasks: number[];
  assignedIncident?: Incident;
  vital: Vital;
}

// cutoff def:
// array of 4, 0 = terrible cutoff, 1 = bad cutoff, 2 = good cutoff, 3 = excellent cutoff
// -100 to 100
export interface ChanceModif {
  category: string;
  cutoffs: [number, number, number, number];
}

export interface StatModif {
  category: string;
  crit_fail: number;
  fail: number;
  success: number;
  crit_success: number;
}

export interface Task {
  name: string;
  descs: string[][];
  icon: FunctionalComponent;
  chanceModifs: ChanceModif[];
  statModifs: StatModif[];
  baseFail: number;
  baseCrit: number;
}

export interface PostTask {
  desc: string;
  person: TeamMember;
  success: boolean;
  crit: boolean;
}

export interface Review {
  title: string;
  score: number;
}

export interface Message {
  sender: Person;
  content: string;
}

export interface AssetPack {
  icon: string;
  lore: string;
}

export interface statCheck {
  category: string;
  threshold: number;
  over_step: number; // if over threshold, determine extra addition  to total weight
  max_over: number;
  variance: number;
  weight: number;
}

export interface IncidentChunk {
  name: string;
  location: string;
  challenge: string;
  enemies?: Person[];
  statCheck: statCheck[];
}

export interface Incident {
  name: string;
  location: string;
  sequence: IncidentChunk[];
  power: number;
  context: string;
  request_head: string;
  request_desc: string;
  requester: Person;
  pay: number;
  reputation: number;
  agentsAssigned: number;
  minAgents: number;
  recAgents: number;
  maxAgents: number;
  weeksToSolve: number;
  repeatable?: boolean; // repeatable: exclusive with the following 3 values
  unlockOnFail?: Incident[];
  unlockOnSuccess?: Incident[];
  unlockOnIgnore?: Incident[];
}

export interface Action {
  name: string;
  icon: FunctionalComponent;
}

export interface GameValue {
  name: string;
  icon?: FunctionalComponent;
  ref: Ref;
}

export interface SFX {
  chat: HTMLAudioElement;
  bigchat: HTMLAudioElement;
  uiClick: HTMLAudioElement;
}
