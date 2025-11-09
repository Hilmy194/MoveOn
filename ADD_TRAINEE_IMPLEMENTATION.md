# Add Trainee Flow - Implementation Guide

Guide untuk mengimplementasikan fitur "Add Trainee" di CoachTraineesPage.jsx

---

## Endpoint API yang Sudah Tersedia

### 1. GET Available Trainees
```
GET /api/coach/available-trainees
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "New Trainee",
      "email": "newtrain@trainee.com",
      "avatar": null,
      "status": "active",
      "createdAt": "2024-01-20T10:00:00Z"
    }
  ],
  "count": 1
}
```

### 2. POST Add Trainee to Coach
```
POST /api/coach/:coachId/add-trainee
```

**Body:**
```json
{
  "traineeId": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Trainee added successfully",
  "data": {
    "id": 1,
    "coach_id": 1,
    "trainee_id": 5,
    "status": "active",
    "assigned_date": "2024-01-20T14:30:00Z"
  }
}
```

---

## Implementation Steps

### Step 1: Add Modal Component

Create `Frontend/src/pages/AddTraineeModal.jsx`:

```jsx
import { useState } from 'react'
import api from '../services/api'

export default function AddTraineeModal({ coachId, onClose, onAdded }) {
  const [availableTrainees, setAvailableTrainees] = useState([])
  const [selectedTrainee, setSelectedTrainee] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch available trainees when modal opens
  useState(() => {
    fetchAvailableTrainees()
  }, [])

  const fetchAvailableTrainees = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/coach/${coachId}/available-trainees`)
      setAvailableTrainees(response.data.data || [])
    } catch (err) {
      setError('Failed to load available trainees')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTrainee = async () => {
    if (!selectedTrainee) return

    try {
      setLoading(true)
      const response = await api.post(`/coach/${coachId}/add-trainee`, {
        traineeId: selectedTrainee.id
      })
      
      if (response.data.success) {
        onAdded(selectedTrainee)
        onClose()
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add trainee')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#002451] rounded-lg p-6 max-w-md w-full mx-4 border border-yellow-400/30">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">➕ Add Trainee</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && !availableTrainees.length ? (
          <p className="text-white/60">Loading trainees...</p>
        ) : availableTrainees.length === 0 ? (
          <p className="text-white/60">No available trainees to add</p>
        ) : (
          <>
            <div className="mb-4 max-h-64 overflow-y-auto">
              {availableTrainees.map(trainee => (
                <button
                  key={trainee.id}
                  onClick={() => setSelectedTrainee(trainee)}
                  className={`w-full text-left p-3 rounded mb-2 transition ${
                    selectedTrainee?.id === trainee.id
                      ? 'bg-yellow-400/30 border border-yellow-400'
                      : 'bg-white/5 border border-white/10 hover:border-yellow-400/50'
                  }`}
                >
                  <p className="font-semibold text-white">{trainee.name}</p>
                  <p className="text-xs text-white/60">{trainee.email}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTrainee}
                disabled={!selectedTrainee || loading}
                className="flex-1 px-4 py-2 rounded-lg bg-yellow-400 text-[#001a3d] font-semibold hover:bg-yellow-300 transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
```

### Step 2: Update CoachTraineesPage.jsx

Add state dan handler:

```jsx
const [showAddModal, setShowAddModal] = useState(false)

const handleTraineeAdded = async (trainee) => {
  // Refresh trainees list
  const response = await api.get('/coach/trainees')
  setTrainees(response.data.data || [])
  setShowAddModal(false)
}
```

Add button di header:

```jsx
<div className="px-6 md:px-16 py-8 border-b border-white/10">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <div>
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">👥 Your Trainees</h1>
      <p className="text-white/70">Monitor performance, statistics, and progress of all your trainees</p>
    </div>
    <button
      onClick={() => setShowAddModal(true)}
      className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-[#001a3d] font-semibold rounded-lg transition"
    >
      ➕ Add Trainee
    </button>
  </div>
</div>
```

Add modal rendering:

```jsx
{showAddModal && (
  <AddTraineeModal
    coachId={user?.id}
    onClose={() => setShowAddModal(false)}
    onAdded={handleTraineeAdded}
  />
)}
```

---

## Remove Trainee Implementation

Add function ke CoachTraineesPage.jsx:

```jsx
const handleRemoveTrainee = async (traineeId) => {
  if (!window.confirm('Are you sure? This will remove the trainee and all their data.')) {
    return
  }

  try {
    const response = await api.delete(`/coach/${user.id}/remove-trainee/${traineeId}`)
    if (response.data.success) {
      // Refresh list
      const traineesResponse = await api.get('/coach/trainees')
      setTrainees(traineesResponse.data.data || [])
    }
  } catch (error) {
    console.error('Failed to remove trainee:', error)
  }
}
```

Add remove button di trainee card:

```jsx
<button
  onClick={(e) => {
    e.preventDefault()
    handleRemoveTrainee(trainee.id)
  }}
  className="w-full mt-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-1 rounded-lg transition text-sm"
>
  🗑️ Remove
</button>
```

---

## Testing Add Trainee Flow

1. **Login as Coach**
2. **Go to Trainees Page**
3. **Click "➕ Add Trainee"**
4. **Select trainee from modal**
5. **Click Add**
6. **Trainee should appear in list**

---

## Status

- ✅ Backend endpoints ready (`/available-trainees`, `/add-trainee`, `/remove-trainee`)
- ⏳ Frontend modal needs to be created
- ⏳ Add button needs to be added to header
- ⏳ Remove button needs to be added to trainee cards

---

**Ready to implement?** Create the AddTraineeModal.jsx first, then update CoachTraineesPage.jsx!
