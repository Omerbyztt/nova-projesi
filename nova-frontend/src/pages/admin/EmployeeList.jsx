import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import ConfirmModal from '../../components/ConfirmModal';
import SkeletonTable from '../../components/ui/SkeletonTable';
import EmptyState from '../../components/ui/EmptyState';
import SummaryCard from '../../components/ui/SummaryCard';
import { useToast } from '../../components/ui/ToastProvider';
import './EmployeeList.css';
import './DepartmentList.css'; 

const EmployeeList = () => {
  const toast = useToast();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [companyId, setCompanyId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmpId, setCurrentEmpId] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, empId: null });
  
  const [newEmp, setNewEmp] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    title: '',
    departmentId: '',
    roleOption: 'EMPLOYEE'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
        
        const [empRes, deptRes] = await Promise.all([
          axiosInstance.get(`/employees/company/${cId}`),
          axiosInstance.get(`/departments/company/${cId}`)
        ]);
        
        setEmployees(empRes.data || []);
        setDepartments(deptRes.data || []);
      } else {
        toast.error('Şirket bilgisi bulunamadı. Lütfen önce bir şirket oluşturun.');
      }
    } catch (err) {
      toast.error('Veriler yüklenirken hata oluştu.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!companyId) return;
    
    if (!newEmp.firstName || !newEmp.lastName || !newEmp.email || !newEmp.departmentId) {
      toast.error('Lütfen Ad, Soyad, Email ve Departman alanlarını doldurun.');
      return;
    }
    
    try {
      let actualRole = newEmp.roleOption;
      const isManager = actualRole === 'DEPARTMENT_MANAGER';
      if (isManager) actualRole = 'EMPLOYEE';
      const empPayload = {
        firstName: newEmp.firstName,
        lastName: newEmp.lastName,
        email: newEmp.email,
        title: newEmp.title,
        role: actualRole,
        department: { id: newEmp.departmentId }
      };
      
      if (newEmp.password) {
        empPayload.password = newEmp.password;
      }
      
      let empRes;
      if (isEditMode && currentEmpId) {
        empRes = await axiosInstance.put(`/employees/${currentEmpId}`, empPayload);
        toast.success('Çalışan başarıyla güncellendi.');
      } else {
        empRes = await axiosInstance.post('/employees', empPayload);
        toast.success('Çalışan başarıyla eklendi.');
      }
      
      if (isManager && newEmp.departmentId) {
        const dRes = await axiosInstance.get(`/departments/${newEmp.departmentId}`);
        const dept = dRes.data;
        dept.manager = { id: empRes.data.id };
        await axiosInstance.put(`/departments/${newEmp.departmentId}`, dept);
      }
      
      setNewEmp({
        firstName: '', lastName: '', email: '', password: '', title: '', departmentId: '', roleOption: 'EMPLOYEE'
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      setCurrentEmpId(null);
      await fetchData();
    } catch (err) {
      toast.error('Çalışan eklenirken hata oluştu.');
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    const empId = confirmModal.empId;
    if (empId) {
      try {
        await axiosInstance.delete(`/employees/${empId}`);
        toast.success('Çalışan başarıyla silindi.');
        await fetchData();
      } catch (err) {
        toast.error('Silinirken hata oluştu.');
      }
    }
    setConfirmModal({ isOpen: false, empId: null });
  };

  if (isLoading && employees.length === 0) {
    return <div className="page-container"><div className="page-header"><h2>Yükleniyor...</h2></div></div>;
  }

  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
    const title = (emp.title || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || title.includes(search);
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Çalışanlar</h2>
          <p>Şirket bünyesindeki tüm personeli görüntüleyin.</p>
        </div>
        <button className="btn-primary" onClick={() => {
          setIsEditMode(false);
          setCurrentEmpId(null);
          setNewEmp({ firstName: '', lastName: '', email: '', password: '', title: '', departmentId: '', roleOption: 'EMPLOYEE' });
          setIsModalOpen(true);
        }}>
          + Yeni Çalışan Ekle
        </button>
      </div>

      <div className="summary-cards-container" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px'}}>
        <SummaryCard 
          title="Toplam Çalışan" 
          value={employees.length} 
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
          color="blue"
        />
        <SummaryCard 
          title="Aktif Departman" 
          value={departments.length} 
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
          color="purple"
        />
        <SummaryCard 
          title="Son Eklenen" 
          value={employees.length > 0 ? employees[employees.length - 1].firstName : '-'} 
          icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="green"
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
              placeholder="Çalışan Ara (İsim, Ünvan)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <SkeletonTable columns={4} rows={4} />
        ) : filteredEmployees.length === 0 ? (
          <EmptyState 
            title="Çalışan Bulunamadı" 
            message={searchTerm ? "Arama kriterlerinize uyan çalışan bulunamadı." : "Şirketinize henüz hiç çalışan eklenmemiş."}
            actionText={!searchTerm ? "+ Yeni Çalışan Ekle" : null}
            onAction={!searchTerm ? () => {
              setIsEditMode(false);
              setCurrentEmpId(null);
              setNewEmp({ firstName: '', lastName: '', email: '', password: '', title: '', departmentId: '', roleOption: 'EMPLOYEE' });
              setIsModalOpen(true);
            } : null}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Ad Soyad</th>
                <th>Departman</th>
                <th>Ünvan / Rol</th>
                <th className="action-column">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td className="font-medium">
                    <div className="employee-name-cell">
                      <div className="avatar-small">
                        {emp.firstName?.charAt(0) || ''}{emp.lastName?.charAt(0) || ''}
                      </div>
                      {emp.firstName} {emp.lastName}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${emp.department ? 'status-blue' : 'status-warning'}`}>
                      {emp.department?.name || 'Atanmadı'}
                    </span>
                  </td>
                  <td className="text-muted">{emp.title || emp.role}</td>
                  <td className="action-column">
                    <button 
                      className="icon-btn edit-btn" 
                      title="Düzenle"
                      onClick={() => {
                        setIsEditMode(true);
                        setCurrentEmpId(emp.id);
                        
                        let roleOpt = emp.role;
                        if (emp.department?.manager?.id === emp.id) {
                           roleOpt = 'DEPARTMENT_MANAGER';
                        }
                        
                        setNewEmp({
                          firstName: emp.firstName,
                          lastName: emp.lastName,
                          email: emp.email,
                          password: '', // Edit mode'da şifre boş bırakılır
                          title: emp.title || '',
                          departmentId: emp.department ? emp.department.id : '',
                          roleOption: roleOpt
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button className="icon-btn delete-btn" title="Sil" onClick={() => setConfirmModal({ isOpen: true, empId: emp.id })}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
          <div className="modal-content" style={{maxWidth: '500px'}}>
            <h3>{isEditMode ? 'Çalışanı Düzenle' : 'Yeni Çalışan Ekle'}</h3>
            <div className="form-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px'}}>
              <div className="form-group">
                <label>Ad</label>
                <input type="text" value={newEmp.firstName} onChange={e => setNewEmp({...newEmp, firstName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Soyad</label>
                <input type="text" value={newEmp.lastName} onChange={e => setNewEmp({...newEmp, lastName: e.target.value})} />
              </div>
              <div className="form-group full-width" style={{gridColumn: '1 / -1'}}>
                <label>Email</label>
                <input type="email" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
              </div>
              <div className="form-group full-width" style={{gridColumn: '1 / -1'}}>
                <label>{isEditMode ? 'Yeni Şifre (Değiştirmek İstemiyorsanız Boş Bırakın)' : 'Geçici Şifre'}</label>
                <input type="text" value={newEmp.password} onChange={e => setNewEmp({...newEmp, password: e.target.value})} placeholder={isEditMode ? "********" : ""} />
              </div>
              <div className="form-group">
                <label>Ünvan</label>
                <input type="text" value={newEmp.title} onChange={e => setNewEmp({...newEmp, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select value={newEmp.roleOption} onChange={e => setNewEmp({...newEmp, roleOption: e.target.value})} style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--admin-border)'}}>
                  <option value="EMPLOYEE">Standart Çalışan</option>
                  <option value="DEPARTMENT_MANAGER">Departman Yöneticisi</option>
                  <option value="COMPANY_ADMIN">Şirket Yöneticisi</option>
                </select>
              </div>
              <div className="form-group full-width premium-input" style={{gridColumn: '1 / -1'}}>
                <label>Departman</label>
                <select value={newEmp.departmentId} onChange={e => setNewEmp({...newEmp, departmentId: e.target.value})} style={{padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--admin-border)'}}>
                  <option value="">Seçiniz...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-actions" style={{marginTop: '24px'}}>
              <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>İptal</button>
              <button className="btn-primary" onClick={handleAdd}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Çalışanı Sil"
        message="Bu çalışanı silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, empId: null })}
      />
    </div>
  );
};

export default EmployeeList;
