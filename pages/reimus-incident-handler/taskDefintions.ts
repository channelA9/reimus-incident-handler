import { Task } from "../../util/types";
import { Dumbbell, Bed, Briefcase, Orbit } from "lucide-vue-next";

// 0 = terrible (4), 1 = bad (2), 2 = good (-2), 3 = excellent (-4)
// add all up together to add fail chance modifier (baseFail + total)/100

// 0 = terrible (2), 1 = bad (-1), 2 = good (-1), 3 = excellent (2)
// add all up together to add critical chance modifier (baseCrit + total)/100

const trainTask: Task = {
  name: "Train",
  icon: Dumbbell,
  descs: [
    ['CHAR was injured trying to train!'],
    ['CHAR fell asleep while trying to train.'],
    ['CHAR trained for some time.'],
    ['CHAR took to training with ease!']
  ],
  chanceModifs: [
    {
      category: "spiritual.mastery",
      cutoffs: [-20, 0, 20, 40],
    },
    {
      category: "vital.health",
      cutoffs: [-20, 0, 20, 40],
    },
  ],
  statModifs: [
    {
      category: "spiritual.mastery",
      crit_fail: -5,
      fail: -2,
      success: 2,
      crit_success: 5,
    },
    {
      category: "vital.health",
      crit_fail: -5,
      fail: -2,
      success: 2,
      crit_success: 5,
    },
  ],
  baseFail: 10,
  baseCrit: 5,
};

const restTask: Task = {
  name: "Rest",
  icon: Bed,
  descs: [
    [`CHAR got stressed relaxing...`],
    [`CHAR couldn't relax at all.`],
    ['CHAR rested for some time.'],
    ['CHAR had an amazing rest!']
  ],
  chanceModifs: [
    {
      category: "vital.rest",
      cutoffs: [-50, 0, 50, 90],
    },
  ],
  statModifs: [
    {
      category: "vital.rest",
      crit_fail: -5,
      fail: -2,
      success: 2,
      crit_success: 5,
    },
    {
      category: "vital.health",
      crit_fail: -1,
      fail: 0,
      success: 5,
      crit_success: 15,
    },
  ],
  baseFail: 5,
  baseCrit: 10,
};

const meditateTask: Task = {
  name: "Meditate",
  icon: Orbit,
  descs: [
    [`CHAR couldn't medidtate and got distracted.`],
    ['CHAR tried to medidate, but failed.'],
    ['CHAR medidated.'],
    ['CHAR entered a state of zen.']
  ],
  chanceModifs: [
    {
      category: "spiritual.energy",
      cutoffs: [-20, 0, 20, 40],
    },
    {
      category: "personality.sensitivity",
      cutoffs: [-20, 0, 20, 40],
    },
  ],
  statModifs: [
    {
      category: "spiritual.energy",
      crit_fail: -5,
      fail: -2,
      success: 2,
      crit_success: 5,
    },
    {
      category: "personality.sensitivity",
      crit_fail: -5,
      fail: -2,
      success: 2,
      crit_success: 5,
    },
  ],
  baseFail: 10,
  baseCrit: 5,
};

const workTask: Task = {
  name: "Work",
  icon: Briefcase,
  descs: [
    [`CHAR was run out of town while trying to sell stuff.`],
    [`CHAR couldn't find any willing patrons.`],
    ['CHAR did some work and earned some money.'],
    ['CHAR made a killing!']
  ],
  chanceModifs: [
    {
      category: "skills.building",
      cutoffs: [-20, 0, 20, 40],
    },
    {
      category: "personality.morals",
      cutoffs: [-20, 0, 20, 40],
    },
    {
      category: "personality.sociability",
      cutoffs: [-20, 0, 20, 40],
    },
  ],
  statModifs: [
    {
      category: "status.money",
      crit_fail: -3,
      fail: 0,
      success: 1,
      crit_success: 3,
    },
  ],
  baseFail: 15,
  baseCrit: 3,
};

export const taskArr = [restTask,workTask,meditateTask,trainTask];
