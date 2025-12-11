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

  // -----------------------------------------------------
  //  CORRECT addItem FUNCTION
  // -----------------------------------------------------
  const addItem = async (table: string, item: any, listKey: keyof AppData) => {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(item)
      .select('*')
      .single();

    if (error) {
      console.error(`Error adding to ${table}:`, error);
      return;
    }

    setData(prev => ({
      ...prev,
      [listKey]: [...prev[listKey], inserted]
    }));
  };

  // -----------------------------------------------------
  //  UPDATE / DELETE (bunlar doğru)
  // -----------------------------------------------------

  const updateItem = async (table: string, id: string, updates: any, listKey: keyof AppData) => {
    setData(prev => ({
      ...prev,
      [listKey]: prev[listKey].map(item => item.id === id ? { ...item, ...updates } : item)
    }));

    await supabase.from(table).update(updates).eq('id', id);
  };

  const deleteItem = async (table: string, id: string, listKey: keyof AppData) => {
    setData(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter(item => item.id !== id)
    }));

    await supabase.from(table).delete().eq('id', id);
  };

  // -----------------------------------------------------
  //  SPECIFIC ACTIONS
  // -----------------------------------------------------

  const addTask = (task: Omit<Task, 'id'>) => addItem('tasks', task, 'tasks');
  const updateTask = (id: string, updates: Partial<Task>) => updateItem('tasks', id, updates, 'tasks');
  const deleteTask = (id: string) => deleteItem('tasks', id, 'tasks');

  return (
    <AppContext.Provider value={{
      ...data,
      addTask, updateTask, deleteTask,
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
