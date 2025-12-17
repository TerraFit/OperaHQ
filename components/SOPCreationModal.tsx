
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { DEPARTMENT_VISUALS } from '../constants';
import { SOPDepartment, SOPCreationMethod, SOPCreationRequest } from '../types';
import { 
  X, ArrowRight, ArrowLeft, BrainCircuit, Users, ExternalLink, PenTool, CheckCircle, 
  Loader2, Wand2, Calendar, FileText
} from 'lucide-react';

interface SOPCreationModalProps {
  onClose: () => void;
  onCreate: (request: SOPCreationRequest) => void;
}

type WizardStep = 'details' | 'method' | 'configure';

export default function SOPCreationModal({ onClose, onCreate }: SOPCreationModalProps) {
  const { user, employees } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState<WizardStep>('details');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<SOPCreationRequest>>({
    title: '',
    department: 'general',
    category: '',
    description: '',
    priority: 'medium',
    deadline: '',
    method: 'internal'
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
  };

  const handleSubmit = () => {
    setIsGenerating(true);
    
    // Simulate API call / AI generation
    setTimeout(() => {
        const newRequest: SOPCreationRequest = {
            id: `req-${Date.now()}`,
            title: formData.title!,
            department: formData.department as SOPDepartment,
            category: formData.category!,
            description: formData.description,
            priority: formData.priority as any,
            deadline: formData.deadline,
            status: formData.method === 'ai_generated' ? 'draft' : 'assigned',
            method: formData.method as SOPCreationMethod,
            assignedBy: user?.id || 'unknown',
            createdAt: new Date().toISOString(),
            progress: formData.method === 'ai_generated' ? 100 : 0,
            aiGenerated: formData.method === 'ai_generated',
            assignedToId: selectedEmployee,
            assignedToName: employees.find(e => e.id === selectedEmployee)?.firstName,
            externalEmail: externalEmail
        };
        
        onCreate(newRequest);
        setIsGenerating(false);
    }, 1500);
  };

  const departmentVisual = DEPARTMENT_VISUALS[formData.department || 'general'];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create New SOP</h2>
            <p className="text-sm text-gray-500">Step {currentStep === 'details' ? '1' : currentStep === 'method' ? '2' : '3'} of 3</p>
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
                  placeholder="e.g. Emergency Evacuation Procedure"
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Briefly describe the purpose and scope..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Priority</label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg bg-white"
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as any})}
                  >
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Deadline</label>
                  <input 
                    type="date" 
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: METHOD */}
          {currentStep === 'method' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">How should this SOP be created?</h3>
              
              <div 
                onClick={() => setFormData({...formData, method: 'ai_generated'})}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-4 hover:shadow-md ${formData.method === 'ai_generated' ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:border-purple-300'}`}
              >
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <BrainCircuit size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">AI Assistant</h4>
                  <p className="text-sm text-gray-500">Generate instantly using AI credits (~2 min)</p>
                </div>
                <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded">1 Credit</span>
              </div>

              <div 
                onClick={() => setFormData({...formData, method: 'internal'})}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-4 hover:shadow-md ${formData.method === 'internal' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Assign Employee</h4>
                  <p className="text-sm text-gray-500">Delegate to internal staff member</p>
                </div>
              </div>

              <div 
                onClick={() => setFormData({...formData, method: 'external'})}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-4 hover:shadow-md ${formData.method === 'external' ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-300'}`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                  <ExternalLink size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">External Contractor</h4>
                  <p className="text-sm text-gray-500">Send to specialist or consultant</p>
                </div>
              </div>

              <div 
                onClick={() => setFormData({...formData, method: 'self'})}
                className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-4 hover:shadow-md ${formData.method === 'self' ? 'border-gray-500 bg-gray-50 ring-1 ring-gray-500' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <PenTool size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900">Write Yourself</h4>
                  <p className="text-sm text-gray-500">Open editor immediately</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIGURE */}
          {currentStep === 'configure' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              
              {/* VISUAL PREVIEW OF REQUEST */}
              <div className="p-4 rounded-lg flex items-center gap-4 border" style={{ background: departmentVisual.bgLight, borderColor: departmentVisual.color }}>
                 <div className="text-2xl">{departmentVisual.icon}</div>
                 <div>
                    <h4 className="font-bold text-gray-900">{formData.title}</h4>
                    <p className="text-xs text-gray-600 uppercase font-bold">{formData.department} • {formData.category}</p>
                 </div>
              </div>

              {/* AI CONFIG */}
              {formData.method === 'ai_generated' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Wand2 size={16} className="text-purple-600" /> AI Instructions
                  </label>
                  <textarea 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none h-32"
                    placeholder="Describe specific procedures, safety checks, and required tone..."
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                  />
                  <div className="mt-2 text-xs text-purple-600 font-medium">✨ 12 Credits Remaining</div>
                </div>
              )}

              {/* INTERNAL ASSIGNMENT */}
              {formData.method === 'internal' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Select Employee</label>
                  <select 
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    value={selectedEmployee}
                    onChange={e => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Select staff member...</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.jobTitle})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* EXTERNAL ASSIGNMENT */}
              {formData.method === 'external' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Contractor Email</label>
                  <input 
                    type="email" 
                    className="w-full p-2.5 border border-gray-300 rounded-lg"
                    placeholder="consultant@company.com"
                    value={externalEmail}
                    onChange={e => setExternalEmail(e.target.value)}
                  />
                </div>
              )}

              {formData.method === 'self' && (
                <div className="text-center py-8 text-gray-500">
                   <FileText size={48} className="mx-auto mb-2 text-gray-300" />
                   <p>Editor will open after creation.</p>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
          {currentStep !== 'details' ? (
            <button onClick={handleBack} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg flex items-center gap-2">
              <ArrowLeft size={18} /> Back
            </button>
          ) : (
            <div></div> // Spacer
          )}

          {currentStep !== 'configure' ? (
            <button onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2">
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button 
                onClick={handleSubmit} 
                disabled={isGenerating}
                className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGenerating ? <><Loader2 className="animate-spin" size={18} /> Processing</> : <><CheckCircle size={18} /> Create SOP</>}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}