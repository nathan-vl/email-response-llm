import type { ReactNode } from 'react';

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
  >
    <div className="absolute inset-0 bg-black/50" onMouseDown={onClose} />

    <div
      className={`relative w-full max-w-lg transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
    >
      <button
        onMouseDown={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-red-700"
        aria-label="Fechar"
      >
        <i className="fa-solid fa-xmark" />
      </button>

      {children}
    </div>
  </div>
);

export default Modal;
