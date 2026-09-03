import api from './axios';

export const getMe          = ()       => api.get('/users/me');
export const getUserById    = (id)     => api.get(`/users/${id}`);
// Send only the fields the backend cares about; use id (not _id) for the URL
export const updateMe       = (data)   => api.put(`/users/${data.id || data._id}`, {
  name: data.name,
  bio: data.bio,
  location: data.location,
  skillsOffered: data.skillsOffered,
});
export const getNotifications     = ()  => api.get('/users/notifications');
export const markAllNotifRead     = ()  => api.patch('/users/notifications/read-all');

