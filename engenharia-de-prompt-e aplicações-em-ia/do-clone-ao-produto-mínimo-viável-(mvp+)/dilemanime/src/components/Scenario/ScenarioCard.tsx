/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ScenarioSide } from '../../types';
import { CharacterIcon } from './CharacterIcon';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ScenarioCardProps {
  side: ScenarioSide;
  label: string;
  onClick: () => void;
  imageUrl?: string | null;
  isGenerating?: boolean;
  translations: any;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ 
  side, 
  label, 
  onClick, 
  imageUrl,
  isGenerating,
  translations
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, borderColor: "#3b82f6" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative aspect-video bg-white rounded-xl border-4 border-white shadow-2xl overflow-hidden cursor-pointer flex flex-col"
    >
      {/* Scenario Header/Label */}
      <div className="absolute top-4 left-4 z-20">
        <span className="bg-gray-900 text-white px-3 py-1 text-xs font-black tracking-widest uppercase rounded">
          {label}
        </span>
      </div>

      {/* Character Count Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
          <span>{side.characters.length}</span>
          <span>{side.characters.length === 1 ? translations.life : translations.lives}</span>
        </div>
      </div>

      {/* Background/Road representation or Generated Image */}
      <div className="absolute inset-0 bg-[#e5e7eb] flex flex-col z-0">
        {imageUrl ? (
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={imageUrl} 
            alt={label}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            <div className="h-1/2 border-b-4 border-white border-dashed flex items-center justify-center" />
            <div className="h-1/2 flex items-center justify-center" />
          </>
        )}
        
        {isGenerating && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Generating Illustration...</span>
            </div>
          </div>
        )}
      </div>

      {/* Characters Display (Overlay if no image, or as fallback) */}
      {!imageUrl && (
        <div className="relative flex-grow flex items-center justify-center gap-4 p-8 z-10">
          <div className="flex flex-wrap justify-center gap-3 max-w-[80%]">
            {side.characters.map((char, idx) => (
              <motion.div
                key={`${char}-${idx}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-2 rounded-full shadow-md border border-gray-100"
              >
                <CharacterIcon type={char} />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
