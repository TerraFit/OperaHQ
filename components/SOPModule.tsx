import React, { useState } from 'react';
import { STANDARD_SOPS } from '../constants';
import { MOCK_SOP_ATTEMPTS } from '../services/mockData';
import { SOPAttempt } from '../types';
import { CheckCircle, XCircle, AlertCircle, PlayCircle, Lock } from 'lucide-react';

export default function SOPModule() {
  const [selectedSOP, setSelectedSOP] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState(false);

  // Mock taking a test
  const handleTakeTest = (sopCode: string) => {
    setSelectedSOP(sopCode);
    setQuizMode(true);
  };

  const closeQuiz = () => {
    setQuizMode(false);
    setSelectedSOP(null);
  };

  const getStatus = (code: string) => {
    const attempt = MOCK_SOP_ATTEMPTS.find(a => a.sopCode === code);
    if (!attempt) return { status: 'NOT_ATTEMPTED', color: 'text-red-500', icon: AlertCircle, label: 'Not Started' };
    if (attempt.passed) return { status: 'PASSED', color: 'text-green-500', icon: CheckCircle, label: 'Certified' };
    return { status: 'FAILED', color: 'text-red-500', icon: XCircle, label: 'Failed' };
  };

  if (quizMode && selectedSOP) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-xl font-bold">Assessment: {STANDARD_SOPS.find(s => s.code === selectedSOP)?.title}</h2>
          <p className="opacity-90 text-sm mt-1">Requirement: 100% Score to Pass</p>
        </div>
        <div className="p-8 text-center space-y-6">
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded border border-yellow-200 text-sm">
            This is a mock interface. In the production app, this would present the 10-question quiz specific to {selectedSOP}.
          </div>
          <button 
            onClick={closeQuiz} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors"
          >
            Submit Mock Answers (100%)
          </button>
          <button 
            onClick={closeQuiz} 
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Standard Operating Procedures</h2>
        <p className="text-gray-500 text-sm">Mandatory certifications for compliance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STANDARD_SOPS.map((sop) => {
          const { status, color, icon: Icon, label } = getStatus(sop.code);
          return (
            <div key={sop.code} className="bg-white p-5 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors shadow-sm flex flex-col justify-between h-40">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-gray-400">{sop.code}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">{sop.department}</span>
                </div>
                <h3 className="font-semibold text-gray-900 leading-tight">{sop.title}</h3>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className={`flex items-center gap-1.5 text-sm font-medium ${color}`}>
                  <Icon size={16} />
                  {label}
                </div>
                
                {status !== 'PASSED' && (
                  <button 
                    onClick={() => handleTakeTest(sop.code)}
                    className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded hover:bg-blue-100 font-medium transition-colors flex items-center gap-1"
                  >
                    Start <PlayCircle size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}