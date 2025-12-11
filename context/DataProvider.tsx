import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AppContextType, AppData, Task, Investor, Achievement, 
  ServiceItem, ServicePackage, CorporatePricing, Contact, Note, EventItem, Meeting, Customer,
  Expense, Contract, Partner, LibraryItem, SocialMetric, SocialHistoryEntry
} from '../types';

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
  socialHistory: []
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);
  const [loading, setLoading] = useState(true);

  const generateId = () => crypto.randomUUID();

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      
      const [
        { data: tasks },
        { data: investors },
        { data: achievements },
        { data: services },
        { data: packages },
        { data: corporatePricing },
        { data: contacts },
        { data: notes },
        { data: events },
        { data: meetings },
        { data: customers },
        { data: expenses },
        { data: contracts },
        { data: partners },
        { data: library },
        { data: socialStats },
        { data: socialHistory }
      ] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('investors').select('*'),
        supabase.from('achievements').select('*'),
        supabase.from('services').select('*'),
        supabase.from('packages').select('*'),
        supabase.from('corporate_pricing').select('*'),
        supabase.from('contacts').select('*'),
        supabase.from('notes').select('*'),
        supabase.from('events').select('*'),
        supabase.from('meetings').select('*'),
        supabase.from('customers').select('*'),
        supabase.from('expenses').select('*'),
        supabase.from('contracts').select('*'),
        supabase.from('partners').select('*'),
        supabase.from('library').select('*'),
        supabase.from('social_stats').select('*'),
        supabase.from('social_history').select('*')
      ]);

      // Handle Auto-Seeding for fixed structures if empty
      let finalCorporatePricing = corporatePricing || [];
      if (finalCorporatePricing.length === 0) {
        const defaults = [
          { id: generateId(), size: 'kucuk', basePrice: 15000, adjustment: 0, description: '1-50 Oda / 1-5 Poliklinik' },
          { id: generateId(), size: 'orta', basePrice: 35000, adjustment: 0, description: '50-200 Oda / Küçük Hastane' },
          { id: generateId(), size: 'buyuk', basePrice: 75000, adjustment: 0, description: '200+ Oda / Tam Teşekküllü Hastane' },
        ];
        await supabase.from('corporate_pricing').insert(defaults);
        finalCorporatePricing = defaults as any;
      }

      let finalSocialStats = socialStats || [];
      if (finalSocialStats.length === 0) {
        const defaults = [
          { platform: 'instagram', currentWeek: 0, lastWeek: 0 },
          { platform: 'linkedin', currentWeek: 0, lastWeek: 0 },
          { platform: 'website', currentWeek: 0, lastWeek: 0 },
        ];
        await supabase.from('social_stats').insert(defaults);
        finalSocialStats = defaults as any;
      }

      setData({
        tasks: tasks || [],
        investors: investors || [],
        achievements: achievements || [],
        services: services || [],
        packages: packages || [],
        corporatePricing: finalCorporatePricing,
        contacts: contacts || [],
        notes: notes || [],
        events: events || [],
        meetings: meetings || [],
        customers: customers || [],
        expenses: expenses || [],
        contracts: contracts || [],
        partners: partners || [],
        library: library || [],
        socialStats: finalSocialStats,
        socialHistory: socialHistory || [],
      });
      setLoading(false);
    };

    fetchAllData();
  }, []);

  // --- Generic Supabase Helpers ---

  const addItem = async (table: string, item: any, listKey: keyof AppData) => {
    const newItem = { ...item, id: generateId() };
    
    // Optimistic Update
    setData(prev => ({ ...prev, [listKey]: [...(prev[listKey] as any[]), newItem] }));
    
    const { error } = await supabase.from(table).insert(newItem);
    if (error) console.error(`Error adding to ${table}:`, error);
  };

  const updateItem = async (table: string, id: string, updates: any, listKey: keyof AppData) => {
    // Optimistic Update
    setData(prev => ({
      ...prev,
      [listKey]: (prev[listKey] as any[]).map(i => i.id === id ? { ...i, ...updates } : i)
    }));

    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) console.error(`Error updating ${table}:`, error);
  };

  const deleteItem = async (table: string, id: string, listKey: keyof AppData) => {
    // Optimistic Update
    setData(prev => ({
      ...prev,
      [listKey]: (prev[listKey] as any[]).filter(i => i.id !== id)
    }));

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) console.error(`Error deleting from ${table}:`, error);
  };

  // --- Specific Actions ---

  const addTask = (task: Omit<Task, 'id'>) => addItem('tasks', task, 'tasks');
  const updateTask = (id: string, updates: Partial<Task>) => updateItem('tasks', id, updates, 'tasks');
  const deleteTask = (id: string) => deleteItem('tasks', id, 'tasks');

  const addInvestor = (item: Omit<Investor, 'id'>) => addItem('investors', item, 'investors');
  const deleteInvestor = (id: string) => deleteItem('investors', id, 'investors');

  const addAchievement = (item: Omit<Achievement, 'id'>) => addItem('achievements', item, 'achievements');
  const deleteAchievement = (id: string) => deleteItem('achievements', id, 'achievements');

  const addService = (item: Omit<ServiceItem, 'id'>) => addItem('services', item, 'services');
  const deleteService = (id: string) => deleteItem('services', id, 'services');

  const addPackage = (item: Omit<ServicePackage, 'id'>) => addItem('packages', item, 'packages');
  const deletePackage = (id: string) => deleteItem('packages', id, 'packages');

  const updateCorporatePricing = (id: string, updates: Partial<CorporatePricing>) => updateItem('corporate_pricing', id, updates, 'corporatePricing');

  const addContact = (item: Omit<Contact, 'id'>) => addItem('contacts', item, 'contacts');
  const deleteContact = (id: string) => deleteItem('contacts', id, 'contacts');

  const addNote = (item: Omit<Note, 'id' | 'createdAt'>) => addItem('notes', { ...item, createdAt: new Date().toISOString() }, 'notes');
  const deleteNote = (id: string) => deleteItem('notes', id, 'notes');

  const addEvent = (item: Omit<EventItem, 'id'>) => addItem('events', item, 'events');
  const deleteEvent = (id: string) => deleteItem('events', id, 'events');

  const addMeeting = (item: Omit<Meeting, 'id'>) => addItem('meetings', item, 'meetings');
  const deleteMeeting = (id: string) => deleteItem('meetings', id, 'meetings');

  const addCustomer = (item: Omit<Customer, 'id'>) => addItem('customers', item, 'customers');
  const deleteCustomer = (id: string) => deleteItem('customers', id, 'customers');

  const addExpense = (item: Omit<Expense, 'id'>) => addItem('expenses', item, 'expenses');
  const deleteExpense = (id: string) => deleteItem('expenses', id, 'expenses');

  const addContract = (item: Omit<Contract, 'id'>) => addItem('contracts', item, 'contracts');
  const deleteContract = (id: string) => deleteItem('contracts', id, 'contracts');

  const addPartner = (item: Omit<Partner, 'id'>) => addItem('partners', item, 'partners');
  const deletePartner = (id: string) => deleteItem('partners', id, 'partners');

  const addLibraryItem = (item: Omit<LibraryItem, 'id' | 'dateAdded'>) => addItem('library', { ...item, dateAdded: new Date().toISOString() }, 'library');
  const deleteLibraryItem = (id: string) => deleteItem('library', id, 'library');

  // Special Handling for Social Stats
  const updateSocialMetric = async (platform: string, updates: Partial<SocialMetric>) => {
    setData(prev => ({
      ...prev,
      socialStats: prev.socialStats.map(s => s.platform === platform ? { ...s, ...updates } : s)
    }));
    
    // Assuming 'social_stats' table has a 'platform' column to match
    const { error } = await supabase.from('social_stats').update(updates).eq('platform', platform);
    if (error) console.error('Error updating social stats:', error);
  };

  const archiveSocialStats = async () => {
    const newEntry: SocialHistoryEntry = {
      id: generateId(),
      date: new Date().toLocaleDateString('tr-TR'),
      stats: [...data.socialStats]
    };
    
    // 1. Add to History Table
    await supabase.from('social_history').insert(newEntry);

    // 2. Reset Current Stats
    const resetStats = data.socialStats.map(s => ({
      ...s,
      lastWeek: s.currentWeek,
      currentWeek: 0
    }));

    // Update local state
    setData(prev => ({
      ...prev,
      socialHistory: [newEntry, ...prev.socialHistory],
      socialStats: resetStats
    }));

    // Update DB stats row by row
    for (const stat of resetStats) {
        await supabase.from('social_stats').update({
            lastWeek: stat.lastWeek,
            currentWeek: stat.currentWeek
        }).eq('platform', stat.platform);
    }
  };

  const deleteSocialHistory = (id: string) => deleteItem('social_history', id, 'socialHistory');

  if (loading) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
           <div className="text-slate-600 font-medium">Veriler Yükleniyor...</div>
        </div>
      );
  }

  return (
    <AppContext.Provider value={{
      ...data,
      addTask, updateTask, deleteTask,
      addInvestor, deleteInvestor,
      addAchievement, deleteAchievement,
      addService, deleteService,
      addPackage, deletePackage,
      updateCorporatePricing,
      addContact, deleteContact,
      addNote, deleteNote,
      addEvent, deleteEvent,
      addMeeting, deleteMeeting,
      addCustomer, deleteCustomer,
      addExpense, deleteExpense,
      addContract, deleteContract,
      addPartner, deletePartner,
      addLibraryItem, deleteLibraryItem,
      updateSocialMetric,
      archiveSocialStats,
      deleteSocialHistory
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};