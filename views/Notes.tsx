import React, { useState } from 'react';
import { useData } from '../context/DataProvider';
import { Plus, X } from 'lucide-react';

export const NotesView: React.FC = () => {
  const { notes, addNote, deleteNote } = useData();
  const [text, setText] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    addNote({ content: text });
    setText('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Genel Notlar</h2>
      
      <div className="mb-8 relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 pr-16 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none h-32 resize-none shadow-sm text-slate-700 placeholder-yellow-700/50"
          placeholder="Buraya hızlıca bir not alın..."
        />
        <button 
          onClick={handleAdd}
          className="absolute bottom-4 right-4 bg-yellow-500 text-white p-2 rounded-full shadow-lg hover:bg-yellow-600 transition-transform hover:scale-110"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {notes.map(note => (
          <div key={note.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group">
            <button 
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
            <p className="text-slate-700 whitespace-pre-wrap">{note.content}</p>
            <div className="mt-4 text-xs text-slate-400 border-t pt-2">
              {new Date(note.createdAt).toLocaleString('tr-TR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};