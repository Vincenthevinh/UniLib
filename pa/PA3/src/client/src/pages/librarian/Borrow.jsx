import React, { useState } from 'react';
import { api } from '../../api/endpoints.js';
import { errorMessage, formatDate } from './circulationUtils.js';
import '../../styles/staff.css';

export default function Borrow() {
  const [readerId, setReaderId] = useState('');
  const [barcode, setBarcode] = useState('');
  const [preview, setPreview] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const check = async (event) => {
    event.preventDefault(); setPreview(null); setReceipt(null); setMessage('');
    if (!readerId.trim() || !barcode.trim()) { setMessage('Enter Reader ID and Copy barcode.'); return; }
    setBusy(true);
    try { setPreview(await api.circulation.eligibility(readerId.trim(), barcode.trim())); }
    catch (err) { setMessage(errorMessage(err)); }
    finally { setBusy(false); }
  };
  const checkout = async () => {
    if (!preview?.eligible) return;
    if (!window.confirm(`Confirm checkout of ${preview.copy.barcode} to ${preview.reader.fullName}?`)) return;
    setBusy(true); setMessage('');
    try {
      const result = await api.circulation.checkout(readerId.trim(), preview.copy.id);
      setReceipt(result); setPreview(null);
      setMessage('Checkout completed. The backend is authoritative for eligibility and due date.');
    } catch (err) { setMessage(errorMessage(err)); setPreview(null); }
    finally { setBusy(false); }
  };
  return <main className="staff-page" aria-labelledby="borrow-title">
    <header className="staff-heading"><div><p className="staff-eyebrow">SCR-07 · UC-07 · Librarian</p><h1 id="borrow-title">Circulation — Borrow</h1><p>Check eligibility before lending a physical Book Copy.</p></div></header>
    <section className="staff-panel"><h2>Checkout request</h2><form className="staff-form" onSubmit={check}>
      <label className="staff-field">Reader ID (UUID)<input required value={readerId} onChange={(e) => { setReaderId(e.target.value); setPreview(null); }} placeholder="Reader UUID" /></label>
      <label className="staff-field">Copy barcode<input required value={barcode} onChange={(e) => { setBarcode(e.target.value); setPreview(null); }} placeholder="UL-001-1" /></label>
      <button className="staff-secondary" type="submit" disabled={busy}>Check eligibility</button>
    </form></section>
    {message && <p role="status" className="staff-notice">{message}</p>}
    {preview && <section className="staff-panel" aria-label="Checkout eligibility"><h2>Eligibility result</h2>
      <p><strong>Reader:</strong> {preview.reader.fullName} · <strong>Active Loans:</strong> {preview.activeLoans}/3 · <strong>Overdue:</strong> {preview.overdueCount}</p>
      <p><strong>Copy:</strong> {preview.copy.barcode} · <strong>Status:</strong> {preview.copy.status}</p>
      <p role="status">{preview.eligible ? 'Eligible for checkout (mock preview; revalidated at checkout).' : `Blocked: ${preview.block?.rule || 'F05'} — ${preview.block?.message}`}</p>
      <button className="staff-primary" type="button" disabled={busy || !preview.eligible} onClick={checkout}>Complete checkout</button>
    </section>}
    {receipt && <section className="staff-panel"><h2>Loan created</h2><p>Loan ID: {receipt.id}</p><p>Due date (BR-02): <strong>{formatDate(receipt.dueAt)}</strong></p></section>}
    <p className="staff-hint">F05 eligibility preview endpoint is provisional until Vinh confirms the API. The server must revalidate BR-01, BR-04 and held-copy eligibility atomically.</p>
  </main>;
}
