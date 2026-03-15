import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code2, Users, Building2, BarChart2, MessageSquare, Settings, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'DSA Tracker', path: '/dsa', icon: Code2 },
        { name: 'Mock Interviews', path: '/interviews', icon: Users },
        { name: 'Company Prep', path: '/companies', icon: Building2 },
        { name: 'Insights', path: '/insights', icon: BarChart2 },
        { name: 'Community', path: '/community', icon: MessageSquare },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className={`${collapsed ? 'w-20' : 'w-64'} h-screen bg-white dark:bg-dark-paper border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col sticky top-0 md:relative z-30`}>
            {/* Logo Area */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                {!collapsed && (
                    <div className="flex items-center space-x-2 text-primary-600">
                        <Activity className="w-6 h-6" />
                        <span className="text-xl font-bold font-sans tracking-tight">PlacementPulse</span>
                    </div>
                )}
                {collapsed && (
                    <div className="flex items-center justify-center w-full text-primary-600">
                        <Activity className="w-6 h-6" />
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button 
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 shadow-sm text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center rounded-lg px-3 py-2.5 transition-colors
                                ${isActive ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}
                            `}
                        >
                            <Icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                            {!collapsed && <span className="font-medium text-sm">{item.name}</span>}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
