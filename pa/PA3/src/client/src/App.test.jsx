import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import App from './App.jsx';

describe('UniLib Client App Shell', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ status: 'ok', db: 'up' }),
    });
  });

  it('renders application header and title', async () => {
    render(<App />);
    const h1List = screen.getAllByRole('heading', { level: 1 });
    expect(h1List[0]).toHaveTextContent('UniLib — University Library Management System');
    await waitFor(() => {
      expect(screen.getByTestId('backend-status')).toHaveTextContent('ok');
    });
  });

  it('renders role shell navigation and SCR-01 login placeholder by default', async () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: /Quick role preview/i })).toBeInTheDocument();
    expect(screen.getAllByText(/SCR-01/).length).toBeGreaterThan(0);
    await waitFor(() => {
      expect(screen.getByTestId('backend-status')).toHaveTextContent('ok');
    });
  });
});