import React, { useState } from 'react';
import './TaskList.css';
import './DepartmentList.css'; // Reusing table styles
import './EmployeeList.css';   // Reusing avatar styles

const TaskList = () => {
  // Master View Data with Department
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Ürün Geliştirme (Frontend)', department: 'Yazılım & Ar-Ge', assignee: 'Ömer Faruk', status: 'IN_PROGRESS' },
    { id: 2, title: 'Mülakat Süreçleri', department: 'İnsan Kaynakları', assignee: 'Ayşe Yılmaz', status: 'TODO' },
    { id: 3, title: 'Q3 Satış Hedefleri Raporu', department: 'Satış & Pazarlama', assignee: 'Mehmet Demir', status: 'DONE' }
  ]);
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'TODO':
        return <span className="status-badge status-todo">Bekliyor</span>;
      case 'IN_PROGRESS':
        return <span className="status-badge status-progress">Devam Ediyor</span>;
      case 'DONE':
        return <span className="status-badge status-done">Tamamlandı</span>;
      default:
        return <span className="status-badge">Bilinmiyor</span>;
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>İş Takip Paneli (Master View)</h2>
          <p>Tüm departmanlardaki operasyonları ve ana görev tanımlarını kuşbakışı izleyin.</p>
        </div>
        <button className="btn-primary">
          + Yeni Görev Ata
        </button>
      </div>

      <div className="content-card table-card">
        <div className="table-toolbar">
          <div className="toolbar-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Görev Başlığı veya Personel Ara..." />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Görev Başlığı</th>
              <th>Departman</th>
              <th>Atanan Çalışan</th>
              <th>Durum</th>
              <th className="action-column">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="font-medium">{task.title}</td>
                <td>
                  <span className="dept-badge">{task.department}</span>
                </td>
                <td>
                  <div className="employee-name-cell">
                    <div className="avatar-small">{task.assignee.split(' ').map(n=>n[0]).join('')}</div>
                    {task.assignee}
                  </div>
                </td>
                <td>
                  {getStatusBadge(task.status)}
                </td>
                <td className="action-column">
                  <button className="icon-btn edit-btn" title="Görüntüle">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                  <button className="icon-btn delete-btn" title="Sil">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
