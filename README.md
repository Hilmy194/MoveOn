# 🏋️ MoveOn - Fitness Coaching Platform

<div align="center">

![MoveOn Logo](https://img.shields.io/badge/MoveOn-Fitness%20Platform-yellow?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-ISC-green?style=for-the-badge)

**A comprehensive fitness coaching platform connecting coaches with trainees for personalized workout plans and nutrition guidance.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## 🎯 About

**MoveOn** is a modern fitness coaching platform designed to bridge the gap between professional coaches and trainees. The platform provides comprehensive tools for workout management, progress tracking, meal planning with AI assistance, and real-time communication between coaches and their clients.

### Key Highlights

- 🎓 **Role-Based System**: Separate interfaces for coaches and trainees
- 💪 **Workout Management**: Create, assign, and track workout tasks
- 🤖 **AI-Powered Meal Planning**: Personalized nutrition plans using Google Gemini AI
- 📊 **Progress Tracking**: Visual analytics and performance metrics
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

---

## ✨ Features

### For Coaches 👨‍🏫

- ✅ **Trainee Management**: Add, monitor, and manage multiple trainees
- ✅ **Task Assignment**: Create and assign customized workout tasks
- ✅ **Template Library**: Pre-built workout templates for quick assignment
- ✅ **Progress Monitoring**: Track trainee performance and completion rates
- ✅ **Analytics Dashboard**: Comprehensive statistics and insights
- ✅ **Notifications**: Real-time updates on trainee activities
- ✅ **Profile Management**: Customize coach profile and credentials

### For Trainees 💪

- ✅ **Personalized Dashboard**: View assigned tasks and progress
- ✅ **Task Management**: Track, start, and complete workout assignments
- ✅ **Progress Tracking**: Monitor personal fitness journey
- ✅ **AI Meal Planner**: Generate customized meal plans based on goals
- ✅ **Submission System**: Submit workout results and feedback
- ✅ **Chat Support**: Communicate directly with assigned coach
- ✅ **Profile Customization**: Manage personal information and goals

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react) | UI Framework |
| ![Vite](https://img.shields.io/badge/Vite-7.1.7-646CFF?logo=vite) | Build Tool |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.18-38B2AC?logo=tailwind-css) | Styling |
| ![React Router](https://img.shields.io/badge/React_Router-7.9.4-CA4245?logo=react-router) | Routing |
| ![Axios](https://img.shields.io/badge/Axios-1.6.2-5A29E4?logo=axios) | HTTP Client |

### Backend

| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js) | Runtime Environment |
| ![Express](https://img.shields.io/badge/Express-4.18.2-000000?logo=express) | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-8.0.0-47A248?logo=mongodb) | Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-8.0.0-880000?logo=mongoose) | ODM |
| ![JWT](https://img.shields.io/badge/JWT-9.0.0-000000?logo=json-web-tokens) | Authentication |
| ![Bcrypt](https://img.shields.io/badge/Bcrypt-2.4.3-338933) | Password Hashing |

### AI Integration

| Technology | Purpose |
|------------|---------|
| ![Google Gemini](https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google) | Meal Plan Generation |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB Atlas Account** - [Sign Up](https://www.mongodb.com/cloud/atlas)
- **Google Gemini API Key** - [Get API Key](https://ai.google.dev/)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Hilmy194/MoveOn.git
cd MoveOn
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
# Copy the content below and update with your credentials
```

Create `.env` file in Backend folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/MoveOn?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=24h
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

```bash
# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd Frontend

# Install dependencies
npm install

# Create .env.local file
# Copy the content below
```

Create `.env.local` file in Frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

```bash
# Start frontend development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## ⚙️ Configuration

### MongoDB Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for development)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Google Gemini API Setup

1. **Get API Key**
   - Visit [Google AI Studio](https://ai.google.dev/)
   - Sign in with Google account
   - Create new API key
   - Copy the API key to your `.env.local` file

### Database Initialization

The MongoDB collections will be created automatically when you run the application. The main collections include:

- `users` - User accounts (coaches and trainees)
- `tasks` - Workout tasks
- `taskassignments` - Task assignments to trainees
- `traineesubmissions` - Workout submissions
- `notifications` - System notifications
- `workouttemplates` - Pre-built workout templates

---

## 📖 Usage

### Running the Full Application

**Option 1: Run Separately** (Recommended for Development)

Terminal 1 - Backend:
```bash
cd Backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd Frontend
npm run dev
```

**Option 2: Run Concurrently** (If configured)

```bash
cd Frontend
npm run dev:full
```

### Accessing the Application

1. Open your browser and navigate to: `http://localhost:5173`
2. You'll see the login page

### Test Accounts

Use these credentials to test the application:

**Coach Account:**
- Username: `coach1`
- Password: `password123`

**Trainee Account:**
- Username: `trainee1`
- Password: `password123`

### Creating New Accounts

1. Click "Register Here" on the login page
2. Fill in the registration form
3. Select role (Coach or Trainee)
4. Submit to create account

---

## 📁 Project Structure

```
MoveOn/
├── Backend/                    # Backend Node.js application
│   ├── database/
│   │   └── init.sql           # Database schema (reference)
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── db_mongo.js    # MongoDB connection
│   │   │   └── jwt.js         # JWT configuration
│   │   ├── controllers/       # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── coach.controller.js
│   │   │   ├── trainee.controller.js
│   │   │   ├── task.controller.js
│   │   │   ├── assignment.controller.js
│   │   │   ├── submission.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── notification.controller.js
│   │   │   ├── template.controller.js
│   │   │   └── mealplan.controller.js
│   │   ├── middleware/        # Custom middleware
│   │   │   ├── authMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── UserModel.js
│   │   │   ├── TaskModel.js
│   │   │   ├── TaskAssignmentModel.js
│   │   │   ├── TraineeSubmissionModel.js
│   │   │   ├── NotificationModel.js
│   │   │   ├── WorkoutTemplateModel.js
│   │   │   └── CoachTraineeModel.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── coach.routes.js
│   │   │   ├── trainee.routes.js
│   │   │   ├── task.routes.js
│   │   │   ├── assignment.routes.js
│   │   │   ├── submission.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── notification.routes.js
│   │   │   ├── template.routes.js
│   │   │   └── mealplan.routes.js
│   │   └── utils/             # Utility functions
│   │       ├── response.js
│   │       └── validator.js
│   ├── .env                   # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js              # Entry point
│
├── Frontend/                   # Frontend React application
│   ├── public/                # Static assets
│   ├── server/                # Express server for API proxy
│   │   └── index.js
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── components/        # Reusable components
│   │   │   ├── AddTraineeModal.jsx
│   │   │   └── DesignSystem.jsx
│   │   ├── context/           # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── CoachDashboard.jsx
│   │   │   ├── CoachTraineesPage.jsx
│   │   │   ├── CoachTraineeDetail.jsx
│   │   │   ├── CoachTasks.jsx
│   │   │   ├── CoachAssignTask.jsx
│   │   │   ├── CoachStatistics.jsx
│   │   │   ├── TraineeDashboard.jsx
│   │   │   ├── TraineeTasks.jsx
│   │   │   ├── TraineeTaskDetail.jsx
│   │   │   ├── TraineeProgress.jsx
│   │   │   ├── TraineeProfile.jsx
│   │   │   ├── AIAssistant.jsx
│   │   │   ├── MealPlanner.jsx
│   │   │   ├── Chat.jsx
│   │   │   ├── Features.jsx
│   │   │   └── FeatureDetail.jsx
│   │   ├── services/          # API services
│   │   │   ├── api.js
│   │   │   ├── aiClient.js
│   │   │   └── geminiService.js
│   │   ├── App.jsx            # Main app component
│   │   ├── App.css
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── .env.local             # Environment variables
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── eslint.config.js
│
└── README.md                   # This file
```

---

## 🔌 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected routes require JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Main Endpoints

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |

#### Coach Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/coach/trainees` | Get all trainees | Yes (Coach) |
| POST | `/coach/trainees` | Add new trainee | Yes (Coach) |
| GET | `/coach/trainees/:id` | Get trainee details | Yes (Coach) |
| DELETE | `/coach/trainees/:id` | Remove trainee | Yes (Coach) |
| GET | `/coach/dashboard` | Get coach dashboard stats | Yes (Coach) |

#### Task Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | Get all tasks | Yes |
| POST | `/tasks` | Create new task | Yes (Coach) |
| GET | `/tasks/:id` | Get task details | Yes |
| PUT | `/tasks/:id` | Update task | Yes (Coach) |
| DELETE | `/tasks/:id` | Delete task | Yes (Coach) |

#### Assignment Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/assignments` | Get assignments | Yes |
| POST | `/assignments` | Assign task to trainee | Yes (Coach) |
| PUT | `/assignments/:id/status` | Update assignment status | Yes |

#### Trainee Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/trainee/dashboard` | Get trainee dashboard | Yes (Trainee) |
| GET | `/trainee/tasks` | Get assigned tasks | Yes (Trainee) |
| GET | `/trainee/progress` | Get progress data | Yes (Trainee) |

#### Submission Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/submissions` | Submit task completion | Yes (Trainee) |
| GET | `/submissions/:assignmentId` | Get submission details | Yes |

#### Notification Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get all notifications | Yes |
| PUT | `/notifications/:id/read` | Mark as read | Yes |

#### Template Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/templates` | Get workout templates | Yes |
| POST | `/templates` | Create template | Yes (Coach) |

#### Meal Plan Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/mealplan/generate` | Generate AI meal plan | Yes |

### Example API Request

```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'coach1',
    password: 'password123'
  })
});

const data = await response.json();
// Returns: { success: true, token: "jwt_token", user: {...} }

// Get Coach Dashboard (Authenticated)
const dashboardResponse = await fetch('http://localhost:5000/api/coach/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the powerful database
- Google for Gemini AI API
- TailwindCSS for the utility-first CSS framework
- All contributors and testers

---

## 🔄 Version History

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ Coach and trainee dashboards
- ✅ Task management system
- ✅ AI meal planner integration
- ✅ Progress tracking
- ✅ Notification system
- ✅ Real-time chat

### Future Updates
- 🔜 Video exercise demonstrations
- 🔜 Mobile app (React Native)
- 🔜 Advanced analytics
- 🔜 Social features
- 🔜 Workout reminders
- 🔜 Payment integration

---

<div align="center">

### Made with ❤️ by MoveOn Team

**⭐ Star this repo if you find it helpful!**

[Back to Top](#️-moveon---fitness-coaching-platform)

</div>
