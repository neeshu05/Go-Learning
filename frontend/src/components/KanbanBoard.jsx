import KanbanColumn from './KanbanColumn';

const COLUMNS = [
  { title: 'Todo',        status: 'todo' },
  { title: 'In Progress', status: 'in_progress' },
  { title: 'Done',        status: 'done' },
];

export default function KanbanBoard({ todos, onDrop, onDelete, onTogglePriority }) {
  return (
    <div style={{ display: 'flex', gap: 16, padding: 24, alignItems: 'flex-start' }}>
      {COLUMNS.map(col => (
        <KanbanColumn
          key={col.status}
          title={col.title}
          status={col.status}
          todos={todos.filter(t => t.status === col.status)}
          onDrop={onDrop}
          onDelete={onDelete}
          onTogglePriority={onTogglePriority}
        />
      ))}
    </div>
  );
}
