import { Navigate, Route, Routes } from 'react-router-dom'
import { ChangePage, ForgetPage, MainPage, SignIn } from 'src/components/page'
import { isAuthenticated } from 'src/helper/constants'
import { routes } from './config/config.routes'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={routes.default} element={<SignIn />} />
      <Route path={routes.forget} element={<ForgetPage />} />
      <Route path={routes.change} element={<ChangePage />} />
      <Route path={routes.main} element={ isAuthenticated ? <MainPage /> : <Navigate to='/' />} />
    </Routes>
  )
}

export default AppRoutes
