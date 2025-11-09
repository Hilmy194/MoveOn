import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function TraineeProgress() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalDuration: 0,
    totalCalories: 0,
    streak: 0,
    weeklyActivities: [],
  })

  // Safe getter with default values
  const safeStats = {
    totalTasks: stats?.totalTasks || 0,
    completedTasks: stats?.completedTasks || 0,
    totalDuration: stats?.totalDuration || 0,
    totalCalories: stats?.totalCalories || 0,
    streak: stats?.streak || 0,
    weeklyActivities: stats?.weeklyActivities || [],
  }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return

        console.log('📥 Fetching progress data...')

        const res = await api.get(`/trainee/progress`)
        const data = res.data.data || {}
        setStats({
          totalTasks: data.totalTasks || 0,
          completedTasks: data.completedTasks || 0,
          totalDuration: data.totalDuration || 0,
          totalCalories: data.totalCalories || 0,
          streak: data.streak || 0,
          weeklyActivities: data.weeklyActivities || [],
        })
        console.log('✅ Progress fetched:', data)
      } catch (err) {
        console.error('❌ Error fetching progress:', err.message)
        // Set demo data if API fails
        setStats({
          totalTasks: 10,
          completedTasks: 6,
          totalDuration: 450,
          totalCalories: 3500,
          streak: 5,
          weeklyActivities: [
            { day: 'Mon', tasks: 1, duration: 60, calories: 450 },
            { day: 'Tue', tasks: 2, duration: 120, calories: 850 },
            { day: 'Wed', tasks: 1, duration: 45, calories: 350 },
            { day: 'Thu', tasks: 0, duration: 0, calories: 0 },
            { day: 'Fri', tasks: 2, duration: 105, calories: 750 },
            { day: 'Sat', tasks: 1, duration: 60, calories: 400 },
            { day: 'Sun', tasks: 1, duration: 60, calories: 700 },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const completionPercentage = safeStats.totalTasks > 0 
    ? Math.round((safeStats.completedTasks / safeStats.totalTasks) * 100)
    : 0

  const avgDurationPerTask = safeStats.completedTasks > 0 
    ? Math.round(safeStats.totalDuration / safeStats.completedTasks)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a3d] to-[#002451] text-white pb-20">
      {/* Header */}
      <div className="px-6 md:px-16 py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-yellow-400">📊 Your Progress</span>
          </h1>
          <p className="text-white/70">Track your fitness journey and achievements</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Completion Rate */}
          <div className="bg-gradient-to-br from-[#003266] to-[#002451] rounded-lg p-6 border border-yellow-400/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-medium">Completion Rate</p>
                <h3 className="text-4xl font-bold text-yellow-400 mt-2">{loading ? '...' : completionPercentage}%</h3>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
            <p className="text-xs text-white/60">{safeStats.completedTasks} of {safeStats.totalTasks} tasks</p>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-[#003266] to-[#002451] rounded-lg p-6 border border-red-400/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-medium">Current Streak</p>
                <h3 className="text-4xl font-bold text-red-400 mt-2">{loading ? '...' : safeStats.streak}</h3>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
            <p className="text-xs text-white/60">Days in a row</p>
          </div>

          {/* Total Duration */}
          <div className="bg-gradient-to-br from-[#003266] to-[#002451] rounded-lg p-6 border border-blue-400/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Duration</p>
                <h3 className="text-4xl font-bold text-blue-400 mt-2">{loading ? '...' : (safeStats.totalDuration / 60).toFixed(1)}</h3>
              </div>
              <div className="text-3xl">⏱️</div>
            </div>
            <p className="text-xs text-white/60">hours trained</p>
          </div>

          {/* Total Calories */}
          <div className="bg-gradient-to-br from-[#003266] to-[#002451] rounded-lg p-6 border border-green-400/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/70 text-sm font-medium">Calories Burned</p>
                <h3 className="text-4xl font-bold text-green-400 mt-2">{loading ? '...' : (safeStats.totalCalories || 0).toLocaleString()}</h3>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
            <p className="text-xs text-white/60">total calories</p>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#002451] rounded-lg p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-8">📅 Weekly Activity</h2>

            {loading ? (
              <div className="text-center text-white/50">⏳ Loading...</div>
            ) : (
              <div className="space-y-8">
                {/* Tasks per day */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tasks Completed</h3>
                  <div className="flex items-end justify-around gap-2 h-48 mb-4">
                    {stats.weeklyActivities?.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div className="w-full bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg transition-all hover:opacity-80" style={{
                          height: `${Math.max(20, (day.tasks || 0) * 40)}px`,
                          minHeight: '20px'
                        }}>
                          {day.tasks > 0 && (
                            <div className="text-white text-xs font-bold text-center mt-1">{day.tasks}</div>
                          )}
                        </div>
                        <div className="text-xs text-white/60 mt-3 font-medium">{day.day}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration per day */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Training Time (minutes)</h3>
                  <div className="flex items-end justify-around gap-2 h-48 mb-4">
                    {safeStats.weeklyActivities?.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div className="w-full bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-lg transition-all hover:opacity-80" style={{
                          height: `${Math.max(20, (day.duration || 0) / 2)}px`,
                          minHeight: '20px'
                        }}>
                          {day.duration > 0 && (
                            <div className="text-white text-xs font-bold text-center mt-1">{day.duration}</div>
                          )}
                        </div>
                        <div className="text-xs text-white/60 mt-3 font-medium">{day.day}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calories per day */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Calories Burned</h3>
                  <div className="flex items-end justify-around gap-2 h-48">
                    {safeStats.weeklyActivities?.map((day, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1">
                        <div className="w-full bg-gradient-to-t from-green-400 to-green-300 rounded-t-lg transition-all hover:opacity-80" style={{
                          height: `${Math.max(20, (day.calories || 0) / 20)}px`,
                          minHeight: '20px'
                        }}>
                          {day.calories > 0 && (
                            <div className="text-white text-xs font-bold text-center mt-1">{day.calories}</div>
                          )}
                        </div>
                        <div className="text-xs text-white/60 mt-3 font-medium">{day.day}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="px-6 md:px-16 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Achievements */}
          <div className="bg-[#002451] rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-6">🏆 Achievements</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-[#001a3d] rounded-lg border border-yellow-400/20">
                <div className="text-3xl">🎯</div>
                <div>
                  <div className="font-semibold">25% Complete</div>
                  <div className="text-xs text-white/60">Completed 1/4 of tasks</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#001a3d] rounded-lg border border-green-400/20">
                <div className="text-3xl">🔥</div>
                <div>
                  <div className="font-semibold">{safeStats.streak > 3 ? 'Hot Streak!' : 'Building Momentum'}</div>
                  <div className="text-xs text-white/60">Keep up the consistency!</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#001a3d] rounded-lg border border-blue-400/20">
                <div className="text-3xl">💪</div>
                <div>
                  <div className="font-semibold">Dedicated</div>
                  <div className="text-xs text-white/60">You're following your program</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-[#002451] rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-bold mb-6">📈 Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-[#001a3d] rounded-lg">
                <div className="text-sm text-white/70">Avg. Duration per Task</div>
                <div className="text-lg font-bold text-yellow-400">{avgDurationPerTask} min</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#001a3d] rounded-lg">
                <div className="text-sm text-white/70">Tasks Remaining</div>
                <div className="text-lg font-bold text-blue-400">{safeStats.totalTasks - safeStats.completedTasks}</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#001a3d] rounded-lg">
                <div className="text-sm text-white/70">Avg. Calories/Task</div>
                <div className="text-lg font-bold text-green-400">
                  {safeStats.completedTasks > 0 ? Math.round(safeStats.totalCalories / safeStats.completedTasks) : 0}
                </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#001a3d] rounded-lg">
                <div className="text-sm text-white/70">Best Day</div>
                <div className="text-lg font-bold text-red-400">
                  {safeStats.weeklyActivities?.length > 0 
                    ? safeStats.weeklyActivities.reduce((max, day) => ((day?.tasks || 0) > (max?.tasks || 0)) ? day : max, {day: 'N/A', tasks: 0}).day 
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
