import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query(`
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'dbo'
      ORDER BY TABLE_NAME, ORDINAL_POSITION
    `);
    // Raw result from database:
    // [
    //   { TABLE_NAME: 'FARM', COLUMN_NAME: 'FARMID', DATA_TYPE: 'int', IS_NULLABLE: 'NO' },
    //   { TABLE_NAME: 'FARM', COLUMN_NAME: 'FARM_NAME____', DATA_TYPE: 'varchar', IS_NULLABLE: 'NO' },
    //   { TABLE_NAME: 'FARM', COLUMN_NAME: 'LOCATION', DATA_TYPE: 'varchar', IS_NULLABLE: 'YES' },
    //   { TABLE_NAME: 'DRIVER', COLUMN_NAME: 'DRIVERID', DATA_TYPE: 'int', IS_NULLABLE: 'NO' },
    //   // ... more rows
    // ]

    const tables = {};
    result.recordset.forEach(row => {
      if (!tables[row.TABLE_NAME]) {
        tables[row.TABLE_NAME] = {
          name: row.TABLE_NAME,
          displayName: row.TABLE_NAME.replace(/_/g, ' '),
          columns: [],
        };
      }
      tables[row.TABLE_NAME].columns.push({
        name: row.COLUMN_NAME,
        type: row.DATA_TYPE,
        nullable: row.IS_NULLABLE === 'YES',
      });
    });

    //  result:
    // [
    //   {
    //     name: 'FARM',
    //     displayName: 'FARM',
    //     columns: [
    //       { name: 'FARMID', type: 'int', nullable: false },
    //       { name: 'FARM_NAME____', type: 'varchar', nullable: false },
    //       { name: 'LOCATION', type: 'varchar', nullable: true }
    //     ]
    //   },.........]

    return NextResponse.json(Object.values(tables));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
