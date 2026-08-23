import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import './TaskBoard.css';

const TaskBoard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedToId: ''
  });

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Görevler çekilirken hata oluştu:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentEmployees = async () => {
    if (currentUser?.role === 'DEPARTMENT_MANAGER' && currentUser?.department?.id) {
      try {
        const res = await axiosInstance.get(`/employees/department/${currentUser.department.id}`);
        setEmployees(res.data);
      } catch (err) {
        console.error('Çalışanlar çekilirken hata:', err);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDepartmentEmployees();
  }, [currentUser]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/tasks', newTask);
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', dueDate: '', assignedToId: '' });
      fetchTasks();
    } catch (err) {
      console.error('Görev oluşturulamadı:', err);
      alert('Görev oluşturulamadı, bilgileri kontrol edin.');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Durum güncellenemedi:', err);
      alert('Durum güncellenemedi.');
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Yükleniyor...</div>;

  const role = currentUser?.role;

  // ----------------------------------------------------
  // COMPANY_ADMIN View (Data Table)
  // ----------------------------------------------------
  if (role === 'COMPANY_ADMIN' || role === 'SUPER_ADMIN') {
    return (
      <div className="task-board-container">
        <div className="task-header">
          <h2 className="task-title">Şirket Görevleri</h2>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Görev Başlığı</th>
                <th>Atayan</th>
                <th>Atanan</th>
                <th>Departman</th>
                <th>Bitiş Tarihi</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                    Henüz görev bulunmuyor.
                  </td>
                </tr>
              ) : (
                tasks.map(t => (
                  <tr key={t.id}>
                    <td><strong>{t.title}</strong></td>
                    <td>{t.assignedBy?.firstName} {t.assignedBy?.lastName}</td>
                    <td>{t.assignedTo?.firstName} {t.assignedTo?.lastName}</td>
                    <td>{t.department?.name}</td>
                    <td>{t.dueDate || '-'}</td>
                    <td>
                      <span className={`status-badge ${t.status === 'TODO' ? 'status-todo' : t.status === 'IN_PROGRESS' ? 'status-in-progress' : 'status-done'}`}>
                        {t.status === 'TODO' ? 'YAPILACAK' : t.status === 'IN_PROGRESS' ? 'DEVAM EDİYOR' : 'TAMAMLANDI'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Kanban Board Component (For Manager & Employee)
  // ----------------------------------------------------
  const renderKanbanColumn = (status, title) => {
    const columnTasks = tasks.filter(t => t.status === status);
    
    return (
      <div className="kanban-column">
        <div className="kanban-column-header">
          <h3 className="kanban-column-title">{title}</h3>
          <span className="kanban-badge">{columnTasks.length}</span>
        </div>
        
        {columnTasks.map(t => (
          <div key={t.id} className="task-card">
            <h4 className="task-card-title">{t.title}</h4>
            <p className="task-card-desc">{t.description}</p>
            
            <div className="task-card-footer">
              <div className="task-assignee">
                <div className="avatar-circle">
                  {t.assignedTo?.firstName?.[0]}{t.assignedTo?.lastName?.[0]}
                </div>
                <span>{t.assignedTo?.firstName} {t.assignedTo?.lastName}</span>
              </div>
              <div className="task-actions">
                {status === 'TODO' && (
                  <button className="action-btn" onClick={() => handleUpdateStatus(t.id, 'IN_PROGRESS')}>Başla</button>
                )}
                {status === 'IN_PROGRESS' && (
                  <>
                    <button className="action-btn" onClick={() => handleUpdateStatus(t.id, 'TODO')}>Geri</button>
                    <button className="action-btn" onClick={() => handleUpdateStatus(t.id, 'DONE')} style={{ color: '#059669', borderColor: '#059669' }}>Bitir</button>
                  </>
                )}
                {status === 'DONE' && (
                  <button className="action-btn" onClick={() => handleUpdateStatus(t.id, 'IN_PROGRESS')}>Geri Al</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {columnTasks.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '20px 0' }}>
            Görev yok
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="task-board-container">
      <div className="task-header">
        <h2 className="task-title">Görev Panosu</h2>
        {role === 'DEPARTMENT_MANAGER' && (
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            + Yeni Görev Ata
          </button>
        )}
      </div>

      <div className="kanban-board">
        {renderKanbanColumn('TODO', 'Yapılacaklar')}
        {renderKanbanColumn('IN_PROGRESS', 'Devam Ediyor')}
        {renderKanbanColumn('DONE', 'Tamamlandı')}
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Yeni Görev Oluştur</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Görev Başlığı</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Örn: Q3 Finansal Raporu"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <textarea 
                  className="form-input" 
                  required 
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Görev detayları..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bitiş Tarihi</label>
                <input 
                  type="date" 
                  className="form-input" 
                  required 
                  value={newTask.dueDate}
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Atanacak Çalışan</label>
                <select 
                  className="form-select" 
                  required 
                  value={newTask.assignedToId}
                  onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}
                >
                  <option value="">Çalışan Seçin...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>İptal</button>
                <button type="submit" className="btn-primary">Görev Ata</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
