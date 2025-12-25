import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, Phone, Mail, Building, Calendar, User, X, MapPin } from 'lucide-react';
import { Customer, CustomerType } from '../types';

export const CustomersView: React.FC = () => {
  const { customers, addCustomer, deleteCustomer } = useData();
  const [activeTab, setActiveTab] = useState<CustomerType>('potansiyel');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id'>>({
    type: 'potansiyel',
    name: '',
    company: '',
    contactInfo: '', // İletişim bilgisi buraya kaydediliyor
    service: '',
    startDate: '',
    endDate: '',
  });

  const openAddModal = (type: CustomerType) => {
    setNewCustomer((prev) => ({ ...prev, type }));
    setActiveTab(type);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Formdaki verileri doğru şekilde gönder
    addCustomer({
      type: newCustomer.type,
      name: newCustomer.name,
      company: newCustomer.company,
      contactInfo: newCustomer.contactInfo, // İletişim bilgisi buradan gidiyor
      service: newCustomer.service,
      startDate: newCustomer.startDate,
      endDate: newCustomer.endDate,
    });
    
    setShowAddModal(false);
    setNewCustomer({
      type: 'potansiyel',
      name: '',
      company: '',
      contactInfo: '',
      service: '',
      startDate: '',
      endDate: '',
    });
  };

  const filteredCustomers = customers.filter((c) => c.type === activeTab);

  const renderFormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Müşteri / Kurum Adı
        </label>
        <div className="flex gap-2">
          <input
            required
            type="text"
            placeholder="Kişi Adı"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            className="w-1/2 border p-2 rounded outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            required
            type="text"
            placeholder="Kurum Adı"
            value={newCustomer.company}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, company: e.target.value })
            }
            className="w-1/2 border p-2 rounded outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          İletişim Adresi
        </label>
        <input
          required
          type="text"
          placeholder="Telefon: 0555 555 55 55, Email: ornek@email.com, Adres: İstanbul"
          value={newCustomer.contactInfo}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, contactInfo: e.target.value })
          }
          className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-slate-500 mt-1">
          Telefon, email veya adres bilgilerini girin
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Verilen Hizmet
        </label>
        <input
          required
          type="text"
          placeholder="Hizmet Detayı"
          value={newCustomer.service}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, service: e.target.value })
          }
          className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {activeTab !== 'potansiyel' && (
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Başlangıç Tarihi
            </label>
            <input
              required
              type="date"
              value={newCustomer.startDate}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, startDate: e.target.value })
              }
              className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bitiş Tarihi
            </label>
            <input
              required
              type="date"
              value={newCustomer.endDate}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, endDate: e.target.value })
              }
              className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">Müşteri Yönetimi</h2>
      <p className="text-slate-500 mb-6">Müşteri portföyü ve proje takibi.</p>

      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg mb-6 w-fit">
        {(['potansiyel', 'mevcut', 'onceki'] as CustomerType[]).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === t
                ? 'bg-white text-primary shadow'
                : 'text-slate-600'
            }`}
          >
            {t === 'potansiyel'
              ? 'Potansiyel Müşteriler'
              : t === 'mevcut'
              ? 'Mevcut Müşteriler'
              : 'Önceki Müşteriler'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border min-h-[400px] p-4">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50 rounded-t-lg">
          <h3 className="font-medium">
            {activeTab === 'potansiyel' 
              ? 'Potansiyel Müşteriler' 
              : activeTab === 'mevcut' 
              ? 'Mevcut Müşteriler' 
              : 'Önceki Müşteriler'} 
            ({filteredCustomers.length})
          </h3>
          <button
            onClick={() => openAddModal(activeTab)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} /> Müşteri Ekle
          </button>
        </div>

        {/* MÜŞTERİ KARTLARI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredCustomers.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-400">
              Bu kategoride kayıt bulunamadı.
            </div>
          ) : (
            filteredCustomers.map((customer) => (
              <div 
                key={customer.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{customer.company}</h3>
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <User size={14} /> {customer.name}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    customer.type === 'potansiyel' ? 'bg-blue-100 text-blue-800' :
                    customer.type === 'mevcut' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {customer.type}
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  {/* İLETİŞİM BİLGİLERİ - BURASI DÜZELDİ */}
                  <div className="flex items-start gap-2 text-sm text-slate-700">
                    <Phone size={14} className="mt-1 flex-shrink-0" />
                    <span className="break-words">{customer.contactInfo}</span>
                  </div>
                  
                  <div className="text-sm text-slate-700">
                    <span className="font-medium">Hizmet:</span> {customer.service}
                  </div>

                  {customer.startDate && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      <span>Başlangıç: {new Date(customer.startDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Kartın tıklanmasını engelle
                      deleteCustomer(customer.id);
                    }}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MÜŞTERİ EKLEME MODAL'I */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Yeni Müşteri Ekle</h3>
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              <div className="flex justify-end gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MÜŞTERİ DETAY MODAL'I */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedCustomer.company}</h2>
                <p className="text-slate-600 mt-1">{selectedCustomer.service}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-500">İlgili Kişi</label>
                  <p className="font-medium text-lg flex items-center gap-2">
                    <User size={18} /> {selectedCustomer.name}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm text-slate-500">İletişim Bilgisi</label>
                  <div className="font-medium flex items-start gap-2 mt-1">
                    <Phone size={18} className="flex-shrink-0 mt-1" />
                    <div className="break-words">{selectedCustomer.contactInfo}</div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-slate-500">Müşteri Tipi</label>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCustomer.type === 'potansiyel' ? 'bg-blue-100 text-blue-800' :
                    selectedCustomer.type === 'mevcut' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCustomer.type === 'potansiyel' ? 'Potansiyel Müşteri' :
                     selectedCustomer.type === 'mevcut' ? 'Mevcut Müşteri' :
                     'Önceki Müşteri'}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {selectedCustomer.startDate && (
                  <div>
                    <label className="text-sm text-slate-500">Başlangıç Tarihi</label>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar size={18} /> 
                      {new Date(selectedCustomer.startDate).toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {selectedCustomer.endDate && (
                  <div>
                    <label className="text-sm text-slate-500">Bitiş Tarihi</label>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar size={18} /> 
                      {new Date(selectedCustomer.endDate).toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-slate-500">Hizmet Süresi</label>
                  {selectedCustomer.startDate && selectedCustomer.endDate ? (
                    <p className="font-medium">
                      {Math.ceil(
                        (new Date(selectedCustomer.endDate).getTime() - 
                         new Date(selectedCustomer.startDate).getTime()) / 
                        (1000 * 60 * 60 * 24)
                      )} gün
                    </p>
                  ) : (
                    <p className="text-slate-400">Süre belirtilmemiş</p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex justify-between">
              <button
                onClick={() => {
                  if (window.confirm(`${selectedCustomer.company} müşterisini silmek istediğinize emin misiniz?`)) {
                    deleteCustomer(selectedCustomer.id);
                    setSelectedCustomer(null);
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} /> Müşteriyi Sil
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                  Kapat
                </button>
                <button
                  onClick={() => {
                    // WhatsApp mesajı aç (isteğe bağlı)
                    const phoneMatch = selectedCustomer.contactInfo.match(/(\d[\d\s\-\(\)]{8,}\d)/);
                    if (phoneMatch) {
                      const phone = phoneMatch[0].replace(/\D/g, '');
                      window.open(`https://wa.me/${phone}`, '_blank');
                    } else {
                      alert("Telefon numarası bulunamadı. İletişim bilgilerini kontrol edin.");
                    }
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  WhatsApp ile İletişim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};