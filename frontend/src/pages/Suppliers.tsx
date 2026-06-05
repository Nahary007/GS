import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  X, 
  Trash2,
  Edit2,
  Boxes
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
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

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Failed to fetch suppliers', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const doSave = async () => {
      try {
        if (editingId) {
          await api.put(`/api/suppliers/${editingId}`, { name, email, phone, address });
        } else {
          await api.post('/api/suppliers', { name, email, phone, address });
        }
        resetForm();
        fetchSuppliers();
      } catch (error) {
        console.error('Failed to save supplier', error);
      }
    };

    if (editingId) {
      setConfirmModal({
        isOpen: true,
        title: 'Modifier le fournisseur ?',
        message: `Voulez-vous enregistrer les modifications pour "${name}" ?`,
        confirmLabel: 'Modifier',
        variant: 'warning',
        onConfirm: doSave
      });
    } else {
      await doSave();
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);
    setName(supplier.name);
    setEmail(supplier.email || '');
    setPhone(supplier.phone || '');
    setAddress(supplier.address || '');
  };

  const handleDelete = (id: number, supplierName: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Supprimer le fournisseur ?',
      message: `Êtes-vous sûr de vouloir supprimer définitivement "${supplierName}" ?`,
      confirmLabel: 'Supprimer',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/api/suppliers/${id}`);
          fetchSuppliers();
        } catch (error) {
          console.error('Failed to delete supplier', error);
        }
      }
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
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
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Partenaires</span>
        <h2 className="text-3xl font-extralight text-slate-900 tracking-tight mt-1">Fournisseurs</h2>
        <p className="text-sm text-slate-500 mt-1.5 font-light">Gérez l'ensemble des distributeurs et fabricants référencés.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Modern Form Panel (4 cols) */}
        <div className="lg:col-span-4 bg-slate-50/40 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-semibold text-slate-800 text-sm mb-4">
            {editingId ? 'Modifier le fournisseur' : 'Nouveau fournisseur'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nom */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Raison sociale</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Ex: ACME Corp"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-slate-800 focus:ring-0 rounded-xl text-sm font-light transition-all focus:outline-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Adresse email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@entreprise.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-slate-800 focus:ring-0 rounded-xl text-sm font-light transition-all focus:outline-none"
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Téléphone</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-slate-800 focus:ring-0 rounded-xl text-sm font-light transition-all focus:outline-none"
              />
            </div>

            {/* Adresse */}
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider">Adresse postale</label>
              <input 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
                placeholder="12 rue de la Paix, Paris"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 focus:border-slate-800 focus:ring-0 rounded-xl text-sm font-light transition-all focus:outline-none"
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
                  onClick={resetForm}
                  className="px-3.5 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs text-slate-600 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Clean, Spacious Suppliers List (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-400">CONTACTS ({suppliers.length})</span>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-400 text-xs font-light">Chargement des fournisseurs...</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {suppliers.map((supp) => (
                <div key={supp.id} className="py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-base">{supp.name}</h4>
                    
                    {/* Contacts Details row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-light">
                      {supp.email && <span>{supp.email}</span>}
                      {supp.email && supp.phone && <span className="text-slate-300">&bull;</span>}
                      {supp.phone && <span>{supp.phone}</span>}
                      {supp.address && (
                        <>
                          <span className="text-slate-300 hidden sm:inline">&bull;</span>
                          <span className="text-slate-400 break-words max-w-md block sm:inline">{supp.address}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions (always visible, cleanly styled) */}
                  <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
                    <button 
                      type="button"
                      onClick={() => handleEdit(supp)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg hover:border-slate-400 transition-all bg-white"
                    >
                      <Edit2 size={12} />
                      <span>Modifier</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(supp.id, supp.name)} 
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 hover:text-red-700 border border-red-100 rounded-lg hover:border-red-300 transition-all bg-white"
                    >
                      <Trash2 size={12} />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              ))}

              {suppliers.length === 0 && (
                <div className="text-center py-20">
                  <Boxes size={24} className="mx-auto text-slate-350 mb-3 stroke-[1.5]" />
                  <p className="text-sm text-slate-500 font-light">Aucun fournisseur enregistré pour le moment.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Suppliers;
