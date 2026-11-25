import React, { useState } from 'react';
import { api } from '../../api/endpoints.js';
import { errorMessage, findCopyByBarcode, formatDate } from './circulationUtils.js';
import '../../styles/staff.css';

export default function Return() {
  const [barcode, setBarcode] = useState('');
  const [condition, setCondition] = useState('Good');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const process = async (event) => {
    event.preventDefault(); setResult(null); setMessage('');
    if (!barcode.trim()) { setMessage('Enter the returned Book Copy barcode.'); return; }
    if (!window.confirm(`Confirm return of ${barcode} with condition ${condition}?`)) return;
    setBusy(true);
    try {
      const copy = await findCopyByBarcode(api, barcode);
      const response = await api.circulation.checkin(copy.id, condition);
      setResult(response);
      setMessage('Return recorded. Status and any 72-hour hold come from the circulation service.');
    } catch (err) { setMessage(errorMessage(err)); }
    finally { setBusy(false); }
  };
  return <main className="staff-page" aria-labelledby="return-title">
    <header className="staff-heading"><div><p className="staff-eyebrow">SCR-08 · UC-08 · Librarian</p><h1 id="return-title">Circulation — Return</h1><p>Record a return and show the resulting copy or hold status.</p></div></header>
    <section className="staff-panel"><h2>Check in Book Copy</h2><form className="staff-form" onSubmit={process}>
      <label className="staff-field">Copy barcode<input required value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="UL-001-1" /></label>
      <label className="staff-field">Physical condition<select value={condition} onChange={(e) => setCondition(e.target.value)}><option value="Good">Good / circulatable</option><option value="Damaged">Damaged</option><option value="Lost">Lost</option></select></label>
      <button className="staff-primary" disabled={busy} type="submit">Confirm return</button>
    </form></section>
    {message && <p role="status" className="staff-notice">{message}</p>}
    {result && <section className="staff-panel"><h2>Return result</h2>
      <p><strong>Copy status:</strong> {result.copy?.status || 'Unknown'}</p>
      {result.copy?.status === 'Reserved' && result.hold ? <p><strong>Held for Reader:</strong> {result.hold.readerId}<br/><strong>Pickup until:</strong> {formatDate(result.hold.expiresAt)} (BR-08 · 72 hours)</p> : null}
      {result.copy?.status === 'Reserved' && !result.hold && <p>Copy is Reserved. [TBD: real F05 response must include allocated Reader ID and pickup deadline.]</p>}
      {['Damaged','Lost'].includes(result.copy?.status) && <p>Damaged/Lost copy is excluded from the hold shelf; Pending reservations stay queued (REV-08).</p>}
    </section>}
    <p className="staff-hint">Barcode lookup currently uses catalog/copy listing (demo adapter). Vinh must confirm an authoritative F05 barcode lookup and return response for live mode.</p>
  </main>;
}
