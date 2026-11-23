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
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('UniLib — University Library Management System');
    await waitFor(() => {
      expect(screen.getByTestId('backend-status')).toHaveTextContent('ok');
    });
  });
});
