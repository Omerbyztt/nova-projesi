import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useToast } from '../../components/ui/ToastProvider';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const DashboardOverview = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/dashboard/summary');
      setStats(response.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error('Özet verileri yüklenemedi. Lütfen backend sunucusunu yeniden başlattığınızdan emin olun.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh'}}>
        <div style={{color: 'var(--admin-text-muted)'}}>Yükleniyor...</div>
      </div>
    );
  }

  // Format data for Recharts
  const pieData = stats && stats.employeesByDepartment ? Object.keys(stats.employeesByDepartment).map(key => ({
    name: key,
    value: stats.employeesByDepartment[key]
  })) : [];

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2>Özet Paneli</h2>
          <p>Şirketinizin genel istatistikleri ve güncel durumu.</p>
        </div>
      </div>

      {!stats ? (
        <div className="content-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Veri bulunamadı veya sunucuya bağlanılamadı.</p>
        </div>
      ) : (
        <>
          {/* Top Stat Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <div className="content-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5', padding: '16px', borderRadius: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Toplam Çalışan</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>{stats.totalEmployees}</p>
              </div>
            </div>

            <div className="content-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '16px', borderRadius: '12px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--admin-text-muted)', fontWeight: 500 }}>Aktif Departman</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '1.8rem', fontWeight: 700, color: 'var(--admin-text-main)' }}>{stats.totalDepartments}</p>
              </div>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Charts */}
            <div className="content-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '1.1rem', color: 'var(--admin-text-main)' }}>Departmanlara Göre Çalışan Dağılımı</h3>
              <div style={{ height: 300, width: '100%' }}>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: '#1e293b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{textAlign: 'center', color: 'var(--admin-text-muted)', marginTop: '100px'}}>Yeterli veri yok.</p>
                )}
              </div>
            </div>

            <div className="content-card" style={{ padding: '24px' }}>
              <h3 style={{ margin: '0 0 24px 0', fontSize: '1.1rem', color: 'var(--admin-text-main)' }}>Son Eklenen Çalışanlar</h3>
              {stats.recentEmployees && stats.recentEmployees.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {stats.recentEmployees.map((emp) => (
                    <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--admin-border)' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', 
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        color: 'white', fontWeight: 600, fontSize: '0.9rem' 
                      }}>
                        {emp.firstName.charAt(0)}{emp.lastName.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--admin-text-main)', fontSize: '0.95rem' }}>{emp.firstName} {emp.lastName}</h4>
                        <p style={{ margin: '2px 0 0 0', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
                          {emp.department ? emp.department.name : 'Bilinmeyen Departman'} • {emp.title || 'Belirtilmemiş'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--admin-text-muted)' }}>Henüz çalışan bulunmuyor.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
