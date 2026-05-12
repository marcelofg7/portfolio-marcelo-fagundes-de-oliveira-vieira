/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

import { Language } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  progress?: number;
  total?: number;
  onNavigate?: (scenario: number) => void;
  activeTab: 'judge' | 'explore' | 'results' | 'settings';
  onTabChange: (tab: 'judge' | 'explore' | 'results' | 'settings') => void;
  currentLanguage: Language;
  translations: any;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  progress, 
  total, 
  onNavigate,
  activeTab,
  onTabChange,
  currentLanguage,
  translations
}) => {
  return (
    <div className="min-h-screen bg-[#f5f5f5] font-sans text-gray-900 flex flex-col">
      <Header 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        currentLanguage={currentLanguage}
        translations={translations}
      />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 pb-32">
        <div className="w-full max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      <Footer 
        progress={progress} 
        total={total} 
        onNavigate={onNavigate} 
        translations={translations}
      />
    </div>
  );
};
