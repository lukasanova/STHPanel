import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, FileText, CheckCircle, Clock, XCircle, Upload, Eye, X, Download } from 'lucide-react';
import { Contract } from '../types';

export const ContractsView: React.FC = () => {
  const { contracts, addContract, deleteContract } = useData();
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [newContract, setNewContract] = useState<Omit<Contract, 'id'>>({
    companyName: '', contractType: '', startDate: '', endDate: '', status: 'aktif', contractFile: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContract(newContract);
    setShowModal(false);
    setNewContract({ companyName: '', contractType: '', startDate: '', endDate: '', status: 'aktif', contractFile: '' });
  };

  const handleDownload = (fileName: string) => {
    // Simulation: Create a dummy file to download since we don't have a backend
    const element = document.createElement("a");
    const file = new Blob([`Bu dosya (${fileName}) simülasyon amaçlı oluşturulmuştur. Gerçek bir backend olmadığı için orijinal dosya içeriği sunucuda tutulmamaktadır.`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getStatusBadge = (status: Contract['status']) => {
      switch(status) {
          case 'aktif': return <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold uppercase border border-green-200"><CheckCircle size={12} className="mr-1"/> Aktif</span>;
          case 'yenilenecek': return <span className="flex items-center text-orange-600 bg-orange-50 px-2 py-1 rounded text-xs font-bold uppercase border border-orange-200"><Clock size={12} className="mr-1"/> Yenilenecek</span>;
          case 'bitti': return <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold uppercase border border-red-200"><XCircle size={12} className="mr-1"/> Bitti</span>;
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sözleşmeler</h2>
          <p className="text-slate-500">Kurumlarla yapılan anlaşmaların takibi.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        >
          <Plus size={18} />
          <span>Sözleşme Ekle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {contracts.map(contract => (
            <div key={contract.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all relative">
                 <button onClick={() => deleteContract(contract.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500">
                      <Trash2 size={16} />
                 </button>
                 <div className="flex items-center mb-4">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-lg mr-4">
                         <FileText size={24} />
                     </div>
                     <div>
                         <h3 className="font-bold text-lg text-slate-800">{contract.companyName}</h3>
                         <p className="text-sm text-slate-500">{contract.contractType}</p>
                     </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                     <div className="bg-slate-50 p-2 rounded">
                         <div className="text-xs text-slate-400 mb-1">Başlangıç</div>
                         <div className="font-semibold text-slate-700">{contract.startDate}</div>
                     </div>
                     <div className="bg-slate-50 p-2 rounded">
                         <div className="text-xs text-slate-400 mb-1">Bitiş</div>
                         <div className="font-semibold text-slate-700">{contract.endDate}</div>
                     </div>
                 </div>

                 {contract.contractFile && (
                     <div className="mb-4 flex items-center justify-between bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-600">
                         <div className="flex items-center truncate mr-2">
                            <FileText size={14} className="mr-2 text-red-500 flex-shrink-0"/>
                            <span className="truncate font-medium">{contract.contractFile}</span>
                         </div>
                         <div className="flex items-center gap-2 flex-shrink-0">
                             <button 
                               onClick={() => handleDownload(contract.contractFile!)} 
                               className="text-slate-500 hover:text-green-600 flex items-center font-bold bg-white border border-slate-200 px-2 py-1 rounded shadow-sm transition-colors"
                               title="İndir"
                             >
                                <Download size={12} className="mr-1"/> İndir
                             </button>
                             <button 
                               onClick={() => setPreviewFile(contract.contractFile!)} 
                               className="text-slate-500 hover:text-blue-600 flex items-center font-bold bg-white border border-slate-200 px-2 py-1 rounded shadow-sm transition-colors"
                               title="Önizle"
                             >
                                <Eye size={12} className="mr-1"/> Önizle
                             </button>
                         </div>
                     </div>
                 )}

                 <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                     <span className="text-xs text-slate-400">Durum:</span>
                     {getStatusBadge(contract.status)}
                 </div>
            </div>
        ))}
         {contracts.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                 <p className="text-slate-400">Kayıtlı sözleşme bulunmamaktadır.</p>
            </div>
         )}
      </div>

      {/* Add Contract Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Yeni Sözleşme Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kurum Adı</label>
                <input required type="text" value={newContract.companyName} onChange={e => setNewContract({...newContract, companyName: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sözleşme Türü/Hizmet</label>
                <input required type="text" value={newContract.contractType} onChange={e => setNewContract({...newContract, contractType: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" placeholder="Örn: Yıllık Danışmanlık" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Başlangıç</label>
                    <input required type="date" value={newContract.startDate} onChange={e => setNewContract({...newContract, startDate: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bitiş</label>
                    <input required type="date" value={newContract.endDate} onChange={e => setNewContract({...newContract, endDate: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
                  </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                <select value={newContract.status} onChange={e => setNewContract({...newContract, status: e.target.value as any})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none">
                    <option value="aktif">Aktif</option>
                    <option value="yenilenecek">Yenilenecek</option>
                    <option value="bitti">Bitti</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Sözleşme Dosyası (PDF)</label>
                <div className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                   <input type="file" accept=".pdf" className="hidden" id="contract-upload" onChange={e => setNewContract({...newContract, contractFile: e.target.files?.[0]?.name || ''})} />
                   <label htmlFor="contract-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <span className="text-sm text-slate-600">{newContract.contractFile ? newContract.contractFile : 'PDF dosyasını buraya sürükleyin veya tıklayın'}</span>
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

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-fade-in">
             <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
                <div className="flex items-center text-white space-x-2">
                   <FileText size={20} className="text-red-400" />
                   <span className="font-medium truncate max-w-xs">{previewFile}</span>
                   <span className="text-slate-500 text-xs px-2 py-0.5 border border-slate-600 rounded">Önizleme Modu</span>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleDownload(previewFile!)}
                        className="text-white hover:text-green-400 transition-colors bg-white/10 p-2 rounded hover:bg-white/20"
                        title="İndir"
                    >
                        <Download size={20} />
                    </button>
                    <button onClick={() => setPreviewFile(null)} className="text-slate-400 hover:text-white transition-colors bg-white/10 p-2 rounded hover:bg-white/20">
                       <X size={20} />
                    </button>
                </div>
             </div>
             
             {/* Simulated PDF Viewer */}
             <div className="flex-1 bg-slate-200 overflow-y-auto p-8 flex justify-center">
                 <div className="bg-white shadow-lg w-full max-w-2xl min-h-full p-12 text-slate-300 flex flex-col items-center justify-center">
                    <FileText size={64} className="mb-4 text-slate-200" />
                    <h3 className="text-2xl font-bold text-slate-300 mb-2">Belge Önizleme</h3>
                    <p className="text-center max-w-md">"{previewFile}" dosyasının içeriği burada görüntülenir.</p>
                    <div className="mt-8 w-full space-y-4 opacity-30">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-200 rounded w-full"></div>
                        <div className="h-32 bg-slate-100 rounded w-full border border-slate-200 mt-4"></div>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};