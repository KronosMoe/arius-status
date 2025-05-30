import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { AuthProvider } from './components/utils/providers/auth-provider'
import { Toaster } from 'sonner'
import {
  BASE_PATH,
  DASHBOARD_PATH,
  MONITOR_INFO_PATH,
  SETTING_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  STATUS_PATH,
} from './constants/routes'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import Navbar from './components/utils/Navbar'
import Protected from './components/utils/Protected'
import Dashboard from './pages/Dashboard'
import { TooltipProvider } from './components/ui/tooltip'
import Setting from './pages/Setting'
import MonitorInfo from './pages/MonitorInfo'
import StatusPage from './pages/Status'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const location = useLocation()
  const navbarRender = () => {
    switch (location.pathname) {
      case SIGN_IN_PATH:
        return <></>

      case SIGN_UP_PATH:
        return <></>

      case STATUS_PATH:
        return <></>

      default:
        return <Navbar />
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
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
              <Route path={MONITOR_INFO_PATH} element={<MonitorInfo />} />
              <Route path={STATUS_PATH} element={<StatusPage/>}/>
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </DndProvider>
  )
}

export default App
