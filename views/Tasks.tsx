import React, { useState } from "react";
import { useData } from "../context/DataProvider";
import { Plus, Trash2, AlertCircle, Calendar, User, CheckCircle, Clock, XCircle } from "lucide-react";
import { TaskStatus } from "../types";

export const TasksView: React.FC = () => {
  const { tasks = [], addTask, updateTask, deleteTask } = useData();

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    assignee: "",
    due_date: "",
    status: "beklemede" as TaskStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTask.name.trim() || !newTask.assignee.trim()) {
      alert("Lütfen görev adı ve sorumlu alanlarını doldurun!");
      return;
    }
    
    addTask(newTask);
    setShowModal(false);

    setNewTask({
      name: "",
      assignee: "",
      due_date: "",
      status: "beklemede",
    });
  };

  // Tarihi DD-MM-YYYY formatına çevir
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}-${month}-${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Duruma göre renk ve ikon
  const getStatusConfig = (status: TaskStatus) => {
    switch (status) {
      case "tamamlandi":
        return {
          color: "text-green-600 bg-green-50 border-green-200",
          icon: <CheckCircle size={14} className="text-green-600" />,
          label: "Tamamlandı"
        };
      case "devam-ediyor":
        return {
          color: "text-blue-600 bg-blue-50 border-blue-200",
          icon: <Clock size={14} className="text-blue-600" />,
          label: "Devam Ediyor"
        };
      case "beklemede":
      default:
        return {
          color: "text-yellow-600 bg-yellow-50 border-yellow-200",
          icon: <AlertCircle size={14} className="text-yellow-600" />,
          label: "Beklemede"
        };
    }
  };

  // Bugünden önceki tarihleri kırmızı yap
  const isOverdue = (dateString: string) => {
    if (!dateString) return false;
    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Görevler</h2>
          <p className="text-slate-500">Tüm görevlerinizi takip edin ve yönetin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-slate-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={18} />
          <span className="font-semibold">Görev Ekle</span>
        </button>
      </div>

      {/* Görev Tablosu */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-600 font-semibold">
                <th className="text-left p-4">Görev</th>
                <th className="text-left p-4">Sorumlu</th>
                <th className="text-left p-4">Son Tarih</th>
                <th className="text-left p-4">Durum</th>
                <th className="text-left p-4">İşlem</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <AlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-lg">Henüz görev eklenmemiş</p>
                    <p className="text-sm mt-2">Yeni görev eklemek için "Görev Ekle" butonuna tıklayın</p>
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const statusConfig = getStatusConfig(task.status);
                  const overdue = isOverdue(task.due_date);
                  
                  return (
                    <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-slate-800">{task.name}</div>
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-slate-400" />
                          <span className="text-slate-700">{task.assignee || "-"}</span>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        {task.due_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className={overdue ? "text-red-400" : "text-slate-400"} />
                            <span className={`font-medium ${overdue ? "text-red-600" : "text-slate-700"}`}>
                              {formatDate(task.due_date)}
                            </span>
                            {overdue && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                Geçmiş
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">Belirtilmemiş</span>
                        )}
                      </td>
                      
                      <td className="p-4">
                        <div className="flex items-center">
                          <select
                            value={task.status}
                            onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${statusConfig.color}`}
                          >
                            <option value="beklemede">Beklemede</option>
                            <option value="devam-ediyor">Devam Ediyor</option>
                            <option value="tamamlandi">Tamamlandı</option>
                          </select>
                        </div>
                      </td>
                      
                      <td className="p-4">
                        <button
                          onClick={() => {
                            if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
                              deleteTask(task.id);
                            }
                          }}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Görevi Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Yeni Görev Ekle</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Görev Adı *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örnek: En az 2 klinik ile anlaş"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sorumlu Kişi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örnek: Batu"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Son Tarih
                </label>
                <input
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-slate-500 mt-1">
                  DD-MM-YYYY formatında tarih seçebilirsiniz
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Durum
                </label>
                <select
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value as TaskStatus })}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="beklemede">Beklemede</option>
                  <option value="devam-ediyor">Devam Ediyor</option>
                  <option value="tamamlandi">Tamamlandı</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-300 text-slate-700 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors font-semibold"
                >
                  Görevi Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};