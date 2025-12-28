// types.ts - TAMAMEN GÜNCELLENMİŞ HALİ

// Görev Durumları
export type TaskStatus = 'beklemede' | 'devam-ediyor' | 'tamamlandi';
export type Priority = 'dusuk' | 'orta' | 'yuksek';

// Görev arayüzü
export interface Task {
  id: string;
  name: string;
  assignee: string;
  due_date: string;
  status: TaskStatus;
  priority?: Priority;
}

export interface Investor {
  id: string;
  name: string;
  contactInfo: string;
  status: 'potansiyel' | 'gorusuldu' | 'red' | 'anlasildi';
  potentialAmount: string;
  notes: string;
}

export interface Achievement {
  id: string;
  date: string;
  title: string;
  impact: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  target: 'otel' | 'hastane' | 'diger';
  description: string;
  features: string[];
}

export interface CorporatePricing {
  id: string;
  size: string;
  description: string;
  basePrice: number;
  adjustment: number;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  description: string;
  participants: string[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: string[];
  agenda: string;
  notes: string;
  status: string;
}

export type CustomerType = 'potansiyel' | 'mevcut' | 'onceki';

export interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  company: string;
  contactInfo: string;
  service: string;
  startDate?: string;
  endDate?: string;
  invoiceFile?: string;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  invoiceFile?: string;
  invoiceUrl?: string;
}

export interface Income {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  invoiceFile?: string;
  invoiceUrl?: string;
}

export interface Contract {
  id: string;
  companyName: string;
  contractType: string;
  startDate: string;
  endDate: string;
  status: 'aktif' | 'bitti' | 'yenilenecek';
  contractFile?: string;
  contractUrl?: string;
}

export interface Partner {
  id: string;
  name: string;
  startDate: string;
  contactInfo: string;
  expertise: string;
}

export type DocCategory = 'sablon' | 'hukuk' | 'rapor' | 'marka';

export interface LibraryItem {
  id: string;
  title: string;
  category: DocCategory;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  dateAdded: string;
}

export interface SocialMetric {
  name: string;
  currentWeek: number;
  lastWeek: number;
  unit?: string;
}

export interface SocialPlatform {
  id: string;
  platform: 'instagram' | 'linkedin' | 'website';
  name: string;
  metrics: SocialMetric[];
}

export interface SocialHistoryEntry {
  id: string;
  date: string;
  stats: SocialPlatform[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  color: string;
  assignee: string;
  type: 'meeting' | 'task' | 'event' | 'reminder';
}

// App State Context Interface
export interface AppData {
  tasks: Task[];
  investors: Investor[];
  achievements: Achievement[];
  services: ServiceItem[];
  packages: ServicePackage[];
  corporatePricing: CorporatePricing[];
  contacts: Contact[];
  notes: Note[];
  events: Event[];
  meetings: Meeting[];
  customers: Customer[];
  expenses: Expense[];
  incomes: Income[];
  contracts: Contract[];
  partners: Partner[];
  library: LibraryItem[];
  socialStats: SocialPlatform[];
  socialHistory: SocialHistoryEntry[];
  calendarEvents: CalendarEvent[];
}

export interface AppContextType extends AppData {
  addTask: (task: Omit<Task, 'id'>) => Promise<any>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<any>;
  deleteTask: (id: string) => Promise<void>;
  
  addInvestor: (investor: Omit<Investor, 'id'>) => Promise<any>;
  deleteInvestor: (id: string) => Promise<void>;

  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  deleteAchievement: (id: string) => void;

  addService: (service: Omit<ServiceItem, 'id'>) => Promise<any>;
  deleteService: (id: string) => Promise<void>;

  addPackage: (pkg: Omit<ServicePackage, 'id'>) => Promise<any>;
  deletePackage: (id: string) => Promise<void>;

  updateCorporatePricing: (id: string, data: Partial<CorporatePricing>) => void;

  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;

  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;

  addEvent: (event: Omit<Event, 'id'>) => Promise<any>;
  deleteEvent: (id: string) => Promise<void>;

  addMeeting: (meeting: Omit<Meeting, 'id'>) => Promise<any>;
  deleteMeeting: (id: string) => Promise<void>;

  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<any>;
  deleteCustomer: (id: string) => Promise<void>;

  addExpense: (item: Omit<Expense, 'id'> & { file?: File }) => Promise<any>;
  deleteExpense: (id: string) => Promise<void>;

  addIncome: (item: Omit<Income, 'id'> & { file?: File }) => Promise<any>;
  deleteIncome: (id: string) => Promise<void>;

  addContract: (item: Omit<Contract, 'id'> & { file?: File }) => Promise<any>;
  deleteContract: (id: string) => Promise<void>;

  addPartner: (item: Omit<Partner, 'id'>) => Promise<any>;
  deletePartner: (id: string) => Promise<void>;

  addLibraryItem: (item: Omit<LibraryItem, 'id' | 'dateAdded'> & { file?: File }) => Promise<any>;
  deleteLibraryItem: (id: string) => Promise<void>;

  updateSocialMetric: (platformId: string, metricName: string, updates: { currentWeek?: number, lastWeek?: number }) => void;
  archiveSocialStats: () => void;
  deleteSocialHistory: (id: string) => Promise<void>;

  addCalendarEvent: (item: Omit<CalendarEvent, 'id'>) => Promise<any>;
  updateCalendarEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<any>;
  deleteCalendarEvent: (id: string) => Promise<void>;
}