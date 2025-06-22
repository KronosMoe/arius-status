import { Route, Routes, useLocation } from 'react-router-dom'
import Home from '@/pages/Home'
import { AuthProvider } from '@/components/util/providers/auth-provider'
import { Toaster } from 'sonner'
import {
  BASE_PATH,
  DASHBOARD_PATH,
  MONITOR_INFO_PATH,
  SETTING_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  STATUS_PAGE_CREATION_PATH,
  STATUS_PAGE_EDIT_PATH,
  STATUS_PAGE_FULL_PATH,
  STATUS_PAGE_PATH,
} from '@/constants/routes'
import SignIn from '@/pages/Auth/SignIn'
import SignUp from '@/pages/Auth/SignUp'
import Protected from '@/components/util/Protected'
import Dashboard from '@/pages/Dashboard'
import { TooltipProvider } from '@/components/ui/tooltip'
import Setting from '@/pages/Setting'
import MonitorInfo from '@/pages/Monitor/_id'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import StatusPages from '@/pages/StatusPage'
import StatusCreation from '@/pages/StatusPage/create'
import StatusPage from '@/pages/StatusPage/_id'
import StatusEditor from '@/pages/StatusPage/edit'
import Navbar from '@/components/util/Navbar'

function App() {
  const location = useLocation()
  const navbarRender = () => {
    if (
      location.pathname === SIGN_IN_PATH ||
      location.pathname === SIGN_UP_PATH ||
      location.pathname === STATUS_PAGE_CREATION_PATH ||
      location.pathname.startsWith('/status/')
    ) {
      return <></>
    }

    return <Navbar />
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

            <Route path={STATUS_PAGE_FULL_PATH} element={<StatusPage />} />

            <Route element={<Protected />}>
              <Route path={DASHBOARD_PATH} element={<Dashboard />} />
              <Route path={SETTING_PATH} element={<Setting />} />
              <Route path={MONITOR_INFO_PATH} element={<MonitorInfo />} />
              <Route path={STATUS_PAGE_PATH} element={<StatusPages />} />
              <Route path={STATUS_PAGE_CREATION_PATH} element={<StatusCreation />} />
              <Route path={STATUS_PAGE_EDIT_PATH} element={<StatusEditor />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </DndProvider>
  )
}

export default App
