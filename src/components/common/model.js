import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-card__header">
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-card__close" aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-card__body">{children}</div>
      </div>
    </div>
    , document.body
  );
};

export default Modal;