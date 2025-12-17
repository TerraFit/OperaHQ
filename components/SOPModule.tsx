
import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../App';
import { MOCK_SOPS, MOCK_SOP_ATTEMPTS } from '../services/mockData';
import { SOPService } from '../services/sopService';
import { SOP, SOPAttempt } from '../types';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  PlayCircle, 
  BookOpen, 
  Clock, 
  ChevronRight, 
  Award,
  Lock,
  Eye,
  FileText
} from 'lucide-react';

interface SOPCardProps {
  sop: SOP;
  statusConfig: { status: string; label: string; color: string; bg: string };
  onClick: (sop: SOP) => void;
}

const SOPCard: React.FC<SOPCardProps> = ({ sop, statusConfig, onClick }) => {
  const { status, label, color, bg } = statusConfig;
  return (
      <div 
        onClick={() => onClick(sop)}
        className={`p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-blue-300 bg-white relative overflow-hidden`}
      >
          <div className={`absolute top-0 left-0 w-1.5 h-full ${status === 'certified' ? 'bg-green-500' : status === 'failed' ? 'bg-red-500' : 'bg-gray-300'}`}></div>
          
          <div className="flex justify-between items-start mb-2 pl-3">
              <div>
                  <span className="text-xs font-mono text-gray-400 font-bold">{sop.code}</span>
                  <h3 className="font-bold text-gray-900 leading-tight mb-1">{sop.title}</h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {sop.department}
                  </span>
              </div>
              <div className={`p-1.5 rounded-full ${bg} ${color}`}>
                  {status === 'certified' ? <CheckCircle size={18} /> : 
                   status === 'failed' ? <XCircle size={18} /> : 
                   <AlertCircle size={18} />}
              </div>
          </div>
          
          <div className="flex justify-between items-end mt-4 pl-3">
              <div className="text-xs font-medium text-gray-500">{label}</div>
              <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                  Open <ChevronRight size={12} />
              </button>
          </div>
      </div>
  );
};

export default function SOPModule() {
  const { user } = useContext(AppContext);
  const [attempts, setAttempts] = useState<SOPAttempt[]>(MOCK_SOP_ATTEMPTS);
  const [selectedSOP, setSelectedSOP] = useState<SOP | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'reading' | 'testing'>('list');
  const [filterDept, setFilterDept] = useState('all');

  // --- READING STATE ---
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReadingComplete, setIsReadingComplete] = useState(false);

  // --- TESTING STATE ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testResult, setTestResult] = useState<{passed: boolean, score: number} | null>(null);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (viewMode === 'reading') {
        interval = setInterval(() => setReadingTime(prev => prev + 1), 1000);
    } else if (viewMode === 'testing' && timeLeft > 0 && !testResult) {
        interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [viewMode, timeLeft, testResult]);

  // Derived Data
  const userAttempts = attempts.filter(a => a.userId === user?.id);
  const filteredSOPs = MOCK_SOPS.filter(s => filterDept === 'all' || s.department === filterDept || s.department === 'all');

  // --- ACTIONS ---

  const handleOpenSOP = (sop: SOP) => {
      setSelectedSOP(sop);
      setReadingTime(0);
      setScrollProgress(0);
      setIsReadingComplete(false);
      setViewMode('reading');
  };

  const handleStartTest = () => {
      if (!selectedSOP) return;
      
      const lastAttempt = userAttempts.find(a => a.sopId === selectedSOP.id);
      const eligibility = SOPService.checkEligibility(selectedSOP, lastAttempt);

      if (!eligibility.eligible) {
          alert(`You are not eligible to take this test yet.\n\nPlease wait ${eligibility.daysRemaining} more days (4-week minimum interval).`);
          return;
      }

      setAnswers({});
      setCurrentQuestion(0);
      setTimeLeft(selectedSOP.timeLimitMinutes * 60);
      setTestResult(null);
      setViewMode('testing');
  };

  const handleSubmitTest = () => {
      if (!selectedSOP || !user) return;

      const result = SOPService.gradeTest(selectedSOP, answers);
      setTestResult(result);

      // Save Attempt
      const newAttempt: SOPAttempt = {
          id: `att-${Date.now()}`,
          sopId: selectedSOP.id,
          sopCode: selectedSOP.code,
          userId: user.id,
          score: result.score,
          passed: result.passed,
          timestamp: new Date().toISOString(),
          testDurationSeconds: (selectedSOP.timeLimitMinutes * 60) - timeLeft,
          validUntil: result.passed ? SOPService.calculateValidityDate() : '',
          nextEligibleDate: SOPService.calculateNextEligibleDate()
      };

      setAttempts([...attempts, newAttempt]);
  };

  const handleClose = () => {
      setSelectedSOP(null);
      setViewMode('list');
      setTestResult(null);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const element = e.currentTarget;
      const progress = Math.round((element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100);
      setScrollProgress(progress);
      if (progress > 90) setIsReadingComplete(true);
  };

  const getStatus = (sopId: string) => {
      const attempt = userAttempts.find(a => a.sopId === sopId);
      if (!attempt) return { status: 'not_started', label: 'Not Started', color: 'text-gray-400', bg: 'bg-gray-100' };
      if (!attempt.passed) return { status: 'failed', label: 'Failed', color: 'text-red-600', bg: 'bg-red-50' };
      
      const isValid = new Date(attempt.validUntil) > new Date();
      if (!isValid) return { status: 'expired', label: 'Expired', color: 'text-orange-600', bg: 'bg-orange-50' };
      
      return { status: 'certified', label: 'Certified', color: 'text-green-600', bg: 'bg-green-50' };
  };

  // --- RENDER ---

  if (viewMode === 'reading' && selectedSOP) {
      return (
          <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
                  {/* Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                              <BookOpen className="text-blue-600" /> {selectedSOP.title}
                          </h2>
                          <div className="text-sm text-gray-500 flex items-center gap-3">
                              <span>{selectedSOP.code}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock size={14} /> {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')} reading</span>
                          </div>
                      </div>
                      <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">×</button>
                  </div>

                  {/* Content with Scroll Tracking */}
                  <div className="flex-1 overflow-y-auto p-8 relative" onScroll={handleScroll}>
                      <div className="prose max-w-none">
                          <h1>{selectedSOP.title}</h1>
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                              <p className="font-bold text-blue-900">Summary</p>
                              <p className="text-blue-800 text-sm">Standard Operating Procedure for {selectedSOP.department}. Compliance is mandatory.</p>
                          </div>
                          
                          {/* Mock Content Generation */}
                          <div dangerouslySetInnerHTML={{ __html: selectedSOP.contentHtml }} />
                          <div className="space-y-4 text-gray-600">
                              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                              <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
                              <div className="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400 font-bold border-2 border-dashed border-gray-200">
                                  Diagram / Video Placeholder
                              </div>
                              <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
                              <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
                          </div>
                      </div>
                  </div>

                  {/* Footer with Progress & Actions */}
                  <div className="border-t border-gray-200 p-4 bg-white flex justify-between items-center">
                      <div className="flex items-center gap-4 flex-1">
                          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${scrollProgress}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-gray-500">{scrollProgress}% Read</span>
                      </div>
                      
                      <div className="flex gap-3">
                          <button onClick={handleClose} className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50">
                              Close
                          </button>
                          <button 
                              onClick={handleStartTest}
                              disabled={!isReadingComplete}
                              className={`px-6 py-2 rounded-lg font-bold text-white flex items-center gap-2 shadow-sm transition-all
                                  ${isReadingComplete ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}
                              `}
                          >
                              {isReadingComplete ? <><PlayCircle size={18} /> Take Test</> : <><Lock size={18} /> Finish Reading</>}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  if (viewMode === 'testing' && selectedSOP) {
      return (
          <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                  {/* Test Header */}
                  <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
                      <div>
                          <h2 className="text-xl font-bold">{selectedSOP.title} Assessment</h2>
                          <p className="text-blue-100 text-sm">Pass Mark: {selectedSOP.passingScore}% • Strict Enforcement</p>
                      </div>
                      <div className={`text-2xl font-mono font-bold px-3 py-1 rounded bg-black/20 ${timeLeft < 60 ? 'text-red-300 animate-pulse' : ''}`}>
                          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </div>
                  </div>

                  {/* Result View */}
                  {testResult ? (
                      <div className="p-10 text-center flex flex-col items-center justify-center flex-1">
                          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${testResult.passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {testResult.passed ? <Award size={48} /> : <XCircle size={48} />}
                          </div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">{testResult.passed ? 'Certified!' : 'Test Failed'}</h3>
                          <div className="text-xl font-medium text-gray-600 mb-8">
                              Score: <span className={testResult.passed ? 'text-green-600' : 'text-red-600'}>{testResult.score}%</span>
                          </div>
                          
                          {testResult.passed ? (
                              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-green-800 text-sm max-w-md mb-8">
                                  Congratulations. Your certification is valid for 12 months.
                              </div>
                          ) : (
                              <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-800 text-sm max-w-md mb-8">
                                  You did not meet the 100% requirement. Please review the SOP and try again in 4 weeks.
                              </div>
                          )}

                          <button onClick={handleClose} className="bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-colors">
                              Return to Dashboard
                          </button>
                      </div>
                  ) : (
                      /* Question View */
                      <div className="p-8 flex-1 overflow-y-auto">
                          {selectedSOP.questions.length > 0 ? (
                              <div className="max-w-2xl mx-auto">
                                  <div className="mb-6 flex justify-between items-center text-sm font-bold text-gray-400 uppercase">
                                      <span>Question {currentQuestion + 1} of {selectedSOP.questions.length}</span>
                                  </div>
                                  
                                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                                      {selectedSOP.questions[currentQuestion].question}
                                  </h3>

                                  <div className="space-y-3">
                                      {selectedSOP.questions[currentQuestion].options.map((opt, idx) => (
                                          <button
                                              key={idx}
                                              onClick={() => setAnswers({...answers, [currentQuestion]: idx})}
                                              className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center gap-3
                                                  ${answers[currentQuestion] === idx 
                                                      ? 'border-blue-500 bg-blue-50 text-blue-800' 
                                                      : 'border-gray-200 hover:border-gray-300 text-gray-700'}
                                              `}
                                          >
                                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                                                  ${answers[currentQuestion] === idx ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'}
                                              `}>
                                                  {answers[currentQuestion] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                                              </div>
                                              {opt}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          ) : (
                              <div className="text-center text-gray-500 mt-10">
                                  No questions available for this demo SOP. Auto-pass enabled.
                              </div>
                          )}
                      </div>
                  )}

                  {/* Test Footer */}
                  {!testResult && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
                          <button 
                              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                              disabled={currentQuestion === 0}
                              className="px-4 py-2 text-gray-600 font-bold hover:text-gray-900 disabled:opacity-50"
                          >
                              Back
                          </button>
                          
                          {currentQuestion === selectedSOP.questions.length - 1 || selectedSOP.questions.length === 0 ? (
                              <button 
                                  onClick={handleSubmitTest}
                                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 shadow-sm"
                              >
                                  Submit Assessment
                              </button>
                          ) : (
                              <button 
                                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-sm"
                              >
                                  Next Question
                              </button>
                          )}
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="text-blue-600" /> Standard Operating Procedures
                </h2>
                <p className="text-gray-500 text-sm mt-1">Compliance Library • {userAttempts.filter(a => a.passed).length} of {MOCK_SOPS.length} Certified</p>
            </div>
            
            <div className="flex items-center gap-3">
                <select 
                    value={filterDept} 
                    onChange={e => setFilterDept(e.target.value)}
                    className="bg-gray-100 border border-gray-200 text-gray-700 text-sm rounded-lg p-2.5 font-bold focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="all">All Departments</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="grounds">Grounds</option>
                    <option value="front_desk">Front Desk</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSOPs.map(sop => (
                <SOPCard 
                    key={sop.id} 
                    sop={sop} 
                    statusConfig={getStatus(sop.id)}
                    onClick={handleOpenSOP}
                />
            ))}
        </div>
    </div>
  );
}
