import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0C0E]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-xs font-light">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (user && token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await api.post('/api/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Identifiants incorrects ou session invalide. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#0B0C0E] overflow-hidden font-sans z-50">
      <div className="w-full max-w-sm px-6">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-white tracking-tight">GS</h2>
          <p className="text-slate-400 text-xs mt-1 font-light">Gestion professionnelle d'inventaire</p>
        </div>

        {/* Form panel */}
        <div className="bg-[#13151A] border border-slate-900 px-6 py-8 rounded-2xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest" htmlFor="email">
                Adresse email
              </label>
              <input 
                type="email" 
                id="email"
                placeholder="nom@entreprise.com"
                className="w-full px-3.5 py-2.5 bg-[#0B0C0E] border border-slate-800 focus:border-slate-400 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none transition-colors text-sm font-light"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest" htmlFor="password">
                Mot de passe
              </label>
              <input 
                type="password" 
                id="password"
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-[#0B0C0E] border border-slate-800 focus:border-slate-400 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none transition-colors text-sm font-light"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-red-400 text-[11px] leading-normal font-light">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white hover:bg-slate-100 active:bg-slate-200 text-[#0B0C0E] rounded-xl font-medium text-xs py-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-[#0B0C0E] border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                'Se connecter'
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Login;
