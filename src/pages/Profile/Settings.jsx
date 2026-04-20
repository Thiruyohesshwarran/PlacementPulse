import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContextState';
import { Bell, Lock, User as UserIcon } from 'lucide-react';

const toMinutes = (time) => {
    const [hour, minute] = String(time || '00:00').split(':').map(Number);
    return (hour * 60) + minute;
};

const isQuietHoursActiveNow = (start, end, now) => {
    const startMinutes = toMinutes(start);
    const endMinutes = toMinutes(end);

    if (startMinutes === endMinutes) {
        return false;
    }

    if (startMinutes < endMinutes) {
        return now >= startMinutes && now < endMinutes;
    }

    // Overnight window, for example 22:00 -> 07:00.
    return now >= startMinutes || now < endMinutes;
};

const Settings = () => {
    const { user, updateProfile, changePassword } = useAuth();
    const [activeSection, setActiveSection] = useState('profile');
    const [form, setForm] = useState(() => ({
        name: user?.name || '',
        college: user?.college || '',
        targetRole: user?.targetRole || '',
    }));
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const hasPassword = Boolean(user?.hasPassword);

    const [quietHours, setQuietHours] = useState(() => {
        if (typeof window === 'undefined') {
            return { enabled: false, start: '22:00', end: '07:00' };
        }

        const raw = window.localStorage.getItem('quietHours');
        if (!raw) {
            return { enabled: false, start: '22:00', end: '07:00' };
        }

        try {
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'object' && parsed) {
                return {
                    enabled: Boolean(parsed.enabled),
                    start: parsed.start || '22:00',
                    end: parsed.end || '07:00',
                };
            }
        } catch {
            window.localStorage.removeItem('quietHours');
        }

        return { enabled: false, start: '22:00', end: '07:00' };
    });
    const [quietStatus, setQuietStatus] = useState({ type: '', message: '' });
    const [nowMinutes, setNowMinutes] = useState(0);

    useEffect(() => {
        const updateNowMinutes = () => {
            const now = new Date();
            setNowMinutes((now.getHours() * 60) + now.getMinutes());
        };

        updateNowMinutes();
        const interval = window.setInterval(updateNowMinutes, 60 * 1000);
        return () => window.clearInterval(interval);
    }, []);

    const hasInvalidQuietRange = quietHours.start === quietHours.end;
    const quietActiveNow = quietHours.enabled && !hasInvalidQuietRange && isQuietHoursActiveNow(quietHours.start, quietHours.end, nowMinutes);

    const onChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const onPasswordChange = (field) => (e) => {
        setPasswordForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setStatus({ type: '', message: '' });

        const result = await updateProfile({
            name: form.name.trim(),
            college: form.college.trim(),
            targetRole: form.targetRole.trim(),
        });

        if (result.success) {
            setStatus({ type: 'success', message: 'Profile updated successfully.' });
        } else {
            setStatus({ type: 'error', message: result.message });
        }

        setSaving(false);
    };

    const onPasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordStatus({ type: '', message: '' });

        if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
            setPasswordStatus({ type: 'error', message: 'New password and confirmation are required.' });
            return;
        }

        if (hasPassword && !passwordForm.currentPassword) {
            setPasswordStatus({ type: 'error', message: 'All password fields are required.' });
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
            return;
        }

        setChangingPassword(true);
        const result = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);

        if (result.success) {
            setPasswordStatus({ type: 'success', message: result.message });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setPasswordStatus({ type: 'error', message: result.message });
        }

        setChangingPassword(false);
    };

    const onQuietHoursSave = () => {
        if (hasInvalidQuietRange) {
            setQuietStatus({ type: 'error', message: 'Start and end time cannot be the same.' });
            return;
        }

        localStorage.setItem('quietHours', JSON.stringify(quietHours));
        setQuietStatus({ type: 'success', message: 'Quiet hours saved.' });
        setTimeout(() => setQuietStatus({ type: '', message: '' }), 2000);
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
                    <button
                        type="button"
                        onClick={() => setActiveSection('profile')}
                        className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            activeSection === 'profile'
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <UserIcon className="w-4 h-4 mr-3" /> Profile
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('security')}
                        className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            activeSection === 'security'
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Lock className="w-4 h-4 mr-3" /> Security
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('notifications')}
                        className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                            activeSection === 'notifications'
                                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                    >
                        <Bell className="w-4 h-4 mr-3" /> Notifications
                    </button>
                </div>

                <div className="md:col-span-3 space-y-8">
                    {activeSection === 'profile' && (
                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Information</h2>

                            <div className="flex items-center space-x-6 mb-8">
                                <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-100 ring-1 ring-primary-200/60 dark:ring-primary-500/30 flex items-center justify-center font-bold text-3xl">
                                    {user?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        Change Avatar
                                    </button>
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={onSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                        <input type="text" className="input-field" value={form.name} onChange={onChange('name')} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                        <input type="email" disabled className="input-field bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed text-slate-500" defaultValue={user?.email || ''} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">College</label>
                                    <input type="text" className="input-field" value={form.college} onChange={onChange('college')} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Target Role</label>
                                    <input type="text" className="input-field" value={form.targetRole} onChange={onChange('targetRole')} />
                                </div>
                                {status.message && (
                                    <div className={`text-sm ${status.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {status.message}
                                    </div>
                                )}
                                <div className="pt-4">
                                    <button type="submit" className="btn-primary" disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Security</h2>
                            <p className="text-sm text-slate-500 mb-6">
                                {hasPassword
                                    ? 'Update your account password.'
                                    : 'Set a local password so you can also sign in without Google.'}
                            </p>

                            <form className="space-y-4" onSubmit={onPasswordSubmit}>
                                {hasPassword && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                                        <input
                                            type="password"
                                            className="input-field"
                                            value={passwordForm.currentPassword}
                                            onChange={onPasswordChange('currentPassword')}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        {hasPassword ? 'New Password' : 'Create Password'}
                                    </label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={passwordForm.newPassword}
                                        onChange={onPasswordChange('newPassword')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        {hasPassword ? 'Confirm New Password' : 'Confirm Password'}
                                    </label>
                                    <input
                                        type="password"
                                        className="input-field"
                                        value={passwordForm.confirmPassword}
                                        onChange={onPasswordChange('confirmPassword')}
                                    />
                                </div>
                                {passwordStatus.message && (
                                    <div className={`text-sm ${passwordStatus.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {passwordStatus.message}
                                    </div>
                                )}
                                <div className="pt-2">
                                    <button type="submit" className="btn-primary" disabled={changingPassword}>
                                        {changingPassword ? 'Updating...' : 'Change Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="card p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Notifications</h2>
                            <p className="text-sm text-slate-500 mb-6">Set quiet hours to pause non-critical alerts.</p>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${quietActiveNow ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'}`}>
                                        {quietActiveNow ? 'Active now' : 'Not active'}
                                    </span>
                                </div>

                                <label className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Quiet Hours</span>
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={quietHours.enabled}
                                            onChange={(e) => setQuietHours((prev) => ({ ...prev, enabled: e.target.checked }))}
                                        />
                                        <div className="w-11 h-6 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors peer-checked:bg-primary-600" />
                                        <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                                    </div>
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            className="input-field"
                                            value={quietHours.start}
                                            onChange={(e) => setQuietHours((prev) => ({ ...prev, start: e.target.value }))}
                                            disabled={!quietHours.enabled}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            className="input-field"
                                            value={quietHours.end}
                                            onChange={(e) => setQuietHours((prev) => ({ ...prev, end: e.target.value }))}
                                            disabled={!quietHours.enabled}
                                        />
                                    </div>
                                </div>
                                {quietHours.enabled && hasInvalidQuietRange && (
                                    <div className="text-sm text-red-600">
                                        Start and end time cannot be the same.
                                    </div>
                                )}
                                {quietStatus.message && (
                                    <div className={`text-sm ${quietStatus.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {quietStatus.message}
                                    </div>
                                )}
                                <div className="pt-2">
                                    <button type="button" className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed" onClick={onQuietHoursSave} disabled={quietHours.enabled && hasInvalidQuietRange}>
                                        Save Quiet Hours
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
