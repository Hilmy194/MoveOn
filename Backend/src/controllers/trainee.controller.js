import User from '../models/UserModel.js';
import TaskAssignment from '../models/TaskAssignmentModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

// ==================== PROFILE ====================

export const getTraineeProfile = async (req, res) => {
  try {
    const traineeId = req.user.id;
    
    const trainee = await User.findById(traineeId).select('-password');
    
    if (!trainee) {
      return errorResponse(res, 'Trainee not found', 404);
    }

    return successResponse(res, trainee, 'Profile retrieved successfully');
  } catch (error) {
    console.error('❌ Error fetching trainee profile:', error);
    return errorResponse(res, error.message, 500);
  }
};

export const updateTraineeProfile = async (req, res) => {
  try {
    const traineeId = req.user.id;
    const updates = req.body;

    // Don't allow updating sensitive fields
    delete updates.password;
    delete updates.role;
    delete updates.email;
    delete updates.username;

    const trainee = await User.findByIdAndUpdate(
      traineeId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!trainee) {
      return errorResponse(res, 'Trainee not found', 404);
    }

    return successResponse(res, trainee, 'Profile updated successfully');
  } catch (error) {
    console.error('❌ Error updating trainee profile:', error);
    return errorResponse(res, error.message, 500);
  }
};

// ==================== TASKS ====================

export const getTraineeTasks = async (req, res) => {
  try {
    const traineeId = req.user.id;
    
    console.log('📋 [GET TRAINEE TASKS] Fetching tasks for trainee:', traineeId);

    const assignments = await TaskAssignment.find({ trainee_id: traineeId })
      .populate({
        path: 'task_id',
        select: 'title description workout_type difficulty_level duration_minutes calories_target exercises created_by createdAt'
      })
      .populate({
        path: 'assigned_by',
        select: 'full_name email username'
      })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${assignments.length} assignments`);

    const tasks = assignments.map(assignment => {
      const task = assignment.task_id;
      
      return {
        assignment_id: assignment._id,
        task_id: task._id,
        title: task.title,
        description: task.description,
        workout_type: task.workout_type,
        difficulty: task.difficulty_level,
        duration: task.duration_minutes,
        calories_target: task.calories_target,
        exercises: task.exercises || [],
        due_date: assignment.due_date,
        status: assignment.status,
        priority: assignment.priority,
        notes: assignment.notes,
        assigned_at: assignment.createdAt,
        completed_at: assignment.completed_at,
        coach: {
          id: assignment.assigned_by._id,
          name: assignment.assigned_by.full_name,
          email: assignment.assigned_by.email,
          username: assignment.assigned_by.username
        }
      };
    });

    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      in_progress: tasks.filter(t => t.status === 'in_progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => t.status === 'overdue').length
    };

    return successResponse(res, { tasks, stats }, 'Tasks retrieved successfully');

  } catch (error) {
    console.error('❌ Error fetching trainee tasks:', error);
    return errorResponse(res, error.message, 500);
  }
};

export const submitTaskCompletion = async (req, res) => {
  try {
    const traineeId = req.user.id;
    const { taskId } = req.params;
    const { notes, completion_data } = req.body;

    console.log('✅ [SUBMIT TASK] Trainee:', traineeId, 'Task:', taskId);

    const assignment = await TaskAssignment.findOne({
      task_id: taskId,
      trainee_id: traineeId
    });

    if (!assignment) {
      return errorResponse(res, 'Task assignment not found', 404);
    }

    assignment.status = 'completed';
    assignment.completed_at = new Date();
    if (notes) {
      assignment.notes = notes;
    }

    await assignment.save();

    console.log('✅ Task marked as completed');

    return successResponse(res, assignment, 'Task completed successfully');

  } catch (error) {
    console.error('❌ Error submitting task completion:', error);
    return errorResponse(res, error.message, 500);
  }
};

// ==================== PROGRESS ====================

export const getTraineeProgress = async (req, res) => {
  try {
    const traineeId = req.user.id;

    const assignments = await TaskAssignment.find({ trainee_id: traineeId })
      .populate('task_id')
      .sort({ createdAt: -1 });

    const totalTasks = assignments.length;
    const completedTasks = assignments.filter(a => a.status === 'completed').length;
    const inProgressTasks = assignments.filter(a => a.status === 'in_progress').length;
    const pendingTasks = assignments.filter(a => a.status === 'pending').length;

    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    const totalMinutes = assignments
      .filter(a => a.status === 'completed' && a.task_id)
      .reduce((sum, a) => sum + (a.task_id.duration_minutes || 0), 0);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCompletions = assignments.filter(a => 
      a.status === 'completed' && 
      a.completed_at && 
      new Date(a.completed_at) >= sevenDaysAgo
    );

    const progress = {
      statistics: {
        total_tasks: totalTasks,
        completed: completedTasks,
        in_progress: inProgressTasks,
        pending: pendingTasks,
        completion_rate: completionRate,
        total_workout_minutes: totalMinutes,
        total_workout_hours: Math.round(totalMinutes / 60 * 10) / 10
      },
      recent_activity: {
        last_7_days_completions: recentCompletions.length,
        recent_tasks: recentCompletions.slice(0, 5).map(a => ({
          task_id: a.task_id._id,
          title: a.task_id.title,
          completed_at: a.completed_at
        }))
      },
      upcoming_tasks: assignments
        .filter(a => a.status !== 'completed' && a.due_date)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5)
        .map(a => ({
          assignment_id: a._id,
          task_id: a.task_id._id,
          title: a.task_id.title,
          due_date: a.due_date,
          status: a.status
        }))
    };

    return successResponse(res, progress, 'Progress retrieved successfully');

  } catch (error) {
    console.error('❌ Error fetching trainee progress:', error);
    return errorResponse(res, error.message, 500);
  }
};

// ==================== NOTIFICATIONS ====================

export const getTraineeNotifications = async (req, res) => {
  try {
    const traineeId = req.user.id;

    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const upcomingTasks = await TaskAssignment.find({
      trainee_id: traineeId,
      status: { $in: ['pending', 'in_progress'] },
      due_date: { $lte: threeDaysFromNow, $gte: new Date() }
    })
    .populate('task_id', 'title')
    .sort({ due_date: 1 });

    const notifications = upcomingTasks.map(assignment => ({
      type: 'task_due_soon',
      message: `Task "${assignment.task_id.title}" is due on ${new Date(assignment.due_date).toLocaleDateString()}`,
      task_id: assignment.task_id._id,
      assignment_id: assignment._id,
      due_date: assignment.due_date,
      priority: assignment.priority
    }));

    return successResponse(res, notifications, 'Notifications retrieved successfully');

  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    return errorResponse(res, error.message, 500);
  }
};