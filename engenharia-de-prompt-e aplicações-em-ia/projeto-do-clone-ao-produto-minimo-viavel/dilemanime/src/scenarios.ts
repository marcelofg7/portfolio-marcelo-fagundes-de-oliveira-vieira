/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    description: "The self-driving car has a sudden brake failure. It must choose between continuing straight and hitting a group of pedestrians, or swerving and hitting another group.",
    sideA: {
      characters: ['man', 'woman', 'boy', 'girl'],
      isLawAbiding: true
    },
    sideB: {
      characters: ['elderly_man', 'elderly_woman', 'dog'],
      isLawAbiding: false
    }
  },
  {
    id: 2,
    description: "The car must decide between hitting a group of high-status individuals or a group of animals.",
    sideA: {
      characters: ['executive', 'executive', 'doctor'],
      isLawAbiding: true
    },
    sideB: {
      characters: ['dog', 'cat', 'dog', 'cat'],
      isLawAbiding: true
    }
  },
  {
    id: 3,
    description: "A choice between saving an athlete or a pregnant woman.",
    sideA: {
      characters: ['athlete', 'athlete'],
      isLawAbiding: true
    },
    sideB: {
      characters: ['pregnant_woman'],
      isLawAbiding: true
    }
  },
  {
    id: 4,
    description: "The car must choose between hitting pedestrians crossing legally or those crossing illegally.",
    sideA: {
      characters: ['man', 'woman'],
      isLawAbiding: true
    },
    sideB: {
      characters: ['man', 'woman'],
      isLawAbiding: false
    }
  },
  {
    id: 5,
    description: "A group of children vs a group of elderly people.",
    sideA: {
      characters: ['boy', 'girl', 'boy'],
      isLawAbiding: true
    },
    sideB: {
      characters: ['elderly_man', 'elderly_woman'],
      isLawAbiding: true
    }
  },
  {
    id: 6,
    description: "The car must choose between hitting a group of medical professionals or a group of high-level executives.",
    sideA: {
      characters: ['doctor', 'doctor', 'doctor'],
      isLawAbiding: true
    },
    sideB: {
      characters: ['executive', 'executive', 'executive'],
      isLawAbiding: true
    }
  },
  {
    id: 7,
    description: "A choice between hitting a pregnant woman and a child, or a larger group of athletes.",
    sideA: {
      characters: ['pregnant_woman', 'boy'],
      isLawAbiding: true
    },
    sideB: {
      characters: ['athlete', 'athlete', 'athlete', 'athlete'],
      isLawAbiding: true
    }
  },
  {
    id: 8,
    description: "The car must decide between hitting a group of domestic animals or an elderly person crossing the street.",
    sideA: {
      characters: ['dog', 'cat', 'dog'],
      isLawAbiding: true
    },
    sideB: {
      characters: ['elderly_man'],
      isLawAbiding: true
    }
  }
];
