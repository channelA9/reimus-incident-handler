import { TeamMember, Person } from "../../util/types";

// I LOVE DEFINING CHARACTERS

const dayDef = [-1, -1, -1, -1, -1, -1];

export const system: Person = {
  name: "SYSTEM",
  role: "System",
  assetID: -1,
  relations: {},
  stats: {
    spiritual: { mastery: 10, energy: 12, strength: 15 },
    danmaku: { accuracy: 10, density: 10, speed: 10, variety: 10 },
    skills: { music: 10, cooking: 10, gardening: 15, building: 10 },
    personality: {
      expression: 80,
      morals: 90,
      sensitivity: 80,
      flexibility: 70,
      sociability: 40,
      logicality: 50,
      creativity: 60,
      pride: 30,
    },
    status: { popularity: 100, money: 20 },
  },
};
export const user: Person = {
  name: "PLAYER",
  role: "Writer",
  assetID: 0,
  relations: {},
  stats: {
    spiritual: { mastery: 10, energy: 12, strength: 15 },
    danmaku: { accuracy: 10, density: 10, speed: 10, variety: 10 },
    skills: { music: 10, cooking: 10, gardening: 15, building: 10 },
    personality: {
      expression: 80,
      morals: 90,
      sensitivity: 80,
      flexibility: 70,
      sociability: 40,
      logicality: 50,
      creativity: 60,
      pride: 30,
    },
    status: { popularity: 100, money: 20 },
  },
};
export const reimuH: TeamMember = {
  name: "Reimu Hakurei",
  role: "Miko",
  assetID: 1,
  morale: 1,
  rank: 1,
  relations: {},
  dayTasks: dayDef,
  vital: { health: 100, rest: 70 },
  stats: {
    spiritual: { mastery: 10, energy: 12, strength: 15 },
    danmaku: { accuracy: 10, density: 10, speed: 10, variety: 10 },
    skills: { music: 10, cooking: 10, gardening: 15, building: 10 },
    personality: {
      expression: 80,
      morals: 90,
      sensitivity: 80,
      flexibility: 70,
      sociability: 40,
      logicality: 50,
      creativity: 60,
      pride: 30,
    },
    status: { popularity: 100, money: 20 },
  },
};
export const marisaK: TeamMember = {
  name: "Marisa Kirisame",
  role: "Witch",
  assetID: 2,
  morale: -1,
  rank: -1,
  relations: {},
  dayTasks: dayDef,
  vital: { health: 100, rest: 70 },
  stats: {
    spiritual: { mastery: 15, energy: 10, strength: 10 },
    danmaku: { accuracy: 15, density: 15, speed: 15, variety: 15 },
    skills: { music: 10, cooking: 10, gardening: 10, building: 10 },
    personality: {
      expression: 80,
      morals: 60,
      sensitivity: 60,
      flexibility: 90,
      sociability: 80,
      logicality: 90,
      creativity: 95,
      pride: 60,
    },
    status: { popularity: 95, money: 50 },
  },
};
export const sanaeK: TeamMember = {
  name: "Sanae Kochiya",
  role: "Miko",
  assetID: 3,
  morale: -1,
  rank: -1,
  relations: {},
  dayTasks: dayDef,
  vital: { health: 100, rest: 80 },
  stats: {
    spiritual: { mastery: 15, energy: 10, strength: 10 },
    danmaku: { accuracy: 15, density: 10, speed: 10, variety: 10 },
    skills: { music: 10, cooking: 10, gardening: 15, building: 10 },
    personality: {
      expression: 70,
      morals: 85,
      sensitivity: 80,
      flexibility: 80,
      sociability: 85,
      logicality: 70,
      creativity: 75,
      pride: 40,
    },
    status: { popularity: 80, money: 30 },
  },
};

export const keineK: Person = {
  name: "Keine Kamishirasawa",
  role: "Teacher",
  assetID: 1,
  relations: {},
  stats: {
    spiritual: { mastery: 15, energy: 10, strength: 10 },
    danmaku: { accuracy: 15, density: 10, speed: 10, variety: 10 },
    skills: { music: 10, cooking: 10, gardening: 15, building: 10 },
    personality: {
      expression: 70,
      morals: 85,
      sensitivity: 80,
      flexibility: 80,
      sociability: 85,
      logicality: 70,
      creativity: 75,
      pride: 40,
    },
    status: { popularity: 80, money: 30 },
  },
};

export const humanTowner: Person = {
  name: "Town Resident",
  role: "Resident of Human Town",
  assetID: 1,
  relations: {},
  stats: {
    spiritual: { mastery: 15, energy: 10, strength: 10 },
    danmaku: { accuracy: 15, density: 10, speed: 10, variety: 10 },
    skills: { music: 10, cooking: 10, gardening: 15, building: 10 },
    personality: {
      expression: 50,
      morals: 50,
      sensitivity: 50,
      flexibility: 50,
      sociability: 50,
      logicality: 50,
      creativity: 50,
      pride: 50,
    },
    status: { popularity: 0, money: 10 },
  },
};
