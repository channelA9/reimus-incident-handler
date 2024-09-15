import { IncidentChunk } from "../../util/types";

export const keineSchool1Chunks: IncidentChunk[] = [{
    name: "Arrival at the School",
    location: "Human Town - School Entrance",
    challenge: "Convince the children to gather for the show.",
    statCheck: [
      {
        category: "personality.sociability",
        threshold: 15,
        over_step: 5,
        max_over: 20,
        variance: 3,
        weight: 10,
      }
    ],
  },
  {
    name: "Setting Up the Stage",
    location: "Human Town - School Yard",
    challenge: "Prepare the stage using the school's limited resources.",
    statCheck: [
      {
        category: "personality.creativity",
        threshold: 12,
        over_step: 4,
        max_over: 18,
        variance: 2,
        weight: 8,
      }
    ],
  },
  {
    name: "Rehearsal",
    location: "Human Town - School Yard",
    challenge: "Run a rehearsal for the performance to check for any issues.",
    statCheck: [
      {
        category: "spiritual.mastery",
        threshold: 20,
        over_step: 5,
        max_over: 25,
        variance: 3,
        weight: 9,
      },
      {
        category: "spiritual.energy",
        threshold: 18,
        over_step: 4,
        max_over: 22,
        variance: 3,
        weight: 7,
      }
    ],
  },
  {
    name: "The Big Show",
    location: "Human Town - School Yard",
    challenge: "Perform in front of the kids without messing up.",
    statCheck: [
      {
        category: "spiritual.mastery",
        threshold: 25,
        over_step: 6,
        max_over: 30,
        variance: 5,
        weight: 12,
      },
      {
        category: "spiritual.energy",
        threshold: 18,
        over_step: 5,
        max_over: 22,
        variance: 4,
        weight: 8,
      }
    ]
  },
  {
    name: "Aftermath",
    location: "Human Town - School Yard",
    challenge: "Handle feedback and possibly sign autographs for the kids.",
    statCheck: [
      {
        category: "status.popularity",
        threshold: 12,
        over_step: 3,
        max_over: 15,
        variance: 2,
        weight: 6,
      },
      {
        category: "personality.sensitivity",
        threshold: 10,
        over_step: 3,
        max_over: 14,
        variance: 2,
        weight: 5,
      }
    ]
  }
]