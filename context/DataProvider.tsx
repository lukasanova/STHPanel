import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { AppContextType, AppData, LibraryItem, DocCategory, Investor, Expense, Contract } from "../types";

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
        // TÜM VERİLERİ ÇEK
        const { data: libraryData } = await supabase.from("library").select("*");
        const { data: tasksData } = await supabase.from("tasks").select("*");
        const { data: customersData } = await supabase.from("customers").select("*");
        const { data: partnersData } = await supabase.from("partners").select("*");
        const { data: investorsData } = await supabase.from("investors").select("*");
        const { data: expensesData } = await supabase.from("expenses").select("*");
        const { data: contractsData } = await supabase.from("contracts").select("*");

        console.log("📊 Contracts verisi:", contractsData);

        setData({
          ...initialData,
          library: libraryData || [],
          tasks: tasksData || [],
          customers: customersData || [],
          partners: partnersData || [],
          investors: investorsData || [],
          expenses: expensesData || [],
          contracts: contractsData || [],
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
      
      console.log(`📤 ${table} insert:`, itemWithId);
      
      const { data: inserted, error } = await supabase
        .from(table)
        .insert(itemWithId)
        .select("*")
        .single();

      if (error) {
        console.error(`❌ ${table} ekleme hatası:`, error);
        console.error(`❌ Hata mesajı:`, error.message);
        console.error(`❌ Hata detayı:`, error.details);
        alert(`Hata: ${error.message}`);
        return;
      }

      console.log(`✅ ${table} eklendi:`, inserted);
      
      // State'i güncelle
      setData(prev => ({
        ...prev,
        [key]: [...prev[key], inserted],
      }));

    } catch (error) {
      console.error(`🔥 ${table} ekleme hatası:`, error);
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

  /* ---------------- INVESTORS ---------------- */
  const addInvestor = async (item: Omit<Investor, 'id'>) => {
    console.log("💰 Yatırımcı ekleniyor:", item);
    
    try {
      const formattedItem = {
        name: item.name,
        contact_info: item.contactInfo,
        status: item.status,
        potential_amount: item.potentialAmount,
        notes: item.notes,
      };
      
      return addItem("investors", formattedItem, "investors");
    } catch (error) {
      console.error("❌ Yatırımcı ekleme hatası:", error);
    }
  };

  const deleteInvestor = async (id: string) => {
    console.log("🗑️ Yatırımcı siliniyor:", id);
    return deleteItem("investors", id, "investors");
  };

  /* ---------------- EXPENSES ---------------- */
  const addExpense = async (item: Omit<Expense, 'id'> & { file?: File }) => {
    console.log("💰 Gider ekleniyor:", item);
    
    try {
      let fileUrl = "";
      let fileName = "";

      // Dosya yükleme
      if (item.file) {
        console.log("📤 Fatura dosyası yükleniyor...");
        const fileExt = item.file.name.split('.').pop();
        const uniqueName = `${generateId()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('invoices')
          .upload(uniqueName, item.file);

        if (!uploadError) {
          const { data: urlData } = supabase
            .storage
            .from('invoices')
            .getPublicUrl(uniqueName);
          
          fileUrl = urlData.publicUrl;
          fileName = item.file.name;
        }
      } else if (item.invoiceFile) {
        fileName = item.invoiceFile;
      }

      const expenseItem = {
        date: item.date,
        description: item.description,
        amount: item.amount,
        category: item.category,
        invoice_file: fileName,
        invoice_url: fileUrl || null,
      };

      return addItem("expenses", expenseItem, "expenses");
    } catch (error) {
      console.error("❌ Gider ekleme hatası:", error);
    }
  };

  const deleteExpense = async (id: string) => {
    console.log("🗑️ Gider siliniyor:", id);
    return deleteItem("expenses", id, "expenses");
  };

  /* ---------------- CONTRACTS ---------------- */
  const addContract = async (item: Omit<Contract, 'id'> & { file?: File }) => {
    console.log("📝 Sözleşme ekleniyor:", item);
    
    try {
      let fileUrl = "";
      let fileName = "";

      // Dosya yükleme
      if (item.file) {
        console.log("📤 Sözleşme dosyası yükleniyor...");
        const fileExt = item.file.name.split('.').pop();
        const uniqueName = `${generateId()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('contracts')
          .upload(uniqueName, item.file);

        if (!uploadError) {
          const { data: urlData } = supabase
            .storage
            .from('contracts')
            .getPublicUrl(uniqueName);
          
          fileUrl = urlData.publicUrl;
          fileName = item.file.name;
        }
      } else if (item.contractFile) {
        fileName = item.contractFile;
      }

      const contractItem = {
        company_name: item.companyName,
        contract_type: item.contractType,
        start_date: item.startDate,
        end_date: item.endDate,
        status: item.status,
        contract_file: fileName,
        contract_url: fileUrl || null,
      };

      console.log("📤 Kontrat eklenecek:", contractItem);
      return addItem("contracts", contractItem, "contracts");
    } catch (error) {
      console.error("❌ Sözleşme ekleme hatası:", error);
    }
  };

  const deleteContract = async (id: string) => {
    console.log("🗑️ Sözleşme siliniyor:", id);
    return deleteItem("contracts", id, "contracts");
  };

  /* ---------------- LIBRARY ---------------- */
  const addLibraryItem = async (item: Omit<LibraryItem, 'id' | 'dateAdded'> & { file?: File }) => {
    console.log("📚 Library ekleniyor:", item);
    
    try {
      let fileUrl = "";
      let fileName = item.fileName || "";

      if (item.file) {
        console.log("📤 Dosya yükleniyor...");
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

        // YATIRIMCI FONKSİYONLARI
        addInvestor,
        deleteInvestor,

        // GİDER FONKSİYONLARI
        addExpense,
        deleteExpense,

        // SÖZLEŞME FONKSİYONLARI
        addContract,
        deleteContract,

        // DİĞER FONKSİYONLAR (şimdilik boş)
        updateTask: () => {},
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