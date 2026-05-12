'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import styles from './TableUpdate.module.css';

export default function TableUpdate({ tableName, onSuccess }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [updateValues, setUpdateValues] = useState({});
  const [conditionColumn, setConditionColumn] = useState('');
  const [conditionValue, setConditionValue] = useState('');
  const [updateMode, setUpdateMode] = useState('row');
  const [updating, setUpdating] = useState(false);
  const { success, error } = useToast();

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
      'ORDER_LINE': ['RESTAURANTID', 'ORDERID', 'ORDERLINEID', 'FARMID', 'BATCHID', 'QUANTITY'],
      'DELIVARY_TRIP_LINE': ['TRIP_ID', 'ORDER_LINE_ID', 'TRIPID', 'RESTAURANTID', 'ORDERID', 'ORDERLINEID', 'STOP_SEQUENCE', 'ACTUAL_DELIVERY_TIME'],
    };
    
    return columnsMap[tableName] || [];
  };

  const getColumnConfig = (colName) => {
    const configMap = {
      'CROP_TYPE': { 'CROPTYPEID': { type: 'number' }, 'CROPCATEGORY': { type: 'text' } },
      'FARM': { 'FARMID': { type: 'number' }, 'FARM_NAME____': { type: 'text' }, 'LOCATION': { type: 'text' }, 'CITY': { type: 'text' } },
      'DRIVER': { 'DRIVERID': { type: 'number' }, 'DRIVERNAME': { type: 'text' }, 'LICENSENUMBER': { type: 'number' } },
      'TRUCK': { 'TRUCK_ID': { type: 'number' }, 'TRUCK_REG': { type: 'text' }, 'CAPACITY_KG': { type: 'number' } },
      'RESTAURANT': { 'RESTAURANTID': { type: 'number' }, 'NAME': { type: 'text' }, 'DELIVERY_ADDRESS': { type: 'text' }, 'DELIVER_WINDOW': { type: 'text' }, 'CITY': { type: 'text' } },
      'DELIVARY_TRIP': { 'TRIPID': { type: 'number' }, 'DRIVERID': { type: 'number' }, 'TRUCK_ID': { type: 'number' }, 'TRIP_DATE': { type: 'text' }, 'ROUTE_NAME': { type: 'text' }, 'TOTAL_DISTANCE': { type: 'number' } },
      'FARM_SPECIALIZATION': { 'CROPTYPEID': { type: 'number' }, 'FARMID': { type: 'number' } },
      'HARVEST_BATCH': { 'FARMID': { type: 'number' }, 'BATCHID': { type: 'number' }, 'CROPTYPEID': { type: 'number' }, 'HARVEST_DATE': { type: 'text' }, 'AVAILABLE_QTY': { type: 'number' }, 'UNIT_PRICE': { type: 'number' } },
      'ORDERS': { 'RESTAURANTID': { type: 'number' }, 'ORDERID': { type: 'number' }, 'ORDER_DATE': { type: 'text' }, 'ORDER_STATUS': { type: 'text' } },
      'ORDER_LINE': { 'RESTAURANTID': { type: 'number' }, 'ORDERID': { type: 'number' }, 'ORDERLINEID': { type: 'number' }, 'FARMID': { type: 'number' }, 'BATCHID': { type: 'number' }, 'QUANTITY': { type: 'number' } },
      'DELIVARY_TRIP_LINE': { 'TRIP_ID': { type: 'number' }, 'ORDER_LINE_ID': { type: 'number' }, 'TRIPID': { type: 'number' }, 'RESTAURANTID': { type: 'number' }, 'ORDERID': { type: 'number' }, 'ORDERLINEID': { type: 'number' }, 'STOP_SEQUENCE': { type: 'number' }, 'ACTUAL_DELIVERY_TIME': { type: 'text' } },
    };
    
    return configMap[tableName]?.[colName] || { type: 'text' };
  };

  const getPrimaryKey = () => {
    const pkMap = {
      'CROP_TYPE': ['CROPTYPEID'],
      'FARM': ['FARMID'],
      'DRIVER': ['DRIVERID'],
      'TRUCK': ['TRUCK_ID'],
      'RESTAURANT': ['RESTAURANTID'],
      'DELIVARY_TRIP': ['TRIPID'],
      'FARM_SPECIALIZATION': ['CROPTYPEID', 'FARMID'],
      'HARVEST_BATCH': ['FARMID', 'BATCHID'],
      'ORDERS': ['RESTAURANTID', 'ORDERID'],
      'ORDER_LINE': ['RESTAURANTID', 'ORDERID', 'ORDERLINEID'],
      'DELIVARY_TRIP_LINE': ['TRIP_ID', 'ORDER_LINE_ID'],
    };
    return pkMap[tableName] || [];
  };

  useEffect(() => {
    fetchData();
  }, [tableName]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tables/${tableName}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      setData(result);
      
      const cols = getColumnNames();
      if (cols.length > 0) setConditionColumn(cols[0]);
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelect = (row) => {
    setSelectedRow(row);
    const newValues = {};
    getColumnNames().forEach(col => {
      newValues[col] = row[col];
    });
    setUpdateValues(newValues);
  };

  const handleValueChange = (colName, value) => {
    const config = getColumnConfig(colName);
    let processedValue = value;
    
    if (config.type === 'number') {
      processedValue = value === '' ? null : Number(value);
    }
    
    setUpdateValues(prev => ({
      ...prev,
      [colName]: processedValue
    }));
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);

      if (updateMode === 'row') {
        if (!selectedRow) {
          error('Please select a row to update');
          return;
        }

        const pk = getPrimaryKey();
        const pkValue = {};
        pk.forEach(col => { pkValue[col] = selectedRow[col]; });
        const updatedData = {};
        const condition = pkValue;

        getColumnNames().forEach(col => {
          if (!pk.includes(col) && updateValues[col] !== selectedRow[col]) {
            updatedData[col] = updateValues[col];
          }
        });

        if (Object.keys(updatedData).length === 0) {
          error('No changes detected');
          return;
        }

        await fetch(`/api/tables/${tableName}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableName, data: updatedData, condition })
        });
      } else {
        if (!conditionColumn || conditionValue === '') {
          error('Please provide condition column and value');
          return;
        }

        const updatedData = {};
        getColumnNames().forEach(col => {
          if (col !== conditionColumn) {
            updatedData[col] = updateValues[col];
          }
        });

        const hasUpdates = Object.keys(updatedData).some(col => {
          return updatedData[col] !== '' && updatedData[col] !== null && updatedData[col] !== undefined;
        });

        if (!hasUpdates) {
          error('Please provide at least one column to update');
          return;
        }

        let conditionValueProcessed = conditionValue;
        const colConfig = getColumnConfig(conditionColumn);
        if (colConfig.type === 'number') {
          conditionValueProcessed = Number(conditionValue);
        }

        const filteredData = {};
        Object.keys(updatedData).forEach(col => {
          if (updatedData[col] !== '' && updatedData[col] !== null && updatedData[col] !== undefined) {
            filteredData[col] = updatedData[col];
          }
        });

        const condition = { [conditionColumn]: conditionValueProcessed };

        await fetch(`/api/tables/${tableName}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableName, data: filteredData, condition })
        });
      }

      success('Record(s) updated successfully!');
      setSelectedRow(null);
      setUpdateValues({});
      setConditionValue('');
      onSuccess();
    } catch (err) {
      error(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (value instanceof Date || (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value))) {
      return new Date(value).toLocaleString();
    }
    return String(value);
  };

  const columns = getColumnNames();
  const pk = getPrimaryKey();

  return (
    <div className={styles.updateForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>✏️ Update Records</h2>
        <p className={styles.formDesc}>Select a row or use condition to update records in {tableName}</p>
      </div>

      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeBtn} ${updateMode === 'row' ? styles.active : ''}`}
          onClick={() => setUpdateMode('row')}
          disabled={loading}
        >
          Select Row
        </button>
        <button
          className={`${styles.modeBtn} ${updateMode === 'condition' ? styles.active : ''}`}
          onClick={() => setUpdateMode('condition')}
        >
          By Condition
        </button>
      </div>

      {updateMode === 'row' && (
        <div className={styles.rowMode}>
          <div className={styles.rowSelector}>
            <h3 className={styles.sectionTitle}>📋 Select a Row to Edit</h3>
            {loading ? (
              <div className={styles.loading}>
                <div className={styles.loadingSpinner}></div>
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
                    {data.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length} className={styles.empty}>
                          No records found
                        </td>
                      </tr>
                    ) : (
                      data.map((row, idx) => (
                        <tr
                          key={idx}
                          className={selectedRow === row ? styles.selectedRow : ''}
                          onClick={() => handleRowSelect(row)}
                          style={{ cursor: 'pointer' }}
                        >
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

          {selectedRow && (
            <div className={styles.editPanel}>
              <h3 className={styles.sectionTitle}>✏️ Edit Selected Row</h3>
              <div className={styles.editGrid}>
                {columns.map(colName => {
                  if (colName === pk) {
                    return (
                      <div key={colName} className={styles.formGroup}>
                        <label className={styles.label}>{colName} (Primary Key)</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={updateValues[colName] ?? ''}
                          disabled
                        />
                      </div>
                    );
                  }
                  
                  const config = getColumnConfig(colName);
                  return (
                    <div key={colName} className={styles.formGroup}>
                      <label className={styles.label}>{colName}</label>
                      <input
                        type={config.type === 'number' ? 'number' : 'text'}
                        className={styles.input}
                        value={updateValues[colName] ?? ''}
                        onChange={(e) => handleValueChange(colName, e.target.value)}
                        placeholder={`Enter ${colName.toLowerCase()}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {updateMode === 'condition' && (
        <div className={styles.conditionMode}>
          <div className={styles.conditionForm}>
            <h3 className={styles.sectionTitle}>🔍 WHERE Condition</h3>
            <div className={styles.conditionRow}>
              <div className={styles.conditionGroup}>
                <label className={styles.label}>Column</label>
                <select
                  className={styles.select}
                  value={conditionColumn}
                  onChange={(e) => setConditionColumn(e.target.value)}
                >
                  {columns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

              <div className={styles.conditionGroup}>
                <label className={styles.label}>Operator</label>
                <select className={styles.select} defaultValue="=">
                  <option value="=">=</option>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<=">&lt;=</option>
                  <option value="<>">!=</option>
                </select>
              </div>

              <div className={styles.conditionGroup}>
                <label className={styles.label}>Value</label>
                <input
                  type={getColumnConfig(conditionColumn).type === 'number' ? 'number' : 'text'}
                  className={styles.input}
                  value={conditionValue}
                  onChange={(e) => setConditionValue(e.target.value)}
                  placeholder="Enter value"
                />
              </div>
            </div>
          </div>

          <div className={styles.editPanel}>
            <h3 className={styles.sectionTitle}>✏️ Set New Values</h3>
            <div className={styles.editGrid}>
              {columns.filter(col => col !== conditionColumn).map(colName => {
                const config = getColumnConfig(colName);
                return (
                  <div key={colName} className={styles.formGroup}>
                    <label className={styles.label}>{colName}</label>
                    <input
                      type={config.type === 'number' ? 'number' : 'text'}
                      className={styles.input}
                      value={updateValues[colName] ?? ''}
                      onChange={(e) => handleValueChange(colName, e.target.value)}
                      placeholder={`New value for ${colName}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className={styles.formActions}>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleUpdate}
          disabled={updating || (updateMode === 'row' && !selectedRow)}
        >
          {updating ? 'Updating...' : 'Update Record(s)'}
        </button>
      </div>
    </div>
  );
}