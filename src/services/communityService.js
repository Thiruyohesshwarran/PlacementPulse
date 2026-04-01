import api from './api';

export const getCommunityPosts = () => api.get('/community/posts');
export const createCommunityPost = (data) => api.post('/community/posts', data);
export const updateCommunityPost = (postId, data) => api.put(`/community/posts/${postId}`, data);
export const deleteCommunityPost = (postId) => api.delete(`/community/posts/${postId}`);