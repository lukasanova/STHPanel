// types.ts - GÜNCELLENMİŞ HALİ
// Görev Durumları
export type TaskStatus = 'beklemede' | 'devam-ediyor' | 'tamamlandi';
export type Priority = 'dusuk' | 'orta' | 'yuksek';

export interface Task {
  id: string;
  title: string;
  assignee: string; // Görevli kişi
  dueDate: string;
  status: TaskStatus;
  priority: Priority;
  description?: string;
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
  impact: string; // Yarattığı etki
}

export interface ServiceItem {
  id: string;
  name: string;
  category: string; 
  price: number;
}

export interface ServicePackage {
  id: string;
  name: string;
  target: 'otel' | 'hastane' | 'diger';
  description: string;
  price: number;
  features: string[];
}

export interface CorporatePricing {
  id: string;
  size: 'kucuk' | 'orta' | 'buyuk' | 'kurumsal';
  basePrice: number;
  adjustment: number; // Percentage (+20 for increase, -10 for discount)
  description: string;
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  phone: string; // WhatsApp için
  email: string;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description?: string;
  url?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  attendees: string;
  description?: string;
}

export type CustomerType = 'potansiyel' | 'mevcut' | 'onceki';

export interface Customer {
  id: string;
  type: CustomerType;
  name: string; // Kişi Adı
  company: string; // Kurum Adı
  contactInfo: string;
  service: string; // Potansiyel veya Verilen Hizmet
  startDate?: string;
  endDate?: string; // Bitiş veya Sonlandırma Tarihi
  invoiceFile?: string; // Dosya adı simülasyonu
}

// --- NEW TYPES ---

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  invoiceFile?: string; // Dosya adı
  invoiceUrl?: string; // ✅ FATURA URL'Sİ EKLENDİ
}

export interface Contract {
  id: string;
  companyName: string;
  contractType: string;
  startDate: string;
  endDate: string;
  status: 'aktif' | 'bitti' | 'yenilenecek';
  contractFile?: string; // Dosya adı
  contractUrl?: string; // ✅ DOSYA URL'Sİ
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
  fileName?: string; // Link or file name
  fileUrl?: string; // ✅ GERÇEK DOSYA URL'Sİ EKLENDİ
  dateAdded: string;
}

export interface SocialMetric {
  name: string;
  currentWeek: number;
  lastWeek: number;
  unit?: string; // 'takipçi', 'görüntülenme', 'tepki', vb.
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
  events: EventItem[];
  meetings: Meeting[];
  customers: Customer[];
  
  // New Data Arrays
  expenses: Expense[];
  contracts: Contract[];
  partners: Partner[];
  library: LibraryItem[];
  socialStats: SocialMetric[];
  socialHistory: SocialHistoryEntry[];
}

export interface AppContextType extends AppData {
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addInvestor: (investor: Omit<Investor, 'id'>) => void;
  deleteInvestor: (id: string) => void;

  addAchievement: (achievement: Omit<Achievement, 'id'>) => void;
  deleteAchievement: (id: string) => void;

  addService: (service: Omit<ServiceItem, 'id'>) => void;
  deleteService: (id: string) => void;

  addPackage: (pkg: Omit<ServicePackage, 'id'>) => void;
  deletePackage: (id: string) => void;

  updateCorporatePricing: (id: string, data: Partial<CorporatePricing>) => void;

  addContact: (contact: Omit<Contact, 'id'>) => void;
  deleteContact: (id: string) => void;

  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;

  addEvent: (event: Omit<EventItem, 'id'>) => void;
  deleteEvent: (id: string) => void;

  addMeeting: (meeting: Omit<Meeting, 'id'>) => void;
  deleteMeeting: (id: string) => void;

  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  deleteCustomer: (id: string) => void;

  // New Actions - GÜNCELLENDİ
  addExpense: (item: Omit<Expense, 'id'> & { file?: File }) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  addContract: (item: Omit<Contract, 'id'>) => void;
  deleteContract: (id: string) => void;

  addPartner: (item: Omit<Partner, 'id'>) => void;
  deletePartner: (id: string) => void;

  // ✅ DOSYA YÜKLEME DESTEĞİ EKLENDİ
  addLibraryItem: (item: Omit<LibraryItem, 'id' | 'dateAdded'> & { file?: File }) => Promise<LibraryItem | null>;
  deleteLibraryItem: (id: string) => Promise<void>;

  updateSocialMetric: (platform: string, data: Partial<SocialMetric>) => void;
  
  // Save current stats to history
  archiveSocialStats: () => void;
  deleteSocialHistory: (id: string) => void;
}

// Görev durumları
export type TaskStatus = "beklemede" | "devam-ediyor" | "tamamlandi";

// Görev öncelikleri
export type Priority = "dusuk" | "orta" | "yuksek";

// Görev arayüzü
export interface Task {
  id: string;
  name: string;
  assignee: string;
  due_date: string;
  status: TaskStatus;
  priority?: Priority; // İsteğe bağlı
}