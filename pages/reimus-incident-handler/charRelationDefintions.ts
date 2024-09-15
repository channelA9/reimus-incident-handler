import { user, sanaeK, reimuH, marisaK } from "./characterDefinitions";
import { Relations } from "../../util/types";

export const initRel = {
    reimuHRelations: {
        user: {
            person: user,
            opinion: 0,
            trust: 0,
            memory: "I've just agreed to make this person our incident handler. I'm not sure what kind of person they'll be yet though.",
          },
        [sanaeK.name]: {
          person: sanaeK,
          opinion: 80,
          trust: 90,
          memory: "We've been friends for years. She's always there for me.",
        },
        [marisaK.name]: {
          person: marisaK,
          opinion: 70,
          trust: 80,
          memory: "We've had our ups and downs, but we've always found a way to get along.",
        },
      },
      sanaeKRelations: {
        [reimuH.name]: {
          person: reimuH,
          opinion: 90,
          trust: 100,
          memory: "Reimu is like a big sister to me. She's always been there to guide me.",
        },
        [marisaK.name]: {
          person: marisaK,
          opinion: 85,
          trust: 90,
          memory: "Marisa is a lot of fun to be around, and we always have a good time together.",
        },
      },
      marisaKRelations: {
        [reimuH.name]: {
          person: reimuH,
          opinion: 75,
          trust: 85,
          memory: "Reimu can be a bit serious, but she's always honest with me.",
        },
        [sanaeK.name]: {
          person: sanaeK,
          opinion: 90,
          trust: 95,
          memory: "Sanae is always so cheerful and optimistic. She's a great friend to have around.",
        },
      }
}