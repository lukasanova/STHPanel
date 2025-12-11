import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { TaskStatus, Priority } from '../types';

export const TasksView: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', assignee: '', dueDate: '', status: 'beklemede' as TaskStatus, priority: 'orta' as Priority
  });

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  addTask({
    name: newTask.title,
    assignee: newTask.assignee,
    due_date: newTask.dueDate,
    status: newTask.status,
    priority: newTask.priority
  });

  setShowModal(false);
  setNewTask({ 
    title: '', 
    assignee: '', 
    dueDate: '', 
    status: 'beklemede', 
    priority: 'orta' 
  });
};

  const getStatusColor = (status: TaskStatus) => {
    switch(status) {
      case 'tamamlandi': return 'bg-green-100 text-green-800 border-green-200';
      case 'devam-ediyor': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (p: Priority) => {
    switch(p) {
      case 'yuksek': return 'text-red-600';
      case 'orta': return 'text-orange-500';
      default: return 'text-green-500';
    }
  };

  const getPriorityWeight = (p: Priority) => {
    if (p === 'yuksek') return 3;
    if (p === 'orta') return 2;
    return 1;
  };

  // Sort tasks: High priority first, then Medium, then Low
  const sortedTasks = [...tasks].sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Haftalık Görev Tablosu</h2>
          <p className="text-slate-500">Ekip içi görev dağılımı ve takibi. (Öncelik Sıralı)</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        >
          <Plus size={18} />
          <span>Yeni Görev</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Görev</th>
                <th className="px-6 py-4">Sorumlu</th>
                <th className="px-6 py-4">Son Tarih</th>
                <th className="px-6 py-4">Öncelik</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    Henüz görev eklenmemiş.
                  </td>
                </tr>
              ) : sortedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{task.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                      {task.assignee.charAt(0).toUpperCase()}
                    </span>
                    <span className="ml-2 text-slate-600">{task.assignee}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{task.due_date || '-'}</td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center font-medium ${getPriorityColor(task.priority)}`}>
                      <AlertCircle size={14} className="mr-1" />
                      {task.priority.toUpperCase()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={task.status}
                      onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300 ${getStatusColor(task.status)}`}
                    >
                      <option value="beklemede">Beklemede</option>
                      <option value="devam-ediyor">Devam Ediyor</option>
                      <option value="tamamlandi">Tamamlandı</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                      title="Görevi Sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Yeni Görev Ekle</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Görev Başlığı</label>
                <input 
                  required
                  type="text" 
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Örn: X Firması Sunumu"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sorumlu Kişi</label>
                  <input 
                    required
                    type="text" 
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="İsim"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Son Tarih</label>
                  <input 
                    type="date" 
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Öncelik</label>
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as Priority})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="dusuk">Düşük</option>
                    <option value="orta">Orta</option>
                    <option value="yuksek">Yüksek</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
                  <select 
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value as TaskStatus})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="beklemede">Beklemede</option>
                    <option value="devam-ediyor">Devam Ediyor</option>
                    <option value="tamamlandi">Tamamlandı</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};