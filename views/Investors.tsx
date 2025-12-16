import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, TrendingUp, Banknote, TurkishLira } from 'lucide-react';
import { Investor } from '../types';

export const InvestorsView: React.FC = () => {
  const { investors, addInvestor, deleteInvestor } = useData();
  const [showModal, setShowModal] = useState(false);
  const [newInvestor, setNewInvestor] = useState<Omit<Investor, 'id'>>({
    name: '', contactInfo: '', status: 'potansiyel', potentialAmount: '', notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvestor(newInvestor);
    setShowModal(false);
    setNewInvestor({ name: '', contactInfo: '', status: 'potansiyel', potentialAmount: '', notes: '' });
  };

  // TL formatına çeviren fonksiyon
  const formatCurrency = (amount: string) => {
    if (!amount) return 'Belirtilmemiş';
    
    // Eğer zaten TL içeriyorsa olduğu gibi döndür
    if (amount.toLowerCase().includes('tl') || amount.includes('₺')) {
      return amount;
    }
    
    // Sayıysa TL ekle
    const num = amount.replace(/[^\d.,]/g, '');
    if (num) {
      return `${num} TL`;
    }
    
    return amount;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Potansiyel Yatırımcılar</h2>
          <p className="text-slate-500">Yatırımcı görüşmeleri ve durum takibi.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        >
          <Plus size={18} />
          <span>Yatırımcı Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investors.map((investor) => (
          <div key={investor.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{investor.name}</h3>
                  <p className="text-xs text-slate-500">{investor.contactInfo}</p>
                </div>
              </div>
              <button onClick={() => deleteInvestor(investor.id)} className="text-slate-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Durum:</span>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                  ${investor.status === 'anlasildi' ? 'bg-green-100 text-green-700' : 
                    investor.status === 'red' ? 'bg-red-100 text-red-700' :
                    investor.status === 'gorusuldu' ? 'bg-orange-100 text-orange-700' : 
                    'bg-blue-100 text-blue-700'}`}>
                  {investor.status === 'potansiyel' && 'POTANSİYEL'}
                  {investor.status === 'gorusuldu' && 'GÖRÜŞÜLDÜ'}
                  {investor.status === 'anlasildi' && 'ANLAŞILDI'}
                  {investor.status === 'red' && 'RED'}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Potansiyel Tutar:</span>
                <span className="font-semibold text-slate-700 flex items-center">
                  <TurkishLira size={14} className="mr-1" />
                  {formatCurrency(investor.potentialAmount)}
                </span>
              </div>

              {investor.notes && (
                <div className="bg-slate-50 p-3 rounded text-xs text-slate-600 italic border border-slate-100 mt-2">
                  "{investor.notes}"
                </div>
              )}
            </div>
          </div>
        ))}
        
        {investors.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400">Henüz yatırımcı kaydı bulunmamaktadır.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Yatırımcı Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                required 
                type="text" 
                placeholder="Yatırımcı Adı / Kurum" 
                value={newInvestor.name} 
                onChange={e => setNewInvestor({...newInvestor, name: e.target.value})} 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
              />
              <input 
                required 
                type="text" 
                placeholder="İletişim Bilgisi (Telefon/Email)" 
                value={newInvestor.contactInfo} 
                onChange={e => setNewInvestor({...newInvestor, contactInfo: e.target.value})} 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
              />
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Potansiyel Yatırım Tutarı (TL)" 
                  value={newInvestor.potentialAmount} 
                  onChange={e => setNewInvestor({...newInvestor, potentialAmount: e.target.value})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none pl-10" 
                />
                <TurkishLira 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
                />
              </div>
              <select 
                value={newInvestor.status} 
                onChange={e => setNewInvestor({...newInvestor, status: e.target.value as any})} 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="potansiyel">Potansiyel</option>
                <option value="gorusuldu">Görüşüldü</option>
                <option value="anlasildi">Anlaşıldı</option>
                <option value="red">Red</option>
              </select>
              <textarea 
                placeholder="Notlar" 
                value={newInvestor.notes} 
                onChange={e => setNewInvestor({...newInvestor, notes: e.target.value})} 
                className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-primary outline-none"
              ></textarea>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-slate-800"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};