import api from './api';

export const getDSALogs = (params) => api.get('/dsa', { params });
export const getDSAStats = () => api.get('/dsa/stats');
export const createDSALog = (data) => api.post('/dsa', data);
export const updateDSALog = (id, data) => api.put(`/dsa/${id}`, data);
export const deleteDSALog = (id) => api.delete(`/dsa/${id}`);
