/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  User, 
  Baby, 
  Dog, 
  Cat, 
  Stethoscope, 
  Briefcase, 
  Activity,
  Accessibility
} from 'lucide-react';
import { CharacterType } from '../../types';

interface CharacterIconProps {
  type: CharacterType;
  className?: string;
}

export const CharacterIcon: React.FC<CharacterIconProps> = ({ type, className = "" }) => {
  const iconSize = 24;
  
  switch (type) {
    case 'man':
      return <User size={iconSize} className={`text-gray-700 ${className}`} />;
    case 'woman':
      return <User size={iconSize} className={`text-gray-400 ${className}`} />;
    case 'boy':
    case 'girl':
      return <Baby size={iconSize} className={`text-blue-400 ${className}`} />;
    case 'elderly_man':
    case 'elderly_woman':
      return <Accessibility size={iconSize} className={`text-gray-500 ${className}`} />;
    case 'dog':
      return <Dog size={iconSize} className={`text-orange-400 ${className}`} />;
    case 'cat':
      return <Cat size={iconSize} className={`text-yellow-400 ${className}`} />;
    case 'pregnant_woman':
      return <User size={iconSize} className={`text-pink-400 ${className}`} />;
    case 'doctor':
      return <Stethoscope size={iconSize} className={`text-blue-600 ${className}`} />;
    case 'executive':
      return <Briefcase size={iconSize} className={`text-gray-900 ${className}`} />;
    case 'athlete':
      return <Activity size={iconSize} className={`text-green-500 ${className}`} />;
    default:
      return <User size={iconSize} className={className} />;
  }
};
