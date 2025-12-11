import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Calendar, MapPin, ExternalLink, Plus, Trash2, ArrowRight } from 'lucide-react';
import { EventItem } from '../types';

export const EventsView: React.FC = () => {
  const { events, addEvent, deleteEvent } = useData();
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<EventItem, 'id'>>({
    title: '', date: '', location: '', description: ''
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time for accurate date comparison

  // Sort events by date and Filter out past events
  const sortedEvents = [...events]
    .filter(e => {
        const eventDate = new Date(e.date);
        // Include today's events
        return eventDate >= today; 
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent(newEvent);
    setShowModal(false);
    setNewEvent({ title: '', date: '', location: '', description: '' });
  };

  const SOURCE_URL = "https://www.fuartakip.com/fuarlar/fuartakvimi.asp?sektorkod=medika";

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sektörel Etkinlik & Fuar Takvimi</h2>
          <p className="text-slate-500">Medikal sektör fuarları ve yaklaşan önemli etkinlikler.</p>
        </div>
        <div className="flex gap-2">
            <a 
              href={SOURCE_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white border border-slate-300 text-slate-600 hover:text-primary px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-sm font-medium"
            >
              <ExternalLink size={16} />
              <span>Fuar Kaynağı</span>
            </a>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg font-medium"
            >
              <Plus size={18} />
              <span>Etkinlik Ekle</span>
            </button>
        </div>
      </div>

      <div className="space-y-6">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Yaklaşan aktif etkinlik bulunmamaktadır.</p>
            <p className="text-sm">Geçmiş etkinlikler otomatik olarak listeden silinmiştir.</p>
          </div>
        ) : (
          sortedEvents.map((event) => {
            const dateObj = new Date(event.date);
            
            return (
              <div 
                key={event.id} 
                className="bg-white rounded-xl border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col md:flex-row overflow-hidden group border-t-4 border-t-indigo-500"
              >
                {/* Date Box */}
                <div className="md:w-40 bg-slate-50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 group-hover:bg-indigo-50 transition-colors">
                  <span className="text-indigo-600 font-bold text-4xl">{dateObj.getDate()}</span>
                  <span className="text-slate-600 font-bold uppercase tracking-wide text-sm">{dateObj.toLocaleDateString('tr-TR', { month: 'long' })}</span>
                  <span className="text-slate-400 text-xs mt-1">{dateObj.getFullYear()}</span>
                  <div className="mt-2 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                     {dateObj.toLocaleDateString('tr-TR', { weekday: 'short' })}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 relative">
                   <button onClick={() => deleteEvent(event.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-2 bg-white rounded-full hover:bg-red-50">
                      <Trash2 size={18} />
                   </button>

                  <h3 className="text-xl font-bold text-slate-800 mb-2 pr-8">{event.title}</h3>
                  
                  <div className="flex items-center text-slate-600 mb-4 bg-slate-50 w-fit px-3 py-1 rounded-full text-sm font-medium border border-slate-100">
                    <MapPin size={16} className="mr-1.5 text-red-500" />
                    {event.location}
                  </div>
                  
                  {event.description && (
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {event.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    {event.url ? (
                        <span className="text-xs text-indigo-500 font-semibold flex items-center">
                            FuarTakip.com <ExternalLink size={10} className="ml-1"/>
                        </span>
                    ) : (
                         <span className="text-xs text-slate-400 italic">Dahili Etkinlik</span>
                    )}
                    
                    {event.endDate && (
                         <div className="text-xs text-slate-500 flex items-center bg-slate-100 px-2 py-1 rounded">
                             Bitiş: {new Date(event.endDate).toLocaleDateString('tr-TR')}
                         </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

       {/* Add Event Modal */}
       {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Yeni Etkinlik Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Etkinlik Adı</label>
                <input required type="text" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Başlangıç Tarihi</label>
                    <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bitiş Tarihi (Opsiyonel)</label>
                    <input type="date" value={newEvent.endDate || ''} onChange={e => setNewEvent({...newEvent, endDate: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Konum</label>
                <input required type="text" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full border p-2 rounded h-20 focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200">İptal</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};