import React from 'react';
import './EmptyState.css';

const EmptyState = ({ 
  title = "Veri Bulunamadı", 
  message = "Arama kriterlerinize uyan kayıt bulunamadı.", 
  actionText, 
  onAction 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {actionText && onAction && (
        <button className="empty-action-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
