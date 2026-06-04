import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Category {
  id: number;
  name: string;
  description: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/categories/${editingId}`, { name, description });
      } else {
        await api.post('/api/categories', { name, description });
      }
      setName('');
      setDescription('');
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) return;
    try {
      await api.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-primary">Gestion des Catégories</h2>
      
      <form onSubmit={handleSubmit} className="mb-6 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
        </div>
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          {editingId ? 'Modifier' : 'Ajouter'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setName(''); setDescription(''); }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition-colors">
            Annuler
          </button>
        )}
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(cat)} className="text-primary hover:text-blue-900 mr-4">Modifier</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-900">Supprimer</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Aucune catégorie trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
