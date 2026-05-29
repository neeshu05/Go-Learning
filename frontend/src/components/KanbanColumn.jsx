import TodoCard from './TodoCard';

export default function KanbanColumn({ title, status, todos, onDrop, onDelete, onTogglePriority }) {
  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('todoId'), 10);
    onDrop(id, status);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        flex: 1,
        minWidth: 260,
        background: '#e4e6ea',
        borderRadius: 12,
        padding: 12,
      }}
    >
      <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#555' }}>
        {title} <span style={{ fontWeight: 400, color: '#888' }}>({todos.length})</span>
      </h2>
      {todos.map(todo => (
        <TodoCard
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          onTogglePriority={onTogglePriority}
        />
      ))}
    </div>
  );
}
