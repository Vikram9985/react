import React from 'react';

export default function TaskItem({ task, onDragStart, showAssign }) {
  return (
    <div
      className={`task-item ${task.status === 'Completed' ? 'completed' : ''}`}
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
      title={task.description}
    >
      <div className="task-title">{task.title}</div>
      {showAssign && <div className="task-meta">Assigned: {task.assignedTo || '—'}</div>}
      <div className="task-status">{task.status}</div>
    </div>
  );
}
