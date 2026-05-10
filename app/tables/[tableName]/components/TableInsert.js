'use client';

import { useState } from 'react';
import { useToast } from '@/components/Toast';
import styles from './TableInsert.module.css';

const columnTypes = {
  'int': 'number',
  'float': 'number',
  'numeric': 'number',
  'varchar': 'text',
  'datetime2': 'datetime-local',
};

export default function TableInsert({ tableName, onSuccess }) {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error } = useToast();

  const getColumnConfig = (colName) => {
    const configMap = {
      'CROP_TYPE': {
        'CROPTYPEID': { type: 'number', required: true },
        'CROPCATEGORY': { type: 'text', required: true },
      },
      'FARM': {
        'FARMID': { type: 'number', required: true },
        'FARM_NAME____': { type: 'text', required: true, displayName: 'FARM_NAME' },
        'LOCATION': { type: 'text', required: false },
        'CITY': { type: 'text', required: false },
      },
      'DRIVER': {
        'DRIVERID': { type: 'number', required: true },
        'DRIVERNAME': { type: 'text', required: true },
        'LICENSENUMBER': { type: 'number', required: true },
      },
      'TRUCK': {
        'TRUCK_ID': { type: 'number', required: true },
        'TRUCK_REG': { type: 'text', required: true },
        'CAPACITY_KG': { type: 'number', required: true },
      },
      'RESTAURANT': {
        'RESTAURANTID': { type: 'number', required: true },
        'NAME': { type: 'text', required: true },
        'DELIVERY_ADDRESS': { type: 'text', required: true },
        'DELIVER_WINDOW': { type: 'datetime-local', required: false },
        'CITY': { type: 'text', required: false },
      },
      'DELIVARY_TRIP': {
        'TRIPID': { type: 'number', required: true },
        'DRIVERID': { type: 'number', required: true },
        'TRUCK_ID': { type: 'number', required: true },
        'TRIP_DATE': { type: 'datetime-local', required: true },
        'ROUTE_NAME': { type: 'text', required: true },
        'TOTAL_DISTANCE': { type: 'number', required: false },
      },
      'FARM_SPECIALIZATION': {
        'CROPTYPEID': { type: 'number', required: true },
        'FARMID': { type: 'number', required: true },
      },
      'HARVEST_BATCH': {
        'FARMID': { type: 'number', required: true },
        'BATCHID': { type: 'number', required: true },
        'CROPTYPEID': { type: 'number', required: true },
        'HARVEST_DATE': { type: 'datetime-local', required: true },
        'AVAILABLE_QTY': { type: 'number', required: true },
        'UNIT_PRICE': { type: 'number', required: true },
      },
      'ORDERS': {
        'RESTAURANTID': { type: 'number', required: true },
        'ORDERID': { type: 'number', required: true },
        'ORDER_DATE': { type: 'datetime-local', required: false },
        'ORDER_STATUS': { type: 'text', required: false },
      },
      'ORDER_LINE': {
        'RESTAURANTID': { type: 'number', required: true },
        'ORDERID': { type: 'number', required: true },
        'ORDERLINEID': { type: 'number', required: true },
        'FARMID': { type: 'number', required: true },
        'BATCHID': { type: 'number', required: true },
        'TRIP_ID': { type: 'number', required: false },
        'ORDER_LINE_ID': { type: 'number', required: false },
        'QUANTITY': { type: 'number', required: true },
      },
      'DELIVARY_TRIP_LINE': {
        'TRIP_ID': { type: 'number', required: true },
        'ORDER_LINE_ID': { type: 'number', required: true },
        'TRIPID': { type: 'number', required: true },
        'RESTAURANTID': { type: 'number', required: true },
        'ORDERID': { type: 'number', required: true },
        'ORDERLINEID': { type: 'number', required: true },
        'STOP_SEQUENCE': { type: 'number', required: true },
        'ACTUAL_DELIVERY_TIME': { type: 'datetime-local', required: true },
      },
    };
    
    return configMap[tableName]?.[colName] || { type: 'text', required: false };
  };

  const getColumnNames = () => {
    const columnsMap = {
      'CROP_TYPE': ['CROPTYPEID', 'CROPCATEGORY'],
      'FARM': ['FARMID', 'FARM_NAME____', 'LOCATION', 'CITY'],
      'DRIVER': ['DRIVERID', 'DRIVERNAME', 'LICENSENUMBER'],
      'TRUCK': ['TRUCK_ID', 'TRUCK_REG', 'CAPACITY_KG'],
      'RESTAURANT': ['RESTAURANTID', 'NAME', 'DELIVERY_ADDRESS', 'DELIVER_WINDOW', 'CITY'],
      'DELIVARY_TRIP': ['TRIPID', 'DRIVERID', 'TRUCK_ID', 'TRIP_DATE', 'ROUTE_NAME', 'TOTAL_DISTANCE'],
      'FARM_SPECIALIZATION': ['CROPTYPEID', 'FARMID'],
      'HARVEST_BATCH': ['FARMID', 'BATCHID', 'CROPTYPEID', 'HARVEST_DATE', 'AVAILABLE_QTY', 'UNIT_PRICE'],
      'ORDERS': ['RESTAURANTID', 'ORDERID', 'ORDER_DATE', 'ORDER_STATUS'],
      'ORDER_LINE': ['RESTAURANTID', 'ORDERID', 'ORDERLINEID', 'FARMID', 'BATCHID', 'TRIP_ID', 'ORDER_LINE_ID', 'QUANTITY'],
      'DELIVARY_TRIP_LINE': ['TRIP_ID', 'ORDER_LINE_ID', 'TRIPID', 'RESTAURANTID', 'ORDERID', 'ORDERLINEID', 'STOP_SEQUENCE', 'ACTUAL_DELIVERY_TIME'],
    };
    
    return columnsMap[tableName] || [];
  };

  const handleChange = (colName, value) => {
    const config = getColumnConfig(colName);
    let processedValue = value;
    
    if (config.type === 'number') {
      processedValue = value === '' ? null : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [colName]: processedValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const required = getColumnNames().filter(col => getColumnConfig(col).required);
    const missing = required.filter(col => !formData[col] && formData[col] !== 0);
    
    if (missing.length > 0) {
      error(`Please fill in all required fields: ${missing.join(', ')}`);
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch(`/api/tables/${tableName}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName,
          data: formData
        })
      });
      
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Insert failed');
      
      success('Record inserted successfully!');
      setFormData({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      onSuccess();
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({});
  };

  const columns = getColumnNames();

  return (
    <div className={styles.insertForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>➕ Insert New Record</h2>
        <p className={styles.formDesc}>Fill in the values for the new record in {tableName}</p>
      </div>

      {submitted && (
        <div className={styles.successBanner}>
          ✓ Record inserted successfully! Form has been reset.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          {columns.map(colName => {
            const config = getColumnConfig(colName);
            const displayName = config.displayName || colName;
            
            return (
              <div key={colName} className={styles.formGroup}>
                <label className={styles.label}>
                  {displayName}
                  {config.required && <span className={styles.required}>*</span>}
                </label>
                <input
                  type={config.type}
                  className={styles.input}
                  value={formData[colName] ?? ''}
                  onChange={(e) => handleChange(colName, e.target.value)}
                  placeholder={`Enter ${displayName.toLowerCase()}`}
                  required={config.required}
                />
              </div>
            );
          })}
        </div>

        <div className={styles.formActions}>
          <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={handleReset}>
            Reset
          </button>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
            {loading ? 'Inserting...' : 'Insert Record'}
          </button>
        </div>
      </form>
    </div>
  );
}