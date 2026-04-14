import React, { useCallback, useEffect, useState } from 'react';
import { Building2, Edit2, MessageCircle, Plus, PlusCircle, Share2, Tag, Trash2, ThumbsUp, X } from 'lucide-react';
import { useAuth } from '../../context/authContextState';
import { createCommunityPost, deleteCommunityPost, getCommunityPosts, updateCommunityPost } from '../../services/communityService';

const featuredPosts = [
  {
    id: 'featured-1',
    author: 'Alex J.',
    role: 'SDE at Amazon',
    company: 'Amazon',
    avatar: 'A',
    time: '2 hours ago',
    title: 'Amazon SDE 1 Interview Experience (Off-campus) - Selected',
    content: 'The process started with an online assessment containing 2 DSA questions. First was related to sliding window, second was a graph BFS logic. After clearing OA, I had 3 technical rounds focusing heavily on Leadership Principles and problem-solving...',
    facilities: ['Food coupons', 'Transport support', 'Hotel stay', 'Laptop allowance'],
    likes: 124,
    comments: 18,
    tags: ['Amazon', 'Interview Experience', 'SDE 1'],
  },
  {
    id: 'featured-2',
    author: 'Sarah M.',
    role: 'Student',
    company: 'Open Discussion',
    avatar: 'S',
    time: '1 day ago',
    title: 'How to master Dynamic Programming intuitively?',
    content: 'I always struggle with finding the state variables for DP problems. Can someone share a structured way or resources that helped them bridge the gap between recursion and memoization?',
    facilities: [],
    likes: 89,
    comments: 42,
    tags: ['DSA', 'Dynamic Programming', 'Help'],
  },
];

const EMPTY_FORM = {
  company: '',
  role: '',
  title: '',
  content: '',
  tags: [],
  facilities: [],
};

const buildFormFromPost = (post) => ({
  company: post?.company || '',
  role: post?.role || '',
  title: post?.title || '',
  content: post?.content || '',
  tags: Array.isArray(post?.tags) ? post.tags : [],
  facilities: Array.isArray(post?.facilities) ? post.facilities : [],
});

const createDraftHandler = (input, setter, currentItems, setItems) => {
  const normalized = input.trim();

  if (!normalized || currentItems.includes(normalized)) {
    setter('');
    return;
  }

  setItems([...currentItems, normalized]);
  setter('');
};

const ChipInput = ({ label, placeholder, items, inputValue, onInputChange, onAdd, onRemove, icon: Icon }) => (
  <div>
    <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      {Icon && <Icon className="h-4 w-4 text-slate-400" />}
      {label}
    </label>
    <div className="flex gap-2">
      <input
        className="input-field"
        value={inputValue}
        onChange={(event) => onInputChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            onAdd();
          }
        }}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
    {items.length > 0 && (
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
          >
            {item}
            <button type="button" onClick={() => onRemove(item)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
    )}
  </div>
);

const CommunityFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(featuredPosts);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [tagInput, setTagInput] = useState('');
  const [facilityInput, setFacilityInput] = useState('');
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getCommunityPosts();
      setPosts([...featuredPosts, ...data]);
    } catch {
      setPosts(featuredPosts);
      setError('Failed to load community posts. Showing featured posts only.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setTagInput('');
    setFacilityInput('');
    setError('');
    setEditingPost(null);
    setShowModal(true);
  };

  const openEdit = (post) => {
    setForm(buildFormFromPost(post));
    setTagInput('');
    setFacilityInput('');
    setError('');
    setEditingPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitting(false);
    setError('');
    setEditingPost(null);
  };

  const addTag = () => {
    createDraftHandler(tagInput, setTagInput, form.tags, (nextTags) => setForm((current) => ({ ...current, tags: nextTags })));
  };

  const removeTag = (tagToRemove) => {
    setForm((current) => ({ ...current, tags: current.tags.filter((tag) => tag !== tagToRemove) }));
  };

  const addFacility = () => {
    createDraftHandler(
      facilityInput,
      setFacilityInput,
      form.facilities,
      (nextFacilities) => setForm((current) => ({ ...current, facilities: nextFacilities }))
    );
  };

  const removeFacility = (facilityToRemove) => {
    setForm((current) => ({ ...current, facilities: current.facilities.filter((facility) => facility !== facilityToRemove) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        company: form.company,
        role: form.role,
        title: form.title,
        content: form.content,
        tags: form.tags,
        facilities: form.facilities,
      };

      if (editingPost?._id) {
        await updateCommunityPost(editingPost._id, payload);
      } else {
        await createCommunityPost(payload);
      }

      closeModal();
      await fetchPosts();
    } catch (submitError) {
      setError(submitError?.response?.data?.message || 'Something went wrong.');
      setSubmitting(false);
    }
  };

  const handleDelete = async (post) => {
    const confirmDelete = window.confirm('Delete this post? This cannot be undone.');

    if (!confirmDelete) {
      return;
    }

    try {
      setError('');
      await deleteCommunityPost(post._id);
      await fetchPosts();
    } catch (deleteError) {
      setError(deleteError?.response?.data?.message || 'Unable to delete this post.');
    }
  };

  const getPostAuthor = (post) => post.user?.name || post.author || 'Anonymous';
  const getPostRole = (post) => post.role || post.user?.targetRole || 'Student';
  const getPostTime = (post) => post.time || (post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '');
  const getAvatar = (post) => (getPostAuthor(post)?.[0] || 'U').toUpperCase();
  const isOwner = (post) => Boolean(user?._id && post?.user?._id && post.user._id === user._id);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl dark:border-slate-800 sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_28%)]" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-100">
              Community Pulse
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Share company experiences that help others prepare better</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Post the company, role, interview experience, facilities provided, and the tags that make your story searchable.
            </p>
          </div>
          <button onClick={openCreate} className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50">
            <PlusCircle className="mr-2 h-4 w-4" /> New Post
          </button>
        </div>
      </div>

      <div className="card flex flex-col gap-3 rounded-2xl border border-slate-200/70 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Posting as</h2>
          <p className="mt-1 text-base font-semibold text-slate-900 dark:text-white">{user?.name || 'Your profile'}</p>
        </div>
        <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400">
          Include the company, facilities, and tags so others can quickly compare experiences.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="card p-6 text-sm text-slate-400">Loading community posts...</div>
        ) : (
          posts.map((post) => {
            const postTags = post.tags || [];
            const postFacilities = post.facilities || [];

            return (
              <div key={post._id || post.id} className="card p-6">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary-500 to-blue-500 font-bold text-white shadow-sm">
                      {getAvatar(post)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{getPostAuthor(post)}</h4>
                        {post.company && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <Building2 className="h-3.5 w-3.5" />
                            {post.company}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-xs text-slate-500">
                        <span>{getPostRole(post)}</span>
                        <span className="mx-1.5">•</span>
                        <span>{getPostTime(post)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{post.title}</h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.content}</p>

                {postFacilities.length > 0 && (
                  <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <Building2 className="h-4 w-4" />
                      Facilities provided
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {postFacilities.map((facility) => (
                        <span key={facility} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {postTags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {postTags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        <Tag className="h-3.5 w-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-6 border-t border-slate-100 pt-4 text-sm font-medium text-slate-500 dark:border-slate-800">
                  <button className="flex items-center space-x-1.5 transition-colors hover:text-primary-600">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes ?? 0}</span>
                  </button>
                  <button className="flex items-center space-x-1.5 transition-colors hover:text-blue-600">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments ?? 0}</span>
                  </button>
                  {isOwner(post) && (
                    <button type="button" onClick={() => openEdit(post)} className="flex items-center space-x-1.5 transition-colors hover:text-amber-600">
                      <Edit2 className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  {isOwner(post) && (
                    <button type="button" onClick={() => handleDelete(post)} className="flex items-center space-x-1.5 transition-colors hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  )}
                  <button className="ml-auto flex items-center space-x-1.5 transition-colors hover:text-indigo-600">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{editingPost ? 'Edit Community Post' : 'Create Community Post'}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Share your company experience with facilities and tags.</p>
              </div>
              <button onClick={closeModal} type="button">
                <X className="h-5 w-5 text-slate-500 hover:text-slate-900 dark:hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Company *</label>
                  <input
                    className="input-field"
                    required
                    value={form.company}
                    onChange={(event) => setForm((current) => ({ ...current, company: event.target.value }))}
                    placeholder="e.g. Amazon"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Role</label>
                  <input
                    className="input-field"
                    value={form.role}
                    onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                    placeholder="e.g. SDE Intern"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Post Title *</label>
                <input
                  className="input-field"
                  required
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="e.g. Amazon SDE 1 interview experience"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Experience / Details *</label>
                <textarea
                  className="input-field"
                  required
                  rows={5}
                  value={form.content}
                  onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                  placeholder="Describe the rounds, your prep, what helped, and what facilities were provided..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ChipInput
                  label="Facilities provided"
                  placeholder="e.g. Food coupons, transport"
                  items={form.facilities}
                  inputValue={facilityInput}
                  onInputChange={setFacilityInput}
                  onAdd={addFacility}
                  onRemove={removeFacility}
                  icon={Building2}
                />

                <ChipInput
                  label="Tags"
                  placeholder="e.g. Amazon, SDE 1, OA"
                  items={form.tags}
                  inputValue={tagInput}
                  onInputChange={setTagInput}
                  onAdd={addTag}
                  onRemove={removeTag}
                  icon={Tag}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary px-6 py-2 text-sm" disabled={submitting}>
                  {submitting ? 'Saving...' : editingPost ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
