import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminAuth.js';

import {
  // stats
  getAdminStats,
  getRecentActivity,
  // users
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  // children
  listChildren,
  getChild,
  updateChild,
  deleteChild,
  // stories
  listStories,
  getStory,
  updateStory,
  deleteStory,
  // schools
  listSchools,
  createSchool,
  updateSchool,
  deleteSchool,
  // quizzes
  listQuizzes,
  deleteQuiz,
  // knowledge base
  listKnowledge,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
  // seeding
  seedPlans,
  seedKnowledge,
} from '../controllers/admin.controller.js';

const router = express.Router();

// كل الـ Routes محمية بالبوابتين: تسجيل دخول + صلاحية أدمن
router.use(authMiddleware, isAdmin);

// STATS
router.get('/stats', getAdminStats);
router.get('/recent-activity', getRecentActivity);

// USERS
router.route('/users').get(listUsers).post(createUser);
router.route('/users/:id').get(getUser).put(updateUser).delete(deleteUser);

// CHILDREN
router.get('/children', listChildren);
router.route('/children/:id').get(getChild).put(updateChild).delete(deleteChild);

// STORIES
router.get('/stories', listStories);
router.route('/stories/:id').get(getStory).put(updateStory).delete(deleteStory);

// SCHOOLS
router.route('/schools').get(listSchools).post(createSchool);
router.route('/schools/:id').put(updateSchool).delete(deleteSchool);

// QUIZZES
router.get('/quizzes', listQuizzes);
router.delete('/quizzes/:id', deleteQuiz);

// KNOWLEDGE BASE
router.route('/knowledge').get(listKnowledge).post(createKnowledge);
router.route('/knowledge/:id').put(updateKnowledge).delete(deleteKnowledge);

// SEEDING
router.post('/seed/plans', seedPlans);
router.post('/seed/knowledge', seedKnowledge);

export default router;
