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

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <AuthPage />;
  return children;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      {/* Show Navbar even if not logged in so users can see the "Menu" link */}
      <Navbar /> 

      <main className='min-h-screen pt-20'>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          
          {/* MOVE MENU OUT OF PROTECTED ROUTE */}
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/" element={<Navigate to="/menu" replace />} />

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
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {isAuthenticated && <Footer />}
    </BrowserRouter>
  );
}
