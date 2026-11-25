import React, { useEffect, useState } from 'react';
import { api } from '../../api/endpoints.js';
import { daysLate, errorMessage, formatDate } from './circulationUtils.js';
import '../../styles/staff.css';

export default function Overdue() {
  const [loans, setLoans] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const load = async () => {
    setBusy(true); setMessage('');
    try { const result = await api.dashboard.overdue(); setLoans(result.items || []); }
    catch (err) { setMessage(errorMessage(err)); }
    finally { setBusy(false); }
  };
  useEffect(() => { void load(); }, []);
  return <main className="staff-page" aria-labelledby="overdue-title">
    <header className="staff-heading"><div><p className="staff-eyebrow">SCR-12 · UC-12 · F07 · Librarian</p><h1 id="overdue-title">Overdue Desk</h1><p>Monitor unreturned overdue Loans and Reader contact details.</p></div><button className="staff-secondary" onClick={load} disabled={busy}>Refresh</button></header>
    {message && <p role="alert" className="staff-notice">{message}</p>}
    <section className="staff-panel"><h2>Overdue Loans ({loans.length})</h2><div className="staff-scroll"><table className="staff-table"><thead><tr><th>Reader</th><th>Contact</th><th>Copy barcode</th><th>Book Title</th><th>Due date</th><th>Days late</th></tr></thead><tbody>{loans.map((loan) => <tr key={loan.id}><td>{loan.reader?.fullName || loan.readerId}</td><td>{loan.reader?.email || 'Not provided by API'}</td><td>{loan.copy?.barcode || loan.copyId}</td><td>{loan.title?.title || 'Not provided by API'}</td><td>{formatDate(loan.dueAt)}</td><td><strong>{daysLate(loan.dueAt)}</strong></td></tr>)}</tbody></table>{!loans.length && !busy && <p>No overdue Loans returned by the API.</p>}</div></section>
    <p className="staff-hint">F07 real response shape is awaiting Vinh's confirmation. The mock enriches Loans with Reader contacts, copy barcode and Book Title. No real email or SMS is sent.</p>
  </main>;
}
