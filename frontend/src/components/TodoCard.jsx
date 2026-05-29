export default function TodoCard({ todo, onDelete, onTogglePriority }) {
  function handleDragStart(e) {
    e.dataTransfer.setData('todoId', String(todo.id));
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      style={{
        background: '#fff',
        borderRadius: 8,
        padding: '10px 12px',
        marginBottom: 8,
        borderLeft: todo.priority ? '4px solid #f59e0b' : '4px solid transparent',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        cursor: 'grab',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ flex: 1, fontSize: 14 }}>{todo.title}</span>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => onTogglePriority(todo)}
            title={todo.priority ? 'Remove priority' : 'Mark priority'}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 16, opacity: todo.priority ? 1 : 0.3,
            }}
          >⭐</button>
          <button
            onClick={() => onDelete(todo.id)}
            title="Delete"
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, opacity: 0.5 }}
          >✕</button>
        </div>
      </div>
    </div>
  );
}
