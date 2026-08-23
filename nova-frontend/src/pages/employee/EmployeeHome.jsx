import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './EmployeeHome.css';

const EmployeeHome = () => {
  const { currentUser } = useAuth();
  
  if (!currentUser) return null;

  return (
    <div className="employee-home-container">
      <div className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Sistem Aktif
          </span>
          <h1 className="welcome-title">Hoş Geldin, {currentUser.firstName} {currentUser.lastName}</h1>
          <p className="welcome-subtitle">Nova Portal çalışma alanına başarıyla giriş yaptın. Bugün harika işler başaracağından eminiz!</p>
        </div>
        
        <div className="welcome-illustration">
          <div className="user-avatar-large">
            {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
          </div>
          <div className="user-info-card">
            <div className="info-row">
              <span className="info-label">Rol:</span>
              <span className="info-value">{currentUser.role === 'DEPARTMENT_MANAGER' ? 'Departman Yöneticisi' : 'Çalışan'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Departman:</span>
              <span className="info-value">{currentUser.department?.name || 'Atanmadı'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Unvan:</span>
              <span className="info-value">{currentUser.title || 'Belirtilmedi'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-stats-grid">
        <div className="quick-stat-card">
          <div className="stat-icon-wrapper" style={{background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div className="stat-details">
            <h3>Görev Panosu</h3>
            <p>Aktif ve bekleyen görevlerini yönet</p>
          </div>
        </div>
        
        <div className="quick-stat-card">
          <div className="stat-icon-wrapper" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div className="stat-details">
            <h3>Takvim</h3>
            <p>Yaklaşan etkinliklerini ve toplantıları gör</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
