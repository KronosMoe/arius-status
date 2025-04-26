import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { AuthProvider } from './components/utils/providers/auth-provider'
import { Toaster } from 'sonner'
import { BASE_PATH, DASHBOARD_PATH, SETTING_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from './constants/routes'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import Navbar from './components/utils/Navbar'
import Protected from './components/utils/Protected'
import Dashboard from './pages/Dashboard'
import { TooltipProvider } from './components/ui/tooltip'
import Setting from './pages/Setting'

function App() {
  const location = useLocation()
  const navbarRender = () => {
    switch (location.pathname) {
      case SIGN_IN_PATH:
        return <></>

      case SIGN_UP_PATH:
        return <></>

      default:
        return <Navbar />
    }
  }

  return (
    <div>
      <AuthProvider>
        <TooltipProvider>
          {navbarRender()}
          <Toaster />
          <Routes>
            <Route path={BASE_PATH} element={<Home />} />

            <Route path={SIGN_IN_PATH} element={<SignIn />} />
            <Route path={SIGN_UP_PATH} element={<SignUp />} />

            <Route element={<Protected />}>
              <Route path={DASHBOARD_PATH} element={<Dashboard />} />
              <Route path={SETTING_PATH} element={<Setting />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </div>
  )
}

export default App
