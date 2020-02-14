import React from 'react';

import './Modal.css';

const modal = props => {
  const {
    title,
    canCancel,
    onCancel,
    canConfirm,
    onConfirm,
    confirmText = 'Confirm'
  } = props;
  return (
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">{props.children}</section>
      <section className="modal__actions">
        {canCancel && (
          <button
            type="button"
            className="button button-primary"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        {canConfirm && (
          <button
            type="button"
            className="button button-primary"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        )}
      </section>
    </div>
  );
};

export default modal;
