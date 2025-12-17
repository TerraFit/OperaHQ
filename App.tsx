
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';
import TimeClock from './components/TimeClock';
import SOPModule from './components/SOPModule';
import EmployeeProfile from './components/EmployeeProfile';
import MonthlyPlanning from './components/MonthlyPlanning';
import MaintenanceModule from './components/MaintenanceModule';
import RoomAttendantModule from './components/RoomAttendantModule'; // NEW IMPORT
import { MOCK_EMPLOYEES, MOCK_SHIFTS } from './services/mockData';
import { Employee, UserRole, Shift } from './types';

// Global Context with Employee & Shift CRUD capabilities
export const AppContext = React.createContext<{
  user: Employee | null;
  setUser: (u: Employee) => void;
  employees: Employee[];
  setEmployees: (e: Employee[]) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  shifts: Shift[];
  setShifts: (s: Shift[]) => void;
  mockTime: Date;
}>({
  user: null,
  setUser: () => {},
  employees: [],
  setEmployees: () => {},
  updateEmployee: () => {},
  shifts: [],
  setShifts: () => {},
  mockTime: new Date()
});

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = React.useContext(AppContext);
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="p-8 text-red-600 font-bold">Access Denied: Insufficient Permissions</div>;
  }
  return <>{children}</>;
};

const LoginScreen = () => {
  const { setUser, employees } = React.useContext(AppContext);
  const [selectedRole, setSelectedRole] = useState<string>('');

  // Initialize selected role when employees are loaded
  useEffect(() => {
    if (employees.length > 0 && !selectedRole) {
      setSelectedRole(employees[0].id);
    }
  }, [employees, selectedRole]);

  const handleLogin = () => {
    const user = employees.find(e => e.id === selectedRole);
    if (user) setUser(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96 border border-gray-700">
        <h1 className="text-3xl font-bold mb-2 tracking-tight text-white">OperaHQ</h1>
        <p className="text-gray-400 mb-6 text-sm">Zebra Lodge Workforce Management</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase text-gray-500 mb-1">Select User (Demo)</label>
            <select 
              className="w-full bg-gray-700 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-blue-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.role})
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition-colors"
          >
            Authenticate
          </button>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-xs text-gray-500 text-center">
          Restricted Access System. All actions audited.
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [shifts, setShifts] = useState<Shift[]>(MOCK_SHIFTS);
  
  // Simulation of "Current Time" for demo purposes
  const [mockTime, setMockTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setMockTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    // If the updated employee is the current user, update the user state as well
    if (user && user.id === id) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AppContext.Provider value={{ user, setUser, employees, setEmployees, updateEmployee, shifts, setShifts, mockTime }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginScreen />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Planning - Supervisor+ */}
            <Route path="planning" element={
              <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR, UserRole.MANAGER, UserRole.ADMIN]}>
                <MonthlyPlanning />
              </ProtectedRoute>
            } />
            
            <Route path="shift" element={<Schedule />} />
            <Route path="time-clock" element={<TimeClock />} />
            <Route path="housekeeping" element={<RoomAttendantModule />} />
            <Route path="maintenance" element={<MaintenanceModule />} />
            <Route path="sops" element={<SOPModule />} />
            <Route path="my-profile" element={<EmployeeProfile />} />
            
            {/* Redirect old routes for safety */}
            <Route path="schedule" element={<Navigate to="/shift" replace />} />
            <Route path="clock" element={<Navigate to="/time-clock" replace />} />
            <Route path="profile" element={<Navigate to="/my-profile" replace />} />
            
            <Route path="profile/:id" element={
              <ProtectedRoute allowedRoles={[UserRole.MANAGER, UserRole.ADMIN]}>
                <EmployeeProfile />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
}
