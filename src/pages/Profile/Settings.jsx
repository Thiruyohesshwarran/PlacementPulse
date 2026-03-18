import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Moon, Sun, Monitor, Bell, Lock, User as UserIcon } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const [theme, setTheme] = useState('system'); // 'light', 'dark', 'system'

    // Mock toggle function for Theme - in a real app this controls the HTML element class
    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else if (newTheme === 'light') {
            document.documentElement.classList.remove('dark');
        } else {
            // System matching logic
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
                <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Side Navigation for settings */}
                <div className="space-y-1 hidden md:block">
                    <button className="w-full flex items-center px-4 py-2.5 bg-primary-50 dark:bg-primary-900/20 text-primary-600 text-sm font-medium rounded-lg">
                        <UserIcon className="w-4 h-4 mr-3" /> Profile
                    </button>
                    <button className="w-full flex items-center px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium rounded-lg transition-colors">
                        <Lock className="w-4 h-4 mr-3" /> Security
                    </button>
                    <button className="w-full flex items-center px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium rounded-lg transition-colors">
                        <Bell className="w-4 h-4 mr-3" /> Notifications
                    </button>
                </div>

                <div className="md:col-span-3 space-y-8">
                    {/* Basic Info */}
                    <div className="card p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>
                        
                        <div className="flex items-center space-x-6 mb-8">
                             <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-3xl">
                                 {user?.name?.[0] || 'U'}
                             </div>
                             <div>
                                 <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                     Change Avatar
                                 </button>
                             </div>
                        </div>

                        <form className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input type="text" className="input-field" defaultValue={user?.name || ''} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                    <input type="email" disabled className="input-field bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed text-slate-500" defaultValue={user?.email || ''} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College</label>
                                <input type="text" className="input-field" defaultValue={user?.college || 'Test College'} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Role</label>
                                <input type="text" className="input-field" defaultValue={user?.targetRole || 'Software Development Engineer'} />
                            </div>
                            <div className="pt-4">
                                <button type="button" className="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>

                    {/* Appearance */}
                    <div className="card p-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Appearance</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <button 
                                onClick={() => toggleTheme('light')}
                                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${theme === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'}`}
                            >
                                <Sun className="w-6 h-6 mb-2" />
                                <span className="text-sm font-medium">Light</span>
                            </button>
                            <button 
                                onClick={() => toggleTheme('dark')}
                                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${theme === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'}`}
                            >
                                <Moon className="w-6 h-6 mb-2" />
                                <span className="text-sm font-medium">Dark</span>
                            </button>
                            <button 
                                onClick={() => toggleTheme('system')}
                                className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${theme === 'system' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-600' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'}`}
                            >
                                <Monitor className="w-6 h-6 mb-2" />
                                <span className="text-sm font-medium">System</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
