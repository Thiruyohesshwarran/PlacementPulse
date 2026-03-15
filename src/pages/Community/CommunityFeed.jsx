import React from 'react';
import { ThumbsUp, MessageCircle, Share2, PlusCircle } from 'lucide-react';

const feedPosts = [
  {
    id: 1,
    author: 'Alex J.',
    role: 'SDE at Amazon',
    avatar: 'A',
    time: '2 hours ago',
    title: 'Amazon SDE 1 Interview Experience (Off-campus) - Selected',
    content: 'The process started with an online assessment containing 2 DSA questions. First was related to sliding window, second was a graph BFS logic. After clearing OA, I had 3 technical rounds focusing heavily on Leadership Principles and problem-solving...',
    likes: 124,
    comments: 18,
    tags: ['Amazon', 'Interview Experience', 'SDE 1']
  },
  {
    id: 2,
    author: 'Sarah M.',
    role: 'Student',
    avatar: 'S',
    time: '1 day ago',
    title: 'How to master Dynamic Programming intuitively?',
    content: 'I always struggle with finding the state variables for DP problems. Can someone share a structured way or resources that helped them bridge the gap between recursion and memoization?',
    likes: 89,
    comments: 42,
    tags: ['DSA', 'Dynamic Programming', 'Help']
  }
];

const CommunityFeed = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Community</h1>
          <p className="text-slate-500 mt-1">Share experiences, ask questions, and learn together.</p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusCircle className="w-4 h-4 mr-2" /> New Post
        </button>
      </div>

      <div className="space-y-4">
        {feedPosts.map((post) => (
          <div key={post.id} className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
                {post.avatar}
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">{post.author}</h4>
                <div className="flex items-center text-xs text-slate-500">
                  <span>{post.role}</span>
                  <span className="mx-1.5">•</span>
                  <span>{post.time}</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{post.title}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
              {post.content}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-500 font-medium">
              <button className="flex items-center space-x-1.5 hover:text-primary-600 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center space-x-1.5 hover:text-indigo-600 transition-colors ml-auto">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
