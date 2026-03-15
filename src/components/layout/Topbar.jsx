import { Bell, Search, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Topbar = () => {
    const { user, logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className="h-16 bg-white dark:bg-dark-paper border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20">
            {/* Search or Quick Info */}
            <div className="flex-1 flex items-center">
                <div className="relative w-64 hidden sm:block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-4 h-4 text-slate-400" />
                    </span>
                    <input type="text" className="input-field pl-10 h-10 py-0" placeholder="Search..." />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-paper border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg py-1">
                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                            </div>
                            <a href="#profile" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                                <UserIcon className="w-4 h-4 mr-2" /> Profile
                            </a>
                            <a href="#settings" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                                <Settings className="w-4 h-4 mr-2" /> Settings
                            </a>
                            <button 
                                onClick={logout}
                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
