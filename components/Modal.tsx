
import React from 'react';
import { CloseIcon } from './icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div 
        className="bg-[#faf9f6] rounded shadow-xl w-full max-w-md m-4 p-6 relative animate-fade-in-down border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b border-stone-200 pb-2">
          <h2 className="text-xl font-bold text-stone-800 font-serif tracking-wide">{title}</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
