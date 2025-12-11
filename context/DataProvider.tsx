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

      setData({
        tasks: tasks || [],
        investors: investors || [],
        achievements: achievements || [],
        services: services || [],
        packages: packages || [],
        corporatePricing: corporatePricing || [],
        contacts: contacts || [],
        notes: notes || [],
        events: events || [],
        meetings: meetings || [],
        customers: customers || [],
        expenses: expenses || [],
        contracts: contracts || [],
        partners: partners || [],
        library: library || [],
        socialStats: socialStats || [],
        socialHistory: socialHistory || [],
      });
      setLoading(false);
    };

    fetchAllData();
  }, []);

  // ---------------------------
  // GENERIC SUPABASE HELPERS
  // ---------------------------
  
  const addItem = async (table: string, item: any, listKey: keyof AppData) => {
    const newItem = { ...item, id: generateId() };

    const { data: inserted, error } = await supabase
      .from(table)
      .insert(newItem)
      .select('*')
      .single();

    if (error) {
      console.error(`Error adding to ${table}:`, error);
      return;
    }

    setData(prev => ({
      ...prev,
      [listKey]: [...(prev[listKey] as any[]), inserted]
    }));
  };

  const updateItem = async (table: string, id: string, updates: any, listKey: keyof AppData) => {
    const { error } = await supabase.from(table).update(updates).eq('id', id);
    if (error) console.error(`Error updating ${table}:`, error);

    setData(prev => ({
      ...prev,
      [listKey]: (prev[listKey] as any[]).map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteItem = async (table: string, id: string, listKey: keyof AppData) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) console.error(`Error deleting from ${table}:`, error);

    setData(prev => ({
      ...prev,
      [listKey]: (prev[listKey] as any[]).filter(item => item.id !== id)
    }));
  };

  // ---------------------------
  // TABLE-SPECIFIC FUNCTIONS
  // ---------------------------

  // TASKS
  const addTask = (item: Omit<Task, 'id'>) => addItem('tasks', item, 'tasks');
  const updateTask = (id: string, updates: Partial<Task>) => updateItem('tasks', id, updates, 'tasks');
  const deleteTask = (id: string) => deleteItem('tasks', id, 'tasks');

  // PARTNERS
  const addPartner = (item: Omit<Partner, 'id'>) => addItem('partners', item, 'partners');
  const deletePartner = (id: string) => deleteItem('partners', id, 'partners');

  // (Diğer tablolar hazır, istersen onları da ekleyebilirim)

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
      addPartner, deletePartner
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
