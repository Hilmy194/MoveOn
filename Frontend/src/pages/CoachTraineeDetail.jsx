import React, { useState } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { mockTrainees, mockTasks } from '../data/mockCoachData.js'

export default function TraineeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const trainee = mockTrainees.find(t => t.id === parseInt(id))
  const [selectedTab, setSelectedTab] = useState('overview')

  if (!trainee) {
    return (
      <div className="min-h-screen bg-[#001a3d] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Trainee not found</h2>
          <NavLink to="/coach/trainees" className="text-yellow-400 hover:underline">← Back to Trainees</NavLink>
        </div>
      </div>
    )
  }

  const assignedTasks = mockTasks.filter(t => t.assignedTo.includes(trainee.id))
  const completionRate = assignedTasks.length > 0 ? ((trainee.stats.workoutsCompleted / assignedTasks.length) * 100).toFixed(0) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a3d] to-[#002451] text-white pb-20">
      {/* Header */}
      <div className="px-6 md:px-16 py-8 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-start gap-6">
            <div className="text-6xl">{trainee.avatar}</div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{trainee.name}</h1>
              <p className="text-white/70 mt-1">{trainee.email}</p>
              <div className="flex gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  trainee.status === 'active'
                    ? 'bg-green-400/20 text-green-300'
                    : 'bg-gray-400/20 text-gray-300'
                }`}>
                  {trainee.status === 'active' ? '🟢 Active' : '⚪ Inactive'}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-400/20 text-yellow-300">
                  Member since {new Date(trainee.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white transition">
            ✕
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="px-6 md:px-16 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-[#002451] rounded-lg p-5 border border-white/10">
            <p className="text-white/60 text-sm">Workouts Completed</p>
            <h3 className="text-3xl font-bold text-yellow-400 mt-2">{trainee.stats.workoutsCompleted}</h3>
          </div>
          <div className="bg-[#002451] rounded-lg p-5 border border-white/10">
            <p className="text-white/60 text-sm">Total Hours</p>
            <h3 className="text-3xl font-bold text-blue-400 mt-2">{trainee.stats.totalHours}</h3>
          </div>
          <div className="bg-[#002451] rounded-lg p-5 border border-white/10">
            <p className="text-white/60 text-sm">Calories Burned</p>
            <h3 className="text-3xl font-bold text-red-400 mt-2">{trainee.stats.caloriesBurned.toLocaleString()}</h3>
          </div>
          <div className="bg-[#002451] rounded-lg p-5 border border-white/10">
            <p className="text-white/60 text-sm">Average Rating</p>
            <h3 className="text-3xl font-bold text-green-400 mt-2">⭐ {trainee.stats.averageRating}</h3>
          </div>
          <div className="bg-[#002451] rounded-lg p-5 border border-white/10">
            <p className="text-white/60 text-sm">Current Streak</p>
            <h3 className="text-3xl font-bold text-orange-400 mt-2">🔥 {trainee.stats.streak}</h3>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex gap-4 border-b border-white/10">
          {['overview', 'activities', 'tasks'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-3 font-medium transition border-b-2 ${
                selectedTab === tab
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-transparent text-white/60 hover:text-white'
              }`}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'activities' && '⏱️ Recent Activities'}
              {tab === 'tasks' && '📋 Assigned Tasks'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Progress Chart */}
              <div className="lg:col-span-2 bg-[#002451] rounded-lg border border-white/10 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-6">Performance Summary</h2>
                
                <div className="space-y-6">
                  {/* Progress Bar 1 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Completion Rate</p>
                      <span className="text-lg font-bold text-yellow-400">{completionRate}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 h-full rounded-full" style={{ width: `${completionRate}%` }} />
                    </div>
                  </div>

                  {/* Progress Bar 2 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Consistency Score</p>
                      <span className="text-lg font-bold text-green-400">{Math.min(trainee.stats.streak * 5, 100)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-400 to-green-300 h-full rounded-full" style={{ width: `${Math.min(trainee.stats.streak * 5, 100)}%` }} />
                    </div>
                  </div>

                  {/* Progress Bar 3 */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium">Quality Score (Avg Rating)</p>
                      <span className="text-lg font-bold text-blue-400">{(trainee.stats.averageRating / 5 * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-300 h-full rounded-full" style={{ width: `${trainee.stats.averageRating / 5 * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#002451] rounded-lg border border-white/10 p-6">
                <h2 className="text-xl font-bold text-yellow-400 mb-6">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-yellow-400 hover:bg-yellow-300 text-[#001a3d] font-semibold rounded-lg transition">
                    📧 Send Message
                  </button>
                  <button className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition">
                    📋 Assign Task
                  </button>
                  <button className="w-full px-4 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg transition">
                    📊 View Report
                  </button>
                  <button className="w-full px-4 py-3 border border-white/20 text-white hover:bg-white/5 rounded-lg transition">
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {selectedTab === 'activities' && (
            <div className="bg-[#002451] rounded-lg border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-yellow-400">Recent Workout Activities</h2>
              </div>
              <div className="divide-y divide-white/10">
                {trainee.recentActivities.map((activity, idx) => (
                  <div key={idx} className="p-6 hover:bg-white/5 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{activity.workout}</h3>
                        <p className="text-sm text-white/60">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-400">{activity.duration} min</p>
                        <p className="text-sm text-red-400">{activity.calories} cal</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {selectedTab === 'tasks' && (
            <div className="bg-[#002451] rounded-lg border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-yellow-400">Assigned Tasks</h2>
              </div>
              {assignedTasks.length === 0 ? (
                <div className="p-12 text-center text-white/60">
                  <p className="text-lg mb-4">No tasks assigned yet</p>
                  <NavLink to="/coach/assign-task" className="text-yellow-400 hover:underline">Assign a task →</NavLink>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {assignedTasks.map(task => (
                    <div key={task.id} className="p-6 hover:bg-white/5 transition">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          {task.title}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.difficulty === 'beginner' ? 'bg-green-400/20 text-green-300' :
                            task.difficulty === 'intermediate' ? 'bg-yellow-400/20 text-yellow-300' :
                            'bg-red-400/20 text-red-300'
                          }`}>
                            {task.difficulty}
                          </span>
                        </h3>
                        <span className="text-sm text-white/60">Due: {task.dueDate}</span>
                      </div>
                      <p className="text-sm text-white/60 mb-3">{task.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-blue-400">⏱️ {task.duration} min</span>
                        <span className="text-green-400">📝 {task.exercises.length} exercises</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
