'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import styles from './TableDelete.module.css';

export default function TableDelete({ tableName, onSuccess }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [conditionColumn, setConditionColumn] = useState('');
  const [conditionOperator, setConditionOperator] = useState('=');
  const [conditionValue, setConditionValue] = useState('');
  const [deleteMode, setDeleteMode] = useState('selected');
  const [deleting, setDeleting] = useState(false);
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

      const pk = getPrimaryKey();
      if (pk.length === 1) {
        setConditionColumn(pk[0]);
      } else {
        const cols = getColumnNames();
        if (cols.length > 0) setConditionColumn(cols[0]);
      }
    } catch (err) {
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (rowKey) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowKey)) {
      newSelected.delete(rowKey);
    } else {
      newSelected.add(rowKey);
    }
    setSelectedRows(newSelected);
  };

  const getRowKey = (row) => {
    return JSON.stringify(row);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      if (deleteMode === 'selected') {
        if (selectedRows.size === 0) {
          error('Please select at least one row to delete');
          return;
        }

        const pk = getPrimaryKey();
        for (const rowJson of selectedRows) {
          const row = JSON.parse(rowJson);
          const condition = {};
          pk.forEach(col => { condition[col] = row[col]; });

          await fetch(`/api/tables/${tableName}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tableName, condition })
          });
        }
      } else {
        if (!conditionColumn || conditionValue === '') {
          error('Please provide condition column and value');
          return;
        }

        let conditionValueProcessed = conditionValue;
        const colConfig = getColumnConfig(conditionColumn);
        if (colConfig.type === 'number') {
          conditionValueProcessed = Number(conditionValue);
        }

        const condition = { [conditionColumn]: conditionValueProcessed };

        await fetch(`/api/tables/${tableName}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tableName, condition })
        });
      }

      success(`Deleted ${selectedRows.size > 0 ? selectedRows.size : 'matching'} record(s) successfully!`);
      setSelectedRows(new Set());
      setConditionValue('');
      onSuccess();
    } catch (err) {
      error(err.message);
    } finally {
      setDeleting(false);
    }
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

  const formatValue = (value) => {
    if (value === null || value === undefined) return '—';
    if (value instanceof Date || (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T/.test(value))) {
      return new Date(value).toLocaleString();
    }
    return String(value);
  };

  const columns = getColumnNames();

  return (
    <div className={styles.deleteForm}>
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>🗑️ Delete Records</h2>
        <p className={styles.formDesc}>Select rows or use conditions to delete records from {tableName}</p>
      </div>

      <div className={styles.modeSelector}>
        <button
          className={`${styles.modeBtn} ${deleteMode === 'selected' ? styles.active : ''}`}
          onClick={() => setDeleteMode('selected')}
          disabled={loading}
        >
          Select Rows
        </button>
        <button
          className={`${styles.modeBtn} ${deleteMode === 'condition' ? styles.active : ''}`}
          onClick={() => setDeleteMode('condition')}
        >
          By Condition
        </button>
      </div>

      {deleteMode === 'selected' && (
        <div className={styles.selectMode}>
          <div className={styles.selectionInfo}>
            {selectedRows.size > 0 ? (
              <span className={styles.selectedCount}>{selectedRows.size} row(s) selected</span>
            ) : (
              <span className={styles.hint}>Click rows to select for deletion</span>
            )}
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkboxCol}></th>
                    {columns.map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className={styles.empty}>
                        No records to delete
                      </td>
                    </tr>
                  ) : (
                    data.map((row, idx) => {
                      const rowKey = getRowKey(row);
                      return (
                        <tr key={idx} className={selectedRows.has(rowKey) ? styles.selectedRow : ''}>
                          <td className={styles.checkboxCol}>
                            <input
                              type="checkbox"
                              checked={selectedRows.has(rowKey)}
                              onChange={() => toggleRow(rowKey)}
                            />
                          </td>
                          {columns.map(col => (
                            <td key={col} title={formatValue(row[col])}>
                              {formatValue(row[col])}
                            </td>
                          ))}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {deleteMode === 'condition' && (
        <div className={styles.conditionMode}>
          <div className={styles.conditionForm}>
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
                <select
                  className={styles.select}
                  value={conditionOperator}
                  onChange={(e) => setConditionOperator(e.target.value)}
                >
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

            <div className={styles.conditionPreview}>
              DELETE FROM {tableName} WHERE {conditionColumn} {conditionOperator} {conditionValue || '?'}
            </div>
          </div>
        </div>
      )}

      <div className={styles.formActions}>
        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          onClick={handleDelete}
          disabled={deleting || (deleteMode === 'selected' && selectedRows.size === 0)}
        >
          {deleting ? 'Deleting...' : `Delete ${deleteMode === 'selected' ? selectedRows.size : ''} Record(s)`}
        </button>
      </div>
    </div>
  );
}