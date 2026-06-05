import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRight,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalSuppliers: number;
  criticalStockCount: number;
  outOfStockCount: number;
  criticalStockProducts: any[];
  outOfStockProducts: any[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-xs font-medium tracking-wide">Mise à jour des indicateurs...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-16 max-w-sm mx-auto">
        <p className="text-slate-600 font-medium">Une erreur est survenue lors de la synchronisation des données.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Human Designer Minimalist Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Vue d'ensemble</span>
          <h1 className="text-3xl font-extralight text-slate-900 tracking-tight mt-1">
            Bonjour, <span className="font-normal text-slate-800">{user?.firstName || 'Collaborateur'}</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 max-w-2xl font-light leading-relaxed">
            Voici l'état actuel de votre stock. Vous avez actuellement <span className="font-semibold text-slate-700">{stats.criticalStockCount + stats.outOfStockCount} alerte(s)</span> nécessitant un réapprovisionnement.
          </p>
        </div>
        
        {/* Quick Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Link 
            to="/products" 
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-medium text-xs rounded-lg transition-all shadow-sm"
          >
            <Plus size={14} />
            <span>Nouveau produit</span>
          </Link>
        </div>
      </div>

      {/* Modern High-Contrast Stats Cards Grid (Stripe-like) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'RÉFÉRENCES PRODUITS', value: stats.totalProducts, desc: 'Articles référencés en stock', link: '/products' },
          { label: 'CATÉGORIES', value: stats.totalCategories, desc: 'Familles de produits actives', link: '/categories' },
          { label: 'FOURNISSEURS', value: stats.totalSuppliers, desc: 'Partenaires commerciaux', link: '/suppliers' }
        ].map((item, idx) => (
          <Link 
            key={idx}
            to={item.link} 
            className="group flex flex-col justify-between p-6 bg-slate-50/40 rounded-xl hover:bg-slate-50 transition-all duration-300"
          >
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{item.label}</span>
                <ArrowUpRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-4xl font-extralight text-slate-900 mt-4 tracking-tight">{item.value}</p>
            </div>
            <p className="text-xs text-slate-500 font-light mt-6">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Asymmetric Layout for Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Low Stock (2/3 width) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-slate-800 tracking-tight">Stocks critiques</h2>
              <p className="text-xs text-slate-400 font-light mt-0.5">Produits sous le seuil de sécurité défini</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {stats.criticalStockCount} alertes
            </span>
          </div>

          {stats.criticalStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Produit</th>
                    <th className="pb-3 font-semibold text-right">Seuil d'alerte</th>
                    <th className="pb-3 font-semibold text-right">Stock actuel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-light text-slate-650">
                  {stats.criticalStockProducts.slice(0, 5).map(p => (
                    <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{p.name}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.category?.name || 'Sans catégorie'} &bull; {p.supplier?.name || 'Sans fournisseur'}</p>
                      </td>
                      <td className="py-4 text-right text-slate-400">{p.minQuantity || 10}</td>
                      <td className="py-4 text-right font-medium text-amber-600">{p.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {stats.criticalStockProducts.length > 5 && (
                <div className="pt-4 border-t border-slate-100">
                  <Link to="/products" className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 transition-colors">
                    <span>Afficher tous les articles critiques</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50/40 rounded-xl">
              <p className="text-sm text-slate-500 font-light">Aucun produit en stock critique.</p>
            </div>
          )}
        </div>

        {/* Ruptures (1/3 width) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-slate-800 tracking-tight">Ruptures complètes</h2>
              <p className="text-xs text-slate-400 font-light mt-0.5">Produits épuisés</p>
            </div>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">
              {stats.outOfStockCount}
            </span>
          </div>

          {stats.outOfStockProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.outOfStockProducts.slice(0, 5).map(p => (
                <div 
                  key={p.id} 
                  className="flex items-start justify-between p-4 bg-slate-50/40 hover:bg-slate-50 rounded-xl transition-all group"
                >
                  <div className="min-w-0 pr-4">
                    <p className="font-semibold text-sm text-slate-700 truncate group-hover:text-slate-950 transition-colors">{p.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{p.supplier?.name || 'Fournisseur inconnu'}</p>
                  </div>
                  <span className="text-[10px] font-bold text-red-600 tracking-wider bg-red-50 border border-red-100/50 px-2 py-0.5 rounded shrink-0">
                    RUPTURE
                  </span>
                </div>
              ))}
              {stats.outOfStockProducts.length > 5 && (
                <div className="pt-2">
                  <Link to="/products" className="text-xs font-semibold text-slate-650 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors">
                    <span>Afficher toutes les ruptures</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50/40 rounded-xl">
              <p className="text-sm text-slate-500 font-light">Aucune rupture de stock signalée.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
