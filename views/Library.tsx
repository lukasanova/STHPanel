import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, FileText, Download, FileCheck, Image, MessageSquare, Upload, Eye, X, MoreVertical } from 'lucide-react';
import { DocCategory, LibraryItem } from '../types';

export const LibraryView: React.FC = () => {
  const { library, addLibraryItem, deleteLibraryItem } = useData();
  const [activeTab, setActiveTab] = useState<DocCategory>('sablon');
  const [showModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<{name: string, url?: string} | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  const [newItem, setNewItem] = useState<{
    title: string;
    category: DocCategory;
    description?: string;
    file?: File;
    fileName?: string;
  }>({
    title: '', 
    category: 'sablon', 
    description: '', 
    file: undefined,
    fileName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("🎯 Kaydet tuşuna basıldı!");
    console.log("📦 Gönderilen veri:", newItem);
    
    if (!newItem.title.trim()) {
      alert("Lütfen başlık girin!");
      return;
    }
    
    try {
      // Dosya objesini ve adını hazırla
      const itemToAdd = {
        title: newItem.title.trim(),
        category: newItem.category,
        description: newItem.description || "",
        fileName: newItem.fileName || "",
        file: newItem.file, // Dosya objesini gönder
      };
      
      console.log("🚀 Ekleniyor:", itemToAdd);
      
      // Fonksiyonu çağır (DataProvider'daki yeni addLibraryItem)
      const result = await addLibraryItem(itemToAdd);
      
      console.log("✅ Başarıyla eklendi!", result);
      
      // Modal'ı kapat
      setShowModal(false);
      
      // Formu temizle
      setNewItem({ 
        title: '', 
        category: activeTab, 
        description: '', 
        file: undefined,
        fileName: '' 
      });
      
      // Dosya input'unu temizle
      const fileInput = document.getElementById('lib-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Başarı mesajı
      alert("Doküman başarıyla eklendi!");
      
    } catch (error: any) {
      console.error("❌ HATA:", error);
      
      // Daha kullanıcı dostu hata mesajı
      if (error.message?.includes('storage')) {
        alert("Dosya yüklenirken bir hata oluştu. Lütfen dosya boyutunu kontrol edin (max 50MB) veya başka bir dosya seçin.");
      } else if (error.message?.includes('duplicate')) {
        alert("Bu başlıkta bir doküman zaten var. Lütfen farklı bir başlık kullanın.");
      } else {
        alert(`Bir hata oluştu: ${error.message || "Lütfen tekrar deneyin."}`);
      }
    }
  };

  const openModal = () => {
    setNewItem(prev => ({...prev, category: activeTab}));
    setShowModal(true);
  };

  // GERÇEK DOSYA İNDİRME
  const handleDownload = (fileName: string, fileUrl?: string) => {
    if (fileUrl) {
      // Gerçek dosyayı yeni sekmede aç
      window.open(fileUrl, '_blank');
    } else {
      // Eski yöntem (simülasyon)
      const element = document.createElement("a");
      const file = new Blob([`Bu dosya (${fileName}) simülasyon amaçlı oluşturulmuştur. Gerçek bir backend olmadığı için orijinal dosya içeriği sunucuda tutulmamaktadır.`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = fileName;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  // GERÇEK DOSYA ÖNİZLEME
  const handlePreview = (fileName?: string, fileUrl?: string) => {
    if (fileUrl) {
      // Gerçek dosyayı yeni sekmede aç
      window.open(fileUrl, '_blank');
    } else if (fileName) {
      // Eski önizleme modal'ını aç
      setPreviewFile({ name: fileName });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        alert("Dosya boyutu 50MB'den küçük olmalıdır!");
        e.target.value = '';
        return;
      }
      
      setNewItem(prev => ({
        ...prev, 
        file, 
        fileName: file.name
      }));
    }
  };

  const filteredItems = library.filter(l => l.category === activeTab);

  const categories: {id: DocCategory, label: string, icon: any}[] = [
    { id: 'sablon', label: 'Mesaj Şablonları', icon: MessageSquare },
    { id: 'hukuk', label: 'Hukuki Belgeler', icon: FileCheck },
    { id: 'rapor', label: 'Rapor Örnekleri', icon: FileText },
    { id: 'marka', label: 'Marka Kimliği', icon: Image },
  ];

  const isPdf = (name?: string) => name?.toLowerCase().endsWith('.pdf');
  const isImage = (name?: string) => {
    if (!name) return false;
    const ext = name.toLowerCase().split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirmDelete === id) {
      // Silme işlemini gerçekleştir
      await deleteLibraryItem(id);
      setConfirmDelete(null);
    } else {
      // Onay için butonu değiştir
      setConfirmDelete(id);
      
      // 5 saniye sonra onay durumunu sıfırla
      setTimeout(() => {
        setConfirmDelete(null);
      }, 5000);
    }
  };

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
            <div className="col-span-full text-center py-12 text-slate-400">
              Bu kategoride dosya bulunmuyor.
            </div>
          ) : filteredItems.map(item => {
            const hasRealFile = !!item.fileUrl;
            const isImageFile = isImage(item.fileName);
            
            return (
              <div key={item.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all group relative bg-white flex flex-col">
                {/* File Preview Area */}
                <div 
                  onClick={() => handlePreview(item.fileName, item.fileUrl)}
                  className={`w-full h-32 rounded-lg mb-4 flex flex-col items-center justify-center border cursor-pointer transition-colors relative
                    ${isPdf(item.fileName) ? 'bg-red-50 border-red-100 text-red-500 group-hover:bg-red-100' : 
                      isImageFile ? 'bg-blue-50 border-blue-100 text-blue-500 group-hover:bg-blue-100' :
                      'bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-slate-100'}`}
                >
                  {isImageFile && item.fileUrl ? (
                    <>
                      <img 
                        src={item.fileUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {/* Silme butonu resim üzerinde */}
                      <div className="absolute top-2 right-2">
                        {confirmDelete === item.id ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id, item.title);
                            }}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 shadow-lg flex items-center gap-1 animate-pulse"
                          >
                            <Trash2 size={12} />
                            Onayla
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(item.id);
                            }}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Sil
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <FileText size={48} />
                      <span className="text-xs mt-2 font-bold uppercase">
                        {isPdf(item.fileName) ? 'PDF BELGESİ' : 
                         isImageFile ? 'RESİM' : 'DOKÜMAN'}
                      </span>
                      {hasRealFile && (
                        <span className="text-xs mt-1 text-green-600">✓ Gerçek Dosya</span>
                      )}
                      {/* Silme butonu dosya ikonu üzerinde */}
                      <div className="absolute top-2 right-2">
                        {confirmDelete === item.id ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id, item.title);
                            }}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 shadow-lg flex items-center gap-1 animate-pulse"
                          >
                            <Trash2 size={12} />
                            Onayla
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDelete(item.id);
                            }}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Sil
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                  {/* Sağ üst köşede alternatif silme butonu */}
                  <div className="lg:hidden">
                    {confirmDelete === item.id ? (
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="text-red-600 hover:text-red-800 text-sm font-bold"
                      >
                        Onayla?
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(item.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Sil"
                      >
                        <MoreVertical size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mb-4 line-clamp-2 h-10 flex-1">
                  {item.description || "Açıklama yok"}
                </p>
                
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
                  <span className="text-xs text-slate-400">
                    {item.dateAdded ? new Date(item.dateAdded).toLocaleDateString('tr-TR') : 'Tarih yok'}
                  </span>
                  
                  <div className="flex items-center gap-4">
                    {/* Alt kısımda silme butonu (mobil için) */}
                    <div className="hidden lg:block">
                      {confirmDelete === item.id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="text-red-600 hover:text-red-800 text-xs font-bold bg-red-50 px-2 py-1 rounded"
                          >
                            Onayla
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-slate-500 hover:text-slate-700 text-xs"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors text-xs flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Sil
                        </button>
                      )}
                    </div>
                    
                    {(item.fileName && item.fileName !== "dosya-yok.txt") && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDownload(item.fileName!, item.fileUrl)}
                          className="text-xs font-bold text-slate-600 flex items-center hover:text-green-600 bg-slate-100 px-2 py-1 rounded transition-colors"
                          title="İndir"
                        >
                          <Download size={12} className="mr-1"/> İndir
                        </button>
                        <button 
                          onClick={() => handlePreview(item.fileName, item.fileUrl)}
                          className="text-xs font-bold text-slate-600 flex items-center hover:text-blue-600 bg-slate-100 px-2 py-1 rounded transition-colors"
                          title={item.fileUrl ? "Dosyayı Aç" : "Önizle"}
                        >
                          <Eye size={12} className="mr-1"/> {item.fileUrl ? "Aç" : "Önizle"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Onay modalı */}
                {confirmDelete === item.id && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 p-4">
                    <div className="bg-white border border-red-200 rounded-lg p-4 shadow-lg text-center">
                      <Trash2 size={24} className="mx-auto mb-2 text-red-500" />
                      <p className="text-sm font-bold text-slate-700 mb-1">"{item.title}" silinsin mi?</p>
                      <p className="text-xs text-slate-500 mb-3">Bu işlem geri alınamaz.</p>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-600"
                        >
                          Evet, Sil
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-slate-300"
                        >
                          İptal
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Document Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Kütüphaneye Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Başlık *</label>
                <input 
                  required 
                  type="text" 
                  value={newItem.title} 
                  onChange={e => setNewItem({...newItem, title: e.target.value})} 
                  className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Doküman başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                <textarea 
                  value={newItem.description} 
                  onChange={e => setNewItem({...newItem, description: e.target.value})} 
                  className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Doküman açıklaması (isteğe bağlı)"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dosya Yükle (isteğe bağlı)</label>
                <div className="border border-dashed border-slate-300 rounded p-4 text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="lib-upload" 
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.zip"
                  />
                  <label htmlFor="lib-upload" className="cursor-pointer flex flex-col items-center">
                    <Upload size={24} className="text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600">
                      {newItem.fileName ? newItem.fileName : 'Dosyayı buraya sürükleyin veya tıklayın'}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      PDF, DOC, Excel, JPG, PNG (max 50MB)
                    </span>
                    {newItem.file && (
                      <span className="text-xs text-green-600 mt-1">
                        ✓ {(newItem.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowModal(false);
                    const fileInput = document.getElementById('lib-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                  }} 
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded hover:bg-slate-200"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-slate-800 disabled:opacity-50"
                  disabled={!newItem.title.trim()}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Eski Önizleme Modal (sadece dosya adı varsa) */}
      {previewFile && !previewFile.url && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-fade-in">
            <div className="bg-slate-900 p-4 flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center text-white space-x-2">
                <FileText size={20} className="text-blue-400" />
                <span className="font-medium truncate max-w-xs">{previewFile.name}</span>
                <span className="text-slate-500 text-xs px-2 py-0.5 border border-slate-600 rounded">
                  Önizleme Modu
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPreviewFile(null)} 
                  className="text-slate-400 hover:text-white transition-colors bg-white/10 p-2 rounded hover:bg-white/20"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Simulated PDF Viewer */}
            <div className="flex-1 bg-slate-200 overflow-y-auto p-8 flex justify-center">
              <div className="bg-white shadow-lg w-full max-w-2xl min-h-full p-12 text-slate-300 flex flex-col items-center justify-center">
                {isPdf(previewFile.name) ? (
                  <FileText size={64} className="mb-4 text-red-200" />
                ) : (
                  <FileText size={64} className="mb-4 text-slate-200" />
                )}
                <h3 className="text-2xl font-bold text-slate-400 mb-2">Belge Önizleme</h3>
                <p className="text-center max-w-md text-slate-400">
                  "{previewFile.name}" dosyasının içeriği burada görüntülenir.
                  <br />
                  <span className="text-sm">(Gerçek dosya yükleme aktif değil)</span>
                </p>
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