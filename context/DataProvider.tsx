import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  AppContextType,
  AppData,
  Task,
  Investor,
  Achievement,
  ServiceItem,
  ServicePackage,
  CorporatePricing,
  Contact,
  Note,
  EventItem,
  Meeting,
  Customer,
  Expense,
  Contract,
  Partner,
  LibraryItem,
  SocialMetric,
  SocialHistoryEntry,
} from "../types";

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

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<AppData>(initialData);
  const [loading, setLoading] = useState(true);

  const generateId = () => crypto.randomUUID();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const [
        { data: tasksData },
        { data: investorsData },
        { data: achievementsData },
        { data: servicesData },
        { data: packagesData },
        { data: corporatePricingData },
        { data: contactsData },
        { data: notesData },
        { data: eventsData },
        { data: meetingsData },
        { data: customersData },
        { data: expensesData },
        { data: contractsData },
        { data: partnersData },
        { data: libraryData },
        { data: socialStatsData },
        { data: socialHistoryData },
      ] = await Promise.all([
        supabase.from("tasks").select("*"),
        supabase.from("investors").select("*"),
        supabase.from("achievements").select("*"),
        supabase.from("services").select("*"),
        supabase.from("packages").select("*"),
        supabase.from("corporate_pricing").select("*"),
        supabase.from("contacts").select("*"),
        supabase.from("notes").select("*"),
        supabase.from("events").select("*"),
        supabase.from("meetings").select("*"),
        supabase.from("customers").select("*"),
        supabase.from("expenses").select("*"),
        supabase.from("contracts").select("*"),
        supabase.from("partners").select("*"),
        supabase.from("library").select("*"),
        supabase.from("social_stats").select("*"),
        supabase.from("social_history").select("*"),
      ]);

      setData({
        tasks: tasksData ?? [],
        investors: investorsData ?? [],
        achievements: achievementsData ?? [],
        services: servicesData ?? [],
        packages: packagesData ?? [],
        corporatePricing: corporatePricingData ?? [],
        contacts: contactsData ?? [],
        notes: notesData ?? [],
        events: eventsData ?? [],
        meetings: meetingsData ?? [],
        customers: customersData ?? [],
        expenses: expensesData ?? [],
        contracts: contractsData ?? [],
        partners: partnersData ?? [],
        library: libraryData ?? [],
        socialStats: socialStatsData ?? [],
        socialHistory: socialHistoryData ?? [],
      });

      setLoading(false);
    };

    fetchAll();
  }, []);

  // ADD / UPDATE / DELETE functions (değiştirmene gerek yok)
  const addItem = async (table: string, item: any, listKey: keyof AppData) => {
    const newItem = { ...item, id: generateId() };
    const { data: inserted } = await supabase
      .from(table)
      .insert(newItem)
      .select("*")
      .single();

    if (!inserted) return;

    setData((prev) => ({
      ...prev,
      [listKey]: [...(prev[listKey] as any[]), inserted],
    }));
  };

  const updateItem = async (
    table: string,
    id: string,
    updates: any,
    listKey: keyof AppData
  ) => {
    await supabase.from(table).update(updates).eq("id", id);

    setData((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] as any[]).map((i) =>
        i.id === id ? { ...i, ...updates } : i
      ),
    }));
  };

  const deleteItem = async (
    table: string,
    id: string,
    listKey: keyof AppData
  ) => {
    await supabase.from(table).delete().eq("id", id);

    setData((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] as any[]).filter((i) => i.id !== id),
    }));
  };

  return loading ? (
    <div>Yükleniyor...</div>
  ) : (
    <AppContext.Provider
      value={{
        ...data,
        addTask: (item) => addItem("tasks", item, "tasks"),
        updateTask: (id, u) => updateItem("tasks", id, u, "tasks"),
        deleteTask: (id) => deleteItem("tasks", id, "tasks"),

        addPartner: (item) => addItem("partners", item, "partners"),
        deletePartner: (id) => deleteItem("partners", id, "partners"),
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

<AppContext.Provider value={{
  ...data,

  addTask, updateTask, deleteTask,
  addPartner, deletePartner,

  addCustomer,
  deleteCustomer
}}>

