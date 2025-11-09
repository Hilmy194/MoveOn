import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App, { HomeLanding } from './App.jsx'
import FeaturesPage from './pages/Features.jsx'
import FeatureDetail from './pages/FeatureDetail.jsx'
import LoginPage from './pages/Login.jsx'
import RegisterPage from './pages/Register.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: '/', element: <HomeLanding /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/feature/:slug', element: <FeatureDetail /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
