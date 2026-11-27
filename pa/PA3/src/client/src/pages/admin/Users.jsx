import React, { useEffect, useState } from 'react';
import { api } from '../../api/endpoints.js';
import '../../styles/staff.css';

const ROLES = ['Reader', 'Librarian', 'Administrator'];
const emptyForm = { username: '', email: '', fullName: '', password: '', role: 'Reader', isActive: true };
const errorText = (err) => `${err?.code ? `${err.code}: ` : ''}${err?.message || 'Request failed. Try again.'}`;

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const result = await api.users.list();
      setUsers(Array.isArray(result) ? result : result?.items ?? []);
      setMessage('');
    } catch (err) { setMessage(errorText(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);

  function validate() {
    const e = {};
    if (!form.username.trim()) e.username = 'Enter a username.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address.';
    if (!form.fullName.trim()) e.fullName = 'Enter the user’s full name.';
    if (form.password.length < 8) e.password = 'Enter a password of at least 8 characters.';
    setErrors(e);
    return !Object.keys(e).length;
  }

  async function create(event) {
    event.preventDefault();
    if (!validate()) return;
    setBusy(true); setMessage('');
    try {
      await api.users.create({ ...form, username: form.username.trim(), email: form.email.trim(), fullName: form.fullName.trim() });
      setForm(emptyForm);
      await load();
      setMessage('User created.');
    } catch (err) { setMessage(errorText(err)); }
    finally { setBusy(false); }
  }

  async function update(user, patch, action) {
    if (!window.confirm(`${action} for ${user.username}?`)) return;
    setBusy(true); setMessage('');
    try {
      await api.users.update(user.id, patch);
      await load();
      setMessage(`${action} completed.`);
    } catch (err) { setMessage(errorText(err)); }
    finally { setBusy(false); }
  }

  return (
    <main className="staff-page" aria-labelledby="users-title">
      <header className="staff-heading"><div><p className="staff-eyebrow">SCR-02 · Administrator</p><h1 id="users-title">User Management</h1><p>Create accounts, assign roles and control account status.</p></div><button type="button" className="staff-secondary" onClick={load} disabled={busy || loading}>Refresh</button></header>
      {message && <p className="staff-notice" role="status">{message}</p>}
      <section className="staff-panel" aria-labelledby="create-user-title">
        <h2 id="create-user-title">Create User</h2>
        <form onSubmit={create} noValidate className="staff-form">
          {[
            ['username', 'Username', 'text'],
            ['email', 'Email', 'email'],
            ['fullName', 'Full name', 'text'],
            ['password', 'Initial password', 'password'],
          ].map(([key, label, type]) => (
            <label className="staff-field" key={key}>{label}
              <input type={type} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `users-${key}-error` : undefined}/>
              {errors[key] && <small className="staff-error" id={`users-${key}-error`}>{errors[key]}</small>}
            </label>
          ))}
          <label className="staff-field">Role<select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>{ROLES.map((role) => <option key={role}>{role}</option>)}</select></label>
          <label className="staff-checkbox"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}/> Active account</label>
          <button className="staff-primary" disabled={busy} type="submit">{busy ? 'Saving…' : 'Create User'}</button>
        </form>
      </section>
      <section className="staff-panel" aria-labelledby="user-list-title">
        <h2 id="user-list-title">User Accounts</h2>
        {loading ? <p>Loading users…</p> : <div className="staff-scroll"><table className="staff-table"><thead><tr><th scope="col">Username</th><th scope="col">Full name</th><th scope="col">Email</th><th scope="col">Role</th><th scope="col">Account</th><th scope="col">Actions</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.username}</td><td>{user.fullName}</td><td>{user.email}</td><td><select aria-label={`Role for ${user.username}`} disabled={busy} value={user.role} onChange={(e) => { const next = e.target.value; if (next !== user.role) void update(user, { role: next }, `Change role to ${next}`); }}>{ROLES.map((role) => <option key={role}>{role}</option>)}</select></td><td><span className={`staff-status ${user.isActive ? 'is-ok' : 'is-muted'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td><td><button type="button" disabled={busy} className="staff-secondary" onClick={() => update(user, { isActive: !user.isActive }, user.isActive ? 'Deactivate user' : 'Activate user')}>{user.isActive ? 'Deactivate' : 'Activate'}</button></td></tr>)}</tbody></table>{users.length === 0 && <p>No user accounts found.</p>}</div>}
      </section>
    </main>
  );
}
