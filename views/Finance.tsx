import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, FileText, Upload, DollarSign } from 'lucide-react';
import { Expense } from '../types';

export const FinanceView: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useData();
  const [showModal, setShowModal] = useState(false);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    date: '', description: '', amount: 0, category: '', invoiceFile: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense(newExpense);
    setShowModal(false);
    setNewExpense({ date: '', description: '', amount: 0, category: '', invoiceFile: '' });
  };

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Finans & Gider Yönetimi</h2>
          <p className="text-slate-500">Şirket harcamaları ve fatura takibi.</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm flex items-center">
                <span className="text-slate-500 text-sm mr-2">Toplam Gider:</span>
                <span className="text-xl font-bold text-red-600">{totalAmount.toLocaleString('tr-TR')} ₺</span>
             </div>
             <button 
              onClick={() => setShowModal(true)}
              className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
            >
              <Plus size={18} />
              <span>Gider Ekle</span>
            </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-xs">
            <tr>
              <th className="px-6 py-4">Tarih</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Açıklama</th>
              <th className="px-6 py-4">Fatura</th>
              <th className="px-6 py-4 text-right">Tutar</th>
              <th className="px-6 py-4 text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.length === 0 ? (
               <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Harcama kaydı bulunamadı.</td>
               </tr>
            ) : expenses.map(expense => (
              <tr key={expense.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-700 font-medium">{expense.date}</td>
                <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-bold uppercase">{expense.category}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{expense.description}</td>
                <td className="px-6 py-4">
                    {expense.invoiceFile ? (
                        <div className="flex items-center text-primary text-xs font-bold cursor-pointer hover:underline">
                            <FileText size={14} className="mr-1"/> {expense.invoiceFile}
                        </div>
                    ) : <span className="text-slate-300">-</span>}
                </td>
                <td className="px-6 py-4 text-right font-mono text-red-600 font-bold">
                    -{expense.amount.toLocaleString('tr-TR')} ₺
                </td>
                <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteExpense(expense.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Yeni Gider Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
                <input required type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                <select value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none">
                    <option value="">Seçiniz...</option>
                    <option value="Ofis">Ofis Giderleri</option>
                    <option value="Yazılım">Yazılım/Lisans</option>
                    <option value="Pazarlama">Pazarlama/Reklam</option>
                    <option value="Seyahat">Seyahat/Konaklama</option>
                    <option value="Personel">Personel/Maaş</option>
                    <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tutar (TL)</label>
                <input required type="number" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                <input required type="text" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-Fatura / Fiş</label>
                <div className="border border-dashed border-slate-300 rounded p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                   <input type="file" className="hidden" id="invoice-upload" onChange={e => setNewExpense({...newExpense, invoiceFile: e.target.files?.[0]?.name || ''})} />
                   <label htmlFor="invoice-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <span className="text-sm text-slate-600">{newExpense.invoiceFile ? newExpense.invoiceFile : 'Dosyayı buraya sürükleyin veya tıklayın'}</span>
                   </label>
                </div>
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