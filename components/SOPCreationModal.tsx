
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { DEPARTMENT_VISUALS } from '../constants';
import { SOPDepartment, SOPCreationMethod, SOPCreationRequest, SOP } from '../types';
import { AIService, GeneratedSOP } from '../services/aiService';
import { 
  X, ArrowRight, ArrowLeft, BrainCircuit, Users, ExternalLink, PenTool, CheckCircle, 
  Loader2, Wand2, Calendar, FileText, Sparkles, AlertCircle
} from 'lucide-react';

interface SOPCreationModalProps {
  onClose: () => void;
  onCreate: (request: SOPCreationRequest, generatedSop?: SOP) => void;
}

type WizardStep = 'details' | 'method' | 'configure' | 'review';

export default function SOPCreationModal({ onClose, onCreate }: SOPCreationModalProps) {
  const { user, employees } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [aiResult, setAiResult] = useState<GeneratedSOP | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<SOPCreationRequest>>({
    title: '',
    department: 'general',
    category: '',
    description: '',
    priority: 'medium',
    deadline: '',
    method: 'ai_generated'
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [externalEmail, setExternalEmail] = useState('');

  const handleNext = () => {
    if (currentStep === 'details') {
        if(!formData.title || !formData.category) {
            alert("Please fill in required fields");
            return;
        }
        setCurrentStep('method');
    } else if (currentStep === 'method') {
        setCurrentStep('configure');
    }
  };

  const handleBack = () => {
    if (currentStep === 'method') setCurrentStep('details');
    if (currentStep === 'configure') setCurrentStep('method');
    if (currentStep === 'review') setCurrentStep('configure');
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    setGenerationStage('Connecting to Gemini Intelligence...');
    
    try {
        setGenerationStage('Analyzing South African Compliance standards...');
        const result = await AIService.generateSOP(
            formData.title!,
            formData.department as SOPDepartment,
            formData.category!,
            aiPrompt || formData.description || ''
        );
        
        setGenerationStage('Building Competency Assessment...');
        setAiResult(result);
        setCurrentStep('review');
    } catch (err: any) {
        alert(err.message || "Failed to generate SOP. Please check your connection.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (formData.method === 'ai_generated' && aiResult) {
        const newSop: SOP = {
            id: `sop-ai-${Date.now()}`,
            code: `ZL-SOP-AI`, // System will assign formal code on publish
            title: aiResult.title,
            department: formData.department as SOPDepartment,
            category: formData.category!,
            version: "1.0",
            contentHtml: aiResult.contentHtml,
            summary: aiResult.summary,
            questions: aiResult.questions,
            passingScore: 100,
            timeLimitMinutes: 15,
            retestIntervalWeeks: 4
        };

        const newRequest: SOPCreationRequest = {
            id: `req-${Date.now()}`,
            title: aiResult.title,
            department: formData.department as SOPDepartment,
            category: formData.category!,
            description: formData.description,
            priority: formData.priority as any,
            deadline: formData.deadline,
            status: 'review',
            method: 'ai_generated',
            assignedBy: user?.id || 'unknown',
            createdAt: new Date().toISOString(),
            progress: 100,
            aiGenerated: true
        };

        onCreate(newRequest, newSop);
    } else {
        // Handle standard assignment
        const newRequest: SOPCreationRequest = {
            id: `req-${Date.now()}`,
            title: formData.title!,
            department: formData.department as SOPDepartment,
            category: formData.category!,
            description: formData.description,
            priority: formData.priority as any,
            deadline: formData.deadline,
            status: 'assigned',
            method: formData.method as SOPCreationMethod,
            assignedBy: user?.id || 'unknown',
            createdAt: new Date().toISOString(),
            progress: 0,
            assignedToId: selectedEmployee,
            assignedToName: employees.find(e => e.id === selectedEmployee)?.firstName,
            externalEmail: externalEmail
        };
        onCreate(newRequest);
    }
  };

  const departmentVisual = DEPARTMENT_VISUALS[formData.department || 'general'];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {formData.method === 'ai_generated' ? <Sparkles className="text-purple-600" size={24} /> : <FileText className="text-blue-600" size={24} />}
                {currentStep === 'review' ? 'Review AI Generated SOP' : 'Create New SOP'}
            </h2>
            <p className="text-sm text-gray-500">
                {currentStep === 'review' ? 'Final verification before publishing to library' : `Step ${['details', 'method', 'configure'].indexOf(currentStep) + 1} of 3`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: DETAILS */}
          {currentStep === 'details' && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">SOP Title *</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. Pool Maintenance & Chemical Handling"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Department *</label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value as any})}
                  >
                    {Object.keys(DEPARTMENT_VISUALS).filter(k => k !== 'all').map(dept => (
                      <option key={dept} value={dept}>
                        {DEPARTMENT_VISUALS[dept].icon} {dept.charAt(0).toUpperCase() + dept.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    <option value="safety">Safety</option>
                    <option value="hygiene">Hygiene</option>
                    <option value="equipment">Equipment</option>
                    <option value="guest_service">Guest Service</option>
                    <option value="compliance">Compliance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description / Brief</label>
                <textarea 
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Describe the objective. Gemini will expand this into a full document."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          )}

          {/* STEP 2: METHOD */}
          {currentStep === 'method' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Select Generation Method</h3>
              
              <div 
                onClick={() => setFormData({...formData, method: 'ai_generated'})}
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 hover:shadow-lg ${formData.method === 'ai_generated' ? 'border-purple-500 bg-purple-50/50 shadow-md ring-1 ring-purple-500' : 'border-gray-100 bg-white hover:border-purple-200'}`}
              >
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner">
                  <BrainCircuit size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">Gemini AI Assistant <span className="bg-purple-200 text-purple-800 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase">Pro</span></h4>
                  <p className="text-sm text-gray-600">Generates full procedure + automated competency quiz based on lodge data.</p>
                </div>
              </div>

              <div 
                onClick={() => setFormData({...formData, method: 'internal'})}
                className={`p-5 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 hover:shadow-lg ${formData.method === 'internal' ? 'border-blue-500 bg-blue-50/50 shadow-md ring-1 ring-blue-500' : 'border-gray-100 bg-white hover:border-blue-200'}`}
              >
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                  <Users size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Manual Internal Assignment</h4>
                  <p className="text-sm text-gray-600">Assign to a department supervisor to write manually.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIGURE */}
          {currentStep === 'configure' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              {formData.method === 'ai_generated' ? (
                <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-100">
                    <div className="flex items-center gap-3 mb-6">
                        <Sparkles className="text-purple-600" />
                        <h3 className="font-black text-purple-900 text-lg">AI CONFIGURATION</h3>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-purple-800 mb-2">Specific Safety Points for Gemini to include:</label>
                        <textarea 
                            className="w-full p-4 border border-purple-200 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 outline-none h-40 text-gray-800"
                            placeholder="Example: Mention the specific pool pump brand, the location of the eye-wash station, or required gloves for chemical mixing."
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                        />
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-purple-600 font-bold uppercase tracking-widest">Zebra Lodge Safety Engine v2.1</span>
                            <span className="text-xs text-purple-400">Tokens Optimized</span>
                        </div>
                    </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Supervisor to Assign</label>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white"
                    value={selectedEmployee}
                    onChange={e => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Select staff member...</option>
                    {employees.filter(e => e.role !== 'staff').map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.jobTitle})</option>
                    ))}
                  </select>
                  <div className="p-4 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 flex gap-3">
                      <AlertCircle className="shrink-0" />
                      <p className="text-sm">Manual assignments require a manager's final review before they appear in the staff library.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: REVIEW AI RESULT */}
          {currentStep === 'review' && aiResult && (
              <div className="space-y-6 animate-in zoom-in-95">
                  <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3 mb-4">
                      <CheckCircle className="text-green-600" />
                      <div className="text-sm font-bold text-green-800">Gemini Pro has drafted your SOP successfully.</div>
                  </div>

                  <div className="border rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-gray-100 px-4 py-2 border-b font-bold text-gray-700 text-xs uppercase tracking-widest">Document Preview</div>
                      <div className="p-6 bg-white prose max-w-none prose-sm">
                          <h1 className="text-2xl mb-2">{aiResult.title}</h1>
                          <p className="italic text-gray-500 mb-4">{aiResult.summary}</p>
                          <div dangerouslySetInnerHTML={{ __html: aiResult.contentHtml }} />
                      </div>
                  </div>

                  <div className="border rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-indigo-50 px-4 py-2 border-b font-bold text-indigo-700 text-xs uppercase tracking-widest">Competency Assessment (5 Questions)</div>
                      <div className="p-4 bg-white space-y-4">
                          {aiResult.questions.map((q, i) => (
                              <div key={i} className="text-sm border-b last:border-0 pb-3">
                                  <p className="font-bold text-gray-900 mb-2">{i+1}. {q.question}</p>
                                  <div className="grid grid-cols-2 gap-2">
                                      {q.options.map((opt, oi) => (
                                          <div key={oi} className={`px-2 py-1 rounded border text-xs ${oi === q.correctIndex ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-gray-50 text-gray-500'}`}>
                                              {opt}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
          {!isGenerating && (
            <button onClick={handleBack} disabled={currentStep === 'details'} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg flex items-center gap-2 disabled:opacity-30">
              <ArrowLeft size={18} /> Back
            </button>
          )}

          {isGenerating ? (
            <div className="flex items-center gap-4 text-purple-600 font-bold ml-auto">
                <Loader2 className="animate-spin" />
                <span className="animate-pulse">{generationStage}</span>
            </div>
          ) : currentStep === 'configure' && formData.method === 'ai_generated' ? (
            <button 
                onClick={handleGenerateAI}
                className="px-8 py-2 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 flex items-center gap-2 shadow-lg shadow-purple-200 transition-all hover:scale-105"
            >
              <Sparkles size={18} /> Generate with Gemini
            </button>
          ) : currentStep !== 'configure' && currentStep !== 'review' ? (
            <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md">
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button 
                onClick={handleSubmit} 
                className="px-10 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex items-center gap-2 shadow-lg shadow-green-100 transition-all hover:scale-105"
            >
              <CheckCircle size={18} /> Publish to Library
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
