'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';

export default function Header({ onMenuClick }) {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>
            {pathname === '/' ? 'Dashboard' : 
             pathname.startsWith('/tables/') ? (pathname.split('/').pop().replace(/_/g, ' ')) :
             pathname.startsWith('/queries/') ? (pathname.split('/').pop().replace(/-/g, ' + ')) :
             'FarmOps'}
          </h1>
          <span className={styles.subtitle}>
            {pathname === '/' ? 'System overview & statistics' :
             pathname.startsWith('/tables/') ? 'Table operations' :
             pathname.startsWith('/queries/') ? 'JOIN query result' :
             'DB Manager'}
          </span>
        </div>
      </div>
      
      <div className={styles.right}>
        <Link href="/" className={styles.homeBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Home
        </Link>
        <div className={styles.statusBadge}>
          <span className={styles.statusDot} />
          <span>Connected</span>
        </div>
      </div>
    </header>
  );
}