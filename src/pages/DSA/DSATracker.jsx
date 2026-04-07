import React, { useState } from 'react';
import { useEffect, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';
import { getDSALogs, createDSALog, updateDSALog, deleteDSALog } from '../../services/dsaService';

const EMPTY_FORM = { title: '', platform: 'LeetCode', topic: 'Arrays', difficulty: 'Easy', status: 'Pending', notes: '' };

const DSATracker = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopic, setFilterTopic] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = create, object = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterTopic) params.topic = filterTopic;
      if (filterDifficulty) params.difficulty = filterDifficulty;
      const { data } = await getDSALogs(params);
      setLogs(data);
    } catch (e) {
      setError('Failed to load problems.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterTopic, filterDifficulty]);

  useEffect(() => {
    const timer = setTimeout(fetchLogs, 300);
    return () => clearTimeout(timer);
  }, [fetchLogs]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (log) => { setEditing(log); setForm({ title: log.title, platform: log.platform, topic: log.topic, difficulty: log.difficulty, status: log.status, notes: log.notes || '' }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await updateDSALog(editing._id, form);
      } else {
        await createDSALog(form);
      }
      closeModal();
      fetchLogs();
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this problem?')) return;
    try {
      await deleteDSALog(id);
      fetchLogs();
    } catch (e) {
      alert('Failed to delete.');
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Easy': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20';
      case 'Medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
      case 'Hard': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved': return 'text-emerald-600';
      case 'Revision': return 'text-amber-600';
      case 'Pending': return 'text-slate-400';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">DSA Tracker</h1>
          <p className="text-slate-500 mt-1">Log and revise your data structures and algorithms preparation.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Add Problem
        </button>
      </div>

      <div className="card">
        {/* Status Legend */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-3">Status Reference</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Solved</span> - Problem completed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Revision</span> - Needs review</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300"><span className="font-semibold">Pending</span> - Not attempted yet</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-4 w-4 text-slate-400" />
            </span>
            <input 
              type="text" 
              placeholder="Search problems..." 
              className="input-field pl-9 h-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
            <select className="input-field h-10 py-0 min-w-[120px]" value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)}>
              <option value="">All Topics</option>
              {['Arrays','Graphs','DP','Trees','Strings','Sorting','Backtracking','Greedy','Stack & Queue'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="input-field h-10 py-0 min-w-[120px]" value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)}>
              <option value="">Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white dark:bg-dark-paper text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Platform</th>
                <th className="px-6 py-4 font-medium">Topic</th>
                <th className="px-6 py-4 font-medium">Difficulty</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-dark-paper">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-slate-400">No problems found. Add your first one!</td></tr>
              ) : logs.map((row) => (
                <tr key={row._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <CheckCircle2 className={`w-5 h-5 ${getStatusColor(row.status)}`} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900 dark:text-white group-hover:text-primary-600 cursor-pointer">{row.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{row.platform}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">{row.topic}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getDifficultyColor(row.difficulty)}`}>{row.difficulty}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{new Date(row.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button onClick={() => openEdit(row)} className="text-slate-400 hover:text-primary-600 p-1" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(row._id)} className="text-slate-400 hover:text-red-500 p-1" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 bg-white dark:bg-dark-paper">
          <span>Showing {logs.length} {logs.length === 1 ? 'entry' : 'entries'}</span>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium">1</button>
            <button className="px-3 py-1 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editing ? 'Edit Problem' : 'Add Problem'}</h2>
              <button onClick={closeModal}><X className="w-5 h-5 text-slate-500 hover:text-slate-800 dark:hover:text-white" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input className="input-field" required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Two Sum" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform *</label>
                  <select className="input-field" value={form.platform} onChange={e => setForm(f => ({...f, platform: e.target.value}))}>
                    {['LeetCode','GeeksforGeeks','HackerRank','Codeforces','InterviewBit'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topic *</label>
                  <select className="input-field" value={form.topic} onChange={e => setForm(f => ({...f, topic: e.target.value}))}>
                    {['Arrays','Graphs','DP','Trees','Strings','Sorting','Backtracking','Greedy','Stack & Queue'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Difficulty *</label>
                  <select className="input-field" value={form.difficulty} onChange={e => setForm(f => ({...f, difficulty: e.target.value}))}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                  <select className="input-field" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                    <option>Pending</option><option>Solved</option><option>Revision</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea className="input-field" rows={3} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Approach, edge cases..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2 text-sm">{editing ? 'Save Changes' : 'Add Problem'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSATracker;
