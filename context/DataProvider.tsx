import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { 
  AppContextType, AppData, Task, Partner,
} from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialData: AppData = {
  tasks: [],
  partners: [],
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>(initialData);
  const [loading, setLoading] = useState(true);

  const generateId = () => crypto.randomUUID();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const [
        { data: tasksData },
        { data: partnersData }
      ] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('partners').select('*'),
      ]);

      // EN ÖNEMLİ KISIM — undefined olanları asla bırakmıyoruz
      setData({
        tasks: tasksData ?? [],
        partners: partnersData ?? [],
      });

      setLoading(false);
    };

    fetchAll();
  }, []);

  // -------------------------
  // GENERIC INSERT FUNCTION
  // -------------------------
  const addItem = async (table: string, item: any, key: keyof AppData) => {
    const newItem = { ...item, id: generateId() };

    const { data: inserted, error } = await supabase
      .from(table)
      .insert(newItem)
      .select('*')
      .single();

    if (error) {
      console.error(`Insert error in ${table}:`, error);
      return;
    }

    setData(prev => ({
      ...prev,
      [key]: [...prev[key]!, inserted]
    }));
  };

  const deleteItem = async (table: string, id: string, key: keyof AppData) => {
    await supabase.from(table).delete().eq('id', id);

    setData(prev => ({
      ...prev,
      [key]: prev[key]!.filter(i => i.id !== id)
    }));
  };

  // ---- Specific Actions ----
  const addTask = (item: Omit<Task, 'id'>) => addItem("tasks", item, "tasks");
  const deleteTask = (id: string) => deleteItem("tasks", id, "tasks");

  const addPartner = (item: Omit<Partner, 'id'>) => addItem("partners", item, "partners");
  const deletePartner = (id: string) => deleteItem("partners", id, "partners");

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <AppContext.Provider value={{
      ...data,
      addTask,
      deleteTask,
      addPartner,
      deletePartner,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useData = () => {
  const c = useContext(AppContext);
  if (!c) throw new Error("useData must be used inside DataProvider");
  return c;
};
