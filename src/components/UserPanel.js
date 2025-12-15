import React from 'react';
import { updateTask } from '../utils/storage';

export default function UserPanel({ userId, tasks, setTasks }) {
  const myTasks = tasks.filter(t => t.assignedTo === userId);

  function markCompleted(taskId) {
    const updated = updateTask(taskId, { status: 'Completed' });
    if (updated) {
      setTasks(tasks.map(t => (t.id === taskId ? updated : t)));
    }
  }

  return (
    <div className="user-panel">
      <h2>My Tasks</h2>
      {myTasks.length === 0 && <p>No tasks assigned to you.</p>}
      <div className="user-task-list">
        {myTasks.map(t => (
          <div key={t.id} className={`user-task ${t.status === 'Completed' ? 'completed' : ''}`}>
            <div className="user-task-title">{t.title}</div>
            <div className="user-task-desc">{t.description}</div>
            <div className="user-task-actions">
              <span className="status">{t.status}</span>
              {t.status !== 'Completed' && (
                <button onClick={() => markCompleted(t.id)}>Mark Completed</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
