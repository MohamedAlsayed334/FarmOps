'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Dashboard() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/schema');
        if (res.ok) {
          const data = await res.json();
          setTables(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6'];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Database Dashboard</h1>
      <p className={styles.subtitle}>Connected to SQL Server - FarmDelivaryDB</p>
      
      <div className={styles.grid}>
        {tables.map((table, index) => (
          <Link
            key={table.name}
            href={`/tables/${table.name}`}
            className={styles.card}
            style={{ borderTop: `4px solid ${colors[index % colors.length]}` }}
          >
            <div className={styles.cardTitle}>{table.displayName}</div>
            <div className={styles.cardInfo}>
              {table.columns.length} columns
            </div>
          </Link>
        ))}
      </div>
      
      {loading && <div className={styles.loading}>Loading...</div>}
    </div>
  );
}
