import express from 'express';
import { 
  getCoachProfile, 
  updateCoachProfile, 
  getCoachTrainees,
  getAvailableTrainees,
  addTrainee,
  removeTrainee,
  getTraineeDetail,
  createAndAssignTask,
  getCoachTasks,
  updateTask,
  deleteTask
} from '../controllers/coach.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('coach'));

// Profile
router.get('/profile', getCoachProfile);
router.put('/profile', updateCoachProfile);

// Trainees
router.get('/trainees', getCoachTrainees);
router.get('/available-trainees', getAvailableTrainees); // ⭐ New endpoint
router.get('/search-trainees', getAvailableTrainees); // Alias for backward compatibility
router.post('/trainees', addTrainee);
router.delete('/trainees/:traineeId', removeTrainee);
router.get('/trainees/:traineeId', getTraineeDetail);

// Tasks
router.post('/:coachId/tasks', createAndAssignTask);
router.get('/tasks', getCoachTasks);
router.put('/tasks/:taskId', updateTask);
router.delete('/tasks/:taskId', deleteTask);

export default router;