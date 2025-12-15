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

  // Supabase bağlantısını test et
  useEffect(() => {
    console.log("🔍 Supabase bağlantı testi...");
    console.log("URL:", supabase.supabaseUrl ? "✅ Var" : "❌ Yok");
    console.log("Key:", supabase.supabaseKey ? "✅ Var" : "❌ Yok");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("📡 Veriler çekiliyor...");

      try {
        // SADECE BASİT VERİLERİ ÇEK
        const { data: libraryData } = await supabase.from("library").select("*");
        const { data: tasksData } = await supabase.from("tasks").select("*");
        const { data: customersData } = await supabase.from("customers").select("*");
        const { data: partnersData } = await supabase.from("partners").select("*");

        setData({
          ...initialData,
          library: libraryData || [],
          tasks: tasksData || [],
          customers: customersData || [],
          partners: partnersData || [],
        });

        console.log("✅ Veriler alındı!");
      } catch (error) {
        console.error("❌ Veri çekme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- BASİT EKLEME FONKSİYONU ---------------- */
  const addItem = async (table: string, item: any, key: keyof AppData) => {
    console.log(`➕ ${table} ekleniyor:`, item);
    
    try {
      const itemWithId = { ...item, id: generateId() };
      
      const { data: inserted, error } = await supabase
        .from(table)
        .insert(itemWithId)
        .select("*")
        .single();

      if (error) {
        console.error(`❌ ${table} ekleme hatası:`, error);
        alert(`${table} eklenemedi: ${error.message}`);
        return;
      }

      console.log(`✅ ${table} eklendi:`, inserted);
      
      // State'i güncelle
      setData(prev => ({
        ...prev,
        [key]: [...prev[key], inserted],
      }));

      alert(`${table} başarıyla eklendi!`);
    } catch (error) {
      console.error(`🔥 ${table} ekleme hatası:`, error);
      alert("Beklenmeyen hata!");
    }
  };

  /* ---------------- BASİT SİLME FONKSİYONU ---------------- */
  const deleteItem = async (table: string, id: string, key: keyof AppData) => {
    console.log(`🗑️ ${table} siliniyor:`, id);
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`❌ ${table} silme hatası:`, error);
      return;
    }

    setData(prev => ({
      ...prev,
      [key]: prev[key].filter((item: any) => item.id !== id),
    }));

    console.log(`✅ ${table} silindi:`, id);
  };

  /* ---------------- CUSTOMERS ---------------- */
  const addCustomer = (item: any) => {
    const formattedItem = {
      type: item.type,
      name: item.name,
      company: item.company,
      contact_info: item.contactInfo,
      service: item.service,
      start_date: item.startDate || null,
      end_date: item.endDate || null,
      invoice_file: item.invoiceFile || null,
    };
    return addItem("customers", formattedItem, "customers");
  };

  /* ---------------- LIBRARY ---------------- */
  const addLibraryItem = async (item: Omit<LibraryItem, 'id' | 'dateAdded'> & { file?: File }) => {
    console.log("📚 Library ekleniyor:", item);
    
    try {
      let fileUrl = "";
      let fileName = item.fileName || "";

      if (item.file) {
        console.log("📤 Dosya yükleniyor...");
        // Basit dosya yükleme
        const fileExt = item.file.name.split('.').pop();
        const uniqueName = `${generateId()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('library-files')
          .upload(uniqueName, item.file);

        if (!uploadError) {
          const { data: urlData } = supabase
            .storage
            .from('library-files')
            .getPublicUrl(uniqueName);
          
          fileUrl = urlData.publicUrl;
          fileName = item.file.name;
        }
      }

      const libraryItem = {
        title: item.title,
        category: item.category,
        description: item.description || "",
        fileName: fileName,
        fileUrl: fileUrl || null,
        dateAdded: new Date().toISOString(),
      };

      return addItem("library", libraryItem, "library");
    } catch (error) {
      console.error("❌ Library ekleme hatası:", error);
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <AppContext.Provider
      value={{
        ...data,
        
        // TEMEL FONKSİYONLAR
        addTask: (item) => addItem("tasks", item, "tasks"),
        deleteTask: (id) => deleteItem("tasks", id, "tasks"),
        
        addPartner: (item) => addItem("partners", item, "partners"),
        deletePartner: (id) => deleteItem("partners", id, "partners"),
        
        addCustomer,
        deleteCustomer: (id) => deleteItem("customers", id, "customers"),
        
        addLibraryItem,
        deleteLibraryItem: (id) => deleteItem("library", id, "library"),

        // DİĞER FONKSİYONLAR (şimdilik boş)
        updateTask: () => {},
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
        addExpense: () => {},
        deleteExpense: () => {},
        addContract: () => {},
        deleteContract: () => {},
        updateSocialMetric: () => {},
        archiveSocialStats: () => {},
        deleteSocialHistory: () => {},
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useData must be used inside DataProvider");
  return ctx;
};