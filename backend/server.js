require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

const LAST_NAME_INDEX = 'idx_employees_last_name';

app.use(cors());
app.use(express.json());

// Middleware logging sederhana
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ============================================
// Helper: mengukur waktu eksekusi query dalam ms
// menggunakan process.hrtime.bigint()
// ============================================
function startTimer() {
  return process.hrtime.bigint();
}

function endTimer(start) {
  const diff = process.hrtime.bigint() - start;
  return Number(diff) / 1_000_000; // nanosecond -> millisecond
}

async function runTimedQuery(sql, params = []) {
  const t0 = startTimer();
  const [rows] = await pool.query(sql, params);
  const executionTimeMs = endTimer(t0);

  return {
    rows,
    executionTimeMs: parseFloat(executionTimeMs.toFixed(4)),
  };
}

function getExplainSummary(explainRows) {
  const row = Array.isArray(explainRows) && explainRows.length > 0 ? explainRows[0] : null;

  if (!row) {
    return {
      type: null,
      key: null,
      rows: null,
      extra: null,
      isFullTableScan: false,
      isUsingLastNameIndex: false,
    };
  }

  return {
    type: row.type || null,
    key: row.key || null,
    rows: row.rows || null,
    extra: row.Extra || null,
    isFullTableScan: row.type === 'ALL',
    isUsingLastNameIndex: row.key === LAST_NAME_INDEX && row.type !== 'ALL',
  };
}

// ============================================
// ENDPOINT 1: GET /api/managers
// Mengambil data dari view v_manager_profile
// ============================================
app.get('/api/managers', async (req, res) => {
  try {
    const result = await runTimedQuery(
      'SELECT * FROM v_manager_profile ORDER BY history_id DESC'
    );

    res.json({
      success: true,
      data: result.rows,
      executionTimeMs: result.executionTimeMs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ============================================
// ENDPOINT 2: GET /api/employees/search?lastName=...
// Pencarian pegawai berdasarkan nama belakang
// Query menggunakan LIKE 'keyword%' agar index bisa digunakan
// ============================================
app.get('/api/employees/search', async (req, res) => {
  try {
    const { lastName } = req.query;

    if (!lastName || lastName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Parameter lastName diperlukan',
      });
    }

    const keyword = lastName.trim();

    const result = await runTimedQuery(
      `SELECT 
          employee_id, 
          first_name, 
          last_name, 
          email, 
          hire_date, 
          department_id
       FROM employees
       WHERE last_name LIKE CONCAT(?, "%")`,
      [keyword]
    );

    res.json({
      success: true,
      data: result.rows,
      executionTimeMs: result.executionTimeMs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ============================================
// ENDPOINT 3: GET /api/explain/search?lastName=...
// Endpoint lama tetap disediakan
// Menampilkan hasil EXPLAIN query pencarian saat index aktif
// ============================================
app.get('/api/explain/search', async (req, res) => {
  try {
    const { lastName } = req.query;

    if (!lastName || lastName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Parameter lastName diperlukan',
      });
    }

    const keyword = lastName.trim();

    const result = await runTimedQuery(
      `EXPLAIN
       SELECT 
          employee_id, 
          first_name, 
          last_name, 
          email, 
          hire_date, 
          department_id
       FROM employees
       WHERE last_name LIKE CONCAT(?, "%")`,
      [keyword]
    );

    res.json({
      success: true,
      explain: result.rows,
      executionTimeMs: result.executionTimeMs,
      summary: getExplainSummary(result.rows),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ============================================
// ENDPOINT 4: GET /api/explain/compare?lastName=...
// Membandingkan EXPLAIN sebelum dan sesudah index
//
// beforeIndex:
// menggunakan IGNORE INDEX untuk mensimulasikan kondisi sebelum index.
// Biasanya hasilnya type = ALL dan key = NULL.
//
// afterIndex:
// query normal, sehingga optimizer boleh memakai index.
// Biasanya hasilnya type = range dan key = idx_employees_last_name.
// ============================================
app.get('/api/explain/compare', async (req, res) => {
  try {
    const { lastName } = req.query;

    if (!lastName || lastName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Parameter lastName diperlukan',
      });
    }

    const keyword = lastName.trim();

    const beforeSql = `
      EXPLAIN
      SELECT 
          employee_id, 
          first_name, 
          last_name, 
          email, 
          hire_date, 
          department_id
      FROM employees IGNORE INDEX (${LAST_NAME_INDEX})
      WHERE last_name LIKE CONCAT(?, "%")
    `;

    const afterSql = `
      EXPLAIN
      SELECT 
          employee_id, 
          first_name, 
          last_name, 
          email, 
          hire_date, 
          department_id
      FROM employees
      WHERE last_name LIKE CONCAT(?, "%")
    `;

    const beforeResult = await runTimedQuery(beforeSql, [keyword]);
    const afterResult = await runTimedQuery(afterSql, [keyword]);

    const beforeSummary = getExplainSummary(beforeResult.rows);
    const afterSummary = getExplainSummary(afterResult.rows);

    res.json({
      success: true,
      keyword,
      indexName: LAST_NAME_INDEX,
      beforeIndex: {
        label: 'Sebelum index / simulasi tanpa index',
        explain: beforeResult.rows,
        executionTimeMs: beforeResult.executionTimeMs,
        summary: beforeSummary,
      },
      afterIndex: {
        label: 'Sesudah index',
        explain: afterResult.rows,
        executionTimeMs: afterResult.executionTimeMs,
        summary: afterSummary,
      },
      conclusion: {
        beforeIsFullTableScan: beforeSummary.isFullTableScan,
        afterUsesIndex: afterSummary.isUsingLastNameIndex,
        message:
          beforeSummary.isFullTableScan && afterSummary.isUsingLastNameIndex
            ? `Berhasil: sebelum index database melakukan Full Table Scan, sedangkan sesudah index database menggunakan ${LAST_NAME_INDEX}.`
            : 'Periksa kembali hasil EXPLAIN. Pastikan index sudah dibuat dan query menggunakan pola LIKE "keyword%".',
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ============================================
// Health check
// ============================================
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.json({
      status: 'OK',
      database: 'Connected',
    });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      database: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});