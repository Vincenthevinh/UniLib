// N1-W1 deterministic demonstration fixtures. All IDs are valid UUIDs.
// Shape aligns with Q1 DBML and F02-F04/F06 REST contract; no password hashes exposed.
const uuid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const iso = (daysFromNow, hours = 0) => new Date(Date.now() + daysFromNow * 86400000 + hours * 3600000).toISOString();
const users = [
  { id: uuid(1), username: 'reader.demo', email: 'reader@example.test', fullName: 'Demo Reader', role: 'Reader', isActive: true },
  { id: uuid(2), username: 'librarian.demo', email: 'librarian@example.test', fullName: 'Demo Librarian', role: 'Librarian', isActive: true },
  { id: uuid(3), username: 'admin.demo', email: 'admin@example.test', fullName: 'Demo Administrator', role: 'Administrator', isActive: true },
  { id: uuid(4), username: 'reader.two', email: 'reader2@example.test', fullName: 'Second Reader', role: 'Reader', isActive: true },
  { id: uuid(5), username: 'reader.inactive', email: 'inactive@example.test', fullName: 'Inactive Reader', role: 'Reader', isActive: false },
];
const categories = ['Computer Science', 'Mathematics', 'Medicine', 'Engineering', 'Literature'];
const titles = Array.from({ length: 20 }, (_, i) => ({
  id: uuid(100 + i), isbn: `978604${String(1000000 + i).padStart(7, '0')}`,
  title: ['Software Engineering', 'Data Structures', 'Database Systems', 'Web Development', 'Information Security', 'Operating Systems', 'Algorithms', 'Discrete Mathematics', 'Introduction to Statistics', 'Linear Algebra', 'Human Anatomy', 'Clinical Medicine', 'Pharmacology', 'Networks and Protocols', 'Cloud Computing', 'Machine Learning Fundamentals', 'Systems Analysis', 'Software Testing', 'Digital Libraries', 'Research Methods'][i],
  author: `Demo Author ${i + 1}`, category: categories[i % categories.length],
  publisher: 'UniLib Demo Press', publicationYear: 2010 + (i % 15), isActive: true,
  createdAt: iso(-40), updatedAt: iso(-1),
}));
const copies = titles.flatMap((t, i) => {
  const statusList = i === 0 ? ['Borrowed', 'Borrowed'] : i === 1 ? ['Borrowed', 'Reserved'] : i === 2 ? ['Damaged', 'Lost'] : ['Available', 'Available'];
  return statusList.map((status, j) => ({
    id: uuid(1000 + i * 2 + j), titleId: t.id, barcode: `UL-${String(i + 1).padStart(3, '0')}-${j + 1}`,
    shelfLocation: `S${1 + Math.floor(i / 5)}-${i % 5 + 1}`, conditionNotes: status === 'Damaged' ? 'Cover damaged' : null,
    status, createdAt: iso(-35), updatedAt: iso(-1),
  }));
});
const loans = [
  // Reader 1 has one overdue loan; Reader 2 has a non-overdue loan.
  { id: uuid(2001), readerId: users[0].id, copyId: copies[0].id, checkedOutAt: iso(-30), dueAt: iso(-16), returnedAt: null, renewedAt: null },
  { id: uuid(2002), readerId: users[3].id, copyId: copies[1].id, checkedOutAt: iso(-3), dueAt: iso(11), returnedAt: null, renewedAt: null },
  { id: uuid(2003), readerId: users[3].id, copyId: copies[2].id, checkedOutAt: iso(-2), dueAt: iso(12), returnedAt: null, renewedAt: null },
];
const reservations = [
  { id: uuid(3001), readerId: users[3].id, titleId: titles[0].id, heldCopyId: null, status: 'Pending', createdAt: iso(-2), readyAt: null, expiresAt: null, fulfilledAt: null, cancelledAt: null },
  { id: uuid(3002), readerId: users[0].id, titleId: titles[0].id, heldCopyId: null, status: 'Pending', createdAt: iso(-1), readyAt: null, expiresAt: null, fulfilledAt: null, cancelledAt: null },
  { id: uuid(3003), readerId: users[3].id, titleId: titles[1].id, heldCopyId: copies[3].id, status: 'Ready', createdAt: iso(-4), readyAt: iso(-1), expiresAt: iso(2), fulfilledAt: null, cancelledAt: null },
];
export const fixtures = { users, titles, copies, loans, reservations };
export const clone = (x) => structuredClone(x);
export const isOverdue = (loan, now = new Date()) => !loan.returnedAt && new Date(loan.dueAt).getTime() < now.getTime();
export const copySummary = (titleId, currentCopies = copies) => {
  const matched = currentCopies.filter((copy) => copy.titleId === titleId);
  const count = (status) => matched.filter((copy) => copy.status === status).length;
  return {
    totalCopies: matched.length, availableCopies: count('Available'), borrowedCopies: count('Borrowed'),
    reservedCopies: count('Reserved'), damagedCopies: count('Damaged'), lostCopies: count('Lost'),
    shelfLocations: [...new Set(matched.map((copy) => copy.shelfLocation))],
  };
};
export const queuePosition = (r, currentReservations = reservations) => {
  if (r.status !== 'Pending') return 0;
  const queue = currentReservations.filter((item) => item.titleId === r.titleId && item.status === 'Pending')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  return queue.findIndex((item) => item.id === r.id) + 1;
};
