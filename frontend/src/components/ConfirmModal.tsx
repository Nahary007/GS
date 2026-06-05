import React, { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  variant = 'danger'
}) => {
  // Listen for Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with a very subtle blur */}
      <div 
        className="absolute h-[100vh] inset-0 bg-slate-950/15 backdrop-blur-xs transition-opacity duration-300 animate-fade-in "
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative bg-white rounded-xl border border-slate-100/80 shadow-2xl w-full max-w-sm p-6 space-y-4 animate-scale-up z-10">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 font-light leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end items-center gap-3 pt-2">
          <button 
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-xs font-light text-slate-550 hover:text-slate-900 transition-colors"
          >
            Annuler
          </button>
          <button 
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors shadow-sm ${
              isDanger 
                ? 'bg-red-650 bg-red-400 hover:bg-red-500 text-white' 
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
