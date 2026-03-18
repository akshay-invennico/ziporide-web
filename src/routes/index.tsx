import { createBrowserRouter } from 'react-router-dom'
import LoginModal from '../components/auth/LoginModal'
import ForgetPasswordModal from '../components/auth/ForgetPasswordModal'
import VerifyPasswordModal from '../components/auth/VerifyPasswordModal'
import ResetPasswordModal from '../components/auth/ResetPasswordModal'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginModal />,
  },
  {
    path: '/login',
    element: <LoginModal />,
  },
  {
    path: '/forgot-password',
    element: <ForgetPasswordModal />,
  },
  {
    path: '/verify-password',
    element: <VerifyPasswordModal />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordModal />,
  },
])
