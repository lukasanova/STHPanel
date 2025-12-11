import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, Building2, Stethoscope, Briefcase, CheckCircle, Tag } from 'lucide-react';
import { ServiceItem } from '../types';

export const ServicesView: React.FC = () => {
  const { services, packages, corporatePricing, addService, deleteService, addPackage, deletePackage, updateCorporatePricing } = useData();
  const [activeTab, setActiveTab] = useState<'katalog' | 'hizmetler' | 'kurumsal'>('katalog');

  // --- States for New Package ---
  const [newPackage, setNewPackage] = useState({ 
    name: '', 
    price: 0, 
    target: 'otel' as 'otel' | 'hastane', 
    description: '',
    featuresText: '' // Will split by line
  });

  // --- States for New Service ---
  const [newService, setNewService] = useState({ 
    name: '', 
    price: 0, 
    category: ''
  });

  const handleAddPackage = () => {
    if (!newPackage.name || !newPackage.price) return;
    const featuresList = newPackage.featuresText.split('\n').filter(line => line.trim() !== '');
    addPackage({
      name: newPackage.name,
      price: newPackage.price,
      target: newPackage.target,
      description: newPackage.description,
      features: featuresList
    });
    setNewPackage({ name: '', price: 0, target: 'otel', description: '', featuresText: '' });
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price || !newService.category) return;
    addService({
        name: newService.name,
        price: newService.price,
        category: newService.category
    });
    setNewService({ name: '', price: 0, category: '' });
  };

  // Group Services by Category
  const groupedServices = services.reduce((groups, service) => {
    const category = service.category || 'Diğer';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(service);
    return groups;
  }, {} as Record<string, ServiceItem[]>);

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Hizmetler ve Fiyatlandırma</h2>
      <p className="text-slate-500 mb-6">Paketler, tekil hizmet fiyatları ve kurumsal anlaşma koşulları.</p>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200 p-1 rounded-lg mb-6 w-fit">
        <button onClick={() => setActiveTab('katalog')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'katalog' ? 'bg-white text-primary shadow' : 'text-slate-600 hover:text-slate-900'}`}>
          Paket Kataloğu (Otel/Hastane)
        </button>
        <button onClick={() => setActiveTab('hizmetler')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'hizmetler' ? 'bg-white text-primary shadow' : 'text-slate-600 hover:text-slate-900'}`}>
          Tekil Hizmet Fiyatları
        </button>
        <button onClick={() => setActiveTab('kurumsal')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'kurumsal' ? 'bg-white text-primary shadow' : 'text-slate-600 hover:text-slate-900'}`}>
          Kurumsal Fiyatlandırma
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
        
        {/* CATALOG TAB */}
        {activeTab === 'katalog' && (
          <div>
             <div className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
               <h3 className="font-bold text-slate-700 mb-4 flex items-center"><Plus size={18} className="mr-2"/> Yeni Paket Oluştur</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Paket Adı</label>
                   <input type="text" value={newPackage.name} onChange={e => setNewPackage({...newPackage, name: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none" placeholder="Örn: VIP Denetim" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Fiyat (TL)</label>
                   <input type="number" value={newPackage.price} onChange={e => setNewPackage({...newPackage, price: Number(e.target.value)})} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">Hedef Kitle</label>
                   <select value={newPackage.target} onChange={e => setNewPackage({...newPackage, target: e.target.value as any})} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none">
                     <option value="otel">Otel</option>
                     <option value="hastane">Hastane</option>
                     <option value="diger">Diğer</option>
                   </select>
                 </div>
               </div>
               <div className="mb-4">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Paket İçeriği (Her satıra bir özellik yazın)</label>
                   <textarea 
                    value={newPackage.featuresText} 
                    onChange={e => setNewPackage({...newPackage, featuresText: e.target.value})} 
                    className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Örn:
Süreç Analizi
Gizli Müşteri Uygulaması
Yönetim Raporlaması..."
                   ></textarea>
               </div>
               <div className="mb-4">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Kısa Açıklama</label>
                   <input type="text" value={newPackage.description} onChange={e => setNewPackage({...newPackage, description: e.target.value})} className="w-full p-2 border rounded focus:ring-2 focus:ring-primary outline-none" placeholder="Paketin genel amacı..." />
               </div>
               <div className="flex justify-end">
                   <button onClick={handleAddPackage} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors shadow-lg">Paketi Kaydet</button>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {packages.map(pkg => (
                 <div key={pkg.id} className={`border-2 rounded-xl p-6 relative overflow-hidden transition-all hover:shadow-lg ${pkg.target === 'otel' ? 'border-blue-100 bg-blue-50/20' : 'border-red-100 bg-red-50/20'}`}>
                   <div className={`absolute top-0 right-0 p-3 rounded-bl-xl ${pkg.target === 'otel' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                     {pkg.target === 'otel' ? <Building2 size={24} /> : <Stethoscope size={24} />}
                   </div>
                   
                   <h3 className="font-bold text-xl text-slate-800 pr-12">{pkg.name}</h3>
                   <div className="text-sm text-slate-500 mb-4">{pkg.description}</div>
                   
                   <div className="text-3xl font-extrabold text-primary mb-6">{pkg.price.toLocaleString('tr-TR')} ₺</div>
                   
                   <div className="space-y-2 mb-6">
                       {Array.isArray(pkg.features) && pkg.features.length > 0 ? (pkg.features as string[]).map((feature, idx) => (
                           <div key={idx} className="flex items-start text-sm text-slate-700">
                               <CheckCircle size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                               <span>{feature}</span>
                           </div>
                       )) : <div className="text-slate-400 text-sm italic">İçerik girilmemiş.</div>}
                   </div>

                   <button onClick={() => deletePackage(pkg.id)} className="absolute bottom-4 right-4 text-xs text-red-400 hover:text-red-600 flex items-center bg-white px-2 py-1 rounded border border-red-100"><Trash2 size={12} className="mr-1"/> Paketi Sil</button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* INDIVIDUAL SERVICES TAB */}
        {activeTab === 'hizmetler' && (
          <div>
            <div className="mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Hizmet Adı</label>
                  <input type="text" placeholder="Örn: SWOT Analizi" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="w-full md:w-64">
                   <label className="block text-xs font-bold text-slate-500 mb-1">Kategori</label>
                   <input list="categories" placeholder="Kategori Seçin veya Yazın" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
                   <datalist id="categories">
                       {Object.keys(groupedServices).map(cat => <option key={cat} value={cat} />)}
                   </datalist>
              </div>
              <div className="w-full md:w-32">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Fiyat (TL)</label>
                  <input type="number" placeholder="0" value={newService.price} onChange={e => setNewService({...newService, price: Number(e.target.value)})} className="w-full border p-2 rounded focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <button onClick={handleAddService} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-slate-700 w-full md:w-auto">Ekle</button>
            </div>

            <div className="space-y-8">
                {Object.entries(groupedServices).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center border-b pb-2">
                            <Tag size={20} className="mr-2 text-primary"/>
                            {category}
                        </h3>
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {(items as ServiceItem[]).map(s => (
                                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                                    <td className="py-3 px-4 text-slate-700 font-medium">{s.name}</td>
                                    <td className="py-3 px-4 font-mono text-slate-800 text-right">{s.price.toLocaleString('tr-TR')} ₺</td>
                                    <td className="py-3 px-4 text-right w-16">
                                    <button onClick={() => deleteService(s.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* CORPORATE PRICING TAB */}
        {activeTab === 'kurumsal' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {corporatePricing.map(corp => {
                const finalPrice = corp.basePrice * (1 + (corp.adjustment / 100));
                const isDiscount = corp.adjustment < 0;
                const isIncrease = corp.adjustment > 0;

                return (
                <div key={corp.id} className="border-2 border-slate-100 rounded-xl p-6 text-center hover:border-primary transition-colors bg-white shadow-sm">
                  <Briefcase size={32} className="mx-auto text-slate-400 mb-4" />
                  <h3 className="font-bold text-lg uppercase tracking-wide text-slate-700">{corp.size} İşletme</h3>
                  <p className="text-xs text-slate-400 mb-6">{corp.description}</p>
                  
                  <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 mb-1">Paket Baz Fiyatı (TL)</label>
                    <input 
                      type="number" 
                      value={corp.basePrice}
                      onChange={(e) => updateCorporatePricing(corp.id, { basePrice: Number(e.target.value) })}
                      className="text-center font-bold text-xl text-slate-600 border border-slate-200 rounded p-2 w-full focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                   <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-500 mb-1">İndirim / Zam (%)</label>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-slate-400">-%</span>
                        <input 
                        type="number" 
                        value={corp.adjustment}
                        onChange={(e) => updateCorporatePricing(corp.id, { adjustment: Number(e.target.value) })}
                        className={`text-center font-bold border rounded p-2 w-20 focus:outline-none ${isDiscount ? 'text-green-600 border-green-200 bg-green-50' : isIncrease ? 'text-red-600 border-red-200 bg-red-50' : 'text-slate-600 border-slate-200'}`}
                        placeholder="0"
                        />
                        <span className="text-xs text-slate-400">+%</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Negatif değer indirim, pozitif değer zam yapar.</p>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                    <span className="block text-xs text-primary font-bold uppercase mb-1">Satış Fiyatı</span>
                    <span className="text-2xl font-extrabold text-primary">{finalPrice.toLocaleString('tr-TR')} ₺</span>
                    {corp.adjustment !== 0 && (
                        <div className="mt-1 text-xs font-semibold">
                            {isDiscount ? <span className="text-green-600">({corp.adjustment}% İndirim Uygulandı)</span> : <span className="text-red-600">(+{corp.adjustment}% Zam Uygulandı)</span>}
                        </div>
                    )}
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};