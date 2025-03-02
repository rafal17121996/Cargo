import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast/ToastProvider';

import LoginPage from './pages/LoginPage';
import DispatcherPage from './pages/DispatcherPage';
import ProtectedRoute from './components/Routes/ProtectedRoute';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dispatcher"
            element={
              <ProtectedRoute>
                <DispatcherPage />
              </ProtectedRoute>
            }
          />
          {/* Other routes... */}
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
