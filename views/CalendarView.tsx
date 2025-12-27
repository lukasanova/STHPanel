import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataProvider';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Grid,
  List,
  Eye,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { CalendarEvent, CalendarView } from '../types';

export const CalendarViewComponent: React.FC = () => {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useData();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [darkMode, setDarkMode] = useState(true); // Varsayılan Koyu Tema
  
  // Yeni etkinlik formu state'i
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    color: '#3B82F6',
    assignee: '',
    type: 'meeting' as const,
  });

  // Bugünün tarihini al
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Ay değiştirme fonksiyonları
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Ayın günlerini hesapla
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = date.toISOString().split('T')[0];
      const dayEvents = (calendarEvents || []).filter(event => event.date === dateString);
      
      days.push({
        date,
        dateString,
        day: i,
        events: dayEvents
      });
    }
    
    return days;
  };

  // Etkinlik ekleme
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEvent.title.trim()) {
      alert('Etkinlik başlığı gereklidir!');
      return;
    }
    
    if (!newEvent.date) {
      alert('Tarih gereklidir!');
      return;
    }
    
    addCalendarEvent({
      ...newEvent,
      date: newEvent.date || selectedDate,
    });
    
    setShowEventModal(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      color: '#3B82F6',
      assignee: '',
      type: 'meeting',
    });
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Renk seçenekleri (koyu tema için)
  const colorOptions = [
    { name: 'Koyu Mavi', value: '#1E40AF' },
    { name: 'Koyu Kırmızı', value: '#B91C1C' },
    { name: 'Koyu Yeşil', value: '#047857' },
    { name: 'Koyu Mor', value: '#7C3AED' },
    { name: 'Koyu Turuncu', value: '#D97706' },
    { name: 'Koyu Pembe', value: '#BE185D' },
    { name: 'Gri', value: '#4B5563' },
    { name: 'Siyah', value: '#111827' },
  ];

  // Etkinlik tipi seçenekleri
  const typeOptions = [
    { value: 'meeting', label: 'Toplantı' },
    { value: 'task', label: 'Görev' },
    { value: 'event', label: 'Etkinlik' },
    { value: 'reminder', label: 'Hatırlatıcı' },
  ];

  // Ay adı
  const monthName = currentDate.toLocaleDateString('tr-TR', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className={`p-6 min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Takvim</h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Etkinliklerinizi planlayın ve görev dağılımı yapın.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
            title={darkMode ? 'Açık moda geç' : 'Koyu moda geç'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={goToToday}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
          >
            <CalendarIcon size={16} />
            Bugün ({today.getDate()}.{today.getMonth() + 1}.{today.getFullYear()})
          </button>
          
          <button
            onClick={() => setShowEventModal(true)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${darkMode ? 'bg-blue-700 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            <Plus size={16} />
            Etkinlik Ekle
          </button>
        </div>
      </div>

      {/* Takvim Kontrolleri */}
      <div className={`rounded-xl border p-4 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={prevMonth} 
              className={`p-2 rounded ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <ChevronLeft size={20} />
            </button>
            
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {monthName} {year}
            </h3>
            
            <button 
              onClick={nextMonth} 
              className={`p-2 rounded ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className={`flex gap-2 p-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded ${view === 'month' ? (darkMode ? 'bg-gray-600' : 'bg-white') : ''} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded ${view === 'week' ? (darkMode ? 'bg-gray-600' : 'bg-white') : ''} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded ${view === 'day' ? (darkMode ? 'bg-gray-600' : 'bg-white') : ''} ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Aylık Takvim Görünümü */}
      {view === 'month' && (
        <div className={`rounded-xl border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Hafta günleri başlıkları */}
          <div className={`grid grid-cols-7 border-b ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
              <div key={day} className={`p-4 text-center font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {day}
              </div>
            ))}
          </div>
          
          {/* Takvim günleri */}
          <div className="grid grid-cols-7">
            {getDaysInMonth().map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] border-r border-b p-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${
                  day ? '' : (darkMode ? 'bg-gray-900' : 'bg-gray-50')
                } ${
                  day?.dateString === todayString ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') : ''
                }`}
                onClick={() => {
                  if (day) {
                    setSelectedDate(day.dateString);
                    setNewEvent(prev => ({ ...prev, date: day.dateString }));
                    setShowEventModal(true);
                  }
                }}
              >
                {day && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-semibold ${
                        day.dateString === todayString 
                          ? `${darkMode ? 'bg-blue-700' : 'bg-blue-600'} text-white w-6 h-6 flex items-center justify-center rounded-full`
                          : darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {day.day}
                      </span>
                      {day.events.length > 0 && (
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {day.events.length} etkinlik
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {day.events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                          style={{ 
                            backgroundColor: darkMode 
                              ? `${event.color}20` 
                              : `${event.color}15`,
                            borderLeft: `3px solid ${event.color}`
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div className={`font-medium truncate flex-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{event.title}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                                  deleteCalendarEvent(event.id);
                                  setSelectedEvent(null);
                                }
                              }}
                              className={`ml-1 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{event.startTime}</div>
                        </div>
                      ))}
                      {day.events.length > 3 && (
                        <div className={`text-xs pl-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          +{day.events.length - 3} daha...
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Etkinlik Listesi Görünümü */}
      {view === 'week' && (
        <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Bu Haftaki Etkinlikler</h3>
          <div className="space-y-4">
            {(calendarEvents || [])
              .filter(event => {
                const eventDate = new Date(event.date);
                const today = new Date();
                const nextWeek = new Date(today);
                nextWeek.setDate(today.getDate() + 7);
                return eventDate >= today && eventDate <= nextWeek;
              })
              .sort((a, b) => {
                if (a.date === b.date) {
                  return a.startTime.localeCompare(b.startTime);
                }
                return a.date.localeCompare(b.date);
              })
              .map(event => (
                <div
                  key={event.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{event.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                          {typeOptions.find(t => t.value === event.type)?.label}
                        </span>
                      </div>
                      
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{event.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <CalendarIcon size={14} />
                          {formatDate(event.date)}
                        </div>
                        <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Clock size={14} />
                          {event.startTime} - {event.endTime}
                        </div>
                        {event.assignee && (
                          <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <User size={14} />
                            {event.assignee}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event);
                          setShowEventModal(true);
                        }}
                        className={`p-2 ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-500'}`}
                        title="Düzenle"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                            deleteCalendarEvent(event.id);
                            setSelectedEvent(null);
                          }
                        }}
                        className={`p-2 ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                        title="Sil"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            
            {(calendarEvents || []).filter(event => {
              const eventDate = new Date(event.date);
              const today = new Date();
              const nextWeek = new Date(today);
              nextWeek.setDate(today.getDate() + 7);
              return eventDate >= today && eventDate <= nextWeek;
            }).length === 0 && (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <CalendarIcon size={48} className="mx-auto mb-4 opacity-30" />
                <p>Bu hafta için planlanmış etkinlik bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Günlük Görünüm */}
      {view === 'day' && (
        <div className={`rounded-xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {new Date().toLocaleDateString('tr-TR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          <div className="space-y-4">
            {Array.from({ length: 12 }, (_, i) => i + 9).map((hour) => {
              const hourEvents = (calendarEvents || []).filter(event => {
                const eventDate = new Date(event.date);
                const todayString = new Date().toISOString().split('T')[0];
                return event.date === todayString && 
                  parseInt(event.startTime.split(':')[0]) === hour;
              });
              
              return (
                <div key={hour} className={`flex border-b pb-4 ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <div className={`w-20 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {hour}:00
                  </div>
                  <div className="flex-1">
                    {hourEvents.map(event => (
                      <div
                        key={event.id}
                        className="mb-2 p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow relative group"
                        style={{ 
                          backgroundColor: darkMode 
                            ? `${event.color}20`
                            : `${event.color}15`,
                          borderLeft: `4px solid ${event.color}`
                        }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className={`font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{event.title}</h4>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                                setShowEventModal(true);
                              }}
                              className={darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'}
                              title="Düzenle"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                                  deleteCalendarEvent(event.id);
                                  setSelectedEvent(null);
                                }
                              }}
                              className={darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}
                              title="Sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {event.startTime} - {event.endTime}
                          </span>
                          {event.assignee && (
                            <div className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <User size={12} />
                              {event.assignee}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {hourEvents.length === 0 && (
                      <div
                        className={`h-12 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer ${darkMode ? 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-500'}`}
                        onClick={() => {
                          const today = new Date().toISOString().split('T')[0];
                          setSelectedDate(today);
                          setNewEvent(prev => ({ 
                            ...prev, 
                            date: today,
                            startTime: `${hour.toString().padStart(2, '0')}:00`,
                            endTime: `${(hour + 1).toString().padStart(2, '0')}:00`
                          }));
                          setShowEventModal(true);
                        }}
                      >
                        + Etkinlik Ekle
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ETKİNLİK EKLEME/DÜZENLEME MODALI */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                  {selectedEvent ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Ekle'}
                </h3>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                    setNewEvent({
                      title: '',
                      description: '',
                      date: '',
                      startTime: '09:00',
                      endTime: '10:00',
                      color: '#3B82F6',
                      assignee: '',
                      type: 'meeting',
                    });
                  }}
                  className={darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddEvent}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Etkinlik Başlığı *
                    </label>
                    <input
                      type="text"
                      required
                      value={selectedEvent ? selectedEvent.title : newEvent.title}
                      onChange={(e) => {
                        if (selectedEvent) {
                          setSelectedEvent({ ...selectedEvent, title: e.target.value });
                        } else {
                          setNewEvent({ ...newEvent, title: e.target.value });
                        }
                      }}
                      className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'}`}
                      placeholder="Etkinlik başlığını girin"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Açıklama
                    </label>
                    <textarea
                      value={selectedEvent ? selectedEvent.description : newEvent.description}
                      onChange={(e) => {
                        if (selectedEvent) {
                          setSelectedEvent({ ...selectedEvent, description: e.target.value });
                        } else {
                          setNewEvent({ ...newEvent, description: e.target.value });
                        }
                      }}
                      className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'}`}
                      rows={3}
                      placeholder="Etkinlik açıklamasını girin"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Tarih *
                      </label>
                      <input
                        type="date"
                        required
                        value={selectedEvent ? selectedEvent.date : (newEvent.date || selectedDate)}
                        onChange={(e) => {
                          if (selectedEvent) {
                            setSelectedEvent({ ...selectedEvent, date: e.target.value });
                          } else {
                            setNewEvent({ ...newEvent, date: e.target.value });
                          }
                        }}
                        className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'}`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Etkinlik Türü
                      </label>
                      <select
                        value={selectedEvent ? selectedEvent.type : newEvent.type}
                        onChange={(e) => {
                          if (selectedEvent) {
                            setSelectedEvent({ ...selectedEvent, type: e.target.value as any });
                          } else {
                            setNewEvent({ ...newEvent, type: e.target.value as any });
                          }
                        }}
                        className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'}`}
                      >
                        {typeOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Başlangıç Saati
                      </label>
                      <input
                        type="time"
                        value={selectedEvent ? selectedEvent.startTime : newEvent.startTime}
                        onChange={(e) => {
                          if (selectedEvent) {
                            setSelectedEvent({ ...selectedEvent, startTime: e.target.value });
                          } else {
                            setNewEvent({ ...newEvent, startTime: e.target.value });
                          }
                        }}
                        className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'}`}
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Bitiş Saati
                      </label>
                      <input
                        type="time"
                        value={selectedEvent ? selectedEvent.endTime : newEvent.endTime}
                        onChange={(e) => {
                          if (selectedEvent) {
                            setSelectedEvent({ ...selectedEvent, endTime: e.target.value });
                          } else {
                            setNewEvent({ ...newEvent, endTime: e.target.value });
                          }
                        }}
                        className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'}`}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Görevli Kişi
                    </label>
                    <input
                      type="text"
                      value={selectedEvent ? selectedEvent.assignee : newEvent.assignee}
                      onChange={(e) => {
                        if (selectedEvent) {
                          setSelectedEvent({ ...selectedEvent, assignee: e.target.value });
                        } else {
                          setNewEvent({ ...newEvent, assignee: e.target.value });
                        }
                      }}
                      className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' : 'bg-white border-gray-300 text-gray-800 focus:ring-blue-500 focus:border-blue-500'}`}
                      placeholder="Görevli kişinin adını girin"
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Renk Seçin
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => {
                            if (selectedEvent) {
                              setSelectedEvent({ ...selectedEvent, color: color.value });
                            } else {
                              setNewEvent({ ...newEvent, color: color.value });
                            }
                          }}
                          className={`w-8 h-8 rounded-full border-2 hover:scale-110 transition-transform ${
                            (selectedEvent ? selectedEvent.color : newEvent.color) === color.value
                              ? darkMode ? 'border-gray-300' : 'border-gray-800'
                              : darkMode ? 'border-gray-600' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className={`flex justify-end gap-3 mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    İptal
                  </button>
                  
                  {selectedEvent ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedEvent) {
                            updateCalendarEvent(selectedEvent.id, selectedEvent);
                            setShowEventModal(false);
                            setSelectedEvent(null);
                          }
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                      >
                        Güncelle
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedEvent && window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                            deleteCalendarEvent(selectedEvent.id);
                            setShowEventModal(false);
                            setSelectedEvent(null);
                          }
                        }}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                      >
                        Sil
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    >
                      Kaydet
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ETKİNLİK DETAY MODALI */}
      {selectedEvent && !showEventModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={`rounded-xl w-full max-w-md ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedEvent.color }}
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      {typeOptions.find(t => t.value === selectedEvent.type)?.label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className={darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedEvent.description && (
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Açıklama</h4>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tarih</h4>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{formatDate(selectedEvent.date)}</p>
                  </div>
                  
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Saat</h4>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  </div>
                </div>
                
                {selectedEvent.assignee && (
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Görevli</h4>
                    <div className="flex items-center gap-2">
                      <User size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedEvent.assignee}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`flex justify-end gap-3 mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                      deleteCalendarEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  Sil
                </button>
                <button
                  onClick={() => {
                    setShowEventModal(true);
                  }}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};