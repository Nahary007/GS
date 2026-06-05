import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  X, 
  Trash2, 
  Edit2,
  Boxes
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

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
  const [loading, setLoading] = useState(true);

  // Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'danger' | 'warning';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmer',
    variant: 'danger',
    onConfirm: () => {},
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const doSave = async () => {
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

    if (editingId) {
      setConfirmModal({
        isOpen: true,
        title: 'Modifier la catégorie ?',
        message: `Voulez-vous enregistrer les modifications pour "${name}" ?`,
        confirmLabel: 'Modifier',
        variant: 'warning',
        onConfirm: doSave
      });
    } else {
      await doSave();
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
  };

  const handleDelete = (id: number, catName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer la catégorie ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement la catégorie "${catName}" ?`,
      confirmLabel: 'Supprimer',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/api/categories/${id}`);
          fetchCategories();
        } catch (error) {
          console.error('Failed to delete category', error);
        }
      }
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Premium Confirm Modal */}
      <ConfirmModal 
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        variant={confirmModal.variant}
      />

      {/* Premium Minimalist Header */}
      <div className="pb-6 border-b border-slate-100">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Classement</span>
        <h2 className="text-3xl font-extralight text-slate-900 tracking-tight mt-1">Catégories</h2>
        <p className="text-sm text-slate-500 mt-1.5 font-light">Organisez vos produits par familles ou types d'articles.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Modern Form Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/40 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">
            {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Intitulé</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Ex: Électronique, Boissons..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-slate-800 focus:ring-0 rounded-xl text-sm font-light transition-all focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description des articles associés..."
                rows={3}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-slate-800 focus:ring-0 rounded-xl text-sm font-light transition-all focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                type="submit" 
                className="flex-1 bg-slate-900 hover:bg-slate-850 active:bg-slate-950 text-white py-2.5 rounded-xl font-medium text-xs transition-all shadow-sm"
              >
                {editingId ? 'Mettre à jour' : 'Enregistrer'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="px-3.5 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Clean, Spacious Categories List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-400">FAMILLES ({categories.length})</span>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-xs font-light">Chargement des catégories...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div key={cat.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-800 text-base">{cat.name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 tracking-wider">ID #{cat.id}</span>
                    </div>
                    {cat.description ? (
                      <p className="text-sm text-slate-500 font-light">{cat.description}</p>
                    ) : (
                      <p className="text-xs italic text-slate-400 font-light">Aucune description fournie.</p>
                    )}
                  </div>

                  {/* Actions (always visible, cleanly styled) */}
                  <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
                    <button 
                      type="button"
                      onClick={() => handleEdit(cat)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-400 transition-all bg-white"
                    >
                      <Edit2 size={12} />
                      <span>Modifier</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.name)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 rounded-lg hover:border-red-300 transition-all bg-white"
                    >
                      <Trash2 size={12} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="text-center py-20">
                  <Boxes size={24} className="mx-auto text-slate-355 mb-3 stroke-[1.5]" />
                  <p className="text-sm text-slate-500 font-light">Aucune catégorie créée pour le moment.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Categories;
