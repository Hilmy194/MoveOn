import User from '../models/UserModel.js';
import CoachTrainee from '../models/CoachTraineeModel.js';
import TaskAssignment from '../models/TaskAssignmentModel.js';
import Task from '../models/TaskModel.js';
import { successResponse, errorResponse } from '../utils/response.js';

// ==================== COACH DASHBOARD ====================
export const getCoachDashboard = async (req, res) => {
  try {
    const coachId = req.user.id;

    console.log('📊 Fetching coach dashboard for:', coachId);

    // Get total trainees
    const totalTrainees = await CoachTrainee.countDocuments({ coach_id: coachId });

    // Get total tasks created
    const totalTasks = await Task.countDocuments({ created_by: coachId });

    // Get total assignments
    const totalAssignments = await TaskAssignment.countDocuments({ assigned_by: coachId });

    // Get assignments by status
    const assignmentStats = await TaskAssignment.aggregate([
      { $match: { assigned_by: coachId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      overdue: 0
    };

    assignmentStats.forEach(stat => {
      stats[stat._id] = stat.count;
    });

    // Get recent assignments
    const recentAssignments = await TaskAssignment.find({ assigned_by: coachId })
      .populate('task_id', 'title')
      .populate('trainee_id', 'full_name username')
      .sort({ createdAt: -1 })
      .limit(5);

    const dashboardData = {
      overview: {
        total_trainees: totalTrainees,
        total_tasks: totalTasks,
        total_assignments: totalAssignments,
        assignment_stats: stats
      },
      recent_assignments: recentAssignments
    };

    console.log('✅ Coach dashboard data fetched');

    return successResponse(res, dashboardData, 'Dashboard data retrieved successfully');
  } catch (error) {
    console.error('❌ Error fetching coach dashboard:', error);
    return errorResponse(res, error.message, 500);
  }
};

// ==================== TRAINEE DASHBOARD ====================
export const getTraineeDashboard = async (req, res) => {
  try {
    const traineeId = req.user.id;

    console.log('📊 Fetching trainee dashboard for:', traineeId);

    // Get total assignments
    const totalAssignments = await TaskAssignment.countDocuments({ trainee_id: traineeId });

    // Get assignments by status
    const assignmentStats = await TaskAssignment.aggregate([
      { $match: { trainee_id: traineeId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      pending: 0,
      in_progress: 0,
      completed: 0,
      overdue: 0
    };

    assignmentStats.forEach(stat => {
      stats[stat._id] = stat.count;
    });

    // Calculate completion rate
    const completionRate = totalAssignments > 0
      ? Math.round((stats.completed / totalAssignments) * 100)
      : 0;

    // Get upcoming tasks (due within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingTasks = await TaskAssignment.find({
      trainee_id: traineeId,
      status: { $in: ['pending', 'in_progress'] },
      due_date: { $lte: sevenDaysFromNow, $gte: new Date() }
    })
      .populate('task_id', 'title duration_minutes')
      .populate('assigned_by', 'full_name username')
      .sort({ due_date: 1 })
      .limit(5);

    // Get recent completions
    const recentCompletions = await TaskAssignment.find({
      trainee_id: traineeId,
      status: 'completed'
    })
      .populate('task_id', 'title')
      .sort({ completed_at: -1 })
      .limit(5);

    const dashboardData = {
      overview: {
        total_assignments: totalAssignments,
        assignment_stats: stats,
        completion_rate: completionRate
      },
      upcoming_tasks: upcomingTasks,
      recent_completions: recentCompletions
    };

    console.log('✅ Trainee dashboard data fetched');

    return successResponse(res, dashboardData, 'Dashboard data retrieved successfully');
  } catch (error) {
    console.error('❌ Error fetching trainee dashboard:', error);
    return errorResponse(res, error.message, 500);
  }
};