# 🏋️ MoveOn - Fitness Coaching Platform

Platform coaching fitness yang menghubungkan coach dengan trainee untuk manajemen workout, tracking progress, dan komunikasi.

## 📋 Features

### For Coaches:
- 📊 Dashboard management trainees
- 👥 Manage multiple trainees
- 📝 Create and assign workout tasks
- 📈 Track trainee progress
- 💬 Direct chat with trainees
- 🎯 Custom workout templates

### For Trainees:
- 📱 Personal dashboard
- ✅ View and complete assigned tasks
- 📊 Track personal progress
- 💬 Chat with coach
- 📸 Submit workout proof

## 🛠️ Tech Stack

### Frontend:
- **React** + **Vite** - Fast development build tool
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

### Backend:
- **Node.js** + **Express** - Server framework
- **MongoDB** - Primary database (using Mongoose)
- **PostgreSQL** - Optional secondary database (Supabase)
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
MoveOn/
├── Backend/          # Express API server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── server.js
├── Frontend/         # Main React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── context/
│   └── index.html
└── my-project/       # Additional frontend module
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- npm or yarn
- MongoDB account (MongoDB Atlas recommended)
- (Optional) PostgreSQL/Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/MoveOn.git
cd MoveOn
```

2. **Backend Setup**
```bash
cd Backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials
```

3. **Frontend Setup**
```bash
cd ../Frontend
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your backend URL
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start Backend Server**
```bash
cd Backend
npm start
# Server runs on http://localhost:5000
```

2. **Start Frontend Development Server**
```bash
cd Frontend
npm run dev
# App runs on http://localhost:5173
```

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

### Coach Routes
- `GET /coach/trainees` - Get all trainees
- `POST /coach/trainees` - Add new trainee
- `GET /coach/trainees/:id` - Get trainee detail
- `DELETE /coach/trainees/:id` - Remove trainee

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

### Trainees
- `GET /trainee/tasks` - Get assigned tasks
- `POST /trainee/tasks/:id/submit` - Submit task completion
- `GET /trainee/progress` - Get progress data

See [TRAINEE_API.md](./TRAINEE_API.md) for detailed API documentation.

## 🧪 Testing

```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd Frontend
npm test
```

## 📖 Documentation

- [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Coach Features](./Frontend/COACH_FEATURES.md)
- [Trainee Testing Guide](./TRAINEE_TESTING_GUIDE.md)
- [PostgreSQL Setup](./POSTGRES_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern fitness coaching needs
- Built with ❤️ using React and Node.js

## 📞 Support

For support, email support@moveon.com or join our Slack channel.

---

**Happy Coding! 💪**
