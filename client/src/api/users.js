import api from './axios';

export const getMe          = ()       => api.get('/users/me');
export const getUserById    = (id)     => api.get(`/users/${id}`);
export const updateMe       = (data)   => api.put(`/users/${data._id}`, data);
export const getNotifications     = ()  => api.get('/users/notifications');
export const markAllNotifRead     = ()  => api.patch('/users/notifications/read-all');
