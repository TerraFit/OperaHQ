
import React, { useContext, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Clock, 
  BookOpenCheck, 
  User, 
  LogOut,
  ShieldAlert,
  CalendarRange,
  ClipboardList,
  BedDouble,
  Users,
  Wrench,
  MoreHorizontal,
  X,
  Flame,
  Shield
} from 'lucide-react';

export default function Layout() {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMore, setShowMobileMore] = useState(false);

  const handleLogout = () => {
    setUser(null as any);
    navigate('/login');
  };

  if (!user) return null;

  const isSupervisorOrAbove = [
    UserRole.SUPER_ADMIN, 
    UserRole.GENERAL_MANAGER, 
    UserRole.DEPARTMENT_MANAGER, 
    UserRole.SUPERVISOR
  ].includes(user.role);

  // Navigation Items Config
  const sidebarItems = [
    { to: "/admin", icon: Shield, label: "Admin Panel", requiredRole: UserRole.SUPER_ADMIN },
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/planning", icon: CalendarRange, label: "Planning", requiredRole: 'supervisor_plus' },
    { to: "/shift", icon: Users, label: "Shift" },
    { to: "/time-clock", icon: Clock, label: "Time Clock" },
    { to: "/housekeeping", icon: BedDouble, label: "Housekeeping" },
    { to: "/maintenance", icon: Wrench, label: "Maintenance" },
    { to: "/gas-management", icon: Flame, label: "Gas Tanks" }, 
    { to: "/sops", icon: BookOpenCheck, label: "SOPs" },
    { to: "/my-profile", icon: User, label: "My Profile" },
  ];

  const filteredSidebarItems = sidebarItems.filter(item => {
    if (item.requiredRole === UserRole.SUPER_ADMIN) return user.role === UserRole.SUPER_ADMIN;
    if (item.requiredRole === 'supervisor_plus') return isSupervisorOrAbove;
    return true;
  });

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const MobileNavItem = ({ to, icon: Icon, label, onClick }: { to?: string, icon: any, label: string, onClick?: () => void }) => {
    const active = to ? isActive(to) : false;
    return (
      <button 
        onClick={() => {
          if (onClick) onClick();
          else if (to) {
            navigate(to);
            setShowMobileMore(false);
          }
        }}
        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-full ${
          active ? 'text-blue-400 bg-gray-800' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Icon size={24} />
        <span className="text-[10px] mt-1 font-medium truncate w-full text-center">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pb-20 md:pb-0 md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 text-white fixed h-full z-20">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldAlert className="text-blue-500" />
            OperaHQ
          </h1>
          <p className="text-xs text-gray-500 mt-1">v1.0.0 • {user.role.replace('_', ' ').toUpperCase()}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredSidebarItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              className={({isActive}) => `flex items-center gap-3 p-3 rounded transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
            >
              <item.icon size={20} /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500 truncate">{user.jobTitle}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 p-2 rounded text-sm text-gray-300 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation - Sticky */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 px-2 pb-safe pt-2">
        <div className="flex justify-between items-end">
          <MobileNavItem to="/dashboard" icon={LayoutDashboard} label="Home" />
          <MobileNavItem to="/shift" icon={Users} label="Shift" />
          <MobileNavItem to="/time-clock" icon={Clock} label="Clock" />
          <MobileNavItem to="/housekeeping" icon={BedDouble} label="Rooms" />
          <MobileNavItem 
            icon={MoreHorizontal} 
            label="More" 
            onClick={() => setShowMobileMore(!showMobileMore)} 
          />
        </div>
      </nav>

      {/* Mobile More Menu Overlay */}
      {showMobileMore && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileMore(false)}>
          <div 
            className="absolute bottom-20 left-4 right-4 bg-gray-900 rounded-xl p-4 shadow-2xl border border-gray-800 animate-in slide-in-from-bottom-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
              <h3 className="text-gray-400 font-bold text-xs uppercase tracking-wider">More Modules</h3>
              <button onClick={() => setShowMobileMore(false)} className="text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              {user.role === UserRole.SUPER_ADMIN && (
                <MobileNavItem to="/admin" icon={Shield} label="Admin" />
              )}
              {isSupervisorOrAbove && (
                <MobileNavItem to="/planning" icon={CalendarRange} label="Planning" />
              )}
              <MobileNavItem to="/maintenance" icon={Wrench} label="Maint." />
              <MobileNavItem to="/gas-management" icon={Flame} label="Gas" />
              <MobileNavItem to="/sops" icon={BookOpenCheck} label="SOPs" />
              <MobileNavItem to="/my-profile" icon={User} label="Profile" />
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
               <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-400 font-bold py-2 rounded hover:bg-gray-800">
                 <LogOut size={18} /> Sign Out
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}