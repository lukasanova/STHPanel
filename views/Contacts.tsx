import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, Phone, User, MessageCircle } from 'lucide-react';
import { Contact } from '../types';

export const ContactsView: React.FC = () => {
  const { contacts, addContact, deleteContact } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    name: '', role: '', company: '', phone: '', email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContact(newContact);
    setIsAdding(false);
    setNewContact({ name: '', role: '', company: '', phone: '', email: '' });
  };

  const openWhatsApp = (phone: string) => {
    // Remove non-numeric chars
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">İletişim & Rehber</h2>
          <p className="text-slate-500">Çözüm ortakları ve müşterilere hızlı erişim.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-lg transition-colors"
        >
          <Plus size={18} />
          <span>Kişi Ekle</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200 mb-6 animate-fade-in">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Ad Soyad" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} className="border p-2 rounded" />
            <input type="text" placeholder="Kurum" value={newContact.company} onChange={e => setNewContact({...newContact, company: e.target.value})} className="border p-2 rounded" />
            <input type="text" placeholder="Unvan / Rol" value={newContact.role} onChange={e => setNewContact({...newContact, role: e.target.value})} className="border p-2 rounded" />
            <input required type="tel" placeholder="Telefon (905...)" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} className="border p-2 rounded" />
            <div className="col-span-full flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500">İptal</button>
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Kaydet</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">İsim</th>
              <th className="px-6 py-4">Kurum / Unvan</th>
              <th className="px-6 py-4">Telefon</th>
              <th className="px-6 py-4 text-right">İletişim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                    <User size={16} />
                  </div>
                  <span className="font-medium text-slate-800">{contact.name}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <div className="font-medium">{contact.company}</div>
                  <div className="text-xs">{contact.role}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-sm">{contact.phone}</td>
                <td className="px-6 py-4 flex justify-end items-center space-x-2">
                  <button 
                    onClick={() => openWhatsApp(contact.phone)}
                    className="flex items-center space-x-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors text-sm font-bold"
                  >
                    <MessageCircle size={16} />
                    <span>WhatsApp</span>
                  </button>
                  <button onClick={() => deleteContact(contact.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};