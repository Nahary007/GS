import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Product { id: number; name: string; quantity: number; minQuantity: number; }
interface User { id: number; firstName: string; lastName: string; }
interface StockMovement {
  id: number; type: 'IN' | 'OUT'; quantity: number; reason: string; createdAt: string;
  product: Product; user: User;
}

const StockMovements: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [productId, setProductId] = useState<number | ''>('');
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState('');

  const fetchData = async () => {
    try {
      const [movRes, prodRes] = await Promise.all([
        api.get('/api/stocks'),
        api.get('/api/products')
      ]);
      setMovements(movRes.data);
      setProducts(prodRes.data);
    } catch (error) { console.error('Failed to fetch data', error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) return alert("Veuillez sélectionner un produit.");
    if (quantity <= 0) return alert("La quantité doit être supérieure à 0.");
    try {
      await api.post('/api/stocks', { productId, type, quantity, reason });
      setProductId(''); setQuantity(1); setReason('');
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Mouvements de Stock</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-50 p-4 rounded-lg border">
        <div>
          <label className="block text-sm font-medium">Produit</label>
          <select value={productId} onChange={(e) => setProductId(parseInt(e.target.value))} required className="w-full border p-2 rounded">
            <option value="">Sélectionner</option>
            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as 'IN'|'OUT')} className="w-full border p-2 rounded font-bold">
            <option value="IN" className="text-green-600">Entrée (IN)</option>
            <option value="OUT" className="text-red-600">Sortie (OUT)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Quantité</label>
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Motif</label>
          <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optionnel" className="w-full border p-2 rounded" />
        </div>
        <div className="md:col-span-4 flex gap-4 mt-2">
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-bold w-full md:w-auto">Enregistrer le mouvement</button>
        </div>
      </form>

      <h3 className="text-lg font-medium mb-3">Historique des mouvements</h3>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Date</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Produit</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Type</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Qté</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Motif</th>
            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">Utilisateur</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {movements.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">{new Date(m.createdAt).toLocaleString('fr-FR')}</td>
              <td className="px-4 py-3 font-medium">{m.product?.name}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded text-xs font-bold ${m.type === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {m.type === 'IN' ? 'ENTRÉE' : 'SORTIE'}
                </span>
              </td>
              <td className="px-4 py-3 font-bold">{m.quantity}</td>
              <td className="px-4 py-3 text-gray-500">{m.reason || '-'}</td>
              <td className="px-4 py-3 text-gray-500">{m.user?.firstName} {m.user?.lastName}</td>
            </tr>
          ))}
          {movements.length === 0 && <tr><td colSpan={6} className="text-center py-4">Aucun mouvement trouvé.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default StockMovements;
