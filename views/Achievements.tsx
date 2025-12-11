import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, Award } from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { achievements, addAchievement, deleteAchievement } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newAch, setNewAch] = useState({ title: '', date: '', impact: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAchievement(newAch);
    setIsAdding(false);
    setNewAch({ title: '', date: '', impact: '' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Başarılarımız & Günlük</h2>
          <p className="text-slate-500">Tamamlanan işler ve şirket başarıları.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        >
          <Plus size={18} />
          <span>Girdi Ekle</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Başlık / Yapılan İş" value={newAch.title} onChange={e => setNewAch({...newAch, title: e.target.value})} className="border border-slate-300 p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />
              <input required type="date" value={newAch.date} onChange={e => setNewAch({...newAch, date: e.target.value})} className="border border-slate-300 p-2 rounded focus:ring-2 focus:ring-green-500 outline-none" />
            </div>
            <textarea required placeholder="Etki / Sonuç (Örn: Müşteri memnuniyeti %20 arttı)" value={newAch.impact} onChange={e => setNewAch({...newAch, impact: e.target.value})} className="border border-slate-300 p-2 rounded focus:ring-2 focus:ring-green-500 outline-none h-20" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:bg-slate-100 px-4 py-2 rounded">Vazgeç</button>
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Kaydet</button>
            </div>
          </form>
        </div>
      )}

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8">
        {achievements.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((item) => (
          <div key={item.id} className="relative pl-8">
            <div className="absolute -left-[9px] top-0 bg-white border-2 border-green-500 rounded-full w-5 h-5"></div>
            <div className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 group">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2 text-green-600 font-semibold mb-1">
                  <Award size={18} />
                  <span>{new Date(item.date).toLocaleDateString('tr-TR')}</span>
                </div>
                <button onClick={() => deleteAchievement(item.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
              <p className="text-slate-600">{item.impact}</p>
            </div>
          </div>
        ))}
        {achievements.length === 0 && (
          <div className="pl-8 text-slate-400 italic">Henüz bir başarı kaydı girilmedi.</div>
        )}
      </div>
    </div>
  );
};