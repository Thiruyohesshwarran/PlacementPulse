import { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, Video, Star, Clock, Plus, Trash2, Edit2, X, UserRound, Link as LinkIcon, BadgeCheck, AlertCircle } from 'lucide-react';
import { getInterviews, createInterview, updateInterview, deleteInterview } from '../../services/interviewService';

const EMPTY_FORM = {
  interviewerName: '',
  interviewerType: 'Peer',
  interviewerContact: '',
  date: '',
  type: 'DSA',
  mode: 'Online',
  meetingLink: '',
  notes: '',
  status: 'Scheduled',
  rating: '',
  topics: [],
  feedback: '',
  strengths: '',
};

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

const splitTopics = (value) =>
  String(value || '')
    .split(',')
    .map((topic) => topic.trim())
    .filter(Boolean);

const statusBadgeClass = (status) => {
  switch (status) {
    case 'Scheduled':
      return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200';
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200';
    case 'Missed':
      return 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200';
    default:
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  }
};

const MockInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [topicsInput, setTopicsInput] = useState('');
  const [error, setError] = useState('');

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getInterviews();
      setInterviews(data);
    } catch {
      setError('Failed to load interviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInterviews(); }, [fetchInterviews]);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (iv) => {
    setEditing(iv);
    const nextForm = {
      interviewerName: iv.interviewerName || iv.company || '',
      interviewerType: iv.interviewerType || 'Peer',
      interviewerContact: iv.interviewerContact || '',
      date: toDateTimeLocal(iv.date),
      type: iv.type || 'DSA',
      mode: iv.mode || 'Online',
      meetingLink: iv.meetingLink || '',
      notes: iv.notes || '',
      status: iv.status || 'Scheduled',
      rating: iv.rating || '',
      topics: Array.isArray(iv.topics) ? iv.topics : [],
      feedback: iv.feedback || '',
      strengths: iv.strengths || '',
    };
    setForm(nextForm);
    setTopicsInput(nextForm.topics.join(', '));
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setError(''); setTopicsInput(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        topics: splitTopics(topicsInput),
        rating: form.rating ? Number(form.rating) : undefined,
        meetingLink: form.mode === 'Online' ? form.meetingLink : '',
      };

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

  const { scheduled, past, ratedCompleted, avgRating, topicInsights } = useMemo(() => {
    const now = new Date();

    const scheduledItems = interviews
      .filter((i) => i.status === 'Scheduled')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const pastItems = interviews
      .filter((i) => i.status === 'Completed' || i.status === 'Missed' || new Date(i.date) < now)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const completed = interviews.filter((i) => i.status === 'Completed' && i.rating);
    const avg = completed.length > 0
      ? (completed.reduce((sum, i) => sum + Number(i.rating || 0), 0) / completed.length).toFixed(1)
      : '0.0';

    const topicMap = new Map();
    completed.forEach((entry) => {
      const topics = Array.isArray(entry.topics) ? entry.topics : [];
      topics.forEach((topic) => {
        const key = String(topic || '').trim();
        if (!key) return;
        const current = topicMap.get(key) || { total: 0, count: 0 };
        current.total += Number(entry.rating || 0);
        current.count += 1;
        topicMap.set(key, current);
      });
    });

    const insights = Array.from(topicMap.entries())
      .map(([topic, value]) => {
        const topicAvg = value.count ? value.total / value.count : 0;
        return {
          topic,
          avgRating: Number(topicAvg.toFixed(1)),
          level: topicAvg < 3 ? 'Weak' : topicAvg < 4 ? 'Average' : 'Strong',
        };
      })
      .sort((a, b) => a.avgRating - b.avgRating);

    return {
      scheduled: scheduledItems,
      past: pastItems,
      ratedCompleted: completed,
      avgRating: avg,
      topicInsights: insights,
    };
  }, [interviews]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Mock Interviews</h1>
          <p className="text-slate-500 mt-1">Schedule interviews, track interviewer feedback, and improve by topic.</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Schedule Interview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Interviews</h2>
            <div className="space-y-4">
              {loading ? <p className="text-slate-400 text-sm">Loading...</p> : scheduled.length === 0 ? <p className="text-slate-400 text-sm">No scheduled interviews yet.</p> : scheduled.map(interview => (
                <div key={interview._id} className="flex flex-col sm:flex-row p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 justify-between sm:items-center gap-4">
                  <div className="flex items-start space-x-4">
                     <div className="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 flex items-center justify-center font-bold text-lg">
                       {(interview.interviewerName?.[0] || 'I').toUpperCase()}
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h3 className="font-semibold text-slate-900 dark:text-white">{interview.interviewerName}</h3>
                         <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200">{interview.interviewerType}</span>
                       </div>
                       <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{interview.type} Interview</p>
                       <div className="flex items-center text-sm text-slate-500 mt-1">
                         <Calendar className="w-4 h-4 mr-1.5" /> {new Date(interview.date).toLocaleString()}
                       </div>
                       {interview.interviewerContact && <p className="text-xs text-slate-500 mt-1">Contact: {interview.interviewerContact}</p>}
                       <div className="mt-2">
                         <span className={`text-xs px-2 py-1 rounded-full ${statusBadgeClass(interview.status)}`}>Status: {interview.status}</span>
                       </div>
                     </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(interview)} className="p-2 text-slate-400 hover:text-primary-600"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(interview._id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    {interview.mode === 'Online' && interview.meetingLink && (
                      <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200 border border-primary-200 dark:border-primary-900/60 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center justify-center">
                        <Video className="w-4 h-4 mr-2" /> Join Call
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Past Interviews & Feedback</h2>
            <div className="space-y-4">
              {past.length === 0 ? <p className="text-slate-400 text-sm">No completed or missed interviews yet.</p> : past.map(interview => (
                <div key={interview._id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-dark-paper group hover:border-primary-200 transition-colors">
                   <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                     <div className="flex items-center space-x-3">
                       <h3 className="font-semibold text-slate-900 dark:text-white">{interview.interviewerName}</h3>
                       <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs rounded-full">{interview.interviewerType}</span>
                       <span className="px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-200 text-xs rounded-full">{interview.type}</span>
                       <span className={`px-2 py-0.5 text-xs rounded-full ${statusBadgeClass(interview.status)}`}>{interview.status}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className="flex items-center text-sm text-slate-500"><Clock className="w-4 h-4 mr-1.5" />{new Date(interview.date).toLocaleDateString()}</span>
                       <button onClick={() => openEdit(interview)} className="p-1 text-slate-400 hover:text-primary-600"><Edit2 className="w-4 h-4" /></button>
                       <button onClick={() => handleDelete(interview._id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   </div>

                   {interview.status === 'Completed' && (
                     <>
                       <div className="flex items-center space-x-1 mb-2">
                         {[1, 2, 3, 4, 5].map((star) => (
                           <Star key={star} className={`w-4 h-4 ${star <= Number(interview.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                         ))}
                       </div>
                       {Array.isArray(interview.topics) && interview.topics.length > 0 && (
                         <p className="text-sm text-slate-600 dark:text-slate-400 mb-1"><span className="font-medium">Topics:</span> {interview.topics.join(', ')}</p>
                       )}
                       {interview.feedback && <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-medium">Feedback:</span> {interview.feedback}</p>}
                       {interview.strengths && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><span className="font-medium">Strengths:</span> {interview.strengths}</p>}
                     </>
                   )}

                   {interview.status === 'Missed' && interview.notes && (
                     <p className="text-sm text-slate-600 dark:text-slate-400"><span className="font-medium">Notes:</span> {interview.notes}</p>
                   )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - Stats Summary */}
        <div className="space-y-6">
          <div className="card p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 mb-4">
              <span className="text-3xl font-bold">{avgRating}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Average Rating</h3>
            <p className="text-sm text-slate-500 mt-1">Based on {ratedCompleted.length} completed interview{ratedCompleted.length !== 1 ? 's' : ''}</p>
          </div>
          
          <div className="card p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Areas to Improve</h3>
            {topicInsights.length === 0 ? (
              <p className="text-sm text-slate-500">Add ratings and topics in completed interviews to generate insights.</p>
            ) : (
              <div className="space-y-3">
                {topicInsights.slice(0, 4).map((item) => {
                  const width = `${Math.max(15, Math.round((item.avgRating / 5) * 100))}%`;
                  const barClass = item.level === 'Weak' ? 'bg-red-500' : item.level === 'Average' ? 'bg-amber-500' : 'bg-emerald-500';
                  const textClass = item.level === 'Weak' ? 'text-red-600' : item.level === 'Average' ? 'text-amber-600' : 'text-emerald-600';

                  return (
                    <div key={item.topic}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{item.topic}</span>
                        <span className={`font-medium ${textClass}`}>{item.level} ({item.avgRating}/5)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-1">
                        <div className={`${barClass} h-2 rounded-full`} style={{ width }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

        {/* Add / Edit Modal */}
        {showModal && (
          <div className="fixed -top-6 left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editing ? 'Edit Interview' : 'Schedule Interview'}</h2>
                <button onClick={closeModal}><X className="w-5 h-5 text-slate-500 hover:text-slate-800 dark:hover:text-white" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interviewer Name *</label>
                    <input className="input-field" required value={form.interviewerName} onChange={e => setForm(f => ({ ...f, interviewerName: e.target.value }))} placeholder="e.g. Rahul" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interviewer Type *</label>
                    <select className="input-field" value={form.interviewerType} onChange={e => setForm(f => ({ ...f, interviewerType: e.target.value }))}>
                      <option>Self</option>
                      <option>Peer</option>
                      <option>Mentor</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date & Time *</label>
                    <input type="datetime-local" className="input-field" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
                    <select className="input-field" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                      {['DSA', 'System Design', 'Behavioural', 'Leadership', 'Full Stack'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mode *</label>
                    <select className="input-field" value={form.mode} onChange={e => setForm(f => ({ ...f, mode: e.target.value }))}>
                      <option>Online</option>
                      <option>Offline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Interviewer Contact</label>
                    <input className="input-field" value={form.interviewerContact} onChange={e => setForm(f => ({ ...f, interviewerContact: e.target.value }))} placeholder="rahul@gmail.com" />
                  </div>
                </div>

                {form.mode === 'Online' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Meeting Link</label>
                    <input className="input-field" value={form.meetingLink} onChange={e => setForm(f => ({ ...f, meetingLink: e.target.value }))} placeholder="https://meet.google.com/xyz" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      <option>Scheduled</option>
                      <option>Completed</option>
                      <option>Missed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                    <input className="input-field" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Focus on graphs" />
                  </div>
                </div>

                {form.status === 'Completed' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rating (1-5)</label>
                        <input type="number" min="1" max="5" className="input-field" value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))} placeholder="4" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Topics (comma-separated)</label>
                        <input className="input-field" value={topicsInput} onChange={e => setTopicsInput(e.target.value)} placeholder="Graphs, Trees" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Feedback</label>
                      <textarea className="input-field" rows={3} value={form.feedback} onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))} placeholder="Struggled in DFS" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Strengths</label>
                      <textarea className="input-field" rows={2} value={form.strengths} onChange={e => setForm(f => ({ ...f, strengths: e.target.value }))} placeholder="Good communication" />
                    </div>
                  </>
                )}

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
