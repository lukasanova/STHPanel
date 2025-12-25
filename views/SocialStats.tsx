import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Instagram, Linkedin, Globe, ArrowUp, ArrowDown, Minus, Save, Trash2, Calendar, TrendingUp, Users, Eye, Heart, MessageCircle, Share, Clock, Activity } from 'lucide-react';
import { SocialPlatform, SocialMetric } from '../types';

export const SocialStatsView: React.FC = () => {
  const { socialStats, updateSocialMetric, archiveSocialStats, socialHistory, deleteSocialHistory } = useData();
  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);

  // Büyüme yüzdesini hesapla
  const calculateGrowth = (current: number, last: number) => {
    if (last === 0) return 0;
    return ((current - last) / last) * 100;
  };

  // Metrik ikonunu getir
  const getMetricIcon = (metricName: string, size = 16) => {
    switch(metricName.toLowerCase()) {
      case 'görüntülenme':
      case 'ziyaretçi':
      case 'sayfa görüntülenmesi':
        return <Eye size={size} className="text-blue-500" />;
      case 'takipçi':
      case 'tepki':
      case 'beğeni':
        return <Users size={size} className="text-green-500" />;
      case 'yorum':
        return <MessageCircle size={size} className="text-purple-500" />;
      case 'paylaşım':
        return <Share size={size} className="text-orange-500" />;
      case 'büyüme':
        return <TrendingUp size={size} className="text-teal-500" />;
      case 'ortalama oturum süresi':
        return <Clock size={size} className="text-indigo-500" />;
      case 'hemen çıkma oranı':
        return <Activity size={size} className="text-red-500" />;
      default:
        return <TrendingUp size={size} className="text-gray-500" />;
    }
  };

  // Platform ikonunu getir
  const getPlatformIcon = (platform: string, size = 32) => {
    switch(platform) {
      case 'instagram': return <Instagram size={size} className="text-pink-600" />;
      case 'linkedin': return <Linkedin size={size} className="text-blue-700" />;
      case 'website': return <Globe size={size} className="text-slate-600" />;
      default: return null;
    }
  };

  // Sayıyı formatla
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sosyal Trafik Analizi</h2>
          <p className="text-slate-500">Dijital varlıkların haftalık performans takibi.</p>
        </div>
        <button 
          onClick={() => {
            if (window.confirm("Bu haftayı tamamlamak ve yeni haftaya başlamak istediğinize emin misiniz? Mevcut veriler geçmişe kaydedilecek.")) {
              archiveSocialStats();
            }
          }}
          className="bg-primary hover:bg-slate-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all shadow-lg hover:shadow-xl"
        >
          <Save size={20} />
          <span className="font-medium">Haftayı Tamamla ve Kaydet</span>
        </button>
      </div>

      {/* SOSYAL PLATFORM KARTLARI */}
      <div className="space-y-6 mb-12">
        {socialStats.map((platform: SocialPlatform) => {
          const isExpanded = expandedPlatform === platform.id;
          
          return (
            <div key={platform.id} className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden">
              {/* Platform Başlığı */}
              <div 
                className="p-6 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpandedPlatform(isExpanded ? null : platform.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    {getPlatformIcon(platform.platform, 28)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">{platform.name}</h3>
                    <p className="text-slate-500 text-sm">{platform.metrics.length} farklı metrik takip ediliyor</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${isExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {isExpanded ? 'Gizle' : 'Göster'}
                  </span>
                </div>
              </div>
              
              {/* Platform Metrikleri */}
              {isExpanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {platform.metrics.map((metric: SocialMetric) => {
                      const growth = calculateGrowth(metric.currentWeek, metric.lastWeek);
                      const isPositive = growth > 0;
                      const isNegative = growth < 0;
                      
                      return (
                        <div key={metric.name} className="border border-slate-200 rounded-lg p-4 bg-white hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              {getMetricIcon(metric.name, 20)}
                              <div>
                                <h4 className="font-semibold text-slate-800">{metric.name}</h4>
                                <p className="text-xs text-slate-500">{metric.unit}</p>
                              </div>
                            </div>
                            <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${isPositive ? 'bg-green-100 text-green-800' : isNegative ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                              {isPositive ? <ArrowUp size={12} /> : isNegative ? <ArrowDown size={12} /> : <Minus size={12} />}
                              <span className="ml-1">{Math.abs(growth).toFixed(1)}%</span>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {/* Bu Hafta */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-medium text-slate-600">Bu Hafta</label>
                                <span className="text-sm font-bold text-slate-800">{formatNumber(metric.currentWeek)} {metric.unit}</span>
                              </div>
                              <input 
                                type="number" 
                                min="0"
                                value={metric.currentWeek || ''}
                                onChange={(e) => updateSocialMetric(platform.id, metric.name, { currentWeek: Number(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Bu haftaki değeri girin"
                              />
                            </div>
                            
                            {/* Geçen Hafta */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-medium text-slate-600">Geçen Hafta</label>
                                <span className="text-sm font-bold text-slate-800">{formatNumber(metric.lastWeek)} {metric.unit}</span>
                              </div>
                              <input 
                                type="number" 
                                min="0"
                                value={metric.lastWeek || ''}
                                onChange={(e) => updateSocialMetric(platform.id, metric.name, { lastWeek: Number(e.target.value) || 0 })}
                                className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Geçen haftaki değeri girin"
                              />
                            </div>
                          </div>
                          
                          {/* Büyüme Detayı */}
                          <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="text-xs text-slate-600">
                              <span className="font-medium">Büyüme: </span>
                              {growth > 0 ? (
                                <span className="text-green-600">+{formatNumber(metric.currentWeek - metric.lastWeek)} {metric.unit} (%{growth.toFixed(1)})</span>
                              ) : growth < 0 ? (
                                <span className="text-red-600">-{formatNumber(Math.abs(metric.currentWeek - metric.lastWeek))} {metric.unit} (%{Math.abs(growth).toFixed(1)})</span>
                              ) : (
                                <span className="text-slate-500">Değişim yok</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Platform Toplam Özeti */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-2">Platform Özeti</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-800">
                          {platform.metrics.length}
                        </div>
                        <div className="text-xs text-slate-600">Takip Edilen Metrik</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {platform.metrics.filter(m => calculateGrowth(m.currentWeek, m.lastWeek) > 0).length}
                        </div>
                        <div className="text-xs text-slate-600">Pozitif Büyüme</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {platform.metrics.filter(m => calculateGrowth(m.currentWeek, m.lastWeek) < 0).length}
                        </div>
                        <div className="text-xs text-slate-600">Negatif Büyüme</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {platform.metrics.filter(m => calculateGrowth(m.currentWeek, m.lastWeek) === 0).length}
                        </div>
                        <div className="text-xs text-slate-600">Değişmeyen</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* GEÇMİŞ HAFTALAR */}
      {socialHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-xl font-bold text-slate-700 mb-6 flex items-center">
            <Calendar className="mr-3" size={24} /> 
            <span>Geçmiş Haftaların Kayıtları</span>
            <span className="ml-2 px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
              {socialHistory.length} hafta
            </span>
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Tarih</th>
                  <th className="px-6 py-4 font-semibold">Instagram</th>
                  <th className="px-6 py-4 font-semibold">LinkedIn</th>
                  <th className="px-6 py-4 font-semibold">Web Sitesi</th>
                  <th className="px-6 py-4 font-semibold text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {socialHistory.map(entry => {
                  // Instagram'ın ilk metriğini al (Görüntülenme)
                  const instagramEntry = entry.stats.find(s => s.platform === 'instagram');
                  const instagramMetric = instagramEntry?.metrics.find(m => m.name === 'Görüntülenme') || { currentWeek: 0, unit: '' };
                  
                  // LinkedIn'in ilk metriğini al (Görüntülenme)
                  const linkedinEntry = entry.stats.find(s => s.platform === 'linkedin');
                  const linkedinMetric = linkedinEntry?.metrics.find(m => m.name === 'Görüntülenme') || { currentWeek: 0, unit: '' };
                  
                  // Web Sitesinin ilk metriğini al (Ziyaretçi)
                  const websiteEntry = entry.stats.find(s => s.platform === 'website');
                  const websiteMetric = websiteEntry?.metrics.find(m => m.name === 'Ziyaretçi') || { currentWeek: 0, unit: '' };
                  
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-slate-400" />
                          {entry.date}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Instagram size={16} className="text-pink-600 mr-2" />
                          <span className="font-mono">{instagramMetric.currentWeek.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 ml-1">{instagramMetric.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Linkedin size={16} className="text-blue-700 mr-2" />
                          <span className="font-mono">{linkedinMetric.currentWeek.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 ml-1">{linkedinMetric.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Globe size={16} className="text-slate-600 mr-2" />
                          <span className="font-mono">{websiteMetric.currentWeek.toLocaleString()}</span>
                          <span className="text-xs text-slate-500 ml-1">{websiteMetric.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            if (window.confirm("Bu haftalık kaydı silmek istediğinize emin misiniz?")) {
                              deleteSocialHistory(entry.id);
                            }
                          }}
                          className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {socialHistory.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Calendar size={48} className="mx-auto mb-4 opacity-30" />
              <p>Henüz haftalık kayıt bulunmuyor.</p>
              <p className="text-sm mt-2">"Haftayı Tamamla ve Kaydet" butonuna tıklayarak ilk kaydınızı oluşturabilirsiniz.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};