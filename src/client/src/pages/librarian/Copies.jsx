import React, { useEffect, useState } from 'react';
import { api } from '../../api/endpoints.js';
import '../../styles/staff.css';
const statuses = ['Available', 'Borrowed', 'Reserved', 'Damaged', 'Lost'];
const errText = (err) => `${err?.code ? `${err.code}: ` : ''}${err?.message || 'Request failed.'}`;
export default function Copies() {
  const [titles, setTitles] = useState([]);
  const [titleId, setTitleId] = useState('');
  const [copies, setCopies] = useState([]);
  const [form, setForm] = useState({ barcode: '', shelfLocation: '', conditionNotes: '' });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState({});
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const first = await api.books.search({ page: 1, pageSize: 100 });
        if (!cancelled) { const rows = first.items || []; setTitles(rows); setTitleId((old) => old || rows[0]?.id || ''); }
      } catch (err) { if (!cancelled) setMessage(errText(err)); }
    })();
    return () => { cancelled = true; };
  }, []);
  async function load(id = titleId) {
    if (!id) { setCopies([]); return; }
    try { const result = await api.copies.list(id); setCopies(result.items || []); setEditing({}); }
    catch (err) { setMessage(errText(err)); }
  }
  useEffect(() => { void load(titleId); }, [titleId]);
  async function create(event) {
    event.preventDefault();
    if (!titleId) { setMessage('Select a Book Title before registering a copy.'); return; }
    if (!form.barcode.trim() || !form.shelfLocation.trim()) { setMessage('Enter a barcode and shelf location.'); return; }
    setBusy(true); setMessage('');
    try { await api.copies.create(titleId, { barcode: form.barcode.trim(), shelfLocation: form.shelfLocation.trim(), conditionNotes: form.conditionNotes.trim() || null }); setForm({ barcode: '', shelfLocation: '', conditionNotes: '' }); await load(); setMessage('Book Copy registered.'); }
    catch (err) { setMessage(errText(err)); }
    finally { setBusy(false); }
  }
  async function save(copy) {
    const draft = editing[copy.id] || {};
    if (!draft.shelfLocation?.trim()) { setMessage('Shelf Location cannot be empty.'); return; }
    setBusy(true); setMessage('');
    try { await api.copies.update(copy.id, { shelfLocation: draft.shelfLocation.trim(), conditionNotes: draft.conditionNotes?.trim() || null }); await load(); setMessage('Book Copy details saved.'); }
    catch (err) { setMessage(errText(err)); }
    finally { setBusy(false); }
  }
  async function decommission(copy) {
    if (['Borrowed', 'Reserved'].includes(copy.status)) return;
    if (!window.confirm(`Decommission copy ${copy.barcode}? This action is irreversible and may fail if circulation history exists (BR-09).`)) return;
    setBusy(true); setMessage('');
    try { await api.copies.remove(copy.id); await load(); setMessage('Book Copy decommissioned.'); }
    catch (err) { setMessage(`${errText(err)} ${err.code === 'COPY_HAS_HISTORY' ? 'BR-09: A copy with circulation history cannot be deleted.' : ''}`); }
    finally { setBusy(false); }
  }
  return <main className="staff-page" aria-labelledby="copies-title">
    <header className="staff-heading"><div><p className="staff-eyebrow">SCR-04 · Librarian</p><h1 id="copies-title">Book Copy Inventory</h1><p>Register physical copies, update locations and condition, and decommission eligible items.</p></div></header>
    {message && <p className="staff-notice" role="status">{message}</p>}
    <section className="staff-panel"><label className="staff-field">Book Title<select value={titleId} onChange={(e) => setTitleId(e.target.value)}><option value="">Select Book Title</option>{titles.map((t) => <option key={t.id} value={t.id}>{t.title} ({t.isbn})</option>)}</select></label></section>
    <section className="staff-panel"><h2>Register New Copy</h2><form className="staff-form" onSubmit={create}><label className="staff-field">Barcode<input required value={form.barcode} onChange={(e) => setForm((f) => ({ ...f, barcode: e.target.value }))}/></label><label className="staff-field">Shelf Location<input required value={form.shelfLocation} onChange={(e) => setForm((f) => ({ ...f, shelfLocation: e.target.value }))}/></label><label className="staff-field">Condition Notes (optional)<input value={form.conditionNotes} onChange={(e) => setForm((f) => ({ ...f, conditionNotes: e.target.value }))}/></label><button className="staff-primary" disabled={busy || !titleId} type="submit">Register Copy</button></form></section>
    <section className="staff-panel"><h2>Copies for Selected Title</h2><div className="staff-scroll"><table className="staff-table"><thead><tr><th scope="col">Barcode</th><th scope="col">Status</th><th scope="col">Shelf Location</th><th scope="col">Condition Notes</th><th scope="col">Actions</th></tr></thead><tbody>{copies.map((copy) => { const draft = editing[copy.id]; return <tr key={copy.id}><td>{copy.barcode}</td><td><span className={`staff-status ${copy.status === 'Available' ? 'is-ok' : 'is-muted'}`}>{copy.status}</span></td><td>{draft ? <input aria-label={`Shelf location for ${copy.barcode}`} value={draft.shelfLocation} onChange={(e) => setEditing((prev) => ({ ...prev, [copy.id]: { ...prev[copy.id], shelfLocation: e.target.value } }))}/> : copy.shelfLocation}</td><td>{draft ? <input aria-label={`Condition notes for ${copy.barcode}`} value={draft.conditionNotes} onChange={(e) => setEditing((prev) => ({ ...prev, [copy.id]: { ...prev[copy.id], conditionNotes: e.target.value } }))}/> : copy.conditionNotes || '—'}</td><td><div className="staff-actions">{draft ? <button className="staff-secondary" disabled={busy} type="button" onClick={() => save(copy)}>Save</button> : <button className="staff-secondary" disabled={busy} type="button" onClick={() => setEditing((prev) => ({ ...prev, [copy.id]: { shelfLocation: copy.shelfLocation, conditionNotes: copy.conditionNotes || '' } }))}>Edit</button>}<button className="staff-danger" type="button" disabled={busy || ['Borrowed', 'Reserved'].includes(copy.status)} title={['Borrowed', 'Reserved'].includes(copy.status) ? 'BR-09: Circulating copies cannot be decommissioned.' : 'Requires confirmation'} onClick={() => decommission(copy)}>Decommission</button></div></td></tr>; })}</tbody></table>{copies.length === 0 && <p>No copies for this Book Title.</p>}</div><p className="staff-hint">Status is read-only on this screen. Checkout, return and hold allocation are managed by circulation workflows (UC-07/08/11).</p></section>
  </main>;
}
