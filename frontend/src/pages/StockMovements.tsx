import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Boxes
} from 'lucide-react';

interface Product { id: number; name: string; quantity: number; minQuantity: number; }
interface UserData { id: number; firstName: string; lastName: string; }
interface StockMovement {
  id: number; 
  type: 'IN' | 'OUT'; 
  quantity: number; 
  reason: string; 
  createdAt: string;
  product: Product; 
  user: UserData;
}

const StockMovements: React.FC = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [productId, setProductId] = useState<number | ''>('');
  const [type, setType] = useState<'IN' | 'OUT'>('IN');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState('');
  
  // History Filter state
  const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [movRes, prodRes] = await Promise.all([
        api.get('/api/stocks'),
        api.get('/api/products')
      ]);
      setMovements(movRes.data);
      setProducts(prodRes.data);
    } catch (error) { 
      console.error('Failed to fetch data', error); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

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

  // Filter Logic
  const filteredMovements = movements.filter(m => {
    if (filterType === 'ALL') return true;
    return m.type === filterType;
  });

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Premium Minimalist Header */}
      <div className="pb-6 border-b border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Activité</span>
        <h2 className="text-3xl font-extralight text-slate-900 tracking-tight mt-1">Mouvements de stock</h2>
        <p className="text-sm text-slate-500 mt-1.5 font-light">Tracez et gérez les entrées et sorties d'articles de l'inventaire.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Record Movement Form Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/40 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">Enregistrer un flux</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Type Switcher */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Type de mouvement</label>
              <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setType('IN')}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${
                    type === 'IN' 
                      ? 'bg-slate-900 text-white shadow-sm font-semibold' 
                      : 'text-slate-500 hover:text-slate-950 font-light'
                  }`}
                >
                  Entrée (IN)
                </button>
                <button
                  type="button"
                  onClick={() => setType('OUT')}
                  className={`py-2 rounded-lg text-xs font-medium transition-all ${
                    type === 'OUT' 
                      ? 'bg-slate-900 text-white shadow-sm font-semibold' 
                      : 'text-slate-500 hover:text-slate-950 font-light'
                  }`}
                >
                  Sortie (OUT)
                </button>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Produit</label>
              <select 
                value={productId} 
                onChange={(e) => setProductId(parseInt(e.target.value))} 
                required 
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light bg-white transition-colors focus:outline-none"
              >
                <option value="">Sélectionner un produit</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (Stock: {p.quantity})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Quantité</label>
              <input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))} 
                required 
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light transition-colors focus:outline-none"
              />
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Motif / Commentaire</label>
              <input 
                type="text" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder="Ex: Réassort, Livraison client..." 
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light transition-colors focus:outline-none"
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-slate-900 hover:bg-slate-850 active:bg-slate-950 text-white py-2.5 rounded-xl font-medium text-xs transition-all shadow-sm"
            >
              Enregistrer
            </button>
          </form>
        </div>

        {/* Clean, Spacious History List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-400">HISTORIQUE DES MOUVEMENTS</span>

            {/* Filter Switcher */}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-250/50 self-start sm:self-auto">
              {(['ALL', 'IN', 'OUT'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    filterType === tab 
                      ? 'bg-white text-slate-800 shadow-sm font-semibold' 
                      : 'text-slate-500 hover:text-slate-950 font-light'
                  }`}
                >
                  {tab === 'ALL' ? 'Tous' : tab === 'IN' ? 'Entrées' : 'Sorties'}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-xs font-light">Chargement de l'activité...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[580px]">
              {filteredMovements.map((m) => {
                const isEntry = m.type === 'IN';
                
                return (
                  <div key={m.id} className="py-4.5 flex items-start justify-between gap-6 hover:bg-slate-50/20 transition-colors group">
                    <div className="flex items-start gap-3.5 min-w-0">
                      
                      {/* Indicator Arrow */}
                      <div className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${
                        isEntry 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' 
                          : 'bg-red-50 text-red-600 border-red-100/50'
                      }`}>
                        {isEntry ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{m.product?.name || 'Produit supprimé'}</p>
                        
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-slate-400 font-light">
                          {m.reason && <span className="text-slate-500">{m.reason}</span>}
                          {m.reason && <span className="text-slate-300">&bull;</span>}
                          <span>Par {m.user?.firstName} {m.user?.lastName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Date */}
                    <div className="text-right shrink-0">
                      <p className={`font-semibold text-sm ${isEntry ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isEntry ? '+' : '-'}{m.quantity}
                      </p>
                      <span className="text-[10px] text-slate-400 font-light block mt-0.5">
                        {new Date(m.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}

              {filteredMovements.length === 0 && (
                <div className="text-center py-20">
                  <Boxes size={24} className="mx-auto text-slate-350 mb-3 stroke-[1.5]" />
                  <p className="text-sm text-slate-500 font-light">Aucun mouvement répertorié pour ce filtre.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StockMovements;
