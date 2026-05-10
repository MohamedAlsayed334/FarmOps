'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TableBrowser from './components/TableBrowser';
import TableInsert from './components/TableInsert';
import TableDelete from './components/TableDelete';
import TableUpdate from './components/TableUpdate';
import styles from './page.module.css';

const tabs = [
  { id: 'browse', label: 'Browse' },
  { id: 'insert', label: 'Insert' },
  { id: 'delete', label: 'Delete' },
  { id: 'update', label: 'Update' },
];

export default function TablePage() {
  const params = useParams();
  const tableName = params.tableName;
  const [activeTab, setActiveTab] = useState('browse');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className={styles.tablePage}>
      <div className={styles.pageHeader}>
        <h1>{tableName}</h1>
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'browse' && (
          <TableBrowser key={`browse-${refreshKey}`} tableName={tableName} />
        )}
        {activeTab === 'insert' && (
          <TableInsert tableName={tableName} onSuccess={handleRefresh} />
        )}
        {activeTab === 'delete' && (
          <TableDelete key={`delete-${refreshKey}`} tableName={tableName} onSuccess={handleRefresh} />
        )}
        {activeTab === 'update' && (
          <TableUpdate key={`update-${refreshKey}`} tableName={tableName} onSuccess={handleRefresh} />
        )}
      </div>
    </div>
  );
}
