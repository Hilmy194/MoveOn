import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { Button, Card, StatCard, Badge, ProgressBar, Skeleton } from '../components/DesignSystem'

export default function TraineeDashboard() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    totalCalories: 0,
    totalHours: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return

        console.log('📥 Fetching trainee data...')

        // Fetch assigned tasks
        const assignRes = await api.get(`/trainee/assignments`)
        const tasks = assignRes.data.data || []
        setAssignments(tasks)
        console.log('✅ Assignments fetched:', tasks)

        // Calculate stats
        const completed = tasks.filter(t => t.status === 'completed').length
        const inProgress = tasks.filter(t => t.status === 'in_progress').length

        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          inProgressTasks: inProgress,
          totalCalories: 0,
          totalHours: tasks.reduce((acc, t) => acc + (t.duration || 0), 0) / 60,
        })
      } catch (err) {
        console.error('❌ Error fetching data:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const completionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a3d] to-[#002451] text-white pb-20">
      {/* Header */}
      <div className="px-6 md:px-16 py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                <span className="text-yellow-400">💪 My Fitness Journey</span>
              </h1>
              <p className="text-white/70 mt-1">Welcome back, {user?.name}! Here are your assigned tasks.</p>
            </div>
            <Button 
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/trainee/profile'}
            >
              👤 Profile
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {loading ? (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          ) : (
            <>
              <StatCard 
                icon="📋" 
                label="Total Tasks" 
                value={stats.totalTasks.toString()}
              />
              <StatCard 
                icon="✅" 
                label="Completed" 
                value={stats.completedTasks.toString()}
                trend={Math.round((stats.completedTasks / stats.totalTasks) * 100)}
              />
              <StatCard 
                icon="⏳" 
                label="In Progress" 
                value={stats.inProgressTasks.toString()}
              />
              <StatCard 
                icon="⏱️" 
                label="Total Hours" 
                value={stats.totalHours.toFixed(1)}
              />
              <StatCard 
                icon="🔥" 
                label="Progress" 
                value={`${completionPercentage}%`}
                trend={completionPercentage}
              />
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-lg">Overall Progress</h3>
              <span className="text-sm text-yellow-400 font-bold">{completionPercentage}%</span>
            </div>
            <ProgressBar 
              value={completionPercentage}
              max={100}
              color="primary"
            />
            <p className="text-xs text-white/60 mt-3">
              {stats.completedTasks} of {stats.totalTasks} tasks completed
            </p>
          </Card>
        </div>
      </div>

      {/* Active Tasks */}
      <div className="px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-blue-400/10 to-transparent p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-400">📝 Your Assigned Tasks</h2>
              <NavLink to="/trainee/tasks" className="text-xs text-yellow-400 hover:underline font-medium">
                View All →
              </NavLink>
            </div>

            {loading ? (
              <div className="p-8 text-center text-white/50">⏳ Loading tasks...</div>
            ) : assignments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <p className="text-white/70 mb-4">No tasks assigned yet</p>
                <p className="text-sm text-white/50">Your coach will assign tasks here. Check back soon!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {assignments.slice(0, 5).map(task => (
                  <NavLink
                    key={task.id}
                    to={`/trainee/task/${task.id}`}
                    className="block p-6 hover:bg-white/5 transition group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-white group-hover:text-yellow-400 transition text-lg">
                            {task.title}
                          </h3>
                          <Badge variant={
                            task.status === 'completed' ? 'success' :
                            task.status === 'in_progress' ? 'info' :
                            task.status === 'assigned' ? 'warning' :
                            'default'
                          }>
                            {task.status === 'completed' ? '✅ Done' :
                             task.status === 'in_progress' ? '⏳ In Progress' :
                             task.status === 'assigned' ? '📋 Assigned' :
                             'Skipped'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-white/60 mb-3">{task.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-white/50">
                          <span>📅 {task.difficulty || 'N/A'} Level</span>
                          <span>⏱️ {task.duration ? `${task.duration} mins` : 'N/A'}</span>
                          {task.due_date && <span>📍 Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <div className="text-white/70">{task.exercise_count || 0} exercises</div>
                        <div className="text-yellow-400 font-semibold mt-1">
                          {task.status === 'completed' ? '100%' : '0%'}
                        </div>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="text-center group hover:shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <NavLink to="/trainee/tasks" className="block">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-semibold text-white group-hover:text-yellow-400 transition">All Tasks</h3>
                <p className="text-xs text-white/60 mt-1">View all assigned tasks</p>
              </NavLink>
            </Card>

            <Card className="text-center group hover:shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <NavLink to="/trainee/progress" className="block">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold text-white group-hover:text-yellow-400 transition">Progress</h3>
                <p className="text-xs text-white/60 mt-1">Track your fitness progress</p>
              </NavLink>
            </Card>

            <Card className="text-center group hover:shadow-lg hover:scale-105 transition-transform cursor-pointer">
              <NavLink to="/trainee/profile" className="block">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-semibold text-white group-hover:text-yellow-400 transition">Profile</h3>
                <p className="text-xs text-white/60 mt-1">Edit your profile info</p>
              </NavLink>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
