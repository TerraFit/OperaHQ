import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../App';
import { UserRole } from '../types';
import { ComplianceService } from '../services/complianceService';
import { User, Phone, Mail, Shield, Shirt, Briefcase, Camera, Save, X, Edit2, Plane, CalendarCheck, RefreshCw } from 'lucide-react';

const Section = ({ title, children, action }: { title: string, children?: React.ReactNode, action?: React.ReactNode }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">{title}</h3>
      {action}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Field = ({ label, value, icon: Icon }: { label: string, value?: string | number, icon?: any }) => (
  <div className="mb-4 last:mb-0">
    <label className="text-xs text-gray-500 uppercase font-medium flex items-center gap-1 mb-1">
      {Icon && <Icon size={12} />} {label}
    </label>
    <div className="text-gray-900 font-medium break-words">{value || '-'}</div>
  </div>
);

const EditableField = ({ label, value, onChange, icon: Icon }: { label: string, value: string, onChange: (val: string) => void, icon?: any }) => (
  <div className="mb-4 last:mb-0">
    <label className="text-xs text-gray-500 uppercase font-medium flex items-center gap-1 mb-1">
      {Icon && <Icon size={12} />} {label}
    </label>
    <input 
      type="text" 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
    />
  </div>
);

export default function EmployeeProfile() {
  const { user, updateEmployee } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  
  // Camera State
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Edit State
  const [formData, setFormData] = useState({
    photoUrl: '',
    clothingSize: '',
    shoeSize: '',
    uniformSize: ''
  });

  useEffect(() => {
    if (showCamera && stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Error playing video:", e));
    }
  }, [showCamera, stream]);

  if (!user) return <div>Loading...</div>;

  const leaveBalance = ComplianceService.calculateLeaveBalance(user.holidaysEarned, user.holidaysTaken);
  
  // Reverse calc for display purposes only to show the logic
  const approxDaysWorked = Math.round((user.holidaysEarned / 1.7) * 20);

  const startEditing = () => {
    setFormData({
      photoUrl: user.photoUrl || '',
      clothingSize: user.clothingSize || '',
      shoeSize: user.shoeSize || '',
      uniformSize: user.uniformSize || ''
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateEmployee(user.id, formData);
    setIsEditing(false);
  };

  // Camera Functions
  const startCamera = async () => {
    if (!isEditing) return;
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
        });
        setStream(mediaStream);
        setShowCamera(true);
    } catch (err) {
        console.error("Camera error:", err);
        alert("Could not access camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (context) {
            // Flip horizontally for mirror effect if using front camera usually expected
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
            stopCamera();
        }
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in">
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        
        {/* Profile Picture Area */}
        <div 
            className={`relative group ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={startCamera}
            title={isEditing ? "Click to take photo" : ""}
        >
           <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400 border-4 border-white shadow overflow-hidden">
             {isEditing && formData.photoUrl ? (
                <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover transform scale-x-[-1]" />
             ) : user.photoUrl ? (
                <img src={user.photoUrl} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <span>{user.firstName[0]}{user.lastName[0]}</span>
             )}
           </div>
           {isEditing && (
             <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera size={24} />
             </div>
           )}
           {isEditing && !formData.photoUrl && !user.photoUrl && (
             <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 text-white border-2 border-white shadow-sm">
                <Camera size={12} />
             </div>
           )}
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-1 text-gray-500">
             <span className="flex items-center gap-1 text-sm"><Briefcase size={14} /> {user.jobTitle}</span>
             <span className="text-gray-300">•</span>
             <span className="flex items-center gap-1 text-sm"><Shield size={14} /> {user.department}</span>
          </div>
        </div>
        
        <div className="md:ml-auto">
          {isEditing ? (
            <div className="flex gap-2">
               <button onClick={handleSave} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-sm">
                 <Save size={18} /> Save Changes
               </button>
               <button onClick={() => { setIsEditing(false); stopCamera(); }} className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-300">
                 <X size={18} /> Cancel
               </button>
            </div>
          ) : (
            <button onClick={startEditing} className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 shadow-sm transition-colors">
              <Edit2 size={18} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
           <Section title="Personal Information">
              <div className="grid grid-cols-2 gap-4">
                 <Field label="Employee ID" value={user.id} />
                 <Field label="Start Date" value={user.dateStarted} />
                 <Field label="ID Number" value={user.idNumber} />
                 <Field label="Birthday" value={user.birthday} />
                 <Field label="Phone" value={user.phone} icon={Phone} />
                 <Field label="Email" value={user.email} icon={Mail} />
              </div>
              {user.privateAddress && (
                 <div className="mt-4 pt-4 border-t border-gray-100">
                    <Field label="Private Address" value={user.privateAddress} />
                 </div>
              )}
           </Section>

           <Section title="Leave & Accruals">
             <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                   <div className="text-xl font-bold text-blue-700">{user.holidaysEarned.toFixed(2)}</div>
                   <div className="text-[10px] text-blue-600 font-bold uppercase mt-1">Earned</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                   <div className="text-xl font-bold text-gray-700">{user.holidaysTaken.toFixed(2)}</div>
                   <div className="text-[10px] text-gray-600 font-bold uppercase mt-1">Taken</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
                   <div className="text-xl font-bold text-green-700">{leaveBalance.toFixed(2)}</div>
                   <div className="text-[10px] text-green-600 font-bold uppercase mt-1">Balance</div>
                </div>
             </div>
             
             <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
               <CalendarCheck size={14} className="mt-0.5" />
               <div>
                 <span className="font-bold">Accrual Rule:</span> 1.7 days leave for every 20 days worked.
                 <br />
                 Current total based on approx <span className="font-medium text-gray-900">{approxDaysWorked}</span> days worked.
               </div>
             </div>
           </Section>

           {isEditing && (
             <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="block text-xs font-bold text-blue-800 uppercase mb-2">Update Profile Photo URL</label>
                <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                      className="w-full p-2 border border-blue-200 rounded text-sm"
                      placeholder="https:// or data:image/..."
                    />
                    <button 
                        onClick={startCamera} 
                        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                        title="Use Camera"
                    >
                        <Camera size={18} />
                    </button>
                </div>
             </div>
           )}
        </div>

        <div className="space-y-6">
          <Section title="Uniform & Sizes" action={isEditing && <span className="text-xs text-blue-600 font-bold">EDITING</span>}>
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <EditableField label="Clothing" value={formData.clothingSize} onChange={v => setFormData({...formData, clothingSize: v})} icon={Shirt} />
                 <EditableField label="Shoe" value={formData.shoeSize} onChange={v => setFormData({...formData, shoeSize: v})} />
                 <EditableField label="Uniform" value={formData.uniformSize} onChange={v => setFormData({...formData, uniformSize: v})} />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                 <Field label="Clothing" value={user.clothingSize} icon={Shirt} />
                 <Field label="Shoe" value={user.shoeSize} />
                 <Field label="Uniform" value={user.uniformSize} />
              </div>
            )}
          </Section>

          <Section title="Emergency Contact">
            <Field label="Name" value={user.emergencyContactName} />
            <Field label="Phone" value={user.emergencyContactPhone} icon={Phone} />
          </Section>

          <Section title="Performance Stats">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded border border-green-100 text-center">
                   <div className="text-2xl font-bold text-green-700">{user.praises}</div>
                   <div className="text-xs text-green-600 font-medium uppercase">Praises</div>
                </div>
                <div className="p-3 bg-red-50 rounded border border-red-100 text-center">
                   <div className="text-2xl font-bold text-red-700">{user.warnings}</div>
                   <div className="text-xs text-red-600 font-medium uppercase">Warnings</div>
                </div>
             </div>
          </Section>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl w-full max-w-lg">
             <div className="relative aspect-video bg-black">
               <video 
                 ref={videoRef} 
                 autoPlay 
                 playsInline 
                 muted 
                 className="w-full h-full object-cover transform scale-x-[-1]" 
               />
               <canvas ref={canvasRef} className="hidden" />
             </div>
             
             <div className="p-6 flex flex-col gap-4 bg-white">
                <div className="text-center">
                   <h3 className="font-bold text-gray-900">Take Profile Photo</h3>
                   <p className="text-sm text-gray-500">Ensure good lighting and face the camera.</p>
                </div>
                
                <div className="flex gap-3 mt-2">
                   <button 
                     onClick={capturePhoto} 
                     className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                   >
                     <Camera size={20} /> Capture
                   </button>
                   <button 
                     onClick={stopCamera} 
                     className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-bold"
                   >
                     Cancel
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}