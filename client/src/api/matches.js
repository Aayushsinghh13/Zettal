import api from './axios';

export const getMyMatches       = ()           => api.get('/matches');
export const sendMatchRequest   = (data)        => api.post('/matches', data);
export const updateMatchStatus  = (id, status)  => api.put(`/matches/${id}`, { status });
export const deleteMatch        = (id)          => api.delete(`/matches/${id}`);
