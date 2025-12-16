import React, { useState, useRef } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, FileText, CheckCircle, Clock, XCircle, Upload, Eye, X, Download, Calendar, Building } from 'lucide-react';
import { Contract } from '../types';

export const ContractsView: React.FC = () => {
  const { contracts, addContract, deleteContract } = useData();
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [previewFile, setPreviewFile] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newContract, setNewContract] = useState<Omit<Contract, 'id'> & { file?: File }>({
    companyName: '', 
    contractType: '', 
    startDate: '', 
    endDate: '', 
    status: 'aktif', 
    contractFile: '',
    file: undefined
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📝 Sözleşme kaydediliyor...");
    
    setIsSubmitting(true);
    
    try {
      // Log the data being sent
      console.log("📤 Gönderilecek veri:", {
        companyName: newContract.companyName,
        contractType: newContract.contractType,
        startDate: newContract.startDate,
        endDate: newContract.endDate,
        status: newContract.status,
        contractFile: newContract.contractFile,
        file: selectedFile ? selectedFile.name : 'No file'
      });

      const contractData = {
        ...newContract,
        file: selectedFile || undefined
      };
      
      await addContract(contractData);
      console.log("✅ Sözleşme başarıyla eklendi!");
      
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("❌ Sözleşme ekleme hatası:", error);
      alert("Sözleşme eklenirken bir hata oluştu. Lütfen konsolu kontrol edin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewContract({ 
      companyName: '', 
      contractType: '', 
      startDate: '', 
      endDate: '', 
      status: 'aktif', 
      contractFile: '',
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
      console.log("📁 Dosya seçildi:", file.name, file.size, file.type);
      setSelectedFile(file);
      setNewContract(prev => ({ ...prev, contractFile: file.name }));
    }
  };

  const handlePreview = (contract: Contract) => {
    setSelectedContract(contract);
    setPreviewFile((contract as any).contract_url || '');
    setShowPreview(true);
  };

  const getStatusBadge = (status: Contract['status']) => {
    switch(status) {
      case 'aktif': 
        return <span className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
          <CheckCircle size={12} className="mr-1"/> Aktif
        </span>;
      case 'yenilenecek': 
        return <span className="flex items-center text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
          <Clock size={12} className="mr-1"/> Yenilenecek
        </span>;
      case 'bitti': 
        return <span className="flex items-center text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
          <XCircle size={12} className="mr-1"/> Bitti
        </span>;
      default:
        return <span className="flex items-center text-slate-600 bg-slate-50 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
          {status}
        </span>;
    }
  };

  const getRemainingDays = (endDate: string) => {
    try {
      const end = new Date(endDate);
      const today = new Date();
      const diffTime = end.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      console.error("Tarih hesaplama hatası:", error);
      return 0;
    }
  };

  // Debug için: mevcut contracts'ı logla
  console.log("📊 Mevcut sözleşmeler:", contracts);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sözleşmeler</h2>
          <p className="text-slate-500">Kurumlarla yapılan anlaşmaların takibi.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm">
            <div className="text-xs text-slate-500 mb-1">Toplam Sözleşme</div>
            <div className="text-lg font-bold text-primary">{contracts.length}</div>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
            disabled={isSubmitting}
          >
            <Plus size={18} />
            <span>{isSubmitting ? 'Ekleniyor...' : 'Sözleşme Ekle'}</span>
          </button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500 mb-1">Aktif Sözleşmeler</div>
              <div className="text-2xl font-bold text-green-600">
                {contracts.filter(c => c.status === 'aktif').length}
              </div>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500 mb-1">Yenilenecek</div>
              <div className="text-2xl font-bold text-orange-600">
                {contracts.filter(c => c.status === 'yenilenecek').length}
              </div>
            </div>
            <Clock className="text-orange-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500 mb-1">Biten Sözleşmeler</div>
              <div className="text-2xl font-bold text-red-600">
                {contracts.filter(c => c.status === 'bitti').length}
              </div>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map(contract => {
          const remainingDays = getRemainingDays(contract.endDate);
          const isExpiringSoon = remainingDays <= 30 && remainingDays > 0;
          const isExpired = remainingDays <= 0;
          
          return (
            <div key={contract.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all relative">
              <button 
                onClick={() => {
                  if (window.confirm('Bu sözleşmeyi silmek istediğinize emin misiniz?')) {
                    deleteContract(contract.id);
                  }
                }} 
                className="absolute top-4 right-4 text-slate-300 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="flex items-start mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
                  <Building size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{contract.companyName}</h3>
                  <p className="text-sm text-slate-500">{contract.contractType}</p>
                </div>
              </div>
              
              {/* Kalan Gün Gösterimi */}
              {(isExpiringSoon || isExpired) && (
                <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${isExpired ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-orange-50 text-orange-700 border border-orange-200'}`}>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2" />
                    {isExpired 
                      ? `Sözleşme ${Math.abs(remainingDays)} gün önce sona erdi`
                      : `Sözleşme ${remainingDays} gün sonra sona erecek`
                    }
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center text-xs text-slate-400 mb-1">
                    <Calendar size={12} className="mr-1" /> Başlangıç
                  </div>
                  <div className="font-semibold text-slate-700">
                    {new Date(contract.startDate).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="flex items-center text-xs text-slate-400 mb-1">
                    <Calendar size={12} className="mr-1" /> Bitiş
                  </div>
                  <div className="font-semibold text-slate-700">
                    {new Date(contract.endDate).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {(contract as any).contract_url || contract.contractFile ? (
                <div className="mb-4 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center truncate mr-2">
                    <FileText size={16} className="mr-2 text-red-500 flex-shrink-0"/>
                    <span className="truncate font-medium text-sm">
                      {contract.contractFile || 'Sözleşme Dosyası'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {(contract as any).contract_url && (
                      <>
                        <button 
                          onClick={() => handlePreview(contract)}
                          className="text-slate-600 hover:text-blue-600 flex items-center font-medium bg-white border border-slate-200 px-3 py-1 rounded text-xs transition-colors"
                          title="Önizle"
                        >
                          <Eye size={12} className="mr-1"/> Görüntüle
                        </button>
                        <a 
                          href={(contract as any).contract_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-600 hover:text-green-600 flex items-center font-medium bg-white border border-slate-200 px-3 py-1 rounded text-xs transition-colors"
                          title="İndir"
                        >
                          <Download size={12} className="mr-1"/> İndir
                        </a>
                      </>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-400">
                  {remainingDays > 0 ? `${remainingDays} gün kaldı` : 'Süresi doldu'}
                </div>
                {getStatusBadge(contract.status)}
              </div>
            </div>
          );
        })}
        
        {contracts.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
            <div className="mb-4">
              <FileText size={48} className="mx-auto text-slate-300" />
            </div>
            <p className="text-slate-400 mb-2">Kayıtlı sözleşme bulunmamaktadır.</p>
            <button 
              onClick={() => setShowModal(true)}
              className="text-primary hover:text-slate-800 font-medium"
            >
              İlk sözleşmeni eklemek için tıkla
            </button>
          </div>
        )}
      </div>

      {/* Sözleşme Ekleme Modal'ı */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Yeni Sözleşme Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kurum Adı *</label>
                <input 
                  required 
                  type="text" 
                  value={newContract.companyName} 
                  onChange={e => setNewContract({...newContract, companyName: e.target.value})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Kurum veya şirket adı"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sözleşme Türü/Hizmet *</label>
                <input 
                  required 
                  type="text" 
                  value={newContract.contractType} 
                  onChange={e => setNewContract({...newContract, contractType: e.target.value})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Örn: Yıllık Danışmanlık, Proje Anlaşması"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Başlangıç Tarihi *</label>
                  <input 
                    required 
                    type="date" 
                    value={newContract.startDate} 
                    onChange={e => setNewContract({...newContract, startDate: e.target.value})} 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bitiş Tarihi *</label>
                  <input 
                    required 
                    type="date" 
                    value={newContract.endDate} 
                    onChange={e => setNewContract({...newContract, endDate: e.target.value})} 
                    className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                <select 
                  value={newContract.status} 
                  onChange={e => setNewContract({...newContract, status: e.target.value as any})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                  disabled={isSubmitting}
                >
                  <option value="aktif">Aktif</option>
                  <option value="yenilenecek">Yenilenecek</option>
                  <option value="bitti">Bitti</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sözleşme Dosyası (Opsiyonel)</label>
                <div 
                  className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  style={{ opacity: isSubmitting ? 0.5 : 1 }}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    id="contract-upload" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-col items-center">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600">
                      {selectedFile ? selectedFile.name : 'Dosyayı sürükleyin veya tıklayın'}
                    </span>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOC, JPG, PNG (Max: 10MB)</p>
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
                        setNewContract(prev => ({ ...prev, contractFile: '' }));
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-red-500 hover:text-red-700"
                      disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-slate-800 flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Ekleniyor...
                    </>
                  ) : (
                    'Kaydet'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sözleşme Önizleme Modal'ı */}
      {showPreview && previewFile && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedContract?.companyName}</h3>
                <p className="text-sm text-slate-500">{selectedContract?.contractType}</p>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              {previewFile.match(/\.(pdf)$/i) ? (
                <div className="h-[70vh]">
                  <iframe 
                    src={previewFile} 
                    className="w-full h-full border rounded"
                    title="Sözleşme Önizleme"
                  />
                </div>
              ) : previewFile.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                <div className="flex justify-center">
                  <img 
                    src={previewFile} 
                    alt="Sözleşme" 
                    className="max-w-full max-h-[70vh] rounded"
                  />
                </div>
              ) : previewFile.match(/\.(doc|docx)$/i) ? (
                <div className="text-center py-12">
                  <FileText size={64} className="mx-auto text-blue-500 mb-4" />
                  <h4 className="text-lg font-bold text-slate-700 mb-2">Word Belgesi</h4>
                  <p className="text-slate-500 mb-6">Bu dosya formatı tarayıcıda önizlenemiyor.</p>
                  <a 
                    href={previewFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-slate-800 inline-flex items-center"
                  >
                    <Download size={16} className="mr-2" />
                    Dosyayı İndir
                  </a>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">Bu dosya formatı önizlenemiyor</p>
                  <a 
                    href={previewFile}
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
              <div className="flex items-center gap-4">
                {selectedContract && (
                  <>
                    <div className="text-sm">
                      <span className="text-slate-500">Başlangıç: </span>
                      <span className="font-medium">{new Date(selectedContract.startDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-slate-500">Bitiş: </span>
                      <span className="font-medium">{new Date(selectedContract.endDate).toLocaleDateString('tr-TR')}</span>
                    </div>
                    {getStatusBadge(selectedContract.status)}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-slate-100 rounded hover:bg-slate-200"
                >
                  Kapat
                </button>
                <a 
                  href={previewFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-slate-800 flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Sözleşmeyi İndir
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};