import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ConfirmModal from '../components/ConfirmModal';
import {
  Plus,
  Search,
  Trash2,
  X,
  Edit2
} from 'lucide-react';

interface Category { id: number; name: string; }
interface Supplier { id: number; name: string; }
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  minQuantity: number;
  category: Category;
  supplier: Supplier;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // UI Panels state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Confirm delete modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // Confirm edit modal state
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [pendingSave, setPendingSave] = useState<(() => Promise<void>) | null>(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [selectedStockStatus, setSelectedStockStatus] = useState<'all' | 'critical' | 'normal'>('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, supRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/categories'),
        api.get('/api/suppliers')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setSuppliers(supRes.data);
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
    if (!categoryId || !supplierId) return alert("Veuillez sélectionner une catégorie et un fournisseur.");

    const doSave = async () => {
      try {
        const payload = { name, description, price, quantity, categoryId, supplierId };
        if (editingId) await api.put(`/api/products/${editingId}`, payload);
        else await api.post('/api/products', payload);
        resetForm();
        fetchData();
      } catch (error) {
        console.error('Failed to save product', error);
      }
    };

    if (editingId) {
      setPendingSave(() => doSave);
      setConfirmEditOpen(true);
    } else {
      await doSave();
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategoryId(product.category?.id || '');
    setSupplierId(product.supplier?.id || '');
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    setProductToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete === null) return;
    try {
      await api.delete(`/api/products/${productToDelete}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete product', error);
    } finally {
      setProductToDelete(null);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice(0);
    setQuantity(0);
    setCategoryId('');
    setSupplierId('');
    setIsFormOpen(false);
  };

  const openAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  // Filter Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || p.category?.id === selectedCategory;

    let matchesStatus = true;
    if (selectedStockStatus === 'critical') {
      matchesStatus = p.quantity <= p.minQuantity;
    } else if (selectedStockStatus === 'normal') {
      matchesStatus = p.quantity > p.minQuantity;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-10 animate-fade-in relative pb-16">

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => { setConfirmOpen(false); setProductToDelete(null); }}
        onConfirm={confirmDelete}
        title="Supprimer le produit"
        message="Cette action est irréversible. Le produit sera définitivement supprimé du catalogue."
        confirmLabel="Supprimer"
        variant="danger"
      />

      {/* Confirm Edit Modal */}
      <ConfirmModal
        isOpen={confirmEditOpen}
        onClose={() => { setConfirmEditOpen(false); setPendingSave(null); }}
        onConfirm={async () => { if (pendingSave) await pendingSave(); }}
        title="Modifier le produit ?"
        message={`Voulez-vous enregistrer les modifications apportées à ce produit ?`}
        confirmLabel="Modifier"
        variant="warning"
      />

      {/* Top action bar */}
      <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Catalogue</span>
          <h2 className="text-3xl font-extralight text-slate-900 tracking-tight mt-1">Produits</h2>
          <p className="text-sm text-slate-500 mt-1.5 font-light">Gérez votre catalogue de produits, le stock et les alertes.</p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white px-5 py-2.5 rounded-lg font-medium text-xs transition-all shadow-sm shrink-0"
        >
          <Plus size={14} />
          <span>Ajouter un produit</span>
        </button>
      </div>

      {/* Filters section */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl focus:outline-none transition-all text-xs font-light"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Multi-filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value === '' ? '' : parseInt(e.target.value))}
            className="bg-white text-xs font-light text-slate-700 border border-slate-200 focus:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none transition-colors"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {/* Stock status filter */}
          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value as any)}
            className="bg-white text-xs font-light text-slate-700 border border-slate-200 focus:border-slate-800 rounded-xl px-3 py-2.5 focus:outline-none transition-colors"
          >
            <option value="all">Tous les stocks</option>
            <option value="critical">Stock d'alerte</option>
            <option value="normal">Stock suffisant</option>
          </select>
        </div>
      </div>

      {/* Slide-over Form Drawer */}
      {isFormOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 h-[100vh] bg-slate-900/10 backdrop-blur-xs z-40 transition-opacity duration-300 animate-fade-in"
            onClick={resetForm}
          />
          {/* Drawer Container */}
          <aside className="fixed inset-y-0 right-0 h-[100vh] w-full max-w-md bg-white z-50 flex flex-col shadow-2xl border-l border-slate-100 animate-slide-up md:animate-none md:translate-x-0 transition-transform duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
              <div>
                <h3 className="font-semibold text-slate-800 text-sm">{editingId ? 'Modifier le produit' : 'Nouveau produit'}</h3>
                <p className="text-[11px] text-slate-450 text-slate-400 font-light mt-0.5">Renseignez les détails du produit ci-dessous.</p>
              </div>
              <button onClick={resetForm} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={16} className="text-slate-500" />
              </button>
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Nom du produit</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Ordinateur portable"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light transition-colors focus:outline-none"
                />
              </div>

              {/* Price & Stock in same row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Prix (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    required
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light transition-colors focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Stock Initial</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? 0 : parseInt(e.target.value))}
                    required
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light transition-colors focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Supplier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Catégorie</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value === '' ? '' : parseInt(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light bg-white transition-colors focus:outline-none"
                  >
                    <option value="">Sélectionner</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Fournisseur</label>
                  <select
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value === '' ? '' : parseInt(e.target.value))}
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light bg-white transition-colors focus:outline-none"
                  >
                    <option value="">Sélectionner</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Description (Optionnel)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ajoutez des détails sur ce produit..."
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-slate-800 focus:ring-0 text-sm font-light transition-colors resize-none focus:outline-none"
                />
              </div>
            </form>

            <div className="p-6 border-t border-slate-100 flex items-center gap-3 bg-slate-50/20">
              <button
                type="submit"
                form="product-form"
                className="flex-1 bg-slate-900 hover:bg-slate-850 active:bg-slate-950 text-white py-2.5 rounded-xl font-medium text-xs transition-colors shadow-sm"
              >
                {editingId ? 'Modifier le produit' : 'Enregistrer le produit'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl font-medium text-xs text-slate-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Table section */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-400 text-xs font-light">Chargement des produits...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Produit</th>
                  <th className="pb-3 font-semibold">Catégorie</th>
                  <th className="pb-3 font-semibold">Fournisseur</th>
                  <th className="pb-3 font-semibold text-right">Prix</th>
                  <th className="pb-3 font-semibold text-right">Stock</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50 text-sm font-light text-slate-650">
                {filteredProducts.map((p) => {
                  const isOutOfStock = p.quantity === 0;
                  const isLowStock = p.quantity <= p.minQuantity && p.quantity > 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/20 transition-colors group">
                      {/* Name & description */}
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        {p.description && <p className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{p.description}</p>}
                      </td>

                      {/* Category */}
                      <td className="py-4 text-slate-550 text-slate-550 text-slate-500">
                        {p.category?.name || '—'}
                      </td>

                      {/* Supplier */}
                      <td className="py-4 text-slate-500">
                        {p.supplier?.name || '—'}
                      </td>

                      {/* Price */}
                      <td className="py-4 text-right font-medium text-slate-850">
                        {Number(p.price).toFixed(2)} €
                      </td>

                      {/* Stock quantity badge */}
                      <td className="py-4 text-right">
                        {isOutOfStock ? (
                          <span className="inline-block text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                            RUPTURE
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-block text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                            {p.quantity} (FAIBLE)
                          </span>
                        ) : (
                          <span className="text-slate-800 font-normal">{p.quantity}</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-3 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1 text-slate-400 hover:text-slate-800 transition-colors"
                            title="Modifier"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-slate-450">
                      <p className="text-sm font-light text-slate-550">Aucun produit ne correspond à votre recherche.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
