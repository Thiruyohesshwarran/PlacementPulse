import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Target, Code2, Users, Flame, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDSAStats } from '../../services/dsaService';
import { getInterviewStats } from '../../services/interviewService';

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="card p-6 flex flex-col">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="flex items-center text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-full">
          {trend} <ArrowUpRight className="w-3 h-3 ml-1" />
        </span>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{value}</h2>
    </div>
  </div>
);

const DashboardOverview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dsaStats, setDsaStats] = useState({ totalSolved: 0, weekly: [], streak: 0 });
  const [ivStats, setIvStats] = useState({ total: 0, upcoming: 0, upcomingList: [], avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dsa, iv] = await Promise.all([getDSAStats(), getInterviewStats()]);
        setDsaStats(dsa.data);
        setIvStats(iv.data);
      } catch (e) {
        // silently fail — stats just stay at 0
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back{user?.name ? `, ${user.name}` : ''}. Here's your preparation status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="DSA Solved" value={loading ? '...' : dsaStats.totalSolved} icon={Code2} trend={dsaStats.totalSolved > 0 ? `${dsaStats.totalSolved} total` : null} />
      <StatCard title="Current Streak" value={loading ? '...' : `${dsaStats.streak} Days`} icon={Flame} trend={dsaStats.streak > 0 ? 'Keep it up' : null} />
      <StatCard title="Mock Interviews" value={loading ? '...' : ivStats.total} icon={Users} trend={ivStats.upcoming > 0 ? `${ivStats.upcoming} upcoming` : null} />
      <StatCard title="Avg Interview Rating" value={loading ? '...' : ivStats.avgRating || 'N/A'} icon={Target} trend={ivStats.avgRating > 0 ? `out of 5` : null} />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Activity (DSA)</h3>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dsaStats.weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
                />
                <Area type="monotone" dataKey="solved" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorSolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column / Quick Tasks */}
        <div className="card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Interviews</h3>
          
          <div className="space-y-4 flex-1">
            {loading ? <p className="text-slate-400 text-sm">Loading...</p>
              : ivStats.upcomingList.length === 0
              ? <p className="text-slate-400 text-sm">No upcoming interviews.</p>
              : ivStats.upcomingList.map((iv) => (
              <div key={iv._id} className="flex items-center p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-primary-200 dark:hover:border-primary-900/50 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mr-4">
                  {iv.company[0]}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{iv.company}{iv.role ? ` - ${iv.role}` : ''}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(iv.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
            
            <button onClick={() => navigate('/interviews')} className="w-full mt-4 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors border border-dashed border-primary-200">
               + Schedule Mock Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
