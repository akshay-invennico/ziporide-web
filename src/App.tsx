import { AdminNotificationsProvider } from './context/AdminNotificationsContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminNotificationsProvider>
          <AppRoutes />
        </AdminNotificationsProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
