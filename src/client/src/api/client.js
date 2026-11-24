import { fixtures, clone, copySummary, isOverdue, queuePosition } from '../mocks/fixtures.js';

// Vite accepts only public VITE_ variables. No server secrets are used here.
const env = import.meta.env ?? {};
const mockMode = env.VITE_USE_MOCK === 'true';
const baseUrl = String(env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
const storageKey = 'unilib_access_token';
let memoryToken = null;
export const isMockMode = () => mockMode;
export function setToken(value) {
  memoryToken = value || null;
  if (typeof sessionStorage !== 'undefined') {
    if (value) sessionStorage.setItem(storageKey, value);
    else sessionStorage.removeItem(storageKey);
  }
}
export function getToken() {
  return (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(storageKey)) || memoryToken;
}
export const clearToken = () => setToken(null);
export class ApiError extends Error {
  constructor(code, message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}
const error = (status, code, message) => { throw new ApiError(code, message, status); };
const state = clone(fixtures);
const uuid = () => (globalThis.crypto?.randomUUID?.() ?? `00000000-0000-4000-8000-${Math.floor(Math.random() * 1e12).toString().padStart(12, '0')}`);
const nowIso = () => new Date().toISOString();
const active = (reservation) => ['Pending', 'Ready'].includes(reservation.status);
const getTitle = (id) => state.titles.find((t) => t.id === id) ?? error(404, 'NOT_FOUND', 'Book Title not found');
const getCopy = (id) => state.copies.find((c) => c.id === id) ?? error(404, 'NOT_FOUND', 'Book Copy not found');
const currentReader = () => {
  const token = getToken();
  if (!token) error(401, 'UNAUTHORIZED', 'Sign in to continue');
  const id = token.startsWith('mock:') ? token.substring(5) : null;
  const user = state.users.find((u) => u.id === id);
  if (!user || !user.isActive) error(401, 'UNAUTHORIZED', 'Active account required');
  return user;
};
const requireRole = (...roles) => {
  const user = currentReader();
  if (!roles.includes(user.role)) error(403, 'FORBIDDEN', 'You do not have permission');
  return user;
};
const summary = (title) => ({ ...clone(title), ...copySummary(title.id, state.copies) });
const detail = (title) => ({ ...summary(title), copies: clone(state.copies.filter((c) => c.titleId === title.id).map(({ id, barcode, status, shelfLocation, conditionNotes }) => ({ id, barcode, status, shelfLocation, conditionNotes }))) });
const queueEntry = (r) => ({ ...clone(r), queuePosition: queuePosition(r, state.reservations) });
const readerHasOverdue = (id) => state.loans.some((loan) => loan.readerId === id && isOverdue(loan));

async function mockRequest(method, path, body) {
  const url = new URL(path, 'http://unilib.mock');
  const parts = url.pathname.replace(/^\/api\//, '/').split('/').filter(Boolean);
  const [area, id, sub] = parts;
  const options = url.searchParams;
  const q = (options.get('q') || '').toLowerCase();
  // F01, F05, F07 route paths below are PROVISIONAL until Vinh's contract is merged.
  if (area === 'auth') {
    if (id === 'login' && method === 'POST') {
      const user = state.users.find((u) => u.isActive && [u.username, u.email].includes(body?.username || body?.email));
      if (!user || body?.password !== 'demo1234') error(401, 'INVALID_CREDENTIALS', 'Invalid demo credentials');
      const token = `mock:${user.id}`;
      setToken(token);
      return { token, user: clone(user) };
    }
    if (id === 'logout' && method === 'POST') { clearToken(); return { success: true }; }
    if (id === 'me' && method === 'GET') return clone(currentReader());
  }
  if (area === 'users') {
    requireRole('Administrator');
    if (!id && method === 'GET') return { items: clone(state.users) };
    if (!id && method === 'POST') {
      const mandatory = ['username', 'email', 'fullName', 'password', 'role'];
      if (mandatory.some((key) => !String(body?.[key] ?? '').trim())) error(400, 'VALIDATION_ERROR', 'Complete all required fields, including a password');
      if (!['Reader', 'Librarian', 'Administrator'].includes(body.role)) error(400, 'INVALID_ROLE', 'Select an approved role');
      if (String(body.password).length < 8) error(400, 'INVALID_PASSWORD', 'Use a password of at least 8 characters');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) error(400, 'INVALID_EMAIL', 'Enter a valid email address');
      if (state.users.some((u) => u.username.toLowerCase() === body.username.toLowerCase() || u.email.toLowerCase() === body.email.toLowerCase())) error(409, 'USER_EXISTS', 'Username or email already exists');
      const { password: _password, ...safe } = body;
      const user = { ...safe, id: uuid(), isActive: Boolean(body.isActive), createdAt: nowIso(), updatedAt: nowIso() };
      state.users.push(user); return clone(user);
    }
    const user = state.users.find((u) => u.id === id) ?? error(404, 'NOT_FOUND', 'User not found');
    if (method === 'GET') return clone(user);
    if (method === 'PATCH') {
      if (body?.role !== undefined && !['Reader', 'Librarian', 'Administrator'].includes(body.role)) error(400, 'INVALID_ROLE', 'Select an approved role');
      if (body?.isActive !== undefined && typeof body.isActive !== 'boolean') error(400, 'INVALID_STATUS', 'Account status must be a boolean');
      const patch = Object.fromEntries(Object.entries(body || {}).filter(([key]) => ['role', 'isActive', 'fullName'].includes(key)));
      Object.assign(user, patch, { updatedAt: nowIso() }); return clone(user);
    }
  }
  if (area === 'books') {
    if (!id && method === 'GET') {
      let rows = state.titles.filter((t) => [t.title, t.author, t.category, t.isbn].some((v) => v.toLowerCase().includes(q)));
      if (options.get('category')) rows = rows.filter((t) => t.category.toLowerCase() === options.get('category').toLowerCase());
      if (options.get('available') === 'true') rows = rows.filter((t) => copySummary(t.id, state.copies).availableCopies > 0);
      if (options.get('sort') === 'year') rows.sort((a, b) => b.publicationYear - a.publicationYear);
      else rows.sort((a, b) => a.title.localeCompare(b.title));
      const page = Math.max(1, Number(options.get('page') || 1));
      const pageSize = Math.max(1, Math.min(100, Number(options.get('pageSize') || 10)));
      const total = rows.length;
      return { items: rows.slice((page - 1) * pageSize, page * pageSize).map(summary), pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } };
    }
    if (!id && method === 'POST') {
      requireRole('Librarian');
      for (const key of ['isbn', 'title', 'author', 'category']) {
        if (!String(body?.[key] ?? '').trim()) error(400, 'VALIDATION_ERROR', `Enter a valid ${key}`);
      }
      if (!Number.isInteger(body.publicationYear) || body.publicationYear < 1450) error(400, 'INVALID_YEAR', 'Enter a valid publication year');
      if (state.titles.some((t) => t.isbn === body.isbn)) error(409, 'DUPLICATE_ISBN', 'ISBN already exists');
      const title = { ...body, id: uuid(), isActive: true, createdAt: nowIso(), updatedAt: nowIso() };
      state.titles.push(title); return detail(title);
    }
    if (id && sub === 'copies') {
      getTitle(id);
      if (method === 'GET') return { items: clone(state.copies.filter((c) => c.titleId === id).map(({ id: copyId, barcode, status, shelfLocation, conditionNotes }) => ({ id: copyId, barcode, status, shelfLocation, conditionNotes }))) };
      if (method === 'POST') {
        requireRole('Librarian');
        if (!String(body?.barcode ?? '').trim() || !String(body?.shelfLocation ?? '').trim()) error(400, 'VALIDATION_ERROR', 'Enter barcode and shelf location');
        if (state.copies.some((c) => c.barcode === body?.barcode)) error(409, 'DUPLICATE_BARCODE', 'Barcode already in use');
        const copy = { ...body, id: uuid(), titleId: id, status: 'Available', createdAt: nowIso(), updatedAt: nowIso() };
        state.copies.push(copy); return clone(copy);
      }
    }
    const title = getTitle(id);
    if (method === 'GET') return detail(title);
    requireRole('Librarian');
    if (method === 'PATCH') {
      for (const key of ['isbn', 'title', 'author', 'category']) {
        if (key in (body || {}) && !String(body[key] ?? '').trim()) error(400, 'VALIDATION_ERROR', `Enter a valid ${key}`);
      }
      if (body?.isbn && state.titles.some((t) => t.id !== title.id && t.isbn === body.isbn)) error(409, 'DUPLICATE_ISBN', 'ISBN already exists');
      if (body?.publicationYear !== undefined && (!Number.isInteger(body.publicationYear) || body.publicationYear < 1450)) error(400, 'INVALID_YEAR', 'Enter a valid publication year');
      Object.assign(title, body, { updatedAt: nowIso() }); return detail(title);
    }
    if (method === 'DELETE') {
      if (state.copies.some((c) => c.titleId === id) || state.reservations.some((r) => r.titleId === id && active(r))) error(409, 'TITLE_IN_USE', 'Title cannot be deactivated while in use');
      title.isActive = false; title.updatedAt = nowIso(); return detail(title);
    }
  }
  if (area === 'copies' && id) {
    requireRole('Librarian');
    const copy = getCopy(id);
    if (method === 'PATCH') {
      if (body?.shelfLocation !== undefined && !String(body.shelfLocation).trim()) error(400, 'VALIDATION_ERROR', 'Shelf location cannot be empty');
      if (body?.status !== undefined && !['Available', 'Borrowed', 'Reserved', 'Damaged', 'Lost'].includes(body.status)) error(400, 'INVALID_COPY_STATUS', 'Unknown Book Copy status');
      // N2 only edits metadata; lifecycle transitions remain managed by circulation workflows.
      const patch = Object.fromEntries(Object.entries(body || {}).filter(([key]) => ['shelfLocation', 'conditionNotes'].includes(key)));
      Object.assign(copy, patch, { updatedAt: nowIso() }); return clone(copy);
    }
    if (method === 'DELETE') {
      if (['Borrowed', 'Reserved'].includes(copy.status)) error(409, 'COPY_IN_USE', 'Copy is currently circulating');
      if (state.loans.some((l) => l.copyId === copy.id) || state.reservations.some((r) => r.heldCopyId === copy.id)) error(409, 'COPY_HAS_HISTORY', 'Copy has circulation history');
      state.copies.splice(state.copies.indexOf(copy), 1);
      return null; // Real HTTP response is 204 No Content.
    }
  }
  if (area === 'reservations') {
    if (id === 'me' && method === 'GET') {
      const reader = requireRole('Reader');
      return { items: state.reservations.filter((r) => r.readerId === reader.id).map((r) => ({ ...queueEntry(r), title: summary(getTitle(r.titleId)) })) };
    }
    if (id === 'queue' && method === 'GET') {
      requireRole('Librarian');
      return { items: state.reservations.filter((r) => !options.get('titleId') || r.titleId === options.get('titleId')).map((r) => ({ ...queueEntry(r), reader: clone(state.users.find((u) => u.id === r.readerId)), title: summary(getTitle(r.titleId)), copy: r.heldCopyId ? clone(getCopy(r.heldCopyId)) : null })) };
    }
    if (!id && method === 'POST') {
      const reader = requireRole('Reader');
      const title = getTitle(body?.titleId);
      if (readerHasOverdue(reader.id)) error(422, 'READER_OVERDUE', 'Return overdue books before reserving');
      const related = state.copies.filter((c) => c.titleId === title.id);
      if (!related.some((c) => ['Available', 'Borrowed', 'Reserved'].includes(c.status))) error(422, 'NO_CIRCULATING_COPY', 'No circulating copy exists');
      if (related.some((c) => c.status === 'Available')) error(422, 'COPY_AVAILABLE', 'An Available copy can be checked out');
      if (state.loans.some((l) => l.readerId === reader.id && !l.returnedAt && related.some((c) => c.id === l.copyId))) error(422, 'TITLE_ALREADY_BORROWED', 'Reader already borrowed this title');
      if (state.reservations.some((r) => r.readerId === reader.id && r.titleId === title.id && active(r))) error(422, 'RESERVATION_DUPLICATE', 'Reservation already exists');
      if (state.reservations.filter((r) => r.readerId === reader.id && active(r)).length >= 2) error(422, 'RESERVATION_LIMIT', 'Maximum two active reservations');
      const reservation = { id: uuid(), readerId: reader.id, titleId: title.id, heldCopyId: null, status: 'Pending', createdAt: nowIso(), readyAt: null, expiresAt: null, fulfilledAt: null, cancelledAt: null };
      state.reservations.push(reservation);
      return { reservation: clone(reservation), queuePosition: queuePosition(reservation, state.reservations) };
    }
    if (id && method === 'DELETE') {
      const reader = requireRole('Reader');
      const reservation = state.reservations.find((r) => r.id === id) ?? error(404, 'NOT_FOUND', 'Reservation not found');
      if (reservation.readerId !== reader.id) error(403, 'FORBIDDEN', 'Not your Reservation');
      if (!active(reservation)) error(409, 'RESERVATION_NOT_ACTIVE', 'Reservation cannot be cancelled');
      reservation.status = 'Cancelled'; reservation.cancelledAt = nowIso(); return clone(reservation);
    }
  }
  if (area === 'circulation') {
    requireRole('Librarian');
    if (id === 'checkout' && method === 'POST') {
      const reader = state.users.find((u) => u.id === body?.readerId && u.role === 'Reader' && u.isActive) ?? error(422, 'READER_INACTIVE', 'Reader not eligible');
      if (readerHasOverdue(reader.id)) error(422, 'READER_OVERDUE', 'Reader has overdue loans');
      if (state.loans.filter((l) => l.readerId === reader.id && !l.returnedAt).length >= 3) error(422, 'LOAN_LIMIT', 'Maximum three active Loans');
      const copy = getCopy(body?.copyId);
      if (copy.status !== 'Available' && !(copy.status === 'Reserved' && state.reservations.some((r) => r.heldCopyId === copy.id && r.readerId === reader.id && r.status === 'Ready'))) error(409, 'COPY_IN_USE', 'Copy is not available for this Reader');
      const matchedHold = state.reservations.find((r) => r.heldCopyId === copy.id && r.readerId === reader.id && r.status === 'Ready');
      if (matchedHold && new Date(matchedHold.expiresAt) <= new Date()) error(409, 'HOLD_NOT_ELIGIBLE', 'Pickup window expired');
      copy.status = 'Borrowed';
      if (matchedHold) { matchedHold.status = 'Fulfilled'; matchedHold.fulfilledAt = nowIso(); }
      const loan = { id: uuid(), readerId: reader.id, copyId: copy.id, checkedOutAt: nowIso(), dueAt: new Date(Date.now() + 14 * 86400000).toISOString(), returnedAt: null, renewedAt: null };
      state.loans.push(loan); return clone(loan);
    }
    if (id === 'return' && method === 'POST') {
      const copy = getCopy(body?.copyId);
      const loan = state.loans.find((l) => l.copyId === copy.id && !l.returnedAt) ?? error(404, 'NOT_FOUND', 'Active loan not found');
      loan.returnedAt = nowIso();
      if (body?.condition === 'Damaged' || body?.condition === 'Lost') copy.status = body.condition;
      else {
        const next = state.reservations.filter((r) => r.titleId === copy.titleId && r.status === 'Pending')
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id))[0];
        if (next) { copy.status = 'Reserved'; next.status = 'Ready'; next.heldCopyId = copy.id; next.readyAt = nowIso(); next.expiresAt = new Date(Date.now() + 72 * 3600000).toISOString(); }
        else copy.status = 'Available';
      }
      return { loan: clone(loan), copy: clone(copy) };
    }
    if (id === 'renew' && method === 'POST') {
      const loan = state.loans.find((l) => l.id === body?.loanId) ?? error(404, 'NOT_FOUND', 'Loan not found');
      const titleId = getCopy(loan.copyId).titleId;
      if (loan.returnedAt || isOverdue(loan) || loan.renewedAt || state.reservations.some((r) => r.titleId === titleId && active(r))) error(422, 'RENEWAL_NOT_ALLOWED', 'Loan is not eligible for renewal');
      loan.dueAt = new Date(new Date(loan.dueAt).getTime() + 14 * 86400000).toISOString();
      loan.renewedAt = nowIso(); return clone(loan);
    }
  }
  if (area === 'dashboard') {
    const role = currentReader();
    if (id === 'reader') {
      if (role.role !== 'Reader') error(403, 'FORBIDDEN', 'Reader dashboard only');
      const loans = state.loans.filter((l) => l.readerId === role.id);
      return { loans: clone(loans.map((loan) => ({ ...loan, overdue: isOverdue(loan) }))), reservations: state.reservations.filter((r) => r.readerId === role.id).map(queueEntry), overdueCount: loans.filter((loan) => isOverdue(loan)).length };
    }
    if (id === 'overdue') {
      if (role.role !== 'Librarian') error(403, 'FORBIDDEN', 'Librarian dashboard only');
      return { items: clone(state.loans.filter((loan) => isOverdue(loan))) };
    }
  }
  error(404, 'MOCK_ROUTE_NOT_FOUND', `Mock route is not implemented: ${method} ${url.pathname}`);
}

// Paths provided to request() are relative to /api, e.g. "books", NOT "/api/books".
export async function request(method, path, { body, params, token, signal } = {}) {
  const safePath = String(path).replace(/^\/+/, '');
  const apiRoot = baseUrl.startsWith('http') ? `${baseUrl}/` : new URL(`${baseUrl}/`, globalThis.location?.origin || 'http://localhost:5173').href;
  const url = new URL(safePath, apiRoot);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  if (mockMode) return clone(await mockRequest(method.toUpperCase(), url.pathname + url.search, body));
  const jwt = token === undefined ? getToken() : token;
  let response;
  try {
    response = await fetch(url, {
      method: method.toUpperCase(), signal,
      headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}) },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) { throw new ApiError('NETWORK_ERROR', err?.message || 'Unable to reach the server'); }
  if (response.status === 204) return null;
  let payload;
  try { payload = await response.json(); }
  catch { throw new ApiError('INVALID_RESPONSE', 'Server did not return valid JSON', response.status); }
  if (!response.ok) {
    const e = payload?.error;
    throw new ApiError(e?.code || `HTTP_${response.status}`, e?.message || 'Request failed', response.status);
  }
  return payload;
}
export const client = {
  get: (path, params, options) => request('GET', path, { params, ...options }),
  post: (path, body, options) => request('POST', path, { body, ...options }),
  patch: (path, body, options) => request('PATCH', path, { body, ...options }),
  delete: (path, options) => request('DELETE', path, options),
};
