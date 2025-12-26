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
  Tag,
  X
} from 'lucide-react';
import { CalendarEvent, CalendarView } from '../types';

export const CalendarViewComponent: React.FC = () => {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useData();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  // Yeni etkinlik formu state'i
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    color: '#3B82F6', // Mavi
    assignee: '',
    type: 'meeting' as const,
  });

  // Bugünün tarihini al - DOĞRU TARİH İÇİN DÜZELTME
  const today = new Date();
  // Türkiye saati için düzeltme (UTC+3)
  const todayString = new Date(today.getTime() + (3 * 60 * 60 * 1000)).toISOString().split('T')[0];

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
    
    // Ayın ilk gününden önceki boş hücreler
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      // Türkiye saati için düzeltme
      const dateString = new Date(date.getTime() + (3 * 60 * 60 * 1000)).toISOString().split('T')[0];
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

  // Renk seçenekleri
  const colorOptions = [
    { name: 'Mavi', value: '#3B82F6' },
    { name: 'Kırmızı', value: '#EF4444' },
    { name: 'Yeşil', value: '#10B981' },
    { name: 'Mor', value: '#8B5CF6' },
    { name: 'Sarı', value: '#F59E0B' },
    { name: 'Pembe', value: '#EC4899' },
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

  // GÜNLÜK GÖRÜNÜM İÇİN BUGÜNÜN TARİHİNİ DOĞRU AL
  const getTodayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Takvim</h2>
          <p className="text-slate-500">Etkinliklerinizi planlayın ve görev dağılımı yapın.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 flex items-center gap-2"
          >
            <CalendarIcon size={16} />
            Bugün ({today.getDate()}.{today.getMonth() + 1}.{today.getFullYear()})
          </button>
          
          <button
            onClick={() => setShowEventModal(true)}
            className="px-4 py-2 bg-primary hover:bg-slate-800 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Etkinlik Ekle
          </button>
        </div>
      </div>

      {/* Takvim Kontrolleri */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded">
              <ChevronLeft size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-slate-800">
              {monthName} {year}
            </h3>
            
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded ${view === 'month' ? 'bg-white shadow' : ''}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded ${view === 'week' ? 'bg-white shadow' : ''}`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded ${view === 'day' ? 'bg-white shadow' : ''}`}
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Aylık Takvim Görünümü */}
      {view === 'month' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Hafta günleri başlıkları */}
          <div className="grid grid-cols-7 border-b border-slate-200">
            {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day) => (
              <div key={day} className="p-4 text-center font-semibold text-slate-700 bg-slate-50">
                {day}
              </div>
            ))}
          </div>
          
          {/* Takvim günleri */}
          <div className="grid grid-cols-7">
            {getDaysInMonth().map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] border-r border-b border-slate-200 p-2 ${
                  day ? '' : 'bg-slate-50'
                } ${
                  day?.dateString === todayString ? 'bg-blue-50' : ''
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
                          ? 'bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full'
                          : 'text-slate-700'
                      }`}>
                        {day.day}
                      </span>
                      {day.events.length > 0 && (
                        <span className="text-xs text-slate-500">
                          {day.events.length} etkinlik
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      {day.events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80"
                          style={{ backgroundColor: `${event.color}20`, borderLeft: `3px solid ${event.color}` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(event);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div className="font-medium truncate flex-1">{event.title}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
                                  deleteCalendarEvent(event.id);
                                  setSelectedEvent(null);
                                }
                              }}
                              className="text-slate-300 hover:text-red-500 ml-1"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <div className="text-slate-600 truncate">{event.startTime}</div>
                        </div>
                      ))}
                      {day.events.length > 3 && (
                        <div className="text-xs text-slate-500 pl-1">
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
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Bu Haftaki Etkinlikler</h3>
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
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        />
                        <h4 className="font-bold text-slate-800">{event.title}</h4>
                        <span className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600">
                          {typeOptions.find(t => t.value === event.type)?.label}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-3">{event.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {event.startTime} - {event.endTime}
                        </div>
                        {event.assignee && (
                          <div className="flex items-center gap-1">
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
                        className="text-slate-300 hover:text-blue-500 p-2"
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
                        className="text-slate-300 hover:text-red-500 p-2"
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
              <div className="text-center py-12 text-slate-400">
                <CalendarIcon size={48} className="mx-auto mb-4 opacity-30" />
                <p>Bu hafta için planlanmış etkinlik bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Günlük Görünüm */}
      {view === 'day' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            {getTodayDateString()}
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
                <div key={hour} className="flex border-b border-slate-100 pb-4">
                  <div className="w-20 text-slate-500 font-medium">
                    {hour}:00
                  </div>
                  <div className="flex-1">
                    {hourEvents.map(event => (
                      <div
                        key={event.id}
                        className="mb-2 p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow relative group"
                        style={{ backgroundColor: `${event.color}20`, borderLeft: `4px solid ${event.color}` }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-slate-800">{event.title}</h4>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                                setShowEventModal(true);
                              }}
                              className="text-slate-500 hover:text-blue-500"
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
                              className="text-slate-500 hover:text-red-500"
                              title="Sil"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            {event.startTime} - {event.endTime}
                          </span>
                          {event.assignee && (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <User size={12} />
                              {event.assignee}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {hourEvents.length === 0 && (
                      <div
                        className="h-12 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-500 cursor-pointer"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">
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
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddEvent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
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
                      className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Etkinlik başlığını girin"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
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
                      className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      rows={3}
                      placeholder="Etkinlik açıklamasını girin"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
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
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
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
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
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
                      <label className="block text-sm font-medium text-slate-700 mb-1">
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
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
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
                        className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
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
                      className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      placeholder="Görevli kişinin adını girin"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
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
                          className={`w-8 h-8 rounded-full border-2 ${
                            (selectedEvent ? selectedEvent.color : newEvent.color) === color.value
                              ? 'border-slate-800'
                              : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setSelectedEvent(null);
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
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
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
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
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                      >
                        Sil
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary hover:bg-slate-800 text-white rounded-lg"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedEvent.color }}
                  />
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedEvent.title}</h3>
                    <p className="text-slate-500">
                      {typeOptions.find(t => t.value === selectedEvent.type)?.label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedEvent.description && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Açıklama</h4>
                    <p className="text-slate-700">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Tarih</h4>
                    <p className="text-slate-700">{formatDate(selectedEvent.date)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Saat</h4>
                    <p className="text-slate-700">{selectedEvent.startTime} - {selectedEvent.endTime}</p>
                  </div>
                </div>
                
                {selectedEvent.assignee && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-1">Görevli</h4>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-slate-500" />
                      <span className="text-slate-700">{selectedEvent.assignee}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
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
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Sil
                </button>
                <button
                  onClick={() => {
                    setShowEventModal(true);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-slate-800 text-white rounded-lg"
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