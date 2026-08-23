import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import ConfirmModal from '../../components/ConfirmModal';
import SkeletonTable from '../../components/ui/SkeletonTable';
import EmptyState from '../../components/ui/EmptyState';
import SummaryCard from '../../components/ui/SummaryCard';
import { useToast } from '../../components/ui/ToastProvider';
import './DepartmentList.css';
import './EmployeeList.css';

const DepartmentList = () => {
  const toast = useToast();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDeptId, setCurrentDeptId] = useState(null);
  const [newDept, setNewDept] = useState({ name: '', manager: '' });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, deptId: null });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      
      let cId = null;
      const meRes = await axiosInstance.get('/employees/me');
      if (meRes.data && meRes.data.department && meRes.data.department.company) {
        cId = meRes.data.department.company.id;
      } else {
        const companiesRes = await axiosInstance.get('/companies');
        if (companiesRes.data && companiesRes.data.length > 0) {
          cId = companiesRes.data[0].id;
        }
      }

      if (cId) {
        setCompanyId(cId);
        const [deptRes, empRes] = await Promise.all([
          axiosInstance.get(`/departments/company/${cId}`),
          axiosInstance.get(`/employees/company/${cId}`)
        ]);
        setDepartments(deptRes.data || []);
        setEmployees(empRes.data || []);
      } else {
        toast.error('Şirket bilgisi bulunamadı. Lütfen önce bir şirket oluşturun.');
      }
    } catch (err) {
      toast.error('Departmanlar yüklenirken hata oluştu.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (newDept.name && companyId) {
      try {
        const payload = {
          name: newDept.name,
          company: { id: companyId },
          manager: newDept.manager ? { id: newDept.manager } : null
        };
        
        if (isEditMode && currentDeptId) {
          await axiosInstance.put(`/departments/${currentDeptId}`, payload);
          toast.success('Departman başarıyla güncellendi.');
        } else {
          await axiosInstance.post('/departments', payload);
          toast.success('Departman başarıyla eklendi.');
        }
        
        setNewDept({ name: '', manager: '' });
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentDeptId(null);
        await fetchDepartments();
      } catch (err) {
         toast.error('Departman eklenirken hata oluştu.');
         console.error(err);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    const deptId = confirmModal.deptId;
    if (deptId) {
      try {
        await axiosInstance.delete(`/departments/${deptId}`);
        toast.success('Departman başarıyla silindi.');
        fetchDepartments();
      } catch (err) {
        const errorMsg = err.response?.data;
        toast.error(typeof errorMsg === 'string' ? errorMsg : 'Silinirken hata oluştu.');
      }
    }
    setConfirmModal({ isOpen: false, deptId: null });
  };

  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Departman Yönetimi</h2>
          <p>Şirketinizin departman hiyerarşisini buradan yönetin.</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setIsEditMode(false);
          setCurrentDeptId(null);
          setNewDept({ name: '', manager: '' });
          setIsModalOpen(true);
        }}>
          + Yeni Departman Ekle
        </button>
      </div>

      <div className="summary-cards-container" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px'}}>
        <SummaryCard 
          title="Toplam Departman" 
          value={departments.length} 
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
          color="blue"
        />
        <SummaryCard 
          title="Yöneticisi Atanan" 
          value={departments.filter(d => d.manager).length} 
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="green"
        />
        <SummaryCard 
          title="Yönetici Bekleyen" 
          value={departments.filter(d => !d.manager).length} 
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="orange"
        />
      </div>

      <div className="content-card table-card">
        <div className="table-toolbar">
          <div className="toolbar-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Departman Ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable columns={4} rows={3} />
        ) : filteredDepartments.length === 0 ? (
          <EmptyState 
            title="Departman Bulunamadı" 
            message={searchTerm ? "Arama kriterlerinize uyan departman bulunamadı." : "Şirketinize henüz hiç departman eklenmemiş."}
            actionText={!searchTerm ? "+ Yeni Departman Ekle" : null}
            onAction={!searchTerm ? () => {
              setIsEditMode(false);
              setCurrentDeptId(null);
              setNewDept({ name: '', manager: '' });
              setIsModalOpen(true);
            } : null}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Departman Adı</th>
                <th>Departman Yöneticisi</th>
                <th className="action-column">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr key={dept.id}>
                  <td className="text-muted">#{dept.id}</td>
                  <td className="font-medium">{dept.name}</td>
                  <td>
                    <span className={`status-badge ${dept.manager ? 'status-blue' : 'status-warning'}`}>
                      {dept.manager && dept.manager.firstName 
                        ? `${dept.manager.firstName} ${dept.manager.lastName}` 
                        : 'Atanmadı'}
                    </span>
                  </td>
                  <td className="action-column">
                    <button 
                      className="icon-btn edit-btn" 
                      title="Düzenle"
                      onClick={() => {
                        setIsEditMode(true);
                        setCurrentDeptId(dept.id);
                        setNewDept({ name: dept.name, manager: dept.manager ? dept.manager.id : '' });
                        setIsModalOpen(true);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="icon-btn delete-btn" title="Sil" onClick={() => setConfirmModal({ isOpen: true, deptId: dept.id })}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditMode ? 'Departmanı Düzenle' : 'Yeni Departman Ekle'}</h3>
            <div className="form-group premium-input">
              <label>Departman Adı</label>
              <input 
                type="text" 
                value={newDept.name} 
                onChange={(e) => setNewDept({...newDept, name: e.target.value})}
              />
            </div>
            <div className="form-group premium-input" style={{marginTop: '16px'}}>
              <label>Departman Yöneticisi</label>
              <select 
                value={newDept.manager} 
                onChange={(e) => setNewDept({...newDept, manager: e.target.value})}
                style={{width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)'}}
              >
                <option value="">Yönetici Yok (veya Temizle)</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.email})</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>İptal</button>
              <button className="btn-primary" onClick={handleAdd}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Departmanı Sil"
        message="Bu departmanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, deptId: null })}
      />
    </div>
  );
};

export default DepartmentList;
