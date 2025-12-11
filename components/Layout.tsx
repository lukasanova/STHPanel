import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Trophy, Briefcase, 
  Phone, StickyNote, Menu, X, PieChart, Calendar, Bell, Users2, Download, ExternalLink,
  DollarSign, FileText, Handshake, Library, BarChart2
} from 'lucide-react';
import { useData } from '../context/DataProvider';

interface SidebarItemProps {
  to: string;
  icon: any;
  label: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
      active ? 'bg-accent text-slate-900 shadow-md font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const data = useData();
  const { meetings } = data;
  const [upcomingCount, setUpcomingCount] = useState(0);

  // Check for upcoming meetings (within next 24 hours)
  useEffect(() => {
    const checkUpcoming = () => {
      const now = new Date();
      const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      const count = meetings.filter(m => {
        const meetingDate = new Date(`${m.date}T${m.time}`);
        return meetingDate > now && meetingDate < next24h;
      }).length;
      
      setUpcomingCount(count);
    };

    checkUpcoming();
    const interval = setInterval(checkUpcoming, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [meetings]);

  const navItems = [
    { path: '/', label: 'Görev Dağılımı', icon: LayoutDashboard },
    { path: '/customers', label: 'Müşteriler', icon: Users },
    { path: '/investors', label: 'Yatırımcılar', icon: PieChart },
    { path: '/finance', label: 'Finans & Gider', icon: DollarSign },
    { path: '/contracts', label: 'Sözleşmeler', icon: FileText },
    { path: '/partners', label: 'Partnerler', icon: Handshake },
    { path: '/library', label: 'Kütüphane', icon: Library },
    { path: '/social', label: 'Sosyal Trafik', icon: BarChart2 },
    { path: '/achievements', label: 'Başarılarımız', icon: Trophy },
    { path: '/meetings', label: 'Toplantılar', icon: Users2 },
    { path: '/services', label: 'Hizmet & Fiyatlar', icon: Briefcase },
    { path: '/events', label: 'Etkinlik Takvimi', icon: Calendar },
    { path: '/contacts', label: 'İletişim & Rehber', icon: Phone },
    { path: '/notes', label: 'Notlar', icon: StickyNote },
  ];

  const handleExport = () => {
    // Basic HTML Table based Excel export
    const createTable = (title: string, headers: string[], rows: any[][]) => {
      let table = `<h3>${title}</h3><table border="1"><thead><tr>`;
      headers.forEach(h => table += `<th>${h}</th>`);
      table += `</tr></thead><tbody>`;
      rows.forEach(row => {
        table += `<tr>`;
        row.forEach(cell => table += `<td>${cell || ''}</td>`);
        table += `</tr>`;
      });
      table += `</tbody></table><br/>`;
      return table;
    };

    let content = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"></head><body>
    `;

    // Tasks
    content += createTable('Görevler', ['Başlık', 'Sorumlu', 'Durum', 'Öncelik'], data.tasks.map(t => [t.title, t.assignee, t.status, t.priority]));
    // Customers
    content += createTable('Müşteriler', ['Tip', 'İsim', 'Kurum', 'İletişim', 'Hizmet', 'Başlangıç', 'Bitiş'], data.customers.map(c => [c.type, c.name, c.company, c.contactInfo, c.service, c.startDate, c.endDate]));
    // Finance
    content += createTable('Finans', ['Tarih', 'Kategori', 'Açıklama', 'Tutar'], data.expenses.map(e => [e.date, e.category, e.description, e.amount]));
    // Contracts
    content += createTable('Sözleşmeler', ['Kurum', 'Tip', 'Başlangıç', 'Bitiş', 'Durum'], data.contracts.map(c => [c.companyName, c.contractType, c.startDate, c.endDate, c.status]));
    // Partners
    content += createTable('Partnerler', ['İsim', 'Başlangıç', 'Uzmanlık', 'İletişim'], data.partners.map(p => [p.name, p.startDate, p.expertise, p.contactInfo]));
    // Meetings
    content += createTable('Toplantılar', ['Konu', 'Tarih', 'Saat', 'Katılımcılar'], data.meetings.map(m => [m.title, m.date, m.time, m.attendees]));
    // Investors
    content += createTable('Yatırımcılar', ['İsim', 'Durum', 'Tutar', 'Notlar'], data.investors.map(i => [i.name, i.status, i.potentialAmount, i.notes]));
    // Services
    content += createTable('Hizmetler', ['Hizmet Adı', 'Fiyat'], data.services.map(s => [s.name, s.price]));

    content += `</body></html>`;

    // Add BOM for UTF-8 support
    const blob = new Blob(['\uFEFF', content], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SolutionsThatHeal_Veri_${new Date().toISOString().slice(0,10)}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Notification Bell (Fixed Top Right) */}
      {upcomingCount > 0 && (
        <Link to="/meetings" className="fixed top-4 right-4 z-50 group">
          <div className="relative bg-white p-2 rounded-full shadow-lg border border-red-200 animate-pulse-custom cursor-pointer">
            <Bell className="text-red-600" size={24} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {upcomingCount}
            </span>
          </div>
          <div className="absolute top-12 right-0 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Yaklaşan Toplantı!
          </div>
        </Link>
      )}

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-primary text-white flex flex-col
        transform transition-transform duration-200 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-accent">Solutions That Heal</h1>
            <p className="text-xs text-slate-400">Yönetim Paneli</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.path} 
              to={item.path} 
              icon={item.icon} 
              label={item.label}
              active={location.pathname === item.path} 
            />
          ))}
        </nav>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700 space-y-3">
           <button 
            onClick={handleExport}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors shadow-lg"
          >
            <Download size={18} />
            <span className="text-sm font-medium">Excel İndir</span>
          </button>

          <a 
            href="https://docs.google.com/spreadsheets/d/1AiRG22UYDdG1EHwbtjlCK4M0B-NwlQ3L2vov9Yp53Fs/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors shadow-lg"
          >
            <ExternalLink size={18} />
            <span className="text-sm font-medium">STH Excel Dosyası</span>
          </a>

          <div className="mt-4 text-center text-xs text-slate-500">
            &copy; 2024 Solutions That Heal
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 lg:hidden shadow-sm z-10 justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-slate-600 hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="ml-4 font-semibold text-slate-700">Menü</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};