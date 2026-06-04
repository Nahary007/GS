import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <header className="bg-white shadow-sm p-4">
            <h1 className="text-2xl font-bold text-primary">Gestion de Stock</h1>
          </header>
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<div>Accès refusé</div>} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<p>Tableau de bord (Protégé)</p>} />
                <Route path="/dashboard" element={<p>Tableau de bord (Protégé)</p>} />
              </Route>
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
