import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, Building, User, FileText, Upload } from 'lucide-react';
import { Customer, CustomerType } from '../types';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, deleteCustomer } = useData();
  const [activeTab, setActiveTab] = useState<CustomerType>('potansiyel');
  const [showModal, setShowModal] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    type: 'potansiyel',
    name: '',
    company: '',
    contactInfo: '',
    service: '',
    startDate: '',
    endDate: '',
    invoiceFile: ''
  });

  const openModal = (type: CustomerType) => {
    setNewCustomer({ ...newCustomer, type: type });
    setActiveTab(type);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newCustomer);
    setShowModal(false);
    // Reset form
    setNewCustomer({
      type: 'potansiyel',
      name: '',
      company: '',
      contactInfo: '',
      service: '',
      startDate: '',
      endDate: '',
      invoiceFile: ''
    });
  };

  // Filter customers by tab
  const filteredCustomers = customers.filter(c => c.type === activeTab);

  const renderFormFields = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri / Kurum Adı</label>
          <div className="flex gap-2">
            <input required type="text" placeholder="Kişi Adı" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} className="w-1/2 border p-2 rounded outline-none focus:ring-2 focus:ring-primary" />
            <input required type="text" placeholder="Kurum Adı" value={newCustomer.company} onChange={e => setNewCustomer({...newCustomer, company: e.target.value})} className="w-1/2 border p-2 rounded outline-none focus:ring-2 focus:ring-primary" />
          </div>
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">İletişim Adresi</label>
           <input required type="text" placeholder="Telefon, Email, Adres vb." value={newCustomer.contactInfo} onChange={e => setNewCustomer({...newCustomer, contactInfo: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Verilen Hizmet</label>
           <input required type="text" placeholder="Hizmet Detayı" value={newCustomer.service} onChange={e => setNewCustomer({...newCustomer, service: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary" />
        </div>

        {activeTab === 'mevcut' && (
          <div className="flex gap-2">
            <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Başlangıç Tarihi</label>
                <input required type="date" value={newCustomer.startDate} onChange={e => setNewCustomer({...newCustomer, startDate: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="w-1/2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Bitiş Tarihi</label>
                <input required type="date" value={newCustomer.endDate} onChange={e => setNewCustomer({...newCustomer, endDate: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        )}

        {activeTab === 'onceki' && (
          <>
             <div className="flex gap-2">
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Başlama Tarihi</label>
                    <input type="date" value={newCustomer.startDate} onChange={e => setNewCustomer({...newCustomer, startDate: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Sonlandırma Tarihi</label>
                    <input required type="date" value={newCustomer.endDate} onChange={e => setNewCustomer({...newCustomer, endDate: e.target.value})} className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fatura Dosyası</label>
                <div className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer hover:bg-slate-50">
                   <input type="file" className="hidden" id="file-upload" onChange={e => setNewCustomer({...newCustomer, invoiceFile: e.target.files?.[0]?.name || ''})} />
                   <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <span className="text-sm text-slate-600">{newCustomer.invoiceFile ? newCustomer.invoiceFile : 'Dosya Seç veya Sürükle'}</span>
                   </label>
                </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Müşteri Yönetimi</h2>
          <p className="text-slate-500">Müşteri portföyü ve proje takibi.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg mb-6 w-fit">
        <button onClick={() => setActiveTab('potansiyel')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'potansiyel' ? 'bg-white text-primary shadow' : 'text-slate-600 hover:text-slate-900'}`}>
          Potansiyel Müşteriler
        </button>
        <button onClick={() => setActiveTab('mevcut')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'mevcut' ? 'bg-white text-primary shadow' : 'text-slate-600 hover:text-slate-900'}`}>
          Mevcut Müşteriler
        </button>
        <button onClick={() => setActiveTab('onceki')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'onceki' ? 'bg-white text-primary shadow' : 'text-slate-600 hover:text-slate-900'}`}>
          Önceki Müşteriler
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-slate-100 flex justify-end bg-slate-50">
            <button 
                onClick={() => openModal(activeTab)}
                className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-sm text-sm"
            >
                <Plus size={16} />
                <span>Müşteri Ekle</span>
            </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Müşteri / Kurum</th>
                <th className="px-6 py-4">İletişim</th>
                <th className="px-6 py-4">Hizmet</th>
                {activeTab !== 'potansiyel' && <th className="px-6 py-4">Tarihler</th>}
                {activeTab === 'onceki' && <th className="px-6 py-4">Fatura</th>}
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                        Bu kategoride kayıt bulunamadı.
                    </td>
                </tr>
              ) : filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{c.company}</div>
                    <div className="text-slate-500 flex items-center mt-1"><User size={12} className="mr-1"/>{c.name}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate" title={c.contactInfo}>{c.contactInfo}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 text-xs font-medium">
                        {c.service}
                    </span>
                  </td>
                  {activeTab !== 'potansiyel' && (
                      <td className="px-6 py-4 text-slate-600 text-xs">
                          <div className="flex flex-col gap-1">
                            {c.startDate && <span><span className="font-bold">Başlangıç:</span> {c.startDate}</span>}
                            {c.endDate && <span className={activeTab === 'onceki' ? 'text-red-500' : ''}><span className="font-bold">{activeTab === 'onceki' ? 'Sonlanma:' : 'Bitiş:'}</span> {c.endDate}</span>}
                          </div>
                      </td>
                  )}
                   {activeTab === 'onceki' && (
                      <td className="px-6 py-4">
                          {c.invoiceFile ? (
                              <div className="flex items-center text-green-600 text-xs font-bold cursor-pointer hover:underline">
                                  <FileText size={14} className="mr-1"/> {c.invoiceFile}
                              </div>
                          ) : <span className="text-slate-300">-</span>}
                      </td>
                  )}
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteCustomer(c.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* Modal */}
       {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 capitalize">{activeTab} Müşteri Ekle</h3>
            <form onSubmit={handleSubmit}>
               {renderFormFields()}
              <div className="flex justify-end space-x-2 pt-6">
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