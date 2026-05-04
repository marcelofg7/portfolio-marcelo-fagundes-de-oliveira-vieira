/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CharacterType = 
  | 'man' 
  | 'woman' 
  | 'boy' 
  | 'girl' 
  | 'elderly_man' 
  | 'elderly_woman' 
  | 'dog' 
  | 'cat' 
  | 'pregnant_woman' 
  | 'doctor' 
  | 'executive' 
  | 'athlete';

export type Language = 'EN' | 'PT' | 'ES';

export interface ScenarioSide {
  characters: CharacterType[];
  isLawAbiding: boolean; // Crossing on green vs red
}

export interface Scenario {
  id: number;
  description: string;
  sideA: ScenarioSide;
  sideB: ScenarioSide;
}
