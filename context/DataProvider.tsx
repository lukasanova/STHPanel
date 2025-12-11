import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  AppContextType, AppData, Task, Investor, Achievement,
  ServiceItem, ServicePackage, CorporatePricing, Contact, Note,
  EventItem, Meeting, Customer, Expense, Contract, Partner,
  LibraryItem, SocialMetric, SocialHistoryEntry
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

// Tüm başlangıç state'i
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
    const fetchAll = async () => {
      setLoading(true);

      const queries = [
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
      ];

      const results = await Promise.all(queries);

      // SAFETY WRAPPER → data yoksa [] döner
      const safe = (res: any) => (res && res.data ? res.data : []);

      const [
        tasks,
        investors,
        achievements,
        services,
        packages,
        corporatePricing,
        contacts,
        notes,
        events,
        meetings,
        customers,
        expenses,
        contracts,
        partners,
        library,
        socialStats,
        socialHistory
      ] = results.map(safe);

      setData({
        tasks,
        investors,
        achievements,
        services,
        packages,
        corporatePricing,
        contacts,
        notes,
        events,
        meetings,
        customers,
        expenses,
        contracts,
        partners,
        library,
        socialStats,
        socialHistory
      });

      setLoading(false);
    };

    fetchAll();
  }, []);

  // ------------- GENERIC HELPERS -------------

  const addItem = async (table: string, item: any, key: keyof AppData) => {
    const newItem = { ...item, id: generateId() };

    const { data: inserted, error } = await supabase
      .from(table)
      .insert(newItem)
      .select('*')
      .single();

    if (error) {
      console.error(`Add Error (${table}):`, error);
      return;
    }

    setData(prev => ({
      ...prev,
      [key]: [...(prev[key] as any[]), inserted]
    }));
  };

  const updateItem = async (table: string, id: string, updates: any, key: keyof AppData) => {
    const { error } = await supabase.from(table).update(updates).eq('id', id);

    if (error) {
      console.error(`Update Error (${table}):`, error);
      return;
    }

    setData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  const deleteItem = async (table: string, id: string, key: keyof AppData) => {
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) {
      console.error(`Delete Error (${table}):`, error);
      return;
    }

    setData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).filter(item => item.id !== id)
    }));
  };

  // ------------ TABLE SPECIFIC ACTIONS ------------

  // TASKS
  const addTask = (item: Omit<Task, 'id'>) => addItem('tasks', item, 'tasks');
  const updateTask = (id: string, updates: Partial<Task>) =>
    updateItem('tasks', id, updates, 'tasks');
  const deleteTask = (id: string) =>
    deleteItem('tasks', id, 'tasks');

  // PARTNERS
  const addPartner = (item: Omit<Partner, 'id'>) => addItem('partners', item, 'partners');
  const deletePartner = (id: string) => deleteItem('partners', id, 'partners');

  // ----------------------------------------------

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-600">
        Yükleniyor...
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        ...data,
        addTask,
        updateTask,
        deleteTask,
        addPartner,
        deletePartner
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
};
