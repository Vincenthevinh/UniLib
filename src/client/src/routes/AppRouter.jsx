import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import ReaderLayout from "../layouts/ReaderLayout";
import LibrarianLayout from "../layouts/LibrarianLayout";
import AdminLayout from "../layouts/AdminLayout";
import RequireRole from "../components/RequireRole";

import Login from "../pages/Login";
import Catalog from "../pages/reader/Catalog";
import BookDetail from "../pages/reader/BookDetail";
import Dashboard from "../pages/reader/Dashboard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* A2: SCR-01 Login */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      {/* A2, A3, A4: Reader flow (SCR-05, SCR-06, SCR-11 + ReserveModal SCR-09) */}
      <Route
        path="/reader"
        element={
          <RequireRole allowedRoles={["Reader"]}>
            <ReaderLayout />
          </RequireRole>
        }
      >
        <Route index element={<Navigate to="/reader/catalog" replace />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="books/:bookId" element={<BookDetail />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>

      {/* Role entry routes guarded by RequireRole (A4) */}
      <Route
        path="/librarian/*"
        element={
          <RequireRole allowedRoles={["Librarian"]}>
            <LibrarianLayout />
          </RequireRole>
        }
      />
      <Route
        path="/admin/*"
        element={
          <RequireRole allowedRoles={["Administrator"]}>
            <AdminLayout />
          </RequireRole>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
