const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUsersById, updateUser, getMe, deleteUser,
  getNotifications, markNotificationsRead,
} = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/me', auth, getMe);                              // MUST be before /:id
router.get('/notifications', auth, getNotifications);        // GET notifications
router.patch('/notifications/read-all', auth, markNotificationsRead); // PATCH mark read
router.get('/', getAllUsers);
router.get('/:id', getUsersById);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;