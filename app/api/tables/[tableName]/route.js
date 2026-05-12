import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { tableName } = await params;
    const result = await query(`SELECT * FROM [${tableName}]`);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const tableName = body.tableName;
    const data = body.data;

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const columns = Object.keys(data);
    const values = Object.values(data).map(val => {
      if (val && typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
        return val.replace('T', ' ') + ':00';
      }
      return val;
    });
    const columnsClause = columns.map(col => `[${col}]`).join(', ');
    const valuesClause = values.map((_, i) => `@p${i}`).join(', ');

    const sql = `INSERT INTO [${tableName}] (${columnsClause}) VALUES (${valuesClause})`;
    const params = values.map((val, i) => ({ name: `p${i}`, value: val }));

    await query(sql, params);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const tableName = body.tableName;
    const data = body.data;
    const condition = body.condition;

    if (!data || !condition) {
      return NextResponse.json({ error: 'Invalid data or condition' }, { status: 400 });
    }

    const processValue = (val) => {
      if (val && typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) {
        return val.replace('T', ' ') + ':00';
      }
      return val;
    };

    const dataColumns = Object.keys(data);
    const condColumns = Object.keys(condition);
    const setClause = dataColumns.map((col, i) => `[${col}] = @s${i}`).join(', ');
    const whereClause = condColumns.map((col, i) => `[${col}] = @w${i}`).join(' AND ');

    const sql = `UPDATE [${tableName}] SET ${setClause} WHERE ${whereClause}`;
    const params = [
      ...dataColumns.map((col, i) => ({ name: `s${i}`, value: processValue(data[col]) })),
      ...condColumns.map((col, i) => ({ name: `w${i}`, value: processValue(condition[col]) })),
    ];

    const result = await query(sql, params);
    return NextResponse.json({ success: true, updated: result.rowsAffected[0] });
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();
    const tableName = body.tableName;
    const condition = body.condition;
    
    if (!condition) {
      return NextResponse.json({ error: 'Condition required' }, { status: 400 });
    }
    
    const condColumns = Object.keys(condition);
    const whereClause = condColumns.map((col, i) => `[${col}] = @p${i}`).join(' AND ');
    const sql = `DELETE FROM [${tableName}] WHERE ${whereClause}`;
    const params = condColumns.map((col, i) => ({ name: `p${i}`, value: condition[col] }));
    
    const result = await query(sql, params);
    return NextResponse.json({ success: true, deleted: result.rowsAffected[0] });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
