'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const [tablesExpanded, setTablesExpanded] = useState(true);
  const [queriesExpanded, setQueriesExpanded] = useState(true);

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.active : ''}`}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>F</div>
            <div className={styles.brand}>
              <h1>FarmOps</h1>
              <span>DB Manager</span>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span>Navigation</span>
            </div>
            <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
              <span className={styles.icon}>◈</span>
              <span className={styles.text}>Dashboard</span>
            </Link>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle} onClick={() => setTablesExpanded(!tablesExpanded)}>
              <span>Database Tables</span>
              <span className={styles.arrow}>{tablesExpanded ? '▾' : '▸'}</span>
            </div>
            {tablesExpanded && (
              <>
                <Link href="/tables/CROP_TYPE" className={`${styles.navItem} ${pathname === '/tables/CROP_TYPE' ? styles.active : ''}`}>
                  <span className={styles.icon}>🌱</span>
                  <span className={styles.text}>Crop Types</span>
                </Link>
                <Link href="/tables/FARM" className={`${styles.navItem} ${pathname === '/tables/FARM' ? styles.active : ''}`}>
                  <span className={styles.icon}>🏡</span>
                  <span className={styles.text}>Farms</span>
                </Link>
                <Link href="/tables/DRIVER" className={`${styles.navItem} ${pathname === '/tables/DRIVER' ? styles.active : ''}`}>
                  <span className={styles.icon}>🚚</span>
                  <span className={styles.text}>Drivers</span>
                </Link>
                <Link href="/tables/TRUCK" className={`${styles.navItem} ${pathname === '/tables/TRUCK' ? styles.active : ''}`}>
                  <span className={styles.icon}>🚛</span>
                  <span className={styles.text}>Trucks</span>
                </Link>
                <Link href="/tables/RESTAURANT" className={`${styles.navItem} ${pathname === '/tables/RESTAURANT' ? styles.active : ''}`}>
                  <span className={styles.icon}>🍽️</span>
                  <span className={styles.text}>Restaurants</span>
                </Link>
                <Link href="/tables/DELIVARY_TRIP" className={`${styles.navItem} ${pathname === '/tables/DELIVARY_TRIP' ? styles.active : ''}`}>
                  <span className={styles.icon}>🗺️</span>
                  <span className={styles.text}>Delivery Trips</span>
                </Link>
                <Link href="/tables/FARM_SPECIALIZATION" className={`${styles.navItem} ${pathname === '/tables/FARM_SPECIALIZATION' ? styles.active : ''}`}>
                  <span className={styles.icon}>🌾</span>
                  <span className={styles.text}>Farm Specializations</span>
                </Link>
                <Link href="/tables/HARVEST_BATCH" className={`${styles.navItem} ${pathname === '/tables/HARVEST_BATCH' ? styles.active : ''}`}>
                  <span className={styles.icon}>📦</span>
                  <span className={styles.text}>Harvest Batches</span>
                </Link>
                <Link href="/tables/ORDERS" className={`${styles.navItem} ${pathname === '/tables/ORDERS' ? styles.active : ''}`}>
                  <span className={styles.icon}>📋</span>
                  <span className={styles.text}>Orders</span>
                </Link>
                <Link href="/tables/ORDER_LINE" className={`${styles.navItem} ${pathname === '/tables/ORDER_LINE' ? styles.active : ''}`}>
                  <span className={styles.icon}>🛒</span>
                  <span className={styles.text}>Order Lines</span>
                </Link>
                <Link href="/tables/DELIVARY_TRIP_LINE" className={`${styles.navItem} ${pathname === '/tables/DELIVARY_TRIP_LINE' ? styles.active : ''}`}>
                  <span className={styles.icon}>🚗</span>
                  <span className={styles.text}>Delivery Trip Lines</span>
                </Link>
              </>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle} onClick={() => setQueriesExpanded(!queriesExpanded)}>
              <span>JOIN Queries</span>
              <span className={styles.arrow}>{queriesExpanded ? '▾' : '▸'}</span>
            </div>
            {queriesExpanded && (
              <>
                <Link href="/queries/orders-restaurants" className={`${styles.navItem} ${pathname === '/queries/orders-restaurants' ? styles.active : ''}`}>
                  <span className={styles.icon}>🔗</span>
                  <span className={styles.text}>Orders + Restaurants</span>
                </Link>
                <Link href="/queries/harvest-farms-crops" className={`${styles.navItem} ${pathname === '/queries/harvest-farms-crops' ? styles.active : ''}`}>
                  <span className={styles.icon}>🌾</span>
                  <span className={styles.text}>Harvest + Farms + Crops</span>
                </Link>
                <Link href="/queries/delivery-trips-resources" className={`${styles.navItem} ${pathname === '/queries/delivery-trips-resources' ? styles.active : ''}`}>
                  <span className={styles.icon}>🚚</span>
                  <span className={styles.text}>Trips + Drivers + Trucks</span>
                </Link>
                <Link href="/queries/order-lines-details" className={`${styles.navItem} ${pathname === '/queries/order-lines-details' ? styles.active : ''}`}>
                  <span className={styles.icon}>📦</span>
                  <span className={styles.text}>Order Lines + Harvest</span>
                </Link>
                <Link href="/queries/farm-specializations" className={`${styles.navItem} ${pathname === '/queries/farm-specializations' ? styles.active : ''}`}>
                  <span className={styles.icon}>🏡</span>
                  <span className={styles.text}>Farm + Specializations</span>
                </Link>
                <Link href="/queries/delivery-trip-lines" className={`${styles.navItem} ${pathname === '/queries/delivery-trip-lines' ? styles.active : ''}`}>
                  <span className={styles.icon}>🚗</span>
                  <span className={styles.text}>Trip Lines + Orders</span>
                </Link>
              </>
            )}
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <span>Inquiry Queries</span>
            </div>
            <Link href="/queries/top-crop-by-orders" className={`${styles.navItem} ${pathname === '/queries/top-crop-by-orders' ? styles.active : ''}`}>
              <span className={styles.icon}>📈</span>
              <span className={styles.text}>Top Crop by Orders</span>
            </Link>
            <Link href="/queries/farms-no-activity-last-month" className={`${styles.navItem} ${pathname === '/queries/farms-no-activity-last-month' ? styles.active : ''}`}>
              <span className={styles.icon}>🌾</span>
              <span className={styles.text}>Farms No Activity</span>
            </Link>
            <Link href="/queries/top-driver-last-month" className={`${styles.navItem} ${pathname === '/queries/top-driver-last-month' ? styles.active : ''}`}>
              <span className={styles.icon}>🏆</span>
              <span className={styles.text}>Top Driver</span>
            </Link>
            <Link href="/queries/restaurants-no-orders-last-month" className={`${styles.navItem} ${pathname === '/queries/restaurants-no-orders-last-month' ? styles.active : ''}`}>
              <span className={styles.icon}>🍽️</span>
              <span className={styles.text}>Inactive Restaurants</span>
            </Link>
            <Link href="/queries/restaurant-batches-last-month" className={`${styles.navItem} ${pathname === '/queries/restaurant-batches-last-month' ? styles.active : ''}`}>
              <span className={styles.icon}>📦</span>
              <span className={styles.text}>Restaurant Batches</span>
            </Link>
            <Link href="/queries/farm-revenue" className={`${styles.navItem} ${pathname === '/queries/farm-revenue' ? styles.active : ''}`}>
              <span className={styles.icon}>💰</span>
              <span className={styles.text}>Farm Revenue</span>
            </Link>
          </div>
        </nav>

        <div className={styles.footer}>
          <div className={styles.connectionBadge}>
            <div className={styles.dot} />
            <div className={styles.connectionInfo}>
              <div className={styles.label}>SQL Server</div>
              <div className={styles.value}>Connected</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}