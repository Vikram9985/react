import React, { useEffect, useState } from 'react';
import './App.css';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import { loadUsers, loadTasks, saveUsers, saveTasks } from './utils/storage';

function App() {
  // Role selection/login
  const [role, setRole] = useState(null); // 'admin' | 'user'
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);

  // bootstrap default users/tasks from localStorage
  useEffect(() => {
    const u = loadUsers();
    const t = loadTasks();
    setUsers(u);
    setTasks(t);
  }, []);

  useEffect(() => saveUsers(users), [users]);
  useEffect(() => saveTasks(tasks), [tasks]);

  function handleLogout() {
    setRole(null);
    setCurrentUserId(null);
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Role-based Task Manager (localStorage)</h1>
        <div className="login-area">
          {!role && (
            <>
              <button onClick={() => setRole('admin')}>Sign in as Admin</button>
              <div className="user-signin">
                <label>Select user:</label>
                <select
                  value={currentUserId || ''}
                  onChange={(e) => setCurrentUserId(e.target.value)}
                >
                  <option value="">-- choose user --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <button
                  disabled={!currentUserId}
                  onClick={() => currentUserId && setRole('user')}
                >Sign in as User</button>
              </div>
            </>
          )}

          {role && (
            <div className="signed-in">
              <span>Signed in as: {role === 'admin' ? 'Admin' : users.find(u => u.id === currentUserId)?.name || 'User'}</span>
              <button onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      </header>

      <main className="app-main">
        {!role && (
          <section className="welcome">
            <p>Please sign in as Admin or select a User to continue.</p>
            <p>Data is stored in localStorage. Admin can create tasks and assign them to users.</p>
          </section>
        )}

        {role === 'admin' && (
          <AdminPanel users={users} tasks={tasks} setUsers={setUsers} setTasks={setTasks} />
        )}

        {role === 'user' && currentUserId && (
          <UserPanel userId={currentUserId} tasks={tasks} setTasks={setTasks} />
        )}
      </main>

      <footer className="app-footer">
        <small>All data saved to localStorage. Designed for demo and local use.</small>
      </footer>
    </div>
  );
}

export default App;
