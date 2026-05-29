import { useEffect, useState } from 'react';
import { listTodos, createTodo, updateTodo, deleteTodo } from './api/todos';
import KanbanBoard from './components/KanbanBoard';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    listTodos().then(setTodos).catch(() => setError('Failed to load todos'));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const todo = await createTodo(title.trim(), priority ? 1 : 0);
      setTodos(prev => [todo, ...prev]);
      setTitle('');
      setPriority(false);
    } catch {
      setError('Failed to create todo');
    }
  }

  async function handleDrop(id, newStatus) {
    const todo = todos.find(t => t.id === id);
    if (!todo || todo.status === newStatus) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    try {
      await updateTodo(id, { status: newStatus });
    } catch {
      setTodos(prev => prev.map(t => t.id === id ? { ...t, status: todo.status } : t));
      setError('Failed to update status');
    }
  }

  async function handleDelete(id) {
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await deleteTodo(id);
    } catch {
      setError('Failed to delete todo');
    }
  }

  async function handleTogglePriority(todo) {
    const newPriority = todo.priority ? 0 : 1;
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, priority: newPriority } : t));
    try {
      await updateTodo(todo.id, { priority: newPriority });
    } catch {
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, priority: todo.priority } : t));
      setError('Failed to update priority');
    }
  }

  return (
    <div>
      <header style={{ background: '#fff', padding: '16px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Todo Board</h1>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="New todo..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14 }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={priority} onChange={e => setPriority(e.target.checked)} />
            Priority
          </label>
          <button
            type="submit"
            style={{ padding: '8px 16px', borderRadius: 6, background: '#3b82f6', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            Add
          </button>
        </form>
        {error && (
          <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>{error}</p>
        )}
      </header>
      <KanbanBoard
        todos={todos}
        onDrop={handleDrop}
        onDelete={handleDelete}
        onTogglePriority={handleTogglePriority}
      />
    </div>
  );
}
