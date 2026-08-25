import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { tr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axiosInstance from '../../api/axiosConfig';
import './Calendar.css';

const locales = {
  'tr': tr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const [newEvent, setNewEvent] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [editEvent, setEditEvent] = useState({ id: '', title: '', description: '', startDate: '', endDate: '' });

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get('/calendar');
      const formattedEvents = res.data.map(evt => ({
        id: evt.id,
        title: evt.title,
        description: evt.description,
        start: new Date(evt.startDate),
        end: new Date(evt.endDate),
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Etkinlikler getirilirken hata:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Helpers to format for datetime-local input (YYYY-MM-DDThh:mm)
  const formatForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const handleSelectSlot = ({ start, end }) => {
    setSelectedSlot({ start, end });
    setNewEvent({
      title: '',
      description: '',
      startDate: formatForInput(start),
      endDate: formatForInput(end),
    });
    setIsModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setEditEvent({
      id: event.id,
      title: event.title,
      description: event.description || '',
      startDate: formatForInput(event.start),
      endDate: formatForInput(event.end),
    });
    setIsEditModalOpen(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/calendar', newEvent);
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Etkinlik oluşturulamadı:', err);
      alert('Etkinlik oluşturulamadı.');
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/calendar/${editEvent.id}`, editEvent);
      setIsEditModalOpen(false);
      fetchEvents();
    } catch (err) {
      console.error('Etkinlik güncellenemedi:', err);
      alert('Etkinlik güncellenemedi.');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Bu etkinliği silmek istediğinize emin misiniz?")) {
      try {
        await axiosInstance.delete(`/calendar/${id}`);
        setIsEditModalOpen(false);
        fetchEvents();
      } catch (err) {
        console.error('Etkinlik silinemedi:', err);
        alert('Etkinlik silinemedi.');
      }
    }
  };

  const messages = {
    allDay: 'Tüm Gün',
    previous: '< Geri',
    next: 'İleri >',
    today: 'Bugün',
    month: 'Ay',
    week: 'Hafta',
    day: 'Gün',
    agenda: 'Ajanda',
    date: 'Tarih',
    time: 'Zaman',
    event: 'Etkinlik',
    noEventsInRange: 'Bu aralıkta etkinlik yok.'
  };

  return (
    <div className="calendar-page-container">
      <div className="calendar-header">
        <h2 className="calendar-title">Kişisel Takvim</h2>
        <p className="calendar-subtitle">Kendi etkinliklerinizi ve toplantılarınızı buradan yönetebilirsiniz. Boş bir güne tıklayarak etkinlik ekleyebilirsiniz.</p>
      </div>

      <div className="calendar-wrapper">
        <BigCalendar
          localizer={localizer}
          events={events}
          date={currentDate}
          view={currentView}
          onNavigate={(newDate) => setCurrentDate(newDate)}
          onView={(newView) => setCurrentView(newView)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          culture="tr"
          messages={messages}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          popup
        />
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content calendar-modal">
            <h3 className="modal-title">Yeni Etkinlik Oluştur</h3>
            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label className="form-label">Başlık</label>
                <input type="text" className="form-input" required value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="Örn: Proje Toplantısı" />
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama / Not</label>
                <textarea className="form-input" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} placeholder="Etkinlik detayları..." />
              </div>
              <div className="form-row">
                <div className="form-group half-width">
                  <label className="form-label">Başlangıç</label>
                  <input type="datetime-local" className="form-input" required value={newEvent.startDate} onChange={e => setNewEvent({...newEvent, startDate: e.target.value})} />
                </div>
                <div className="form-group half-width">
                  <label className="form-label">Bitiş</label>
                  <input type="datetime-local" className="form-input" required value={newEvent.endDate} onChange={e => setNewEvent({...newEvent, endDate: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>İptal</button>
                <button type="submit" className="btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content calendar-modal">
            <h3 className="modal-title">Etkinliği Düzenle</h3>
            <form onSubmit={handleUpdateEvent}>
              <div className="form-group">
                <label className="form-label">Başlık</label>
                <input type="text" className="form-input" required value={editEvent.title} onChange={e => setEditEvent({...editEvent, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Açıklama / Not</label>
                <textarea className="form-input" value={editEvent.description} onChange={e => setEditEvent({...editEvent, description: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group half-width">
                  <label className="form-label">Başlangıç</label>
                  <input type="datetime-local" className="form-input" required value={editEvent.startDate} onChange={e => setEditEvent({...editEvent, startDate: e.target.value})} />
                </div>
                <div className="form-group half-width">
                  <label className="form-label">Bitiş</label>
                  <input type="datetime-local" className="form-input" required value={editEvent.endDate} onChange={e => setEditEvent({...editEvent, endDate: e.target.value})} />
                </div>
              </div>
              <div className="modal-actions" style={{justifyContent: 'space-between'}}>
                <button type="button" className="btn-icon danger" onClick={() => handleDeleteEvent(editEvent.id)}>Sil</button>
                <div style={{display: 'flex', gap: '12px'}}>
                  <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>İptal</button>
                  <button type="submit" className="btn-primary">Güncelle</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
