import React, { useState, useEffect } from 'react';

export default function App() {
  const [serverHealth, setServerHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerHealth(data))
      .catch(() => setServerHealth({ status: 'offline', db: 'unknown' }));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>UniLib — University Library Management System</h1>
      <p>Team T05 · Baseline Application Shell</p>
      <section style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginTop: '1rem' }}>
        <h2>Backend Status</h2>
        <p data-testid="backend-status">
          API Status: <strong>{serverHealth ? serverHealth.status : 'Checking...'}</strong>
        </p>
        <p data-testid="db-status">
          Database: <strong>{serverHealth ? serverHealth.db : 'Checking...'}</strong>
        </p>
      </section>
    </main>
  );
}
