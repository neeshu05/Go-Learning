const BASE = 'http://localhost:8080/api/todos';

export async function listTodos() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('fetch failed');
  return res.json();
}

export async function createTodo(title, priority = 0) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, priority }),
  });
  if (!res.ok) throw new Error('create failed');
  return res.json();
}

export async function updateTodo(id, patch) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('update failed');
  return res.json();
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('delete failed');
}
