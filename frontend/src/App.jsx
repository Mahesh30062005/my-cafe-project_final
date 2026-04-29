/**
 * App.jsx
 * Root component — sets up React Router with a shared layout.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar   from './components/Navbar';
import Footer   from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import FeedbackPage from './pages/FeedbackPage';
import NotFoundPage from './pages/NotFoundPage';
import AuthPage from './pages/AuthPage';
import OrderPage from './pages/OrderPage';
import CurrentOrdersPage from './pages/CurrentOrdersPage';
import AdminPage from './pages/AdminPage';
import { useAuth } from './context/AuthContext.jsx';

// Updated: Redirects to /login instead of showing the AuthPage inside the route
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      {/* Navbar is now always visible */}
      <Navbar /> 

      <main className='min-h-screen pt-20'>
        <Routes>
          {/* 1. Admin & Public Routes */}
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/login" element={<AuthPage />} />
          
          {/* 2. Default landing page: Auto-redirect to Menu */}
          <Route path="/" element={<Navigate to="/menu" replace />} />

          {/* 3. Protected Routes (Login required) */}
          <Route
            path="/feedback"
            element={(
              <ProtectedRoute>
                <FeedbackPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/order"
            element={(
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            )}
          />
          <Route
            path="/current_orders"
            element={(
              <ProtectedRoute>
                <CurrentOrdersPage />
              </ProtectedRoute>
            )}
          />
          
          {/* 4. Catch-all 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer shows once they are in the app */}
      {isAuthenticated && <Footer />}
    </BrowserRouter>
  );
}