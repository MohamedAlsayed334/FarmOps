'use client';

import { useState, useEffect } from 'react';
import styles from './TableBrowser.module.css';

export default function TableBrowser({ tableName, onRefresh }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/tables/${encodeURIComponent(tableName)}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to fetch');
      }
      const result = await res.json();
      setData(result);
      if (result.length > 0) {
        setColumns(Object.keys(result[0]));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (value instanceof Date || (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value))) {
      return new Date(value).toLocaleString();
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading {tableName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        Error: {error}
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.browser}>
      <div className={styles.toolbar}>
        <span className={styles.info}>{data.length} records</span>
        <button className={styles.refreshBtn} onClick={onRefresh}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 4v6h-6M1 20v-6h6" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map(col => (
                    <td key={col}>{formatValue(row[col])}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}