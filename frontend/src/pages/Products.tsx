import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Category { id: number; name: string; }
interface Supplier { id: number; name: string; }
interface Product {
  id: number; name: string; description: string; price: number; quantity: number; minQuantity: number;
  category: Category; supplier: Supplier;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [minQuantity, setMinQuantity] = useState<number>(10);
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [supplierId, setSupplierId] = useState<number | ''>('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [prodRes, catRes, supRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/categories'),
        api.get('/api/suppliers')
      ]);
      setProducts(prodRes.data); setCategories(catRes.data); setSuppliers(supRes.data);
    } catch (error) { console.error('Failed to fetch data', error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !supplierId) return alert("Veuillez sélectionner une catégorie et un fournisseur.");
    try {
      const payload = { name, description, price, minQuantity, categoryId, supplierId };
      if (editingId) await api.put(`/api/products/${editingId}`, payload);
      else await api.post('/api/products', payload);
      resetForm(); fetchData();
    } catch (error) { console.error('Failed to save product', error); }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id); setName(product.name); setDescription(product.description || '');
    setPrice(product.price); setMinQuantity(product.minQuantity);
    setCategoryId(product.category?.id || ''); setSupplierId(product.supplier?.id || '');
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous supprimer ce produit ?')) return;
    try { await api.delete(`/api/products/${id}`); fetchData(); } 
    catch (error) { console.error('Failed to delete product', error); }
  };

  const resetForm = () => {
    setEditingId(null); setName(''); setDescription(''); setPrice(0); setMinQuantity(10); setCategoryId(''); setSupplierId('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Gestion des Produits</h2>
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium">Nom</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Prix</label>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Quantité d'alerte</label>
          <input type="number" value={minQuantity} onChange={(e) => setMinQuantity(parseInt(e.target.value))} required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Catégorie</label>
          <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value))} required className="w-full border p-2 rounded">
            <option value="">Sélectionner</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Fournisseur</label>
          <select value={supplierId} onChange={(e) => setSupplierId(parseInt(e.target.value))} required className="w-full border p-2 rounded">
            <option value="">Sélectionner</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="md:col-span-3 flex gap-4">
          <button type="submit" className="bg-primary text-white px-4 py-2 rounded">{editingId ? 'Modifier' : 'Ajouter'}</button>
          {editingId && <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">Annuler</button>}
        </div>
      </form>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fournisseur</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((p) => (
            <tr key={p.id}>
              <td className="px-6 py-4">{p.name}</td>
              <td className="px-6 py-4">{p.price} €</td>
              <td className="px-6 py-4"><span className={`font-bold ${p.quantity <= p.minQuantity ? 'text-red-600' : 'text-green-600'}`}>{p.quantity}</span></td>
              <td className="px-6 py-4">{p.category?.name}</td>
              <td className="px-6 py-4">{p.supplier?.name}</td>
              <td className="px-6 py-4">
                <button onClick={() => handleEdit(p)} className="text-primary mr-2">Editer</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-600">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
