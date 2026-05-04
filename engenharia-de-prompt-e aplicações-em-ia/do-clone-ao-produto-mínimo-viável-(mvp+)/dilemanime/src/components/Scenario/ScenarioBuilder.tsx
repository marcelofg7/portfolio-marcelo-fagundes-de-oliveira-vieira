/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scenario, ScenarioSide, CharacterType } from '../../types';
import { ScenarioCard } from './ScenarioCard';
import { CharacterIcon } from './CharacterIcon';
import { Plus, Trash2, Save, RotateCcw, FolderOpen, LogIn } from 'lucide-react';
import { db, collection, doc, setDoc, deleteDoc, onSnapshot, query, where, OperationType, handleFirestoreError } from '../../firebase';
import { useFirebase } from '../layout/FirebaseContext';
import { useEffect } from 'react';

const CHARACTER_OPTIONS: CharacterType[] = [
  'man', 'woman', 'boy', 'girl', 'elderly_man', 'elderly_woman', 
  'dog', 'cat', 'pregnant_woman', 'doctor', 'executive', 'athlete'
];

interface ScenarioBuilderProps {
  translations: any;
}

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({ translations }) => {
  const { user, login } = useFirebase();
  const [description, setDescription] = useState("My Custom Dilemma");
  const [sideA, setSideA] = useState<ScenarioSide>({ characters: ['man'], isLawAbiding: true });
  const [sideB, setSideB] = useState<ScenarioSide>({ characters: ['dog'], isLawAbiding: true });
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load scenarios from Firestore
  useEffect(() => {
    if (!user) {
      setSavedScenarios([]);
      return;
    }

    const q = query(collection(db, 'scenarios'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const scenarios = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedScenarios(scenarios);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'scenarios');
    });

    return () => unsubscribe();
  }, [user]);

  const saveScenario = async () => {
    if (!user) {
      login();
      return;
    }

    setIsSaving(true);
    const scenarioId = Date.now().toString();
    const path = `scenarios/${scenarioId}`;
    try {
      const newScenario = {
        id: scenarioId,
        userId: user.uid,
        description,
        sideA,
        sideB,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'scenarios', scenarioId), newScenario);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const loadScenario = (scenario: any) => {
    setDescription(scenario.description);
    setSideA(scenario.sideA);
    setSideB(scenario.sideB);
    setShowSaved(false);
  };

  const deleteSavedScenario = async (id: string) => {
    const path = `scenarios/${id}`;
    try {
      await deleteDoc(doc(db, 'scenarios', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const addCharacter = (side: 'A' | 'B', type: CharacterType) => {
    if (side === 'A') {
      setSideA(prev => ({ ...prev, characters: [...prev.characters, type] }));
    } else {
      setSideB(prev => ({ ...prev, characters: [...prev.characters, type] }));
    }
  };

  const removeCharacter = (side: 'A' | 'B', index: number) => {
    if (side === 'A') {
      setSideA(prev => ({ ...prev, characters: prev.characters.filter((_, i) => i !== index) }));
    } else {
      setSideB(prev => ({ ...prev, characters: prev.characters.filter((_, i) => i !== index) }));
    }
  };

  const toggleLaw = (side: 'A' | 'B') => {
    if (side === 'A') {
      setSideA(prev => ({ ...prev, isLawAbiding: !prev.isLawAbiding }));
    } else {
      setSideB(prev => ({ ...prev, isLawAbiding: !prev.isLawAbiding }));
    }
  };

  const reset = () => {
    setSideA({ characters: ['man'], isLawAbiding: true });
    setSideB({ characters: ['dog'], isLawAbiding: true });
    setDescription("My Custom Dilemma");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Editor Panel */}
      <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-lg font-black uppercase tracking-widest text-gray-900 border-b pb-4">
          Scenario Editor
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
              placeholder="Describe the situation..."
            />
          </div>

          {/* Side Controls */}
          {['A', 'B'].map((sideLabel) => {
            const side = sideLabel === 'A' ? sideA : sideB;
            return (
              <div key={sideLabel} className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-gray-900">Side {sideLabel}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {side.characters.map((char, idx) => (
                    <div key={idx} className="relative group">
                      <div className="bg-white p-1.5 rounded-full shadow-sm border border-gray-200">
                        <CharacterIcon type={char} />
                      </div>
                      <button 
                        onClick={() => removeCharacter(sideLabel as 'A' | 'B', idx)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <Trash2 size={8} />
                      </button>
                    </div>
                  ))}
                  <div className="relative group">
                    <button className="bg-blue-600 text-white p-1.5 rounded-full shadow-md hover:bg-blue-700 transition-colors">
                      <Plus size={16} />
                    </button>
                    {/* Character Picker Dropdown (Simplified) */}
                    <div className="absolute left-0 top-full mt-2 bg-white shadow-2xl border border-gray-100 rounded-xl p-2 grid grid-cols-4 gap-2 z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all w-48">
                      {CHARACTER_OPTIONS.map(char => (
                        <button 
                          key={char}
                          onClick={() => addCharacter(sideLabel as 'A' | 'B', char)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <CharacterIcon type={char} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 pt-4">
          <button 
            onClick={reset}
            className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            Reset
          </button>
          <button 
            onClick={saveScenario}
            className="flex-1 py-3 bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Save size={14} />
            Save
          </button>
        </div>

        {/* Saved Scenarios List */}
        <div className="pt-6 border-t">
          <button 
            onClick={() => setShowSaved(!showSaved)}
            className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <FolderOpen size={14} />
              Saved Scenarios ({savedScenarios.length})
            </div>
            <span>{showSaved ? 'Hide' : 'Show'}</span>
          </button>
          
          <AnimatePresence>
            {showSaved && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 mt-4 max-h-48 overflow-y-auto pr-2">
                  {savedScenarios.length === 0 && (
                    <p className="text-[10px] text-gray-400 italic">No scenarios saved yet.</p>
                  )}
                  {savedScenarios.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 group">
                      <button 
                        onClick={() => loadScenario(s)}
                        className="flex-grow text-left text-[10px] font-bold text-gray-600 truncate hover:text-blue-600 transition-colors"
                      >
                        {s.description}
                      </button>
                      <button 
                        onClick={() => deleteSavedScenario(s.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-2 space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Live Preview</h3>
          <p className="text-gray-600 font-medium italic">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScenarioCard 
            side={sideA}
            label="Scenario A"
            onClick={() => {}}
            translations={translations}
          />
          <ScenarioCard 
            side={sideB}
            label="Scenario B"
            onClick={() => {}}
            translations={translations}
          />
        </div>
      </div>
    </div>
  );
};
