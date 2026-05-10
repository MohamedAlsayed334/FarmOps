import sql from 'mssql';

const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool = null;

export async function getConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

export async function query(sqlString, params = []) {
  const pool = await getConnection();
  const request = pool.request();

  params.forEach((param) => {
    if (param.value === null || param.value === undefined) {
      request.input(param.name, sql.VarChar, null);
    } else if (typeof param.value === 'number') {
      request.input(param.name, sql.Int, param.value);
    } else if (typeof param.value === 'float') {
      request.input(param.name, sql.Float, param.value);
    } else {
      request.input(param.name, sql.VarChar, String(param.value));
    }
  });

  const result = await request.query(sqlString);
  return result;
}

export default { getConnection, query };
