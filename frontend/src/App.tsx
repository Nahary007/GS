import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import StockMovements from './pages/StockMovements';
import Dashboard from './pages/Dashboard';

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">Gestion de Stock</h1>
      {user && (
        <nav className="flex items-center gap-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-primary">Dashboard</Link>
          <Link to="/categories" className="text-gray-600 hover:text-primary">Catégories</Link>
          <Link to="/suppliers" className="text-gray-600 hover:text-primary">Fournisseurs</Link>
          <Link to="/products" className="text-gray-600 hover:text-primary">Produits</Link>
          <Link to="/stocks" className="text-gray-600 hover:text-primary">Mouvements Stock</Link>
          <button onClick={logout} className="text-red-500 hover:text-red-700 ml-4">Déconnexion</button>
        </nav>
      )}
    </header>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<div>Accès refusé</div>} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/stocks" element={<StockMovements />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
