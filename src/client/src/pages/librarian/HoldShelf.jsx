import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../../api/endpoints.js';
import { errorMessage, formatDate } from './circulationUtils.js';
import '../../styles/staff.css';

export default function HoldShelf() {
  const [items, setItems] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const load = async () => {
    setBusy(true); setMessage('');
    try { const response = await api.reservations.queue(); setItems(response.items || []); }
    catch (err) { setMessage(errorMessage(err)); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, []);
  const titleOptions = useMemo(() => [...new Map(items.map((r) => [r.titleId, r.title?.title || r.titleId])).entries()], [items]);
  const filtered = items.filter((r) => !selectedTitle || r.titleId === selectedTitle);
  const ready = filtered.filter((r) => r.status === 'Ready');
  const pending = filtered.filter((r) => r.status === 'Pending').sort((a,b) => a.titleId.localeCompare(b.titleId) || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  return <main className="staff-page" aria-labelledby="holds-title">
    <header className="staff-heading"><div><p className="staff-eyebrow">SCR-10 · UC-11 · Librarian</p><h1 id="holds-title">Hold Shelf & Reservation Queue</h1><p>Monitor allocated READY holds and title-level FIFO queues.</p></div><button className="staff-secondary" disabled={busy} onClick={load}>Refresh</button></header>
    <p className="staff-notice">Design draft for SCR-10; Figma frame and Ánh's approval are still pending. No manual override of FIFO or expiry is provided.</p>
    {message && <p role="alert" className="staff-notice">{message}</p>}
    <section className="staff-panel"><label className="staff-field">Filter by Book Title<select value={selectedTitle} onChange={(e) => setSelectedTitle(e.target.value)}><option value="">All titles</option>{titleOptions.map(([id,title]) => <option key={id} value={id}>{title}</option>)}</select></label></section>
    <section className="staff-panel"><h2>READY holds · 72-hour pickup window</h2><div className="staff-scroll"><table className="staff-table"><thead><tr><th>Book Title</th><th>Reader</th><th>Copy</th><th>Ready at</th><th>Expires at</th><th>Status</th></tr></thead><tbody>{ready.map((r) => <tr key={r.id}><td>{r.title?.title || r.titleId}</td><td>{r.reader?.fullName || r.readerId}</td><td>{r.copy?.barcode || r.heldCopyId || '—'}</td><td>{formatDate(r.readyAt)}</td><td>{formatDate(r.expiresAt)}</td><td><span className="staff-status is-ok">{new Date(r.expiresAt).getTime() > Date.now() ? 'Ready' : 'Deadline reached — refresh'}</span></td></tr>)}</tbody></table>{!ready.length && <p>No READY holds.</p>}</div></section>
    <section className="staff-panel"><h2>Pending FIFO queue</h2><div className="staff-scroll"><table className="staff-table"><thead><tr><th>Book Title</th><th>Queue position</th><th>Reader</th><th>Requested at</th><th>Status</th></tr></thead><tbody>{pending.map((r) => <tr key={r.id}><td>{r.title?.title || r.titleId}</td><td>{r.queuePosition}</td><td>{r.reader?.fullName || r.readerId}</td><td>{formatDate(r.createdAt)}</td><td>Pending</td></tr>)}</tbody></table>{!pending.length && <p>No Pending reservations.</p>}</div></section>
    <p className="staff-hint">The API is authoritative for allocation, FIFO, and automatic expiry every 60 seconds. This page never changes hold status directly.</p>
  </main>;
}
