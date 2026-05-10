'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.css';

const queryInfo = {
  'orders-restaurants': { name: 'Orders + Restaurants', desc: 'View all orders with their restaurant details' },
  'harvest-farms-crops': { name: 'Harvest + Farms + Crop Types', desc: 'Complete harvest batch information with farm and crop details' },
  'delivery-trips-resources': { name: 'Delivery Trips + Drivers + Trucks', desc: 'View delivery trips with assigned driver and truck information' },
  'order-lines-details': { name: 'Order Lines + Harvest + Farms', desc: 'View order line items with their harvest batch and farm sources' },
  'farm-specializations': { name: 'Farm Specializations', desc: 'View which crops each farm specializes in' },
  'delivery-trip-lines': { name: 'Delivery Trip Lines + Orders', desc: 'View delivery stops with their order details' },
};

export default function QueryPage() {
  const params = useParams();
  const queryName = params.queryName;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [columns, setColumns] = useState([]);

  const info = queryInfo[queryName] || { name: queryName, desc: '' };

  useEffect(() => {
    fetchData();
  }, [queryName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/queries?name=${queryName}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      setData(result.data || []);
      if (result.data?.length > 0) {
        setColumns(Object.keys(result.data[0]));
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(row =>
    Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date || (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value))) {
      try {
        return new Date(value).toLocaleString();
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  return (
    <div className={styles.queryPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerInfo}>
          <h1 className={styles.title}>{info.name}</h1>
          <p className={styles.subtitle}>{info.desc}</p>
        </div>
        <div className={styles.toolbar}>
          <div className="search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-ghost btn-sm" onClick={fetchData}>
            ↻ Refresh
          </button>
        </div>
      </div>

      <div className={styles.resultCard}>
        <div className={styles.resultHeader}>
          <span className={styles.resultCount}>{filteredData.length} results</span>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className="loading-spinner"></div>
            <p>Loading query results...</p>
          </div>
        ) : (
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
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className={styles.empty}>
                      <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <div className="empty-text">No results found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, idx) => (
                    <tr key={idx}>
                      {columns.map(col => (
                        <td key={col} title={formatValue(row[col])}>
                          {formatValue(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}