/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FooterProps {
  progress?: number;
  total?: number;
  onNavigate?: (scenario: number) => void;
  translations: any;
}

export const Footer: React.FC<FooterProps> = ({ progress = 0, total = 13, onNavigate, translations }) => {
  const percentage = (progress / total) * 100;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onNavigate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedPercentage = x / rect.width;
    const targetScenario = Math.max(1, Math.min(total, Math.ceil(clickedPercentage * total)));
    onNavigate(targetScenario);
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200 fixed bottom-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Progress Bar */}
        <div 
          className="w-full h-3 bg-gray-100 rounded-full overflow-hidden cursor-pointer group relative"
          onClick={handleProgressBarClick}
        >
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
          {/* Hover indicator */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-black transition-opacity" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate?.(Math.max(1, progress - 1))}
              disabled={progress <= 1}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gray-100 text-gray-600 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button 
              onClick={() => onNavigate?.(Math.min(total, progress + 1))}
              disabled={progress >= total}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
              {translations.scenario} {progress} {translations.of} {total}
            </span>
            <div className="flex gap-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
              <a href="#" className="hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
