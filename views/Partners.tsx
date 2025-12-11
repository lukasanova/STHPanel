import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, Handshake, Calendar, Phone, Award } from 'lucide-react';
import { Partner } from '../types';

export const PartnersView: React.FC = () => {
  const { partners, addPartner, deletePartner } = useData();
  const [showModal, setShowModal] = useState(false);
  const [newPartner, setNewPartner] = useState<Omit<Partner, 'id'>>({
    name: '', startDate: '', contactInfo: '', expertise: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPartner(newPartner);
    setShowModal(false);
    setNewPartner({ name: '', startDate: '', contactInfo: '', expertise: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Partnerler (Satış Ortakları)</h2>
          <p className="text-slate-500">Çözüm ortaklarımız ve performans takibi.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        >
          <Plus size={18} />
          <span>Partner Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map(partner => (
           <div key={partner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all relative">
               <button onClick={() => deletePartner(partner.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
               </button>
               <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
                   <Handshake size={24} />
               </div>
               <h3 className="font-bold text-lg text-slate-800 mb-1">{partner.name}</h3>
               <p className="text-slate-500 text-sm mb-4 flex items-center">
                   <Award size={14} className="mr-1 text-orange-500" />
                   {partner.expertise}
               </p>

               <div className="border-t border-slate-100 pt-4 space-y-2">
                   <div className="flex items-center text-sm text-slate-600">
                       <Calendar size={16} className="mr-2 text-slate-400" />
                       <span>Başlangıç: {partner.startDate}</span>
                   </div>
                   <div className="flex items-center text-sm text-slate-600">
                       <Phone size={16} className="mr-2 text-slate-400" />
                       <span>{partner.contactInfo}</span>
                   </div>
               </div>
           </div>
        ))}
        {partners.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                 <p className="text-slate-400">Henüz kayıtlı partner bulunmamaktadır.</p>
            </div>
         )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Yeni Partner Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Partner Adı</label>
                <input required type="text" value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Uzmanlık Alanı</label>
                <input required type="text" value={newPartner.expertise} onChange={e => setNewPartner({...newPartner, expertise: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" placeholder="Örn: Medikal Cihaz Satışı" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Başlangıç Tarihi</label>
                <input required type="date" value={newPartner.startDate} onChange={e => setNewPartner({...newPartner, startDate: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">İletişim Bilgileri</label>
                <input required type="text" value={newPartner.contactInfo} onChange={e => setNewPartner({...newPartner, contactInfo: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" placeholder="Telefon / Email" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200">İptal</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-slate-800">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};