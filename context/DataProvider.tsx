import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AppContextType, AppData, Task, Partner
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialData: AppData = {
  tasks: [],
  partners: [],
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------
  // TÜM VERİLERİ SUPABASE'DEN ÇEK
  // ----------------------------------------------------
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);

      const [
        { data: tasks },
        { data: partners }
      ] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('partners').select('*'),
      ]);

      // 🚀 NULL gelirse bile güvenli şekilde state'e at
      setData({
        tasks: tasks ?? [],
        partners: partners ?? [],
      });

      setLoading(false);
    };

    fetchAllData();
  }, []);

  // ----------------------------------------------------
  // GENEL INSERT METHODU
  // ----------------------------------------------------
  const addItem = async (table: string, item: any, listKey: keyof AppData) => {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert(item)
      .select('*')
      .single();

    if (error) {
      console.error(`Insert error in ${table}:`, error);
      return;
    }

    setData(prev => ({
      ...prev,
      [listKey]: [...(prev[listKey] as any[]), inserted]
    }));
  };

  // ----------------------------------------------------
  // UPDATE METHODU
  // ----------------------------------------------------
  const updateItem = async (table: string, id: string, updates: any, listKey: keyof AppData) => {
    const { error } = await supabase.from(table).update(updates).eq('id', id);

    if (error) console.error(`Update error in ${table}:`, error);

    setData(prev => ({
      ...prev,
      [listKey]: prev[listKey].map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  // ----------------------------------------------------
  // DELETE METHODU
  // ----------------------------------------------------
  const deleteItem = async (table: string, id: string, listKey: keyof AppData) => {
    const { error } = await supabase.from(table).delete().eq('id', id);

    if (error) console.error(`Delete error in ${table}:`, error);

    setData(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter(item => item.id !== id)
    }));
  };

  // ----------------------------------------------------
  // TASKS
  // ----------------------------------------------------
  const addTask = (item: Omit<Task, 'id'>) =>
    addItem('tasks', item, 'tasks');

  const updateTask = (id: string, updates: Partial<Task>) =>
    updateItem('tasks', id, updates, 'tasks');

  const deleteTask = (id: string) =>
    deleteItem('tasks', id, 'tasks');

  // ----------------------------------------------------
  // PARTNERS
  // ----------------------------------------------------
  const addPartner = (item: Omit<Partner, 'id'>) =>
    addItem('partners', item, 'partners');

  const deletePartner = (id: string) =>
    deleteItem('partners', id, 'partners');

  // ----------------------------------------------------

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-slate-600 font-medium">Veriler Yükleniyor...</div>
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
        deletePartner,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};
