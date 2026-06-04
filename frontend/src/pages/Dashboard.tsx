import React, { useState, useEffect } from 'react';
import api from '../services/api';

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
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-6 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Tableau de Bord</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Produits</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalProducts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Catégories</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalCategories}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Fournisseurs</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalSuppliers}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-orange-50 p-6 rounded-lg shadow-sm border border-orange-200">
          <h3 className="text-orange-800 text-lg font-bold mb-4 flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            Alerte Stock Faible ({stats.criticalStockCount})
          </h3>
          {stats.criticalStockProducts.length > 0 ? (
            <ul className="space-y-2">
              {stats.criticalStockProducts.slice(0, 5).map(p => (
                <li key={p.id} className="flex justify-between items-center text-sm border-b pb-1">
                  <span>{p.name} <span className="text-gray-500 text-xs">({p.category?.name})</span></span>
                  <span className="font-bold text-orange-600">{p.quantity} en stock</span>
                </li>
              ))}
              {stats.criticalStockProducts.length > 5 && <li className="text-sm text-gray-500 text-center mt-2">...et d'autres</li>}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucun produit en stock faible.</p>
          )}
        </div>

        <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200">
          <h3 className="text-red-800 text-lg font-bold mb-4 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            Rupture de Stock ({stats.outOfStockCount})
          </h3>
          {stats.outOfStockProducts.length > 0 ? (
            <ul className="space-y-2">
              {stats.outOfStockProducts.slice(0, 5).map(p => (
                <li key={p.id} className="flex justify-between items-center text-sm border-b pb-1">
                  <span>{p.name} <span className="text-gray-500 text-xs">({p.category?.name})</span></span>
                  <span className="font-bold text-red-600">0 en stock</span>
                </li>
              ))}
              {stats.outOfStockProducts.length > 5 && <li className="text-sm text-gray-500 text-center mt-2">...et d'autres</li>}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Aucun produit en rupture.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
