import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, FileText, Download, Briefcase, FileCheck, Image, MessageSquare, Upload, Eye, X } from 'lucide-react';
import { DocCategory, LibraryItem } from '../types';

export const LibraryView: React.FC = () => {
  const { library, addLibraryItem, deleteLibraryItem } = useData();
  const [activeTab, setActiveTab] = useState<DocCategory>('sablon');
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [newItem, setNewItem] = useState<Omit<LibraryItem, 'id' | 'dateAdded'>>({
    title: '', category: 'sablon', description: '', fileName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLibraryItem(newItem);
    setShowModal(false);
    setNewItem({ title: '', category: activeTab, description: '', fileName: '' });
  };

  const openModal = () => {
      setNewItem({...newItem, category: activeTab});
      setShowModal(true);
  }

  const handleDownload = (fileName: string) => {
    // Simulation: Create a dummy file to download
    const element = document.createElement("a");
    const file = new Blob([`Bu dosya (${fileName}) simülasyon amaçlı oluşturulmuştur. Gerçek bir backend olmadığı için orijinal dosya içeriği sunucuda tutulmamaktadır.`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const filteredItems = library.filter(l => l.category === activeTab);

  const categories: {id: DocCategory, label: string, icon: any}[] = [
      { id: 'sablon', label: 'Mesaj Şablonları', icon: MessageSquare },
      { id: 'hukuk', label: 'Hukuki Belgeler', icon: FileCheck },
      { id: 'rapor', label: 'Rapor Örnekleri', icon: FileText },
      { id: 'marka', label: 'Marka Kimliği', icon: Image },
  ];

  const isPdf = (name?: string) => name?.toLowerCase().endsWith('.pdf');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Doküman & Şablon Kütüphanesi</h2>
          <p className="text-slate-500">Kurumsal hafıza ve hazır içerikler.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${activeTab === cat.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
              >
                  <cat.icon size={18} />
                  <span>{cat.label}</span>
              </button>
          ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[400px]">
          <div className="p-4 border-b border-slate-100 flex justify-end bg-slate-50">
              <button 
                  onClick={openModal}
                  className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-sm text-sm"
              >
                  <Plus size={16} />
                  <span>Doküman Ekle</span>
              </button>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-400">Bu kategoride dosya bulunmuyor.</div>
              ) : filteredItems.map(item => (
                  <div key={item.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all group relative bg-white flex flex-col">
                      <button onClick={() => deleteLibraryItem(item.id)} className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                          <Trash2 size={16} />
                      </button>

                      {/* File Preview Area */}
                      {isPdf(item.fileName) ? (
                        <div 
                          onClick={() => item.fileName && setPreviewFile(item.fileName)}
                          className="w-full h-32 bg-red-50 rounded-lg mb-4 flex flex-col items-center justify-center border border-red-100 text-red-500 group-hover:bg-red-100 transition-colors cursor-pointer"
                        >
                            <FileText size={48} />
                            <span className="text-xs mt-2 font-bold uppercase">PDF Belgesi</span>
                        </div>
                      ) : (
                        <div 
                          onClick={() => item.fileName && setPreviewFile(item.fileName)}
                          className="w-full h-32 bg-slate-50 rounded-lg mb-4 flex flex-col items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                             <FileText size={48} />
                             <span className="text-xs mt-2 font-bold uppercase">Doküman</span>
                        </div>
                      )}

                      <div className="flex items-center mb-2">
                          <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                      </div>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10 flex-1">{item.description}</p>
                      
                      <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
                          <span className="text-xs text-slate-400">{new Date(item.dateAdded).toLocaleDateString('tr-TR')}</span>
                          {item.fileName && (
                             <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleDownload(item.fileName!)}
                                    className="text-xs font-bold text-slate-600 flex items-center hover:text-green-600 bg-slate-100 px-2 py-1 rounded transition-colors"
                                    title="İndir"
                                  >
                                     <Download size={12} className="mr-1"/> İndir
                                  </button>
                                  <button 
                                    onClick={() => setPreviewFile(item.fileName!)}
                                    className="text-xs font-bold text-slate-600 flex items-center hover:text-blue-600 bg-slate-100 px-2 py-1 rounded transition-colors"
                                    title="Önizle"
                                  >
                                     <Eye size={12} className="mr-1"/> Önizle
                                  </button>
                             </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Kütüphaneye Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                <input required type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-primary outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dosya Yükle</label>
                <div className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                    <input type="file" className="hidden" id="lib-upload" onChange={e => setNewItem({...newItem, fileName: e.target.files?.[0]?.name || ''})} />
                    <label htmlFor="lib-upload" className="cursor-pointer flex flex-col items-center">
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <span className="text-sm text-slate-600">{newItem.fileName ? newItem.fileName : 'Dosyayı buraya sürükleyin veya tıklayın'}</span>
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
                   <FileText size={20} className="text-blue-400" />
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
                    {isPdf(previewFile) ? <FileText size={64} className="mb-4 text-red-200" /> : <FileText size={64} className="mb-4 text-slate-200" />}
                    <h3 className="text-2xl font-bold text-slate-400 mb-2">Belge Önizleme</h3>
                    <p className="text-center max-w-md text-slate-400">"{previewFile}" dosyasının içeriği burada görüntülenir.</p>
                    <div className="mt-8 w-full space-y-4 opacity-30">
                        <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-300 rounded w-full"></div>
                        <div className="h-4 bg-slate-300 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-300 rounded w-full"></div>
                        <div className="h-32 bg-slate-100 rounded w-full border border-slate-300 mt-4"></div>
                    </div>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};