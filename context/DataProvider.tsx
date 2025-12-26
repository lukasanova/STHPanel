import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { 
  AppContextType, 
  AppData, 
  LibraryItem, 
  Investor, 
  Expense, 
  Contract, 
  TaskStatus, 
  Priority, 
  SocialPlatform, 
  SocialHistoryEntry, 
  Event, 
  Meeting, 
  Customer, 
  Task,
  CalendarEvent,
  Partner
} from "../types";

const AppContext = createContext<AppContextType | undefined>(undefined);

// BAŞLANGIÇ SOSYAL VERİLERİ
const initialSocialStats: SocialPlatform[] = [
  {
    id: 'instagram',
    platform: 'instagram',
    name: 'Instagram',
    metrics: [
      { name: 'Görüntülenme', currentWeek: 0, lastWeek: 0, unit: 'görüntülenme' },
      { name: 'Takipçi', currentWeek: 0, lastWeek: 0, unit: 'takipçi' },
      { name: 'Beğeni', currentWeek: 0, lastWeek: 0, unit: 'beğeni' },
      { name: 'Yorum', currentWeek: 0, lastWeek: 0, unit: 'yorum' },
      { name: 'Paylaşım', currentWeek: 0, lastWeek: 0, unit: 'paylaşım' },
    ]
  },
  {
    id: 'linkedin',
    platform: 'linkedin',
    name: 'LinkedIn',
    metrics: [
      { name: 'Görüntülenme', currentWeek: 0, lastWeek: 0, unit: 'görüntülenme' },
      { name: 'Tepki', currentWeek: 0, lastWeek: 0, unit: 'tepki' },
      { name: 'Takipçi', currentWeek: 0, lastWeek: 0, unit: 'takipçi' },
      { name: 'Yorum', currentWeek: 0, lastWeek: 0, unit: 'yorum' },
      { name: 'Paylaşım', currentWeek: 0, lastWeek: 0, unit: 'paylaşım' },
    ]
  },
  {
    id: 'website',
    platform: 'website',
    name: 'Web Sitesi',
    metrics: [
      { name: 'Ziyaretçi', currentWeek: 0, lastWeek: 0, unit: 'ziyaretçi' },
      { name: 'Sayfa Görüntülenmesi', currentWeek: 0, lastWeek: 0, unit: 'görüntülenme' },
      { name: 'Ortalama Oturum Süresi', currentWeek: 0, lastWeek: 0, unit: 'dakika' },
      { name: 'Hemen Çıkma Oranı', currentWeek: 0, lastWeek: 0, unit: '%' },
      { name: 'Büyüme', currentWeek: 0, lastWeek: 0, unit: '%' },
    ]
  }
];

// BAŞLANGIÇ CALENDAR EVENTS (Geçici olarak localStorage'dan veya boş)
const initialCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Tanışma Toplantısı',
    description: 'Yeni müşteri ile tanışma',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    color: '#3B82F6',
    assignee: 'Ahmet',
    type: 'meeting'
  },
  {
    id: '2',
    title: 'Proje Teslimi',
    description: 'XYZ projesinin teslimi',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Yarın
    startTime: '14:00',
    endTime: '15:30',
    color: '#10B981',
    assignee: 'Mehmet',
    type: 'task'
  }
];

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
  socialStats: initialSocialStats,
  socialHistory: [],
  calendarEvents: initialCalendarEvents, // CALENDAR EVENTS EKLENDİ
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);
  const [loading, setLoading] = useState(true);

  const generateId = () => crypto.randomUUID();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("📡 Tüm veriler çekiliyor...");

      try {
        // TÜM VERİLERİ ÇEK
        const { data: libraryData } = await supabase.from("library").select("*");
        const { data: tasksData } = await supabase.from("tasks").select("*");
        const { data: customersData } = await supabase.from("customers").select("*");
        const { data: partnersData } = await supabase.from("partners").select("*");
        const { data: investorsData } = await supabase.from("investors").select("*");
        const { data: expensesData } = await supabase.from("expenses").select("*");
        const { data: contractsData } = await supabase.from("contracts").select("*");
        const { data: socialHistoryData } = await supabase.from("social_history").select("*");
        const { data: eventsData } = await supabase.from("events").select("*");
        const { data: meetingsData } = await supabase.from("meetings").select("*");
        
        // CALENDAR EVENTS'ı çek - EĞER TABLO YOKSA HATA VERME
        let calendarEventsData = [];
        try {
          const { data: calendarData } = await supabase.from("calendar_events").select("*");
          calendarEventsData = calendarData || [];
        } catch (error) {
          console.log("⚠️ Calendar events tablosu henüz oluşturulmamış, localStorage kullanılacak");
          // localStorage'dan al veya initial data kullan
          const savedCalendarEvents = localStorage.getItem('calendarEvents');
          if (savedCalendarEvents) {
            calendarEventsData = JSON.parse(savedCalendarEvents);
          }
        }

        // MÜŞTERİ VERİLERİNİ DÜZELT
        const fixedCustomers = customersData?.map(customer => ({
          id: customer.id,
          type: customer.type,
          name: customer.name,
          company: customer.company,
          contactInfo: customer.contact_info || customer.contactInfo || "",
          service: customer.service,
          startDate: customer.start_date,
          endDate: customer.end_date,
          invoiceFile: customer.invoice_file,
        })) || [];

        // SOSYAL GEÇMİŞ VERİLERİNİ DÖNÜŞTÜR
        const loadedSocialHistory = socialHistoryData?.map(entry => ({
          id: entry.id,
          date: entry.date,
          stats: entry.stats || []
        })) || [];

        // TAKVİM VERİLERİNİ DÖNÜŞTÜR
        const formattedEvents = eventsData?.map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          type: event.type,
          description: event.description,
          participants: event.participants || [],
        })) || [];

        // TOPLANTI VERİLERİNİ DÖNÜŞTÜR
        const formattedMeetings = meetingsData?.map(meeting => ({
          id: meeting.id,
          title: meeting.title,
          date: meeting.date,
          time: meeting.time,
          participants: meeting.participants || [],
          agenda: meeting.agenda,
          notes: meeting.notes,
          status: meeting.status,
        })) || [];

        // CALENDAR EVENTS VERİLERİNİ DÖNÜŞTÜR
        const formattedCalendarEvents = calendarEventsData?.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          startTime: event.start_time || event.startTime,
          endTime: event.end_time || event.endTime,
          color: event.color,
          assignee: event.assignee,
          type: event.type,
        })) || [];

        // localStorage'dan sosyal istatistikleri kontrol et
        const savedSocialStats = localStorage.getItem('socialStats');
        const currentSocialStats = savedSocialStats ? JSON.parse(savedSocialStats) : initialSocialStats;

        setData({
          ...initialData,
          library: libraryData || [],
          tasks: tasksData || [],
          customers: fixedCustomers,
          partners: partnersData || [],
          investors: investorsData || [],
          expenses: expensesData || [],
          contracts: contractsData || [],
          events: formattedEvents,
          meetings: formattedMeetings,
          calendarEvents: formattedCalendarEvents.length > 0 ? formattedCalendarEvents : initialCalendarEvents,
          socialStats: currentSocialStats,
          socialHistory: loadedSocialHistory,
        });

        console.log("✅ Tüm veriler başarıyla yüklendi!");

      } catch (error) {
        console.error("❌ Veri çekme hatası:", error);
        // Hata durumunda localStorage'dan verileri yükle
        try {
          const savedCalendarEvents = localStorage.getItem('calendarEvents');
          const savedData = localStorage.getItem('appData');
          
          if (savedCalendarEvents) {
            const calendarEvents = JSON.parse(savedCalendarEvents);
            setData(prev => ({
              ...prev,
              calendarEvents: calendarEvents
            }));
          }
          
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            setData(prev => ({
              ...prev,
              ...parsedData
            }));
          }
        } catch (localError) {
          console.error("❌ LocalStorage'dan veri yükleme hatası:", localError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ---------------- TEMEL VERİTABANI FONKSİYONLARI ---------------- */
  
  const addItem = async (table: string, item: any, key: keyof AppData) => {
    console.log(`➕ ${table} ekleniyor:`, item);
    
    try {
      const itemWithId = { ...item, id: generateId() };
      
      // Eğer calendar_events tablosu yoksa localStorage kullan
      if (table === "calendar_events") {
        try {
          const { data: inserted, error } = await supabase
            .from(table)
            .insert(itemWithId)
            .select("*")
            .single();

          if (error) {
            console.log(`⚠️ ${table} tablosu yok, localStorage kullanılacak`);
            throw error;
          }

          // State'i güncelle
          setData(prev => ({
            ...prev,
            [key]: [...prev[key], inserted],
          }));

          // localStorage'a kaydet
          const currentEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
          localStorage.setItem('calendarEvents', JSON.stringify([...currentEvents, inserted]));

          console.log(`✅ ${table} eklendi:`, inserted);
          return inserted;
          
        } catch (dbError) {
          // Database hatası durumunda localStorage kullan
          console.log(`📱 ${table} localStorage'a ekleniyor`);
          
          setData(prev => ({
            ...prev,
            [key]: [...prev[key], itemWithId],
          }));

          // localStorage'a kaydet
          const currentEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
          localStorage.setItem('calendarEvents', JSON.stringify([...currentEvents, itemWithId]));

          return itemWithId;
        }
      } else {
        // Diğer tablolar için normal işlem
        const { data: inserted, error } = await supabase
          .from(table)
          .insert(itemWithId)
          .select("*")
          .single();

        if (error) {
          console.error(`❌ ${table} ekleme hatası:`, error);
          alert(`Hata: ${error.message}`);
          throw error;
        }

        // State'i güncelle
        setData(prev => ({
          ...prev,
          [key]: [...prev[key], inserted],
        }));

        console.log(`✅ ${table} eklendi:`, inserted);
        return inserted;
      }
      
    } catch (error) {
      console.error(`🔥 ${table} ekleme hatası:`, error);
      throw error;
    }
  };

  const updateItem = async (table: string, id: string, updates: any, key: keyof AppData) => {
    console.log(`✏️ ${table} güncelleniyor:`, id, updates);
    
    try {
      if (table === "calendar_events") {
        try {
          const { data: updated, error } = await supabase
            .from(table)
            .update(updates)
            .eq("id", id)
            .select("*")
            .single();

          if (error) {
            console.log(`⚠️ ${table} tablosu yok, localStorage kullanılacak`);
            throw error;
          }

          // State'i güncelle
          setData(prev => ({
            ...prev,
            [key]: prev[key].map((item: any) => 
              item.id === id ? updated : item
            ),
          }));

          // localStorage'ı güncelle
          const currentEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
          const updatedEvents = currentEvents.map((event: any) => 
            event.id === id ? updated : event
          );
          localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));

          console.log(`✅ ${table} güncellendi:`, updated);
          return updated;
          
        } catch (dbError) {
          // localStorage ile güncelle
          setData(prev => ({
            ...prev,
            [key]: prev[key].map((item: any) => 
              item.id === id ? { ...item, ...updates } : item
            ),
          }));

          // localStorage'ı güncelle
          const currentEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
          const updatedEvents = currentEvents.map((event: any) => 
            event.id === id ? { ...event, ...updates } : event
          );
          localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));

          return { id, ...updates };
        }
      } else {
        // Diğer tablolar
        const { data: updated, error } = await supabase
          .from(table)
          .update(updates)
          .eq("id", id)
          .select("*")
          .single();

        if (error) {
          console.error(`❌ ${table} güncelleme hatası:`, error);
          return;
        }

        // State'i güncelle
        setData(prev => ({
          ...prev,
          [key]: prev[key].map((item: any) => 
            item.id === id ? updated : item
          ),
        }));

        console.log(`✅ ${table} güncellendi:`, updated);
        return updated;
      }
      
    } catch (error) {
      console.error(`🔥 ${table} güncelleme hatası:`, error);
    }
  };

  const deleteItem = async (table: string, id: string, key: keyof AppData) => {
    console.log(`🗑️ ${table} siliniyor:`, id);
    
    if (table === "calendar_events") {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq("id", id);

        if (error) {
          console.log(`⚠️ ${table} tablosu yok, localStorage kullanılacak`);
          throw error;
        }
      } catch (dbError) {
        // localStorage'dan sil
        const currentEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
        const filteredEvents = currentEvents.filter((event: any) => event.id !== id);
        localStorage.setItem('calendarEvents', JSON.stringify(filteredEvents));
      }

      // State'i güncelle
      setData(prev => ({
        ...prev,
        [key]: prev[key].filter((item: any) => item.id !== id),
      }));

      console.log(`✅ ${table} silindi:`, id);
      return;
    }

    // Diğer tablolar
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

  /* ---------------- CALENDAR EVENTS FONKSİYONLARI ---------------- */
  
  const addCalendarEvent = async (item: Omit<CalendarEvent, 'id'>) => {
    console.log("📅 Takvim etkinliği ekleniyor:", item);
    
    try {
      const formattedItem = {
        title: item.title,
        description: item.description,
        date: item.date,
        start_time: item.startTime,
        end_time: item.endTime,
        color: item.color,
        assignee: item.assignee,
        type: item.type,
      };
      
      const result = await addItem("calendar_events", formattedItem, "calendarEvents");
      alert("✅ Etkinlik başarıyla eklendi!");
      return result;
    } catch (error) {
      console.error("❌ Takvim etkinliği ekleme hatası:", error);
      alert("Etkinlik eklenirken bir hata oluştu!");
      throw error;
    }
  };

  const updateCalendarEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    console.log("✏️ Takvim etkinliği güncelleniyor:", id, updates);
    
    // CalendarEvent'ten database formatına dönüştür
    const dbUpdates: any = {};
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.date) dbUpdates.date = updates.date;
    if (updates.startTime) dbUpdates.start_time = updates.startTime;
    if (updates.endTime) dbUpdates.end_time = updates.endTime;
    if (updates.color) dbUpdates.color = updates.color;
    if (updates.assignee) dbUpdates.assignee = updates.assignee;
    if (updates.type) dbUpdates.type = updates.type;
    
    const result = await updateItem("calendar_events", id, dbUpdates, "calendarEvents");
    alert("✅ Etkinlik başarıyla güncellendi!");
    return result;
  };

  const deleteCalendarEvent = async (id: string) => {
    console.log("🗑️ Takvim etkinliği siliniyor:", id);
    
    if (window.confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
      await deleteItem("calendar_events", id, "calendarEvents");
      alert("✅ Etkinlik başarıyla silindi!");
    }
  };

  /* ---------------- DİĞER FONKSİYONLAR (MEVCUT) ---------------- */
  
  const addTask = (item: any) => {
    const formattedItem = {
      name: item.name,
      assignee: item.assignee,
      due_date: item.due_date,
      status: item.status || "beklemede",
      priority: item.priority || "orta",
    };
    return addItem("tasks", formattedItem, "tasks");
  };

  const updateTask = (id: string, updates: { status?: TaskStatus; priority?: Priority; name?: string; assignee?: string; due_date?: string }) => {
    return updateItem("tasks", id, updates, "tasks");
  };

  const deleteTask = (id: string) => {
    return deleteItem("tasks", id, "tasks");
  };

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

  const deleteCustomer = async (id: string) => {
    return deleteItem("customers", id, "customers");
  };

  const addEvent = async (item: Omit<Event, 'id'>) => {
    console.log("📅 Takvim etkinliği ekleniyor:", item);
    
    try {
      const formattedItem = {
        title: item.title,
        date: item.date,
        time: item.time,
        type: item.type,
        description: item.description,
        participants: item.participants || [],
      };
      
      return addItem("events", formattedItem, "events");
    } catch (error) {
      console.error("❌ Takvim etkinliği ekleme hatası:", error);
      throw error;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    console.log("✏️ Takvim etkinliği güncelleniyor:", id, updates);
    return updateItem("events", id, updates, "events");
  };

  const deleteEvent = async (id: string) => {
    console.log("🗑️ Takvim etkinliği siliniyor:", id);
    return deleteItem("events", id, "events");
  };

  const addMeeting = async (item: Omit<Meeting, 'id'>) => {
    console.log("🤝 Toplantı ekleniyor:", item);
    
    try {
      const formattedItem = {
        title: item.title,
        date: item.date,
        time: item.time,
        participants: item.participants || [],
        agenda: item.agenda,
        notes: item.notes,
        status: item.status || "planlandı",
      };
      
      return addItem("meetings", formattedItem, "meetings");
    } catch (error) {
      console.error("❌ Toplantı ekleme hatası:", error);
      throw error;
    }
  };

  const updateMeeting = async (id: string, updates: Partial<Meeting>) => {
    console.log("✏️ Toplantı güncelleniyor:", id, updates);
    return updateItem("meetings", id, updates, "meetings");
  };

  const deleteMeeting = async (id: string) => {
    console.log("🗑️ Toplantı siliniyor:", id);
    return deleteItem("meetings", id, "meetings");
  };

  const addInvestor = async (item: Omit<Investor, 'id'>) => {
    const formattedItem = {
      name: item.name,
      contact_info: item.contactInfo,
      status: item.status,
      potential_amount: item.potentialAmount,
      notes: item.notes,
    };
    
    return addItem("investors", formattedItem, "investors");
  };

  const deleteInvestor = async (id: string) => {
    return deleteItem("investors", id, "investors");
  };

  const addExpense = async (item: Omit<Expense, 'id'> & { file?: File }) => {
    try {
      let fileUrl = "";
      let fileName = "";

      if (item.file) {
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
    return deleteItem("expenses", id, "expenses");
  };

  const addContract = async (item: Omit<Contract, 'id'> & { file?: File }) => {
    try {
      let fileUrl = "";
      let fileName = "";

      if (item.file) {
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

      return addItem("contracts", contractItem, "contracts");
    } catch (error) {
      console.error("❌ Sözleşme ekleme hatası:", error);
    }
  };

  const deleteContract = async (id: string) => {
    return deleteItem("contracts", id, "contracts");
  };

  const addLibraryItem = async (item: Omit<LibraryItem, 'id' | 'dateAdded'> & { file?: File }) => {
    try {
      let fileUrl = "";
      let fileName = item.fileName || "";

      if (item.file) {
        const fileExt = item.file.name.split('.').pop();
        const uniqueName = `${generateId()}.${fileExt}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('library-files')
          .upload(uniqueName, item.file);

        if (uploadError) {
          console.error("❌ Dosya yükleme hatası:", uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase
          .storage
          .from('library-files')
          .getPublicUrl(uniqueName);
        
        fileUrl = urlData.publicUrl;
        fileName = item.file.name;
      }

      const libraryItem = {
        title: item.title,
        category: item.category,
        description: item.description || "",
        fileName: fileName,
        fileUrl: fileUrl || null,
        dateAdded: new Date().toISOString(),
      };

      const result = await addItem("library", libraryItem, "library");
      return result;
      
    } catch (error) {
      console.error("❌ Library ekleme hatası:", error);
      throw error;
    }
  };

  const deleteLibraryItem = async (id: string) => {
    return deleteItem("library", id, "library");
  };

  const updateSocialMetric = (platformId: string, metricName: string, updates: { currentWeek?: number, lastWeek?: number }) => {
    console.log(`✏️ Sosyal metrik güncelleniyor: ${platformId} - ${metricName}`, updates);
    
    setData(prev => {
      const updatedSocialStats = prev.socialStats.map(platform => {
        if (platform.id === platformId) {
          return {
            ...platform,
            metrics: platform.metrics.map(metric => {
              if (metric.name === metricName) {
                return {
                  ...metric,
                  ...updates
                };
              }
              return metric;
            })
          };
        }
        return platform;
      });

      localStorage.setItem('socialStats', JSON.stringify(updatedSocialStats));
      
      return {
        ...prev,
        socialStats: updatedSocialStats
      };
    });
  };

  const archiveSocialStats = async () => {
    console.log("📊 Hafta arşivleniyor...");
    
    try {
      const today = new Date();
      const formattedDate = today.toLocaleDateString('tr-TR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const newArchiveEntry = {
        id: generateId(),
        date: formattedDate,
        stats: JSON.parse(JSON.stringify(data.socialStats))
      };

      const { data: inserted, error } = await supabase
        .from("social_history")
        .insert({
          id: newArchiveEntry.id,
          date: newArchiveEntry.date,
          stats: JSON.stringify(newArchiveEntry.stats)
        })
        .select("*")
        .single();

      if (error) {
        console.error("❌ Arşivleme hatası:", error);
        alert("Hafta kaydedilirken bir hata oluştu!");
        return;
      }

      setData(prev => ({
        ...prev,
        socialHistory: [...prev.socialHistory, newArchiveEntry]
      }));

      const resetSocialStats = data.socialStats.map(platform => ({
        ...platform,
        metrics: platform.metrics.map(metric => ({
          ...metric,
          lastWeek: metric.currentWeek,
          currentWeek: 0
        }))
      }));

      localStorage.setItem('socialStats', JSON.stringify(resetSocialStats));

      setData(prev => ({
        ...prev,
        socialStats: resetSocialStats
      }));

      console.log("✅ Hafta arşivlendi!");
      alert("✅ Haftalık veriler başarıyla kaydedildi! Yeni hafta başladı.");
      
    } catch (error) {
      console.error("❌ Arşivleme hatası:", error);
      alert("Bir hata oluştu!");
    }
  };

  const deleteSocialHistory = async (id: string) => {
    console.log("🗑️ Sosyal geçmiş siliniyor:", id);
    
    try {
      const { error } = await supabase
        .from("social_history")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Silme hatası:", error);
        return;
      }

      setData(prev => ({
        ...prev,
        socialHistory: prev.socialHistory.filter(entry => entry.id !== id)
      }));

      console.log("✅ Sosyal geçmiş silindi:", id);
    } catch (error) {
      console.error("❌ Silme hatası:", error);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">📊 Veriler yükleniyor...</div>;

  return (
    <AppContext.Provider
      value={{
        ...data,
        
        // CALENDAR EVENTS FONKSİYONLARI - YENİ EKLENDİ
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        
        // TEMEL FONKSİYONLAR
        addTask,
        updateTask,
        deleteTask,
        
        // ORTAKLAR
        addPartner: (item) => addItem("partners", item, "partners"),
        deletePartner: (id) => deleteItem("partners", id, "partners"),
        
        // MÜŞTERİLER
        addCustomer,
        deleteCustomer,
        
        // KÜTÜPHANE
        addLibraryItem,
        deleteLibraryItem,

        // YATIRIMCILAR
        addInvestor,
        deleteInvestor,

        // GİDERLER
        addExpense,
        deleteExpense,

        // SÖZLEŞMELER
        addContract,
        deleteContract,

        // TAKVİM (EVENTS)
        addEvent,
        updateEvent,
        deleteEvent,

        // TOPLANTILAR (MEETINGS)
        addMeeting,
        updateMeeting,
        deleteMeeting,

        // SOSYAL MEDYA
        updateSocialMetric,
        archiveSocialStats,
        deleteSocialHistory,

        // DİĞER FONKSİYONLAR
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