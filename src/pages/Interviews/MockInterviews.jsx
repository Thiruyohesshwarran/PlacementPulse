import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { Calendar, Video, Star, Clock, Plus, Trash2, Edit2, X } from 'lucide-react';
import { getInterviews, createInterview, updateInterview, deleteInterview } from '../../services/interviewService';

const EMPTY_FORM = { company: '', role: '', date: '', type: 'DSA/System Design', notes: '', status: 'Upcoming', rating: '', feedback: '' };

const MockInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getInterviews();
      setInterviews(data);
    } catch (e) {
      setError('Failed to load interviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (iv) => {
    setEditing(iv);
    setForm({ company: iv.company, role: iv.role || '', date: iv.date ? iv.date.slice(0,10) : '', type: iv.type, notes: iv.notes || '', status: iv.status, rating: iv.rating || '', feedback: iv.feedback || '' });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, rating: form.rating ? Number(form.rating) : undefined };
      if (editing) { await updateInterview(editing._id, payload); }
      else { await createInterview(payload); }
      closeModal();
      fetchInterviews();
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview?')) return;
    try { await deleteInterview(id); fetchInterviews(); }
    catch { alert('Failed to delete.'); }
  };

  const upcoming = interviews.filter(i => i.status === 'Upcoming');
  const completed = interviews.filter(i => i.status === 'Completed');
  const avgRating = completed.length > 0
    ? (completed.reduce((s, i) => s + (i.rating || 0), 0) / completed.length).toFixed(1)
    : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Mock Interviews</h1>
          <p className="text-slate-500 mt-1">Schedule practice sessions and track performance feedback.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Schedule</h2>
            <div className="space-y-4">
              {loading ? <p className="text-slate-400 text-sm">Loading...</p> : upcoming.length === 0 ? <p className="text-slate-400 text-sm">No upcoming interviews. Schedule one!</p> : upcoming.map(interview => (
                <div key={interview._id} className="flex flex-col sm:flex-row p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 justify-between sm:items-center gap-4">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                       {interview.company[0]}
                     </div>
                     <div>
                       <h3 className="font-semibold text-slate-900 dark:text-white">{interview.company}{interview.role ? ` - ${interview.role}` : ''}</h3>
                       <div className="flex items-center text-sm text-slate-500 mt-1">
                         <Calendar className="w-4 h-4 mr-1.5" /> {new Date(interview.date).toLocaleString()}
                       </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(interview)} className="p-2 text-slate-400 hover:text-primary-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(interview._id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    <button className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center">
                      <Video className="w-4 h-4 mr-2" /> Join Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Past Interviews Feedback</h2>
            <div className="space-y-4">
              {completed.length === 0 ? <p className="text-slate-400 text-sm">No completed interviews yet.</p> : completed.map(interview => (
                <div key={interview._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-dark-paper group hover:border-primary-200 transition-colors">
                   <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                     <div className="flex items-center space-x-3">
                       <h3 className="font-semibold text-slate-900 dark:text-white">{interview.company}</h3>
                       <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full">{interview.type}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className="flex items-center text-sm text-slate-500"><Clock className="w-4 h-4 mr-1.5" />{new Date(interview.date).toLocaleDateString()}</span>
                       <button onClick={() => openEdit(interview)} className="p-1 text-slate-400 hover:text-primary-600"><Edit2 className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(interview._id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   </div>
                   <div className="flex items-center space-x-1 mb-2">
                     {[1,2,3,4,5].map(star => (
                       <Star key={star} className={`w-4 h-4 ${star <= interview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                     ))}
                   </div>
                   {interview.feedback && <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{interview.feedback}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - Stats Summary */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-4">
              <span className="text-3xl font-bold">{avgRating}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Average Rating</h3>
            <p className="text-sm text-slate-500 mt-1">Based on {completed.length} past mock interview{completed.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Areas to Improve</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Dynamic Programming</span>
                <span className="text-red-600 font-medium">Weak</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full w-[30%]"></div>
              </div>
              
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-slate-600 dark:text-slate-400">System Design</span>
                <span className="text-amber-600 font-medium">Average</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-[60%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Add / Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editing ? 'Edit Interview' : 'Schedule Interview'}</h2>
                <button onClick={closeModal}><X className="w-5 h-5 text-slate-500 hover:text-slate-800 dark:hover:text-white" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company *</label>
                    <input className="input-field" required value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} placeholder="e.g. Google" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                    <input className="input-field" value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} placeholder="e.g. SWE L3" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                    <input type="datetime-local" className="input-field" required value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
                    <select className="input-field" value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                      {['DSA/System Design','Leadership & DSA','System Design','Behavioural','Full Stack'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select className="input-field" value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                      <option>Upcoming</option><option>Completed</option><option>Cancelled</option>
                    </select>
                  </div>
                  {form.status === 'Completed' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating (1-5)</label>
                      <input type="number" min="1" max="5" className="input-field" value={form.rating} onChange={e => setForm(f => ({...f, rating: e.target.value}))} placeholder="4" />
                    </div>
                  )}
                </div>
                {form.status === 'Completed' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feedback</label>
                    <textarea className="input-field" rows={3} value={form.feedback} onChange={e => setForm(f => ({...f, feedback: e.target.value}))} placeholder="What went well, what to improve..." />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                  <textarea className="input-field" rows={2} value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Topics to prepare..." />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">Cancel</button>
                  <button type="submit" className="btn-primary px-6 py-2 text-sm">{editing ? 'Save Changes' : 'Schedule'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default MockInterviews;
