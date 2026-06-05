import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import StockMovements from './pages/StockMovements';
import Dashboard from './pages/Dashboard';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Package, 
  ArrowUpDown, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon
} from 'lucide-react';

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return <>{children}</>;
  }

  const navItems = [
    { path: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
    { path: '/products', label: 'Produits', icon: Package },
    { path: '/categories', label: 'Catégories', icon: FolderKanban },
    { path: '/suppliers', label: 'Fournisseurs', icon: Users },
    { path: '/stocks', label: 'Flux de Stock', icon: ArrowUpDown },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row text-slate-800">
      
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between bg-[#0B0C0E] text-white px-6 py-4 sticky top-0 z-30 border-b border-slate-800/40">
        <span className="font-medium text-base tracking-tight">StockPro</span>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Nav Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/20 backdrop-blur-xs z-40 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Drawer */}
      <aside className={`
        md:hidden fixed inset-y-0 left-0 w-64 bg-[#0B0C0E] text-white z-50 transform transition-transform duration-300 ease-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-900 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">StockPro</span>
          <button onClick={closeMobileMenu} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-light text-sm transition-all
                  ${isActive 
                    ? 'bg-white/10 text-white font-normal' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & logout mobile */}
        <div className="p-6 border-t border-slate-900 bg-slate-950/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-200 font-medium text-xs">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-xs truncate text-white">{user.firstName} {user.lastName}</p>
              <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
            </div>
          </div>
          <button 
            onClick={() => { logout(); closeMobileMenu(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-xs transition-all border border-slate-800"
          >
            <LogOut size={12} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar (Ultra clean Linear-style) */}
      <aside className="hidden md:flex flex-col w-60 bg-[#0B0C0E] text-white h-screen sticky top-0 overflow-y-auto z-20 border-r border-slate-950 shrink-0">
        <div className="p-6 border-b border-slate-900 flex items-center gap-3">
          <span className="font-semibold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">StockPro</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-light transition-all
                  ${isActive 
                    ? 'bg-white/10 text-white font-medium shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={14} className="opacity-80" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile & logout desktop */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/20 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-slate-200 font-medium text-xs">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-xs truncate text-white">{user.firstName} {user.lastName}</p>
              <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-[11px] transition-all border border-slate-900 hover:border-red-950/50"
          >
            <LogOut size={12} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Desktop Top Statusbar */}
        <header className="hidden md:flex items-center justify-end px-8 py-4 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3 text-slate-400 font-light text-xs">
            <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-slate-200">|</span>
            <div className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/50">
              <UserIcon size={12} className="text-slate-400" />
              <span className="text-[11px] font-medium">{user.email}</span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md mx-auto my-12 border border-slate-150">
                <h3 className="text-red-500 font-bold text-xl mb-2">Accès refusé</h3>
                <p className="text-slate-500 text-sm">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
              </div>
            } />
            
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
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
