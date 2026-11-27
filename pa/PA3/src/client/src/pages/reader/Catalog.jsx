import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Input,
  Select,
  Badge,
  EmptyState,
  Pagination,
  Alert,
  Button,
} from '../../components';
import api from '../../api/endpoints';

const PAGE_SIZE = 10;

function resolveAvailableCount(item) {
  if (typeof item.availableCopies === 'number') return item.availableCopies;
  if (typeof item.available === 'number') return item.available;
  if (Array.isArray(item.copies)) {
    return item.copies.filter((c) => c.status === 'Available').length;
  }
  return 0;
}

export default function Catalog() {
  const [books, setBooks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [availableNow, setAvailableNow] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = {
        q: searchQuery.trim() || undefined,
        category: category || undefined,
        available: availableNow ? 'true' : undefined,
        sort: sortBy,
        order: sortDir,
        page,
        pageSize: PAGE_SIZE,
      };
      const result = await api.books.search(params);
      const items = Array.isArray(result)
        ? result
        : result?.items || result?.books || [];
      setBooks(items);
      setPagination(result?.pagination || null);
    } catch (err) {
      setErrorMsg(
        err?.error?.message || err?.message || 'Failed to load catalog titles.'
      );
    } finally {
      setLoading(false);
    }
  }, [searchQuery, category, availableNow, sortBy, sortDir, page]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const categories = useMemo(() => {
    const unique = new Set(books.map((b) => b.category).filter(Boolean));
    return Array.from(unique);
  }, [books]);

  const filteredSortedBooks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matches = books.filter((item) => {
      const queryMatch =
        !q ||
        [item.title, item.author, item.category, item.isbn]
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(q));
      const categoryMatch =
        !category ||
        String(item.category || '').toLowerCase() === category.toLowerCase();
      const availMatch = !availableNow || resolveAvailableCount(item) > 0;
      return queryMatch && categoryMatch && availMatch;
    });

    return [...matches].sort((a, b) => {
      if (sortBy === 'year') {
        const yearA = Number(a.publicationYear ?? a.year ?? 0);
        const yearB = Number(b.publicationYear ?? b.year ?? 0);
        return sortDir === 'desc' ? yearB - yearA : yearA - yearB;
      }
      const titleA = String(a.title || '');
      const titleB = String(b.title || '');
      return sortDir === 'desc'
        ? titleB.localeCompare(titleA)
        : titleA.localeCompare(titleB);
    });
  }, [books, searchQuery, category, availableNow, sortBy, sortDir]);

  const totalItems =
    typeof pagination?.total === 'number'
      ? pagination.total
      : filteredSortedBooks.length;
  const totalPages = Math.max(
    1,
    pagination?.totalPages || Math.ceil(totalItems / PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages);
  const visibleBooks =
    filteredSortedBooks.length > PAGE_SIZE
      ? filteredSortedBooks.slice(
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE
        )
      : filteredSortedBooks;

  return (
    <section aria-labelledby="scr05-title">
      <h1 id="scr05-title">SCR-05 · Catalog Search & Browse</h1>

      {errorMsg && (
        <Alert variant="error" role="alert">
          <span>{errorMsg}</span>
          <Button type="button" variant="secondary" onClick={loadCatalog}>
            Retry
          </Button>
        </Alert>
      )}

      <div className="catalog-toolbar" role="region" aria-label="Catalog filters">
        <Input
          id="catalog-search-input"
          label="Search (Title, Author, Category, ISBN)"
          type="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
        />

        <Select
          id="catalog-category-select"
          label="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          options={[
            { value: '', label: 'All Categories' },
            ...categories.map((cat) => ({ value: cat, label: cat })),
          ]}
        />

        <label className="catalog-checkbox" htmlFor="catalog-available-now">
          <input
            id="catalog-available-now"
            type="checkbox"
            checked={availableNow}
            onChange={(e) => {
              setAvailableNow(e.target.checked);
              setPage(1);
            }}
          />
          <span>Available now</span>
        </label>

        <Select
          id="catalog-sort-select"
          label="Sort by"
          value={`${sortBy}:${sortDir}`}
          onChange={(e) => {
            const [nextField, nextDir] = e.target.value.split(':');
            setSortBy(nextField || 'title');
            setSortDir(nextDir || 'asc');
            setPage(1);
          }}
          options={[
            { value: 'title:asc', label: 'Title (A–Z)' },
            { value: 'title:desc', label: 'Title (Z–A)' },
            { value: 'year:desc', label: 'Year (Newest)' },
            { value: 'year:asc', label: 'Year (Oldest)' },
          ]}
        />
      </div>

      {loading ? (
        <p aria-live="polite" aria-busy="true">
          Loading catalog titles...
        </p>
      ) : visibleBooks.length === 0 ? (
        <EmptyState
          title="No matching titles found"
          description="Try adjusting your search keyword, category filter, or Available now toggle."
        />
      ) : (
        <>
          <div className="catalog-grid">
            {visibleBooks.map((book) => {
              const availCount = resolveAvailableCount(book);
              const bookId = book.id ?? book.titleId;
              return (
                <article key={bookId} className="catalog-card">
                  <h2>
                    <Link to={`/reader/books/${bookId}`}>{book.title}</Link>
                  </h2>
                  <p>Author: {book.author || '—'}</p>
                  <p>
                    Category: {book.category || '—'} · Year:{' '}
                    {book.publicationYear ?? book.year ?? '—'}
                  </p>
                  <p>ISBN: {book.isbn || '—'}</p>
                  <p>
                    <Badge status={availCount > 0 ? 'Available' : 'Inactive'}>
                      {availCount > 0
                        ? `Available (${availCount})`
                        : 'Unavailable'}
                    </Badge>
                  </p>
                  <Link to={`/reader/books/${bookId}`}>View details</Link>
                </article>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        </>
      )}
    </section>
  );
}