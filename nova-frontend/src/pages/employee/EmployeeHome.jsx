import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import './EmployeeHome.css';

const EmployeeHome = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    openTasksCount: 0,
    completedTasksCount: 0,
    recentTasks: []
  });
  const [loading, setLoading] = useState(true);

  const [showEventToast, setShowEventToast] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/dashboard');
        setDashboardData(response.data);
        if (response.data.upcomingEvents && response.data.upcomingEvents.length > 0) {
          setShowEventToast(true);
        }
      } catch (error) {
        console.error("Dashboard verisi alınamadı", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);
  
  if (!currentUser) return null;

  const getPriorityBadge = (priority) => {
    if (priority === 'HIGH') return <span className="task-badge high">Yüksek</span>;
    if (priority === 'MEDIUM') return <span className="task-badge medium">Orta</span>;
    if (priority === 'LOW') return <span className="task-badge low">Düşük</span>;
    return <span className="task-badge low">Belirsiz</span>;
  };

  return (
    <div className="employee-home-container">
      {/* Upcoming Events Toast Notification */}
      {showEventToast && dashboardData.upcomingEvents && (
        <div className="upcoming-events-toast">
          <div className="toast-header">
            <h4>📅 Yaklaşan Etkinlikleriniz Var!</h4>
            <button className="close-toast-btn" onClick={() => setShowEventToast(false)}>✕</button>
          </div>
          <div className="toast-body">
            {dashboardData.upcomingEvents.slice(0, 3).map(evt => {
              const daysLeft = Math.ceil((new Date(evt.startDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={evt.id} className="toast-event-item">
                  <span className="evt-title">{evt.title}</span>
                  <span className="evt-time">{daysLeft === 0 ? 'Bugün' : `${daysLeft} gün sonra`}</span>
                </div>
              );
            })}
            {dashboardData.upcomingEvents.length > 3 && (
              <div style={{ fontSize: '0.8rem', color: 'var(--admin-primary)', marginTop: '4px', cursor: 'pointer' }} onClick={() => navigate('/calendar')}>
                + {dashboardData.upcomingEvents.length - 3} etkinlik daha...
              </div>
            )}
          </div>
        </div>
      )}
      <div className="welcome-banner">
        <div className="welcome-content">
          <span className="welcome-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Sistem Aktif
          </span>
          <h1 className="welcome-title">Hoş Geldin, {currentUser.firstName} {currentUser.lastName}</h1>
          <p className="welcome-subtitle">Nova Portal çalışma alanına başarıyla giriş yaptın. Bugün harika işler başaracağından eminiz!</p>
          
          <div className="welcome-tags">
            <span className="welcome-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {currentUser.role === 'DEPARTMENT_MANAGER' ? 'Departman Yöneticisi' : 'Çalışan'}
            </span>
            <span className="welcome-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              {currentUser.department?.name || 'Atanmadı'}
            </span>
            <span className="welcome-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              {currentUser.title || 'Belirtilmedi'}
            </span>
          </div>
        </div>
        
        <div className="welcome-illustration">
          <div className="user-avatar-large">
            {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Açık Görevler</span>
            <span className="kpi-value">{loading ? '-' : dashboardData.openTasksCount}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Tamamlanan İşler</span>
            <span className="kpi-value">{loading ? '-' : dashboardData.completedTasksCount}</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Bekleyen Onaylar</span>
            <span className="kpi-value">3</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Yaklaşan Toplantı</span>
            <span className="kpi-value">2</span>
          </div>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="recent-tasks-section">
          <div className="section-header">
            <h3>Departman Görevleri</h3>
            <button className="view-all-btn" onClick={() => navigate('/tasks-board')}>Tümünü Gör</button>
          </div>
          <div className="task-list">
            {loading ? (
              <div style={{padding: '24px', textAlign: 'center', color: 'var(--admin-text-muted)'}}>Yükleniyor...</div>
            ) : dashboardData.recentTasks && dashboardData.recentTasks.length > 0 ? (
              dashboardData.recentTasks.map(task => (
                <div className="task-item" key={task.id}>
                  <div className="task-info">
                    <h4>{task.title}</h4>
                    <span>Bitiş: {task.dueDate ? new Date(task.dueDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}</span>
                  </div>
                  {getPriorityBadge(task.priority)}
                </div>
              ))
            ) : (
              <div style={{padding: '32px 24px', textAlign: 'center', color: 'var(--admin-text-muted)'}}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.5, marginBottom: '12px'}}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <p style={{margin: 0, fontWeight: 500}}>Henüz görev atanmamış</p>
              </div>
            )}
          </div>
        </div>

        <div className="quick-actions-section">
          <div className="section-header">
            <h3>Hızlı Aksiyonlar</h3>
          </div>
          <div className="actions-list">
            <button className="action-btn-card" onClick={() => navigate('/tasks-board')}>
              <div className="action-icon" style={{background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
              <span>Yeni Görev Oluştur</span>
            </button>
            <button className="action-btn-card" onClick={() => navigate('/calendar')}>
              <div className="action-icon" style={{background: 'rgba(16, 185, 129, 0.1)', color: '#10b981'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <span>Toplantı Planla</span>
            </button>
          </div>
          
          <div className="mini-calendar-widget">
            <div className="widget-header">
              <h4>Bugün</h4>
              <span>25 Ağu</span>
            </div>
            <div className="event-item">
              <div className="event-time">14:00</div>
              <div className="event-title">Tasarım İncelemesi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
