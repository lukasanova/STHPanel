import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, Calendar, Clock, Users, FileText, Archive, History } from 'lucide-react';
import { Meeting } from '../types';

export const MeetingsView: React.FC = () => {
  const { meetings, addMeeting, deleteMeeting } = useData();
  const [showModal, setShowModal] = useState(false);
  const [newMeeting, setNewMeeting] = useState<Omit<Meeting, 'id'>>({
    title: '', date: '', time: '', attendees: '', description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMeeting(newMeeting);
    setShowModal(false);
    setNewMeeting({ title: '', date: '', time: '', attendees: '', description: '' });
  };

  const now = new Date();

  // Helper to check if meeting is past
  const isMeetingPast = (meeting: Meeting) => {
    const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
    return meetingDate < now;
  };

  // Split meetings into upcoming and past
  const upcomingMeetings = meetings
    .filter(m => !isMeetingPast(m))
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  const pastMeetings = meetings
    .filter(m => isMeetingPast(m))
    .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()); // Newest past first

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Toplantı Planlaması</h2>
          <p className="text-slate-500">Dahili ve harici toplantıların takibi.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        >
          <Plus size={18} />
          <span>Toplantı Ekle</span>
        </button>
      </div>

      {/* --- UPCOMING MEETINGS --- */}
      <h3 className="text-lg font-bold text-primary mb-4 flex items-center border-b border-slate-200 pb-2">
        <Calendar className="mr-2" size={20}/>
        Yaklaşan Toplantılar
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {upcomingMeetings.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300 shadow-sm">
            <p className="text-slate-400">Planlanmış aktif toplantı bulunmuyor.</p>
          </div>
        ) : upcomingMeetings.map((meeting) => {
            const meetingDate = new Date(`${meeting.date}T${meeting.time}`);
            // Check if meeting is within next 24 hours
            const isNear = (meetingDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000);

            return (
              <div 
                key={meeting.id} 
                className={`
                  relative bg-white p-6 rounded-xl shadow-md border-l-4 transition-all hover:shadow-xl hover:-translate-y-1
                  ${isNear ? 'border-l-red-500 ring-1 ring-red-100' : 'border-l-primary'}
                `}
              >
                {isNear && (
                  <span className="absolute top-2 right-2 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border border-red-200 animate-pulse">
                    Yaklaşıyor
                  </span>
                )}
                
                <div className="flex justify-between items-start mb-3">
                  <div className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
                     {new Date(meeting.date).toLocaleDateString('tr-TR', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <button onClick={() => deleteMeeting(meeting.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{meeting.title}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center bg-slate-50 p-2 rounded-lg">
                    <Clock size={18} className="mr-3 text-primary" />
                    <span className="font-bold text-slate-700 text-lg">{meeting.time}</span>
                  </div>
                  <div className="flex items-start text-sm text-slate-600">
                    <Users size={16} className="mr-2 mt-0.5 text-slate-400 flex-shrink-0" />
                    <span>{meeting.attendees}</span>
                  </div>
                </div>

                {meeting.description && (
                  <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-slate-500 flex items-start">
                    <FileText size={16} className="mr-2 mt-0.5 flex-shrink-0 text-slate-400" />
                    <p>{meeting.description}</p>
                  </div>
                )}
              </div>
            );
        })}
      </div>

      {/* --- PAST MEETINGS ARCHIVE --- */}
      {pastMeetings.length > 0 && (
        <div className="opacity-80">
          <h3 className="text-lg font-bold text-slate-500 mb-4 flex items-center border-b border-slate-200 pb-2 mt-8">
            <History className="mr-2" size={20}/>
            Geçmiş Toplantı Arşivi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             {pastMeetings.map((meeting) => (
               <div key={meeting.id} className="bg-slate-100 p-4 rounded-lg border border-slate-200 text-slate-500 hover:bg-white hover:shadow-sm transition-colors relative group">
                  <button onClick={() => deleteMeeting(meeting.id)} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                  <div className="text-xs font-bold uppercase mb-1 text-slate-400">
                    {meeting.date} - {meeting.time}
                  </div>
                  <h4 className="font-bold text-slate-700 mb-1 line-through decoration-slate-400">{meeting.title}</h4>
                  <div className="text-xs flex items-center truncate">
                    <Users size={12} className="mr-1"/> {meeting.attendees}
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Yeni Toplantı Planla</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Toplantı Konusu</label>
                <input required type="text" value={newMeeting.title} onChange={e => setNewMeeting({...newMeeting, title: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                  <input required type="date" value={newMeeting.date} onChange={e => setNewMeeting({...newMeeting, date: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Saat</label>
                  <input required type="time" value={newMeeting.time} onChange={e => setNewMeeting({...newMeeting, time: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Katılımcılar</label>
                <input required type="text" placeholder="Örn: Ahmet, Ayşe, Müşteri X" value={newMeeting.attendees} onChange={e => setNewMeeting({...newMeeting, attendees: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama / Notlar</label>
                <textarea value={newMeeting.description} onChange={e => setNewMeeting({...newMeeting, description: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 h-24 focus:ring-2 focus:ring-primary outline-none"></textarea>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white font-medium rounded hover:bg-slate-800">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};