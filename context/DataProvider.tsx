import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { AppContextType, AppData } from "../types";

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
    const fetchAll = async () => {
      setLoading(true);

      const [
        { data: tasks },
        { data: partners },
        { data: customers },
      ] = await Promise.all([
        supabase.from("tasks").select("*"),
        supabase.from("partners").select("*"),
        supabase.from("customers").select("*"),
      ]);

      setData(prev => ({
        ...prev,
        tasks: tasks ?? [],
        partners: partners ?? [],
        customers: customers ?? [],
      }));

      setLoading(false);
    };

    fetchAll();
  }, []);

  const addItem = async (table: string, item: any, key: keyof AppData) => {
    const newItem = { ...item, id: generateId() };

    const { data: inserted, error } = await supabase
      .from(table)
      .insert(newItem)
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setData(prev => ({
      ...prev,
      [key]: [...(prev[key] as any[]), inserted],
    }));
  };

  const deleteItem = async (table: string, id: string, key: keyof AppData) => {
    await supabase.from(table).delete().eq("id", id);

    setData(prev => ({
      ...prev,
      [key]: (prev[key] as any[]).filter((i: any) => i.id !== id),
    }));
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <AppContext.Provider
      value={{
        ...data,

        // TASKS
        addTask: (item) => addItem("tasks", item, "tasks"),
        deleteTask: (id) => deleteItem("tasks", id, "tasks"),

        // PARTNERS
        addPartner: (item) => addItem("partners", item, "partners"),
        deletePartner: (id) => deleteItem("partners", id, "partners"),

        // CUSTOMERS (DÜZELTİLMİŞ)
addCustomer: (item) =>
  addItem(
    "customers",
    {
      type: item.type,
      name: item.name,
      company: item.company,
      contact_info: item.contactInfo,
      service: item.service,
      start_date: item.startDate || null,
      end_date: item.endDate || null,
      invoice_file: item.invoiceFile || null,
    },
    "customers"
  ),

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
