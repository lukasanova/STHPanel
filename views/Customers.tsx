import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, User } from 'lucide-react';
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
  });

  const openModal = (type: CustomerType) => {
    setNewCustomer((prev) => ({ ...prev, type }));
    setActiveTab(type);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(newCustomer);
    setShowModal(false);

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
          placeholder="Telefon, Email, Adres vb."
          value={newCustomer.contactInfo}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, contactInfo: e.target.value })
          }
          className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-primary"
        />
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

      <div className="bg-white rounded-xl border min-h-[400px]">
        <div className="p-4 border-b flex justify-end bg-slate-50">
          <button
            onClick={() => openModal(activeTab)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} /> Müşteri Ekle
          </button>
        </div>

        <table className="w-full text-sm">
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td className="p-12 text-center text-slate-400">
                  Bu kategoride kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-4 font-bold">{c.company}</td>
                  <td className="p-4 text-slate-600">{c.contactInfo}</td>
                  <td className="p-4">{c.service}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteCustomer(c.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <form onSubmit={handleSubmit}>
              {renderFormFields()}
              <div className="flex justify-end gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 rounded"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded"
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
