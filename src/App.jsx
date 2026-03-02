// import Navbar from 'daisyui/components/navbar'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/auth/Login'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/common/Navbar'
import Dashboard from './pages/dashboard/Dashboard'

function App() {
  return (
    <>
      <Navbar />
      <Dashboard/>
    </>
  )
}

export default App
