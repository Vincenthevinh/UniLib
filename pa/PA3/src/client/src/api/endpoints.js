import { client, clearToken, setToken } from './client.js';

// F02-F04/F06 paths and shapes: confirmed by Quan's UniLib W1 REST API Contract.
// F01/F05/F07 paths: PROVISIONAL adapters pending Vinh's integration contract.
const enc = (id) => encodeURIComponent(String(id));
export const api = {
  auth: {
    async login(credentials) {
      const result = await client.post('auth/login', credentials); // PROVISIONAL
      if (result?.token) setToken(result.token);
      return result;
    },
    async logout() {
      try { return await client.post('auth/logout'); } // PROVISIONAL
      finally { clearToken(); }
    },
    me: () => client.get('auth/me'), // PROVISIONAL
  },
  users: {
    list: () => client.get('users'), // PROVISIONAL F01 Admin
    get: (id) => client.get(`users/${enc(id)}`),
    create: (data) => client.post('users', data),
    update: (id, data) => client.patch(`users/${enc(id)}`, data),
  },
  books: {
    search: (filters = {}) => client.get('books', filters),
    get: (id) => client.get(`books/${enc(id)}`),
    create: (data) => client.post('books', data),
    update: (id, patch) => client.patch(`books/${enc(id)}`, patch),
    remove: (id) => client.delete(`books/${enc(id)}`),
  },
  copies: {
    list: (titleId) => client.get(`books/${enc(titleId)}/copies`),
    create: (titleId, data) => client.post(`books/${enc(titleId)}/copies`, data),
    update: (id, patch) => client.patch(`copies/${enc(id)}`, patch),
    remove: (id) => client.delete(`copies/${enc(id)}`),
  },
  circulation: {
    eligibility: (readerId, barcode) => client.get('circulation/eligibility', { readerId, barcode }), // PROVISIONAL N3 F05 preview; NOT part of Vinh's confirmed API
    checkout: (readerId, copyId) => client.post('circulation/checkout', { readerId, copyId }), // PROVISIONAL F05
    checkin: (copyId, condition) => client.post('circulation/return', { copyId, condition }), // PROVISIONAL F05
    renew: (loanId) => client.post('circulation/renew', { loanId }), // PROVISIONAL F05
  },
  reservations: {
    create: (titleId) => client.post('reservations', { titleId }), // readerId comes from JWT
    mine: () => client.get('reservations/me'),
    queue: (titleId) => client.get('reservations/queue', titleId ? { titleId } : {}),
    cancel: (id) => client.delete(`reservations/${enc(id)}`),
  },
  dashboard: {
    reader: () => client.get('dashboard/reader'), // PROVISIONAL F07
    overdue: () => client.get('dashboard/overdue'), // PROVISIONAL F07
  },
};
export default api;
