'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/Toast";
import styles from "./layout.module.css";

export default function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <ToastProvider>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className={`${styles.main} ${sidebarOpen ? styles.open : ''}`}>
        <Header onMenuClick={toggleSidebar} />
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </ToastProvider>
  );
}