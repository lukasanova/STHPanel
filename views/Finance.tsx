import React, { useState, useRef } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, FileText, Upload, Eye, Download, X } from 'lucide-react';
import { Expense } from '../types';

export const FinanceView: React.FC = () => {
  const { expenses, addExpense, deleteExpense } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'> & { file?: File }>({
    date: '', 
    description: '', 
    amount: 0, 
    category: '', 
    invoiceFile: '',
    file: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Dosya varsa onu da ekleyerek gönder
    const expenseData = {
      ...newExpense,
      file: selectedFile || undefined
    };
    
    await addExpense(expenseData);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewExpense({ 
      date: '', 
      description: '', 
      amount: 0, 
      category: '', 
      invoiceFile: '',
      file: undefined
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewExpense(prev => ({ ...prev, invoiceFile: file.name }));
    }
  };

  const handlePreview = (invoiceUrl: string) => {
    setSelectedInvoice(invoiceUrl);
    setShowPreview(true);
  };

  const totalAmount = expenses.reduce((sum, item) => sum + item.amount, 0);

  // Aylık gider hesapla
  const monthlyExpenses = expenses.reduce((acc, expense) => {
    if (expense.date) {
      const monthYear = expense.date.substring(0, 7); // YYYY-MM
      acc[monthYear] = (acc[monthYear] || 0) + expense.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  // Son 6 ayın giderlerini al
  const last6Months = Object.entries(monthlyExpenses)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 6);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Finans & Gider Yönetimi</h2>
          <p className="text-slate-500">Şirket harcamaları ve fatura takibi.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 px-4 py-3 rounded-lg shadow-sm">
            <span className="text-slate-500 text-sm mr-2">Toplam Gider:</span>
            <span className="text-2xl font-bold text-red-600">{totalAmount.toLocaleString('tr-TR')} ₺</span>
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

      {/* Aylık Özet Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {last6Months.map(([month, amount]) => {
          const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
          const [year, monthNum] = month.split('-');
          const monthName = monthNames[parseInt(monthNum) - 1];
          
          return (
            <div key={month} className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-sm text-slate-500 mb-1">{monthName} {year}</div>
              <div className="text-lg font-bold text-red-600">{amount.toLocaleString('tr-TR')} ₺</div>
            </div>
          );
        })}
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
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  Henüz harcama kaydı bulunmamaktadır.
                </td>
              </tr>
            ) : expenses.map(expense => (
              <tr key={expense.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-700 font-medium">
                  {new Date(expense.date).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{expense.description}</td>
                <td className="px-6 py-4">
                  {(expense as any).invoice_url || expense.invoiceFile ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePreview((expense as any).invoice_url || '')}
                        className="flex items-center text-primary hover:text-primary-dark text-xs font-bold"
                      >
                        <Eye size={14} className="mr-1"/>
                        Görüntüle
                      </button>
                      <span className="text-slate-400">•</span>
                      <a
                        href={(expense as any).invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-green-600 hover:text-green-700 text-xs font-bold"
                      >
                        <Download size={14} className="mr-1"/>
                        İndir
                      </a>
                    </div>
                  ) : <span className="text-slate-300">-</span>}
                </td>
                <td className="px-6 py-4 text-right font-mono text-red-600 font-bold">
                  -{expense.amount.toLocaleString('tr-TR')} ₺
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => {
                      if (window.confirm('Bu gider kaydını silmek istediğinize emin misiniz?')) {
                        deleteExpense(expense.id);
                      }
                    }} 
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Gider Ekleme Modal'ı */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Yeni Gider Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarih *</label>
                <input 
                  required 
                  type="date" 
                  value={newExpense.date} 
                  onChange={e => setNewExpense({...newExpense, date: e.target.value})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kategori *</label>
                <select 
                  required
                  value={newExpense.category} 
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">Seçiniz...</option>
                  <option value="Ofis">Ofis Giderleri</option>
                  <option value="Yazılım">Yazılım/Lisans</option>
                  <option value="Pazarlama">Pazarlama/Reklam</option>
                  <option value="Seyahat">Seyahat/Konaklama</option>
                  <option value="Personel">Personel/Maaş</option>
                  <option value="Vergi">Vergi/Giderler</option>
                  <option value="Kira">Kira/Aidat</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tutar (TL) *</label>
                <input 
                  required 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={newExpense.amount} 
                  onChange={e => setNewExpense({...newExpense, amount: parseFloat(e.target.value) || 0})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama *</label>
                <input 
                  required 
                  type="text" 
                  value={newExpense.description} 
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Harcama açıklaması..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fatura / Fiş (Opsiyonel)</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                     onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    id="invoice-upload" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                  <div className="flex flex-col items-center">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600">
                      {selectedFile ? selectedFile.name : 'Dosyayı sürükleyin veya tıklayın'}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (Max: 10MB)</p>
                  </div>
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-sm text-green-700 flex items-center">
                      <FileText size={14} className="mr-1" />
                      {selectedFile.name}
                    </span>
                    <button 
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setNewExpense(prev => ({ ...prev, invoiceFile: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }} 
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

      {/* Fatura Önizleme Modal'ı */}
      {showPreview && selectedInvoice && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-bold">Fatura Önizleme</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {selectedInvoice.match(/\.(pdf)$/i) ? (
                <div className="h-[70vh]">
                  <iframe 
                    src={selectedInvoice} 
                    className="w-full h-full border rounded"
                    title="Fatura Önizleme"
                  />
                </div>
              ) : selectedInvoice.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <div className="flex justify-center">
                  <img 
                    src={selectedInvoice} 
                    alt="Fatura" 
                    className="max-w-full max-h-[70vh] rounded"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">Bu dosya formatı önizlenemiyor</p>
                  <a 
                    href={selectedInvoice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-slate-800 inline-flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    Dosyayı İndir
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-between">
              <a 
                href={selectedInvoice}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <Download size={16} className="mr-2" />
                Faturayı İndir
              </a>
              <button 
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};