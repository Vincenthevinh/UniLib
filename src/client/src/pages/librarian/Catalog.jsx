import React, { useEffect, useState } from 'react';
import { api } from '../../api/endpoints.js';
import '../../styles/staff.css';

const blank = { isbn: '', title: '', author: '', category: '', publisher: '', publicationYear: String(new Date().getFullYear()) };
const errorText = (err) => `${err?.code ? `${err.code}: ` : ''}${err?.message || 'Request failed.'}`;
export default function Catalog() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load(currentPage = page, search = searchTerm) {
    setLoading(true);
    try {
      const result = await api.books.search({ q: search, page: currentPage, pageSize: 10 });
      setItems(result.items || []); setPagination(result.pagination || null);
    } catch (err) { setMessage(errorText(err)); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [page, searchTerm]);

  function beginEdit(book) {
    setEditing(book.id);
    setForm({ isbn: book.isbn || '', title: book.title || '', author: book.author || '', category: book.category || '', publisher: book.publisher || '', publicationYear: String(book.publicationYear || '') });
    setErrors({}); setMessage('');
  }
  function validate() {
    const e = {};
    if (!form.isbn.trim()) e.isbn = 'Enter an ISBN.';
    if (!form.title.trim()) e.title = 'Enter the Book Title.';
    if (!form.author.trim()) e.author = 'Enter at least one author.';
    if (!form.category.trim()) e.category = 'Enter a category.';
    const year = Number(form.publicationYear);
    if (!/^\d{4}$/.test(form.publicationYear) || year < 1450 || year > new Date().getFullYear() + 1) e.publicationYear = 'Enter a valid 4-digit publication year.';
    setErrors(e);
    return !Object.keys(e).length;
  }
  async function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    const data = { isbn: form.isbn.trim(), title: form.title.trim(), author: form.author.trim(), category: form.category.trim(), publisher: form.publisher.trim() || null, publicationYear: Number(form.publicationYear) };
    setBusy(true); setMessage('');
    try {
      if (editing) await api.books.update(editing, data);
      else await api.books.create(data);
      setEditing(null); setForm(blank);
      await load(); setMessage(editing ? 'Book Title updated.' : 'Book Title created.');
    } catch (err) { setMessage(errorText(err)); }
    finally { setBusy(false); }
  }
  async function remove(book) {
    if (!window.confirm(`Deactivate “${book.title}”? This is blocked when Book Copies or active Reservations exist (BR-09).`)) return;
    setBusy(true); setMessage('');
    try { await api.books.remove(book.id); await load(); setMessage('Book Title deactivated.'); }
    catch (err) { setMessage(`${errorText(err)} ${err.code === 'TITLE_IN_USE' ? 'BR-09: Remove linked copies and resolve active reservations before retrying.' : ''}`); }
    finally { setBusy(false); }
  }
  return <main className="staff-page" aria-labelledby="catalog-title">
    <header className="staff-heading"><div><p className="staff-eyebrow">SCR-03 · Librarian</p><h1 id="catalog-title">Book Catalog Management</h1><p>Maintain Book Title metadata and review copy availability.</p></div></header>
    {message && <p className="staff-notice" role="status">{message}</p>}
    <section className="staff-panel"><h2>{editing ? 'Edit Book Title' : 'Create Book Title'}</h2><form className="staff-form" noValidate onSubmit={submit}>
      {[
        ['isbn', 'ISBN', 'text'], ['title', 'Book Title', 'text'], ['author', 'Author(s)', 'text'], ['category', 'Category', 'text'], ['publisher', 'Publisher (optional)', 'text'], ['publicationYear', 'Publication Year', 'number'],
      ].map(([key, label, type]) => <label className="staff-field" key={key}>{label}<input type={type} value={form[key]} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `catalog-${key}-error` : undefined}/>{errors[key] && <small className="staff-error" id={`catalog-${key}-error`}>{errors[key]}</small>}</label>)}
      <div className="staff-actions"><button type="submit" className="staff-primary" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save Changes' : 'Create Book Title'}</button>{editing && <button type="button" className="staff-secondary" onClick={() => { setEditing(null); setForm(blank); setErrors({}); }}>Cancel edit</button>}</div>
    </form></section>
    <section className="staff-panel"><h2>Book Titles</h2><form className="staff-search" onSubmit={(e) => { e.preventDefault(); setPage(1); setSearchTerm(q); }}><label htmlFor="catalog-search">Search title, ISBN, author or category</label><input id="catalog-search" value={q} onChange={(e) => setQ(e.target.value)}/><button className="staff-secondary" type="submit">Search</button></form>
      {loading ? <p>Loading catalog…</p> : <div className="staff-scroll"><table className="staff-table"><thead><tr><th scope="col">ISBN</th><th scope="col">Title / Author</th><th scope="col">Category / Year</th><th scope="col">Copies</th><th scope="col">Actions</th></tr></thead><tbody>{items.map((book) => <tr key={book.id}><td>{book.isbn}</td><td><strong>{book.title}</strong><div>{book.author}</div></td><td>{book.category} · {book.publicationYear}</td><td>{book.availableCopies} available / {book.totalCopies} total</td><td><div className="staff-actions"><button className="staff-secondary" type="button" disabled={busy} onClick={() => beginEdit(book)}>Edit</button><button className="staff-danger" type="button" disabled={busy || !book.isActive} onClick={() => remove(book)}>Deactivate</button></div></td></tr>)}</tbody></table>{items.length === 0 && <p>No matching Book Titles.</p>}</div>}
      {pagination && <nav className="staff-pager" aria-label="Catalog pagination"><button className="staff-secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button><span>Page {pagination.page} of {Math.max(1, pagination.totalPages)}</span><button className="staff-secondary" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</button></nav>}
    </section>
  </main>;
}
