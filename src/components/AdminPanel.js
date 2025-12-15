import React, { useState } from 'react';
import TaskItem from './TaskItem';
import { createUser, createTask, updateTask } from '../utils/storage';

export default function AdminPanel({ users, tasks, setUsers, setTasks }) {
  const [newUserName, setNewUserName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignTo, setAssignTo] = useState(users.length ? users[0].id : '');

  function handleAddUser(e) {
    e.preventDefault();
    if (!newUserName.trim()) return;
    const u = createUser(newUserName.trim());
    setUsers([...users, u]);
    setNewUserName('');
    setAssignTo(u.id);
  }

  function handleAddTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const t = createTask({ title: title.trim(), description: description.trim(), assignedTo: assignTo || null });
    setTasks([...tasks, t]);
    setTitle('');
    setDescription('');
  }

  function onDragStart(e, taskId) {
    e.dataTransfer.setData('text/plain', taskId);
  }

  function onDropToUser(e, userId) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    const updated = updateTask(taskId, { assignedTo: userId });
    if (updated) {
      const next = tasks.map(t => (t.id === taskId ? updated : t));
      setTasks(next);
    }
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  return (
    <div className="admin-panel">
      <section className="admin-left">
        <h2>Create Task</h2>
        <form onSubmit={handleAddTask} className="task-form">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <label>Assign to:</label>
          <select value={assignTo} onChange={e => setAssignTo(e.target.value)}>
            <option value="">-- unassigned --</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
          <button type="submit">Create Task</button>
        </form>

        <h2>All Tasks (drag to user to reassign)</h2>
        <div className="task-list">
          {tasks.map(t => (
            <TaskItem key={t.id} task={t} onDragStart={onDragStart} showAssign />
          ))}
        </div>
      </section>

      <aside className="admin-right">
        <h2>Users (drop tasks onto a user)</h2>
        <form onSubmit={handleAddUser} className="add-user-form">
          <input placeholder="New user name" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
          <button type="submit">Add User</button>
        </form>

        <div className="user-list">
          {users.map(u => (
            <div key={u.id} className="user-card" onDragOver={onDragOver} onDrop={(e) => onDropToUser(e, u.id)}>
              <strong>{u.name}</strong>
              <div className="user-tasks-count">{tasks.filter(t => t.assignedTo === u.id).length} tasks</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
