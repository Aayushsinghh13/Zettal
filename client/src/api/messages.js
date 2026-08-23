import api from './axios';

export const getMessages  = (matchId) => api.get(`/messages/${matchId}`);
export const sendMessage  = (data)    => api.post('/messages', data);
