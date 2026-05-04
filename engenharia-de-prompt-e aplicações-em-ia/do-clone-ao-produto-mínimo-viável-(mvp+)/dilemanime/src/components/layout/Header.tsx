/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { Language } from '../../types';
import { useFirebase } from './FirebaseContext';

interface HeaderProps {
  currentLanguage: Language;
  activeTab: 'judge' | 'explore' | 'results' | 'settings';
  onTabChange: (tab: 'judge' | 'explore' | 'results' | 'settings') => void;
  translations: any;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentLanguage, 
  activeTab,
  onTabChange,
  translations
}) => {
  const { user, login, logout } = useFirebase();

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-bold tracking-tighter text-gray-900 flex items-center gap-2">
            <span className="bg-gray-900 text-white px-2 py-0.5 rounded">DILEM</span>
            <span>ANIME</span>
          </h1>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            <button 
              onClick={() => onTabChange('judge')}
              className={`${activeTab === 'judge' ? 'text-gray-900 border-b-2 border-gray-900' : 'hover:text-gray-900'} transition-colors h-16 flex items-center uppercase tracking-widest font-black text-xs cursor-pointer`}
            >
              {translations.judge}
            </button>
            <button 
              onClick={() => onTabChange('explore')}
              className={`${activeTab === 'explore' ? 'text-gray-900 border-b-2 border-gray-900' : 'hover:text-gray-900'} transition-colors h-16 flex items-center uppercase tracking-widest font-black text-xs cursor-pointer`}
            >
              {translations.explore}
            </button>
            <button 
              onClick={() => onTabChange('results')}
              className={`${activeTab === 'results' ? 'text-gray-900 border-b-2 border-gray-900' : 'hover:text-gray-900'} transition-colors h-16 flex items-center uppercase tracking-widest font-black text-xs cursor-pointer`}
            >
              {translations.results}
            </button>
            <button 
              onClick={() => onTabChange('settings')}
              className={`${activeTab === 'settings' ? 'text-gray-900 border-b-2 border-gray-900' : 'hover:text-gray-900'} transition-colors h-16 flex items-center uppercase tracking-widest font-black text-xs cursor-pointer`}
            >
              {translations.settings}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onTabChange('settings')}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <Globe size={16} />
            <span>{currentLanguage}</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full border border-gray-200" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <UserIcon size={16} />
                </div>
              )}
              <button 
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md cursor-pointer"
            >
              <LogIn size={14} />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
