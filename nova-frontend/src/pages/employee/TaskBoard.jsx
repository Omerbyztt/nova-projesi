import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosConfig';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './TaskBoard.css';

const TaskBoard = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const [newTask, setNewTask] = useState({
    title: '', description: '', dueDate: '', assignedToId: ''
  });
  
  const [editTask, setEditTask] = useState({
    id: '', title: '', description: '', dueDate: ''
  });

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('/tasks');
      setTasks(res.data.filter(t => t.status !== 'CANCELLED'));
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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dropdown-trigger') && !e.target.closest('.dropdown-menu')) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/tasks/${editTask.id}`, editTask);
      setIsEditModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error('Görev güncellenemedi:', err);
      alert(err.response?.data || 'Görev güncellenemedi.');
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axiosInstance.patch(`/tasks/${taskId}/status`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Durum güncellenemedi:', err);
      alert(err.response?.data || 'Durum güncellenemedi.');
      fetchTasks();
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Bu görevi tamamen silmek istediğinize emin misiniz?")) {
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        fetchTasks();
      } catch (err) {
        console.error('Görev silinemedi:', err);
        alert(err.response?.data || 'Görev silinemedi.');
      }
    }
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);
    
    handleUpdateStatus(taskId, newStatus);
  };

  const openEditModal = (task) => {
    setEditTask({ id: task.id, title: task.title, description: task.description, dueDate: task.dueDate || '' });
    setActiveMenuId(null);
    setIsEditModalOpen(true);
  };

  const getAssigneeColorClass = (id) => {
    const colors = ['blue', 'emerald', 'amber', 'purple', 'rose', 'indigo'];
    if (!id) return 'gray';
    const idx = id % colors.length;
    return colors[idx];
  };

  const role = currentUser?.role;

  if (loading) return <div style={{ padding: '24px' }}>Yükleniyor...</div>;

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
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px' }}>
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
                    <td>
                      <button className="btn-icon danger" onClick={() => handleUpdateStatus(t.id, 'CANCELLED')} title="İptal Et" style={{marginRight: '8px'}}>
                        ✕
                      </button>
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

  const columns = [
    { id: 'TODO', title: 'YAPILACAKLAR' },
    { id: 'IN_PROGRESS', title: 'DEVAM EDİYOR' },
    { id: 'DONE', title: 'TAMAMLANDI' }
  ];

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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {columns.map(col => {
            const columnTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="kanban-column-wrapper">
                <div className="kanban-column-header">
                  <h3 className="kanban-column-title">{col.title}</h3>
                  <span className="kanban-badge">{columnTasks.length}</span>
                </div>
                
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div 
                      className={`kanban-column-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {columnTasks.map((t, index) => {
                        const colorClass = getAssigneeColorClass(t.assignedTo?.id);
                        const isOwner = t.assignedTo?.id === currentUser?.id;
                        const isManager = role === 'DEPARTMENT_MANAGER';
                        const canEdit = isOwner || isManager;
                        
                        return (
                          <Draggable key={t.id.toString()} draggableId={t.id.toString()} index={index} isDragDisabled={!canEdit}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`task-card color-${colorClass} ${snapshot.isDragging ? 'is-dragging' : ''} ${!canEdit ? 'not-draggable' : ''}`}
                              >
                                <div className="task-card-header">
                                  <h4 className="task-card-title">{t.title}</h4>
                                  
                                  {canEdit && (
                                    <div className="task-menu-container">
                                      <button 
                                        className="dropdown-trigger" 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveMenuId(activeMenuId === t.id ? null : t.id);
                                        }}
                                      >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                      </button>
                                      
                                      {activeMenuId === t.id && (
                                        <div className="dropdown-menu">
                                          <button onClick={() => openEditModal(t)}>Düzenle</button>
                                          <button onClick={() => { setActiveMenuId(null); handleUpdateStatus(t.id, 'CANCELLED'); }}>İptal Et</button>
                                          {isManager && (
                                            <button className="text-danger" onClick={() => { setActiveMenuId(null); handleDeleteTask(t.id); }}>Sil</button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                                
                                <p className="task-card-desc">{t.description}</p>
                                
                                <div className="task-card-footer">
                                  <div className="task-assignee">
                                    <div className={`avatar-circle bg-${colorClass}`}>
                                      {t.assignedTo?.firstName?.[0]}{t.assignedTo?.lastName?.[0]}
                                    </div>
                                    <span>{t.assignedTo?.firstName}</span>
                                  </div>
                                  {t.dueDate && (
                                    <div className="task-due-date">
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                      {t.dueDate}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Yeni Görev Oluştur</h3>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Görev Başlığı</label>
                <input type="text" className="form-input" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <textarea className="form-input" required value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Bitiş Tarihi</label>
                <input type="date" className="form-input" required value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Atanacak Çalışan</label>
                <select className="form-select" required value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}>
                  <option value="">Çalışan Seçin...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.role})</option>
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

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Görevi Düzenle</h3>
            <form onSubmit={handleUpdateTask}>
              <div className="form-group">
                <label className="form-label">Görev Başlığı</label>
                <input type="text" className="form-input" required value={editTask.title} onChange={e => setEditTask({...editTask, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama</label>
                <textarea className="form-input" required value={editTask.description} onChange={e => setEditTask({...editTask, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Bitiş Tarihi</label>
                <input type="date" className="form-input" value={editTask.dueDate} onChange={e => setEditTask({...editTask, dueDate: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>İptal</button>
                <button type="submit" className="btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
