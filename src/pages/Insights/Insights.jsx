import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const topicData = [
  { subject: 'Arrays', A: 120, fullMark: 150 },
  { subject: 'Strings', A: 98, fullMark: 150 },
  { subject: 'Linked List', A: 86, fullMark: 150 },
  { subject: 'Trees', A: 99, fullMark: 150 },
  { subject: 'Graphs', A: 85, fullMark: 150 },
  { subject: 'DP', A: 65, fullMark: 150 },
];

const monthlyData = [
  { name: 'Week 1', solved: 20 },
  { name: 'Week 2', solved: 35 },
  { name: 'Week 3', solved: 45 },
  { name: 'Week 4', solved: 40 },
];

const Insights = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Insights & Analytics</h1>
        <p className="text-slate-500 mt-1">Dive deep into your preparation metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="card p-6 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white w-full text-left mb-6">Topic Mastery (DSA)</h3>
          <div className="h-80 w-full max-w-md">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={topicData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis />
                <Radar name="Student" dataKey="A" stroke="#7c3aed" fill="#8b5cf6" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card p-6 flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white w-full text-left mb-6">Problems Solved - This Month</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="solved" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights Card */}
      <div className="card p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/10 dark:to-blue-900/10 border-none">
         <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center mb-4">
           ✨ AI Improvement Suggestions
         </h3>
         <ul className="space-y-3">
           <li className="flex items-start">
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-3 shrink-0"></div>
             <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
               Based on your radar chart, your weakest link is currently <strong>Dynamic Programming</strong>. Consider completing the "Striver DP Series" before taking your next mock interview.
             </p>
           </li>
           <li className="flex items-start">
             <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 mr-3 shrink-0"></div>
             <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
               You have solved only 15% of the Hard problems. To target Google L3, aim to boost your Hard problem-solving consistency.
             </p>
           </li>
         </ul>
      </div>
    </div>
  );
};

export default Insights;
