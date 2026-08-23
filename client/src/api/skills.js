import api from './axios';

export const getAllListings  = (params) => api.get('/skills', { params });
export const getListingById = (id)      => api.get(`/skills/${id}`);
export const createListing  = (data)    => api.post('/skills', data);
export const updateListing  = (id, data)=> api.put(`/skills/${id}`, data);
export const deleteListing  = (id)      => api.delete(`/skills/${id}`);
