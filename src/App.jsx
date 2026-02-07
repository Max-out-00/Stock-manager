// import Navbar from 'daisyui/components/navbar'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/auth/Login'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/common/Navbar'

function App() {
  return (
    <>
      <Navbar />
    </>
  )
}

export default App
