import React from 'react';
import { useData } from '../context/DataProvider';
import { Instagram, Linkedin, Globe, ArrowUp, ArrowDown, Minus, Save, Trash2, Calendar } from 'lucide-react';

export const SocialStatsView: React.FC = () => {
  const { socialStats, updateSocialMetric, archiveSocialStats, socialHistory, deleteSocialHistory } = useData();

  const calculateChange = (current: number, last: number) => {
    if (last === 0) return 0;
    return ((current - last) / last) * 100;
  };

  const getPlatformIcon = (platform: string, size=32) => {
      switch(platform) {
          case 'instagram': return <Instagram size={size} className="text-pink-600" />;
          case 'linkedin': return <Linkedin size={size} className="text-blue-700" />;
          case 'website': return <Globe size={size} className="text-slate-600" />;
          default: return null;
      }
  };

  const getPlatformName = (platform: string) => {
      switch(platform) {
          case 'instagram': return 'Instagram';
          case 'linkedin': return 'LinkedIn';
          case 'website': return 'Web Sitesi';
          default: return platform;
      }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sosyal Trafik Analizi</h2>
          <p className="text-slate-500">Dijital varlıkların haftalık performans takibi.</p>
        </div>
        <button 
          onClick={archiveSocialStats}
          className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        >
           <Save size={18} />
           <span>Haftayı Tamamla ve Kaydet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {socialStats.map((stat) => {
              const change = calculateChange(stat.currentWeek, stat.lastWeek);
              const isPositive = change > 0;
              const isNegative = change < 0;

              return (
                  <div key={stat.platform} className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                          <h3 className="font-bold text-xl text-slate-700">{getPlatformName(stat.platform)}</h3>
                          <div className="bg-white p-2 rounded-lg shadow-sm">
                            {getPlatformIcon(stat.platform)}
                          </div>
                      </div>
                      
                      <div className="p-6">
                          <div className="flex items-end justify-between mb-8">
                              <div>
                                  <div className="text-4xl font-extrabold text-slate-800">{stat.currentWeek.toLocaleString()}</div>
                                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Bu Hafta Görüntülenme</div>
                              </div>
                              <div className={`flex flex-col items-end ${isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-slate-400'}`}>
                                  <div className="flex items-center text-lg font-bold">
                                      {isPositive ? <ArrowUp size={20} /> : isNegative ? <ArrowDown size={20} /> : <Minus size={20} />}
                                      <span className="ml-1">%{Math.abs(change).toFixed(1)}</span>
                                  </div>
                                  <span className="text-[10px] font-medium opacity-80">Geçen Haftaya Göre</span>
                              </div>
                          </div>

                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Bu Hafta Verisi</label>
                                  <input 
                                    type="number" 
                                    value={stat.currentWeek} 
                                    onChange={(e) => updateSocialMetric(stat.platform, { currentWeek: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold font-mono focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Geçen Hafta Verisi</label>
                                  <input 
                                    type="number" 
                                    value={stat.lastWeek} 
                                    onChange={(e) => updateSocialMetric(stat.platform, { lastWeek: Number(e.target.value) })}
                                    className="w-full bg-white border border-slate-300 rounded p-2 text-slate-900 font-bold font-mono focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
              );
          })}
      </div>

      {/* History Section */}
      {socialHistory.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
                <Calendar className="mr-2" size={24} /> Geçmiş Haftaların Kayıtları
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Instagram</th>
                            <th className="px-6 py-4">LinkedIn</th>
                            <th className="px-6 py-4">Web Sitesi</th>
                            <th className="px-6 py-4 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {socialHistory.map(entry => {
                            const insta = entry.stats.find(s => s.platform === 'instagram')?.currentWeek || 0;
                            const linked = entry.stats.find(s => s.platform === 'linkedin')?.currentWeek || 0;
                            const web = entry.stats.find(s => s.platform === 'website')?.currentWeek || 0;
                            
                            return (
                                <tr key={entry.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-bold text-slate-700">{entry.date}</td>
                                    <td className="px-6 py-4 flex items-center text-slate-800">
                                        {getPlatformIcon('instagram', 16)} 
                                        <span className="ml-2 font-mono">{insta.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-800">
                                        <div className="flex items-center">
                                            {getPlatformIcon('linkedin', 16)}
                                            <span className="ml-2 font-mono">{linked.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-800">
                                        <div className="flex items-center">
                                            {getPlatformIcon('website', 16)}
                                            <span className="ml-2 font-mono">{web.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => deleteSocialHistory(entry.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
          </div>
      )}
    </div>
  );
};