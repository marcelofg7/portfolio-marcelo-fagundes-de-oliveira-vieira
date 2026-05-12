/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MainLayout } from './components/layout/MainLayout';
import { ScenarioCard } from './components/Scenario/ScenarioCard';
import { ScenarioBuilder } from './components/Scenario/ScenarioBuilder';
import { SCENARIOS } from './scenarios';
import { generateScenarioImage } from './services/imageService';
import { Language } from './types';
import { TRANSLATIONS } from './translations';
import { Globe } from 'lucide-react';
import { FirebaseProvider } from './components/layout/FirebaseContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <AppContent />
      </FirebaseProvider>
    </ErrorBoundary>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<'judge' | 'explore' | 'results' | 'settings'>('judge');
  const [currentLanguage, setCurrentLanguage] = useState<Language>('EN');
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [images, setImages] = useState<{ [key: string]: string | null }>({});
  const [isGenerating, setIsGenerating] = useState<{ [key: string]: boolean }>({});
  
  const totalScenarios = SCENARIOS.length;
  const currentScenario = SCENARIOS[currentScenarioIdx];
  const t = TRANSLATIONS[currentLanguage];

  // Load images for current scenario
  useEffect(() => {
    const loadImages = async () => {
      const idA = `scenario-${currentScenario.id}-A`;
      const idB = `scenario-${currentScenario.id}-B`;

      if (!images[idA] && !isGenerating[idA]) {
        setIsGenerating(prev => ({ ...prev, [idA]: true }));
        const imgA = await generateScenarioImage(currentScenario.sideA, "Scenario A");
        setImages(prev => ({ ...prev, [idA]: imgA }));
        setIsGenerating(prev => ({ ...prev, [idA]: false }));
      }

      if (!images[idB] && !isGenerating[idB]) {
        setIsGenerating(prev => ({ ...prev, [idB]: true }));
        const imgB = await generateScenarioImage(currentScenario.sideB, "Scenario B");
        setImages(prev => ({ ...prev, [idB]: imgB }));
        setIsGenerating(prev => ({ ...prev, [idB]: false }));
      }
    };

    if (activeTab === 'judge') {
      loadImages();
    }
  }, [currentScenario.id, activeTab]);

  const handleAcceptScenario = (side: 'A' | 'B') => {
    console.log(`Accepted Scenario ${side} for scenario ID ${currentScenario.id}`);
    
    if (currentScenarioIdx < totalScenarios - 1) {
      setTimeout(() => {
        setCurrentScenarioIdx(prev => prev + 1);
      }, 300);
    } else {
      console.log("Experiment Finished!");
      setActiveTab('results');
    }
  };

  const handleNavigate = (scenarioNum: number) => {
    setCurrentScenarioIdx(scenarioNum - 1);
  };

  return (
    <MainLayout 
      progress={currentScenarioIdx + 1} 
      total={totalScenarios}
      onNavigate={handleNavigate}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      currentLanguage={currentLanguage}
      translations={t}
    >
      <AnimatePresence mode="wait">
        {activeTab === 'judge' && (
          <motion.div 
            key="judge-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">
                {t.question}
              </h2>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={currentScenario.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-gray-500 font-medium max-w-2xl mx-auto text-sm leading-relaxed"
                >
                  {currentScenario.description}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="space-y-8 mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="wait">
                  <ScenarioCard 
                    key={`side-a-${currentScenario.id}`}
                    side={currentScenario.sideA}
                    label="Scenario A"
                    onClick={() => handleAcceptScenario('A')}
                    imageUrl={images[`scenario-${currentScenario.id}-A`]}
                    isGenerating={isGenerating[`scenario-${currentScenario.id}-A`]}
                    translations={t}
                  />
                  <ScenarioCard 
                    key={`side-b-${currentScenario.id}`}
                    side={currentScenario.sideB}
                    label="Scenario B"
                    onClick={() => handleAcceptScenario('B')}
                    imageUrl={images[`scenario-${currentScenario.id}-B`]}
                    isGenerating={isGenerating[`scenario-${currentScenario.id}-B`]}
                    translations={t}
                  />
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: "#1f2937" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAcceptScenario('A')}
                  className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-lg transition-colors shadow-lg cursor-pointer text-sm"
                >
                  {t.acceptA}
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.01, backgroundColor: "#1f2937" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAcceptScenario('B')}
                  className="w-full py-4 bg-gray-900 text-white font-bold uppercase tracking-widest rounded-lg transition-colors shadow-lg cursor-pointer text-sm"
                >
                  {t.acceptB}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'explore' && (
          <motion.div 
            key="explore-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black tracking-tighter text-gray-900 uppercase italic">
                {t.designScenario}
              </h2>
              <p className="text-gray-500 font-medium">{t.createPreview}</p>
            </div>
            <ScenarioBuilder translations={t} />
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
            key="settings-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-blue-600" size={24} />
              <h2 className="text-xl font-black uppercase tracking-widest text-gray-900">
                {t.language}
              </h2>
            </div>
            <p className="text-gray-500 text-sm mb-6">{t.selectLanguage}</p>
            <div className="space-y-3">
              {(['EN', 'PT', 'ES'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setCurrentLanguage(lang)}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all border-2 ${
                    currentLanguage === lang 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-lg' 
                    : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200'
                  } cursor-pointer`}
                >
                  {lang === 'EN' ? 'English' : lang === 'PT' ? 'Português' : 'Español'}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'results' && (
          <motion.div 
            key="results-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-20"
          >
            <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase italic mb-4">
              {t.experimentComplete}
            </h2>
            <p className="text-gray-500 mb-8">{t.thankYou}</p>
            <button 
              onClick={() => setActiveTab('judge')}
              className="px-8 py-3 bg-gray-900 text-white font-black uppercase tracking-widest rounded-lg shadow-xl cursor-pointer"
            >
              {t.restart}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
