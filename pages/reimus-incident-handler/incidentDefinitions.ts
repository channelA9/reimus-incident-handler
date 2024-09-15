import { reimuH, keineK } from "./characterDefinitions";
import { Incident } from "../../util/types";
import { keineSchool1Chunks } from "./incidentChunk";

// incident definition calc logic:
// combine all assignees stats, compare to minimum/ideal cutoffs in statCheck

export const incidentTags: {[key: string]: Incident} = {
  keineSchool1: {
    name: "Keine's Commission",
    location: "Human Town",
    sequence: keineSchool1Chunks,
    power: 10,
    context:
      "All of Gensokyo was covered by a red mist, and the light of the day could not reach the ground.",
    request_head: "Give the kids a show!",
    request_desc: `Hi Reimu! I saw that ad you put out a few days ago. 
  Does this mean you're finally opening up and stepping out of that shrine when there isn't an 
  incident for once? If so, I'd like to ask you to put a show on for the kids at the school. 
  Maybe it'll be a good way for you to finally get some recognition!`,
    requester: keineK,
    pay: 1000,
    reputation: 1,
    agentsAssigned: 0,
    minAgents: 1,
    recAgents: 1,
    maxAgents:2,
    weeksToSolve: 1,
    repeatable: false,
  },

  asbestosPipe: {
    name: "Asbestos Pipe",
    location: "Human Town",
    sequence: [],
    power: 100,
    context:
      "One of the buildings was built with asbestos pipes that now need to be removed.",
    request_head: "Please fix my house",
    request_desc: `There are asbestos pipes in my home`,
    requester: keineK,
    pay: 10,
    reputation: 1,
    agentsAssigned: 0,
    minAgents: 1,
    recAgents: 1,
    maxAgents:2,
    weeksToSolve: 1,
    repeatable: false,
  },

  cirnoNuisance: {
    name: "Cirno and the Crew",
    location: "Human Town",
    sequence: [],
    power: 10,
    context:
      "All of Gensokyo was covered by a red mist, and the light of the day could not reach the ground.",
    request_head: "Stop those annoying fairies!",
    request_desc: `For the love of god, please do something about those troublemaking fairies! Especially the blue-haired one.`,
    requester: keineK,
    pay: 1000,
    reputation: 1,
    agentsAssigned: 0,
    minAgents: 1,
    recAgents: 1,
    maxAgents:2,
    weeksToSolve: 1,
    repeatable: false,
  },
};
