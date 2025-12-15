import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { AppContextType, AppData, LibraryItem, DocCategory } from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialData: AppData = {
  tasks: [],
  investors: [],
  achievements: [],
  services: [],
  packages: [],
  corporatePricing: [],
  contacts: [],
  notes: [],
  events: [],
  meetings: [],
  customers: [],
  expenses: [],
  contracts: [],
  partners: [],
  library: [],
  socialStats: [],
  socialHistory: [],
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);
  const [loading, setLoading] = useState(true);

  const generateId = () => crypto.randomUUID();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("📡 Veriler çekiliyor...");

      try {
        // LIBRARY VERİSİNİ ÇEK
        const { data: libraryData, error: libraryError } = await supabase
          .from("library")
          .select("*");

        if (libraryError) {
          console.error("❌ Library çekme hatası:", libraryError);
        } else {
          console.log("✅ Library verisi alındı:", libraryData?.length, "kayıt");
          setData(prev => ({ ...prev, library: libraryData || [] }));
        }

        // DİĞER VERİLER
        const { data: tasksData } = await supabase.from("tasks").select("*");
        const { data: partnersData } = await supabase.from("partners").select("*");
        const { data: customersData } = await supabase.from("customers").select("*");

        setData(prev => ({
          ...prev,
          tasks: tasksData || [],
          partners: partnersData || [],
          customers: customersData || [],
        }));

      } catch (error) {
        console.error("🔥 Genel hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 📚 KÜTÜPHANE EKLEME - GÜNCEL VERSİYON
  const addLibraryItem = async (item: Omit<LibraryItem, 'id' | 'dateAdded'> & { file?: File }) => {
    console.log("➕ addLibraryItem çağrıldı:", item);

    try {
      let fileUrl = "";
      let fileName = item.fileName || "";
      let uploadedFileName = "";

      // ✅ DOSYA VARSA STORAGE'A YÜKLE
      if (item.file) {
        console.log("📤 Dosya yükleniyor:", item.file.name);
        
        // Benzersiz dosya adı oluştur
        const fileExt = item.file.name.split('.').pop();
        uploadedFileName = `${generateId()}.${fileExt}`;
        
        // Supabase Storage'a yükle
        const { data: uploadData, error: uploadError } = await supabase
          .storage
          .from('library-files')
          .upload(uploadedFileName, item.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error("❌ Dosya yükleme hatası:", uploadError);
          alert("Dosya yüklenemedi: " + uploadError.message);
          return null;
        }

        // Public URL'yi al
        const { data: urlData } = supabase
          .storage
          .from('library-files')
          .getPublicUrl(uploadedFileName);

        fileUrl = urlData.publicUrl;
        fileName = item.file.name;
        
        console.log("✅ Dosya yüklendi, URL:", fileUrl);
      }

      // ✅ VERİTABANINA KAYDET - DOĞRU SÜTUN İSİMLERİYLE
      const newItem = {
        id: generateId(),
        title: item.title || "Başlıksız",
        category: item.category || 'sablon',
        description: item.description || "",
        fileName: fileName, // ⬅️ "fileName" (camelCase, SQL'de tırnak içinde)
        fileUrl: fileUrl || null, // ⬅️ "fileUrl" (camelCase, SQL'de tırnak içinde)
        dateAdded: new Date().toISOString(), // ⬅️ "dateAdded" (camelCase, SQL'de tırnak içinde)
      };

      console.log("🆕 Supabase'e gönderilecek:", newItem);

      const { data: inserted, error } = await supabase
        .from("library")
        .insert(newItem)
        .select("*")
        .single();

      if (error) {
        console.error("❌ Veritabanı hatası:", error);
        alert("Veritabanı hatası: " + error.message);
        return null;
      }

      console.log("✅ Veritabanına kaydedildi:", inserted);

      // State'i güncelle
      setData(prev => ({
        ...prev,
        library: [...prev.library, inserted as LibraryItem],
      }));

      console.log("🎉 State güncellendi!");
      return inserted as LibraryItem;
    } catch (error) {
      console.error("🔥 Beklenmeyen hata:", error);
      alert("Hata oluştu: " + error);
      return null;
    }
  };

  const deleteLibraryItem = async (id: string) => {
    try {
      // Önce dosya URL'sini bul
      const itemToDelete = data.library.find(item => item.id === id);
      
      if (itemToDelete?.fileUrl) {
        // Dosya adını URL'den çıkar
        const fileName = itemToDelete.fileUrl.split('/').pop();
        if (fileName) {
          // Storage'dan dosyayı sil
          const { error: storageError } = await supabase
            .storage
            .from('library-files')
            .remove([fileName]);
            
          if (storageError) {
            console.error("❌ Storage silme hatası:", storageError);
          } else {
            console.log("✅ Storage'dan dosya silindi:", fileName);
          }
        }
      }

      // Veritabanından sil
      const { error } = await supabase
        .from("library")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Veritabanı silme hatası:", error);
        alert("Silme hatası: " + error.message);
      } else {
        // State'i güncelle
        setData(prev => ({
          ...prev,
          library: prev.library.filter(item => item.id !== id),
        }));
        console.log("✅ Öğe silindi:", id);
      }
    } catch (error) {
      console.error("🔥 Silme hatası:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Yükleniyor...</div>;
  }

  // Context değeri
  const contextValue: AppContextType = {
    ...data,
    
    // 📚 LIBRARY FONKSİYONLARI
    addLibraryItem,
    deleteLibraryItem,

    // Diğer fonksiyonlar (şimdilik boş)
    addTask: () => {},
    updateTask: () => {},
    deleteTask: () => {},
    addInvestor: () => {},
    deleteInvestor: () => {},
    addAchievement: () => {},
    deleteAchievement: () => {},
    addService: () => {},
    deleteService: () => {},
    addPackage: () => {},
    deletePackage: () => {},
    updateCorporatePricing: () => {},
    addContact: () => {},
    deleteContact: () => {},
    addNote: () => {},
    deleteNote: () => {},
    addEvent: () => {},
    deleteEvent: () => {},
    addMeeting: () => {},
    deleteMeeting: () => {},
    addCustomer: () => {},
    deleteCustomer: () => {},
    addExpense: () => {},
    deleteExpense: () => {},
    addContract: () => {},
    deleteContract: () => {},
    addPartner: () => {},
    deletePartner: () => {},
    updateSocialMetric: () => {},
    archiveSocialStats: () => {},
    deleteSocialHistory: () => {},
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
};