
import React, { useContext, useState } from 'react';
import { AppContext } from '../App';
import { UserRole, AuditLog } from '../types';
import { MOCK_AUDIT_LOGS } from '../services/mockData';
import { Shield, Users, Settings, Database, Activity, Lock, Search, AlertTriangle, Key } from 'lucide-react';

export default function AdminPanel() {
  const { employees, user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState<'users' | 'settings' | 'audit' | 'security'>('users');
  const [searchTerm, setSearchTerm] = useState('');

  if (user?.role !== UserRole.SUPER_ADMIN) {
    return <div className="p-8 text-red-600 font-bold">Access Denied: Super Admin Privileges Required</div>;
  }

  const filteredUsers = employees.filter(emp => 
    emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center bg-gray-900 text-white p-6 rounded-xl shadow-lg">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="text-blue-400" /> Super Admin Portal
          </h1>
          <p className="text-gray-400 text-sm mt-1">System Management & Security</p>
        </div>
        <div className="flex gap-4">
           <div className="text-center px-4 border-r border-gray-700">
             <div className="text-2xl font-bold text-blue-400">{employees.length}</div>
             <div className="text-xs text-gray-500 uppercase">Users</div>
           </div>
           <div className="text-center px-4 border-r border-gray-700">
             <div className="text-2xl font-bold text-green-400">100%</div>
             <div className="text-xs text-gray-500 uppercase">Uptime</div>
           </div>
           <div className="text-center px-4">
             <div className="text-2xl font-bold text-yellow-400">{MOCK_AUDIT_LOGS.length}</div>
             <div className="text-xs text-gray-500 uppercase">Logs</div>
           </div>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'settings', label: 'System Settings', icon: Settings },
          { id: 'security', label: 'Security & Access', icon: Lock },
          { id: 'audit', label: 'Audit Logs', icon: Activity },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap
              ${activeTab === tab.id 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm flex items-center gap-2">
              <Users size={18} /> Create New User
            </button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{emp.firstName} {emp.lastName}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                      ${emp.role === UserRole.SUPER_ADMIN ? 'bg-purple-100 text-purple-700' :
                        emp.role === UserRole.GENERAL_MANAGER ? 'bg-indigo-100 text-indigo-700' :
                        emp.role === UserRole.DEPARTMENT_MANAGER ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'}
                    `}>
                      {emp.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{emp.department}</td>
                  <td className="p-4 text-gray-500">{emp.email}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold
                      ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                    `}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-2">Edit</button>
                    <button className="text-red-600 hover:text-red-800 font-medium text-xs px-2">Disable</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Database size={18} /> System Data</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Backup Frequency</span>
                <select className="border-gray-300 rounded text-sm"><option>Daily</option><option>Weekly</option></select>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Data Retention</span>
                <select className="border-gray-300 rounded text-sm"><option>1 Year</option><option>5 Years</option></select>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Trigger Manual Backup</button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Settings size={18} /> Hotel Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hotel Name</label>
                <input type="text" value="Zebra Lodge" className="w-full p-2 border rounded" readOnly />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Default Timezone</label>
                <input type="text" value="Africa/Johannesburg" className="w-full p-2 border rounded" readOnly />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Key size={18} /> Access Control</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                   <h4 className="font-bold text-yellow-800 text-sm mb-2 flex items-center gap-2"><AlertTriangle size={16} /> Emergency Access</h4>
                   <p className="text-xs text-yellow-700 mb-3">Grant temporary super-admin access to designated managers.</p>
                   <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1.5 rounded text-xs font-bold">Generate Token</button>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                   <h4 className="font-bold text-blue-800 text-sm mb-2">Backup Admin</h4>
                   <p className="text-xs text-blue-700 mb-3">2 Backup Admins configured. Last check: Today.</p>
                   <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold">Manage Backups</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MOCK_AUDIT_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-4 font-bold text-gray-700">{log.userId}</td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold border border-gray-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{log.reason} - {log.changes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}