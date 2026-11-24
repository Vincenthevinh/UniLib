import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import ReaderLayout from '../layouts/ReaderLayout';
import LibrarianLayout from '../layouts/LibrarianLayout';
import AdminLayout from '../layouts/AdminLayout';

import SCR01LoginPage from '../pages/SCR01LoginPage';
import SCR02AdminUsersPage from '../pages/SCR02AdminUsersPage';
import SCR03LibrarianCatalogPage from '../pages/SCR03LibrarianCatalogPage';
import SCR04LibrarianCopiesPage from '../pages/SCR04LibrarianCopiesPage';
import SCR05CatalogSearchPage from '../pages/SCR05CatalogSearchPage';
import SCR06BookDetailPage from '../pages/SCR06BookDetailPage';
import SCR07BorrowBookPage from '../pages/SCR07BorrowBookPage';
import SCR08ReturnBookPage from '../pages/SCR08ReturnBookPage';
import SCR09ReservationModalPage from '../pages/SCR09ReservationModalPage';
import SCR10HoldShelfPage from '../pages/SCR10HoldShelfPage';
import SCR11ReaderDashboardPage from '../pages/SCR11ReaderDashboardPage';
import SCR12OverdueMonitoringPage from '../pages/SCR12OverdueMonitoringPage';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public / Authentication */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<SCR01LoginPage />} />
      </Route>

      {/* Reader Routes */}
      <Route path="/reader" element={<ReaderLayout />}>
        <Route index element={<Navigate to="/reader/dashboard" replace />} />
        <Route path="dashboard" element={<SCR11ReaderDashboardPage />} />
        <Route path="catalog" element={<SCR05CatalogSearchPage />} />
        <Route path="books/:id" element={<SCR06BookDetailPage />} />
        <Route path="reservations/confirm" element={<SCR09ReservationModalPage />} />
      </Route>

      {/* Librarian Routes */}
      <Route path="/librarian" element={<LibrarianLayout />}>
        <Route index element={<Navigate to="/librarian/borrow" replace />} />
        <Route path="catalog" element={<SCR03LibrarianCatalogPage />} />
        <Route path="copies" element={<SCR04LibrarianCopiesPage />} />
        <Route path="search" element={<SCR05CatalogSearchPage />} />
        <Route path="books/:id" element={<SCR06BookDetailPage />} />
        <Route path="borrow" element={<SCR07BorrowBookPage />} />
        <Route path="return" element={<SCR08ReturnBookPage />} />
        <Route path="holds" element={<SCR10HoldShelfPage />} />
        <Route path="overdue" element={<SCR12OverdueMonitoringPage />} />
      </Route>

      {/* Administrator Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<SCR02AdminUsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}