import React, { useState } from "react";
import { useData } from "../context/DataProvider";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { TaskStatus, Priority } from "../types";

export const TasksView: React.FC = () => {
  // ❗ tasks = [] diyerek hata engellenir
  const { tasks = [], addTask, updateTask, deleteTask } = useData();

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    assignee: "",
    due_date: "",
    status: "beklemede" as TaskStatus,
    priority: "orta" as Priority,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask(newTask);
    setShowModal(false);

    setNewTask({
      name: "",
      assignee: "",
      due_date: "",
      status: "beklemede",
      priority: "orta",
    });
  };

  const getPriorityColor = (p: Priority) => {
    if (p === "yuksek") return "text-red-600";
    if (p === "orta") return "text-orange-500";
    return "text-green-500";
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const weight = { yuksek: 3, orta: 2, dusuk: 1 };
    return weight[b.priority] - weight[a.priority];
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Görevler</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Görev Ekle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Görev</th>
              <th>Sorumlu</th>
              <th>Son Tarih</th>
              <th>Öncelik</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {sortedTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.name}</td>
                <td>{task.assignee}</td>
                <td>{task.due_date || "-"}</td>

                <td className={`font-semibold ${getPriorityColor(task.priority)}`}>
                  <AlertCircle size={14} className="inline mr-1" />
                  {task.priority.toUpperCase()}
                </td>

                <td>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTask(task.id, { status: e.target.value as TaskStatus })
                    }
                  >
                    <option value="beklemede">Beklemede</option>
                    <option value="devam-ediyor">Devam Ediyor</option>
                    <option value="tamamlandi">Tamamlandı</option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px]">
            <h3 className="text-xl font-bold mb-4">Yeni Görev Ekle</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Görev Adı"
                value={newTask.name}
                onChange={(e) =>
                  setNewTask({ ...newTask, name: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="text"
                required
                placeholder="Sorumlu"
                value={newTask.assignee}
                onChange={(e) =>
                  setNewTask({ ...newTask, assignee: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <input
                type="date"
                value={newTask.due_date}
                onChange={(e) =>
                  setNewTask({ ...newTask, due_date: e.target.value })
                }
                className="w-full border p-2 rounded"
              />

              <button className="bg-primary text-white px-4 py-2 rounded-lg">
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
