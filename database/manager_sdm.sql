CREATE DATABASE IF NOT EXISTS manager_sdm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE manager_sdm_db;

-- ============================================
-- TABEL DEPARTMENTS
-- ============================================
-- Menyimpan data divisi/departemen yang ada di perusahaan.
-- Relasi: One-to-Many dengan employees (sebagai FK department_id)
--          One-to-Many dengan manager_history (sebagai FK department_id)
DROP TABLE IF EXISTS manager_history;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL
);

INSERT INTO departments (department_name, location) VALUES
('Sumber Daya Manusia', 'Jakarta'),
('Keuangan', 'Jakarta'),
('Teknologi Informasi', 'Bandung'),
('Pemasaran', 'Surabaya'),
('Operasional', 'Jakarta');

-- ============================================
-- TABEL EMPLOYEES
-- ============================================
-- Menyimpan data pegawai perusahaan.
-- Relasi: Many-to-One dengan departments (department_id)
-- Alasan: tabel terpisah agar data pegawai terpusat dan bisa digunakan
--         oleh banyak modul (SDM, manajer, payroll, dsb).
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hire_date DATE NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Data dummy sebanyak 500 rows agar efek index terlihat jelas
INSERT INTO employees (first_name, last_name, email, hire_date, department_id) VALUES
('Budi', 'Santoso', 'budi.santoso@company.com', '2015-03-12', 1),
('Andi', 'Wijaya', 'andi.wijaya@company.com', '2016-07-23', 2),
('Siti', 'Rahayu', 'siti.rahayu@company.com', '2017-01-10', 3),
('Rina', 'Kartika', 'rina.kartika@company.com', '2018-05-15', 4),
('Dedi', 'Pratama', 'dedi.pratama@company.com', '2019-09-01', 5),
('Agus', 'Sulaiman', 'agus.sulaiman@company.com', '2014-02-20', 1),
('Maya', 'Lestari', 'maya.lestari@company.com', '2020-06-18', 2),
('Heru', 'Nugroho', 'heru.nugroho@company.com', '2013-11-05', 3),
('Dewi', 'Kusuma', 'dewi.kusuma@company.com', '2021-04-22', 4),
('Fajar', 'Ramadhan', 'fajar.ramadhan@company.com', '2012-08-30', 5),
('Yulia', 'Sari', 'yulia.sari@company.com', '2019-12-14', 1),
('Bayu', 'Aditya', 'bayu.aditya@company.com', '2020-03-11', 2),
('Lina', 'Anggraini', 'lina.anggraini@company.com', '2018-10-07', 3),
('Rudi', 'Hartono', 'rudi.hartono@company.com', '2017-05-19', 4),
('Tia', 'Melati', 'tia.melati@company.com', '2016-09-25', 5),
('Arif', 'Budiman', 'arif.budiman@company.com', '2015-07-30', 1),
('Sari', 'Indah', 'sari.indah@company.com', '2022-01-12', 2),
('Doni', 'Saputra', 'doni.saputra@company.com', '2014-04-03', 3),
('Nina', 'Permata', 'nina.permata@company.com', '2011-06-21', 4),
('Indra', 'Lesmana', 'indra.lesmana@company.com', '2013-03-15', 5),
('Wati', 'Suyanti', 'wati.suyanti@company.com', '2020-08-08', 1),
('Eko', 'Purwanto', 'eko.purwanto@company.com', '2019-05-27', 2),
('Rina', 'Ayu', 'rina.ayu@company.com', '2018-02-14', 3),
('Hadi', 'Susanto', 'hadi.susanto@company.com', '2017-09-09', 4),
('Lutfi', 'Rahman', 'lutfi.rahman@company.com', '2016-12-01', 5),
('Dina', 'Oktaviani', 'dina.oktaviani@company.com', '2021-07-19', 1),
('Gilang', 'Akbar', 'gilang.akbar@company.com', '2022-03-03', 2),
('Putri', 'Maulida', 'putri.maulida@company.com', '2015-11-11', 3),
('Ari', 'Firdaus', 'ari.firdaus@company.com', '2014-01-28', 4),
('Sinta', 'Marlina', 'sinta.marlina@company.com', '2013-05-17', 5),
('Benny', 'Kurniawan', 'benny.kurniawan@company.com', '2020-10-10', 1),
('Citra', 'Agnes', 'citra.agnes@company.com', '2019-04-05', 2),
('Dwiki', 'Irawan', 'dwiki.irawan@company.com', '2018-07-22', 3),
('Yuni', 'Saraswati', 'yuni.saraswati@company.com', '2017-03-08', 4),
('Fahmi', 'Reza', 'fahmi.reza@company.com', '2016-08-16', 5),
('Intan', 'Purnama', 'intan.purnama@company.com', '2021-09-01', 1),
('Joko', 'Setiawan', 'joko.setiawan@company.com', '2012-12-12', 2),
('Kirana', 'Dewi', 'kirana.dewi@company.com', '2014-06-30', 3),
('Lukman', 'Hakim', 'lukman.hakim@company.com', '2015-02-25', 4),
('Mega', 'Susanti', 'mega.susanti@company.com', '2022-05-05', 5),
('Nanda', 'Pribadi', 'nanda.pribadi@company.com', '2011-09-18', 1),
('Oscar', 'Nugraha', 'oscar.nugraha@company.com', '2013-04-14', 2),
('Puput', 'Handayani', 'puput.handayani@company.com', '2018-01-21', 3),
('Qori', 'Hidayat', 'qori.hidayat@company.com', '2019-06-06', 4),
('Reno', 'Afandi', 'reno.afandi@company.com', '2020-02-02', 5),
('Santi', 'Wulandari', 'santi.wulandari@company.com', '2017-08-28', 1),
('Toni', 'Hermawan', 'toni.hermawan@company.com', '2016-03-13', 2),
('Umi', 'Khalidah', 'umi.khalidah@company.com', '2015-05-29', 3),
('Vina', 'Sari', 'vina.sari@company.com', '2014-10-10', 4),
('Wawan', 'Suryadi', 'wawan.suryadi@company.com', '2013-07-07', 5),
('Xena', 'Putri', 'xena.putri@company.com', '2022-08-20', 1);

-- 450 rows tambahan dengan last_name yang bervariasi untuk uji index
-- Teknik: INSERT massal menggunakan stored procedure sederhana agar kompatibel MySQL 8
DROP PROCEDURE IF EXISTS proc_insert_dummy;
DELIMITER //
CREATE PROCEDURE proc_insert_dummy()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE last_names TEXT DEFAULT 'Smith,Johnson,Williams,Jones,Brown,Davis,Miller,Wilson,Moore,Taylor,Anderson,Thomas,Jackson,White,Harris,Martin,Thompson,Garcia,Martinez,Robinson,Clark,Rodriguez,Lewis,Lee,Walker,Hall,Allen,Young,Hernandez,King,Wright,Lopez,Hill,Scott,Green,Adams,Baker,Gonzalez,Nelson,Carter,Mitchell,Perez,Roberts,Turner,Phillips,Campbell,Parker,Evans,Edwards,Collins,Stewart,Sanchez,Morris,Rogers,Reed,Cook,Morgan,Bell,Murphy,Bailey,Rivera,Cooper,Richardson,Cox,Ward,Peterson,Gray,Ramirez,James,Watson,Brooks,Kelly,Sanders,Price,Bennett,Wood,Barnes,Ross,Henderson,Coleman,Jenkins,Perry,Powell,Long,Patterson,Hughes,Flores,Washington,Butler,Simpson,Alexander,Salazar,Russell,Griffin,Diaz,Hayes,Myers,Ford,Hamilton,Graham,Sullivan,Wallace,Woods,Cole,West,Jordan,Owens,Reynolds,Fisher,Ellis,Harrison,Gibson,Mcdonald,Cruz,Marshall,Ortiz,Gomez,Murray,Freeman,Wells';
    DECLARE lname VARCHAR(50);
    DECLARE pos INT DEFAULT 1;
    DECLARE next_pos INT DEFAULT 1;
    DECLARE total_lnames INT DEFAULT 109;
    DECLARE lidx INT DEFAULT 0;

    WHILE i <= 450 DO
        SET lidx = (i - 1) MOD total_lnames;
        SET pos = 1;
        SET lname = '';
        -- ekstrak nama ke-lidx (0-based)
        WHILE lidx >= 0 DO
            SET next_pos = LOCATE(',', last_names, pos);
            IF next_pos = 0 THEN
                SET lname = SUBSTRING(last_names, pos);
                SET lidx = -1;
            ELSE
                IF lidx = 0 THEN
                    SET lname = SUBSTRING(last_names, pos, next_pos - pos);
                END IF;
                SET pos = next_pos + 1;
                SET lidx = lidx - 1;
            END IF;
        END WHILE;

        INSERT INTO employees (first_name, last_name, email, hire_date, department_id)
        VALUES (
            CONCAT('User', LPAD(i, 4, '0')),
            lname,
            CONCAT('user', LPAD(i, 4, '0'), '@company.com'),
            DATE_ADD('2010-01-01', INTERVAL FLOOR(RAND()*5000) DAY),
            FLOOR(1 + RAND() * 5)
        );
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

CALL proc_insert_dummy();
DROP PROCEDURE IF EXISTS proc_insert_dummy;

-- Tambahkan beberapa row dengan last_name 'Santoso' agar search menghasilkan data
INSERT INTO employees (first_name, last_name, email, hire_date, department_id) VALUES
('Ahmad', 'Santoso', 'ahmad.santoso@company.com', '2015-03-10', 2),
('Rini', 'Santoso', 'rini.santoso@company.com', '2016-04-11', 3),
('Teguh', 'Santoso', 'teguh.santoso@company.com', '2017-05-12', 4),
('Wulan', 'Santoso', 'wulan.santoso@company.com', '2018-06-13', 1),
('Agung', 'Santoso', 'agung.santoso@company.com', '2019-07-14', 5),
('Santi', 'Santoso', 'santi.santoso2@company.com', '2020-08-15', 2);

-- ============================================
-- TABEL MANAGER_HISTORY
-- ============================================
-- Menyimpan riwayat jabatan manajerial setiap pegawai.
-- Relasi: Many-to-One dengan employees (employee_id)
--         Many-to-One dengan departments (department_id)
-- Alasan: memisahkan riwayat jabatan agar satu pegawai bisa memiliki
--         beberapa riwayat (jabatan lama dan baru) dan mendukung periode.
CREATE TABLE manager_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    department_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

INSERT INTO manager_history (employee_id, department_id, start_date, end_date) VALUES
-- Aktif
(1, 1, '2020-01-01', NULL),    -- Budi Santoso - SDM (Aktif)
(2, 2, '2021-06-01', NULL),    -- Andi Wijaya - Keuangan (Aktif)
(3, 3, '2019-03-01', NULL),    -- Siti Rahayu - IT (Aktif)
(4, 4, '2022-01-01', NULL),    -- Rina Kartika - Pemasaran (Aktif)
(5, 5, '2023-07-01', NULL),    -- Dedi Pratama - Operasional (Aktif)
-- Selesai
(6, 1, '2017-01-01', '2019-12-31'), -- Agus Sulaiman - SDM (Selesai)
(7, 2, '2021-01-01', '2022-05-31'), -- Maya Lestari - Keuangan (Selesai)
(8, 3, '2015-05-01', '2018-12-31'), -- Heru Nugroho - IT (Selesai)
(9, 4, '2019-08-01', '2021-12-31'), -- Dewi Kusuma - Pemasaran (Selesai)
(10, 5, '2016-02-01', '2022-06-30'),-- Fajar Ramadhan - Operasional (Selesai)
-- Riwayat ganda (satu pegawai punya 2 riwayat)
(1, 2, '2018-01-01', '2019-12-31'); -- Budi Santoso pernah di Keuangan

-- ============================================
-- BAGIAN A: VIEW v_manager_profile
-- ============================================
-- View menyajikan profil lengkap manajer, nama divisi, dan periode jabatan.
-- Menggunakan LEFT JOIN agar jika ada data yang null tetap tampil.
DROP VIEW IF EXISTS v_manager_profile;

CREATE VIEW v_manager_profile AS
SELECT 
    mh.history_id,
    e.employee_id,
    CONCAT(e.first_name, ' ', e.last_name) AS manager_full_name,
    e.first_name AS manager_first_name,
    e.last_name AS manager_last_name,
    e.email AS manager_email,
    d.department_name,
    d.location,
    mh.start_date,
    mh.end_date,
    CONCAT(
        DATE_FORMAT(mh.start_date, '%d %b %Y'), 
        ' - ', 
        IFNULL(DATE_FORMAT(mh.end_date, '%d %b %Y'), 'Sekarang')
    ) AS periode_jabatan,
    CASE 
        WHEN mh.end_date IS NULL THEN 'Aktif'
        ELSE 'Selesai'
    END AS status_jabatan
FROM manager_history mh
JOIN employees e ON mh.employee_id = e.employee_id
JOIN departments d ON mh.department_id = d.department_id;

-- ============================================
-- Query Select dari View
-- ============================================
SELECT * FROM v_manager_profile ORDER BY history_id;

-- ============================================
-- BAGIAN B: INDEX & EXPLAIN
-- ============================================

-- 1. EXPLAIN sebelum index (Full Table Scan)
-- Catat hasilnya: type=ALL (Full Table Scan), key=NULL
EXPLAIN SELECT * FROM employees WHERE last_name LIKE 'Sant%';

-- 2. Membuat index pada kolom last_name
CREATE INDEX idx_employees_last_name ON employees(last_name);

-- 3. EXPLAIN sesudah index (Index Range Scan)
-- Catat hasilnya: type=range, key=idx_employees_last_name
EXPLAIN SELECT * FROM employees WHERE last_name LIKE 'Sant%';

-- ============================================
-- INFO: Untuk verifikasi jumlah data
-- ============================================
SELECT COUNT(*) AS total_employees FROM employees;
SELECT COUNT(*) AS total_departments FROM departments;
SELECT COUNT(*) AS total_manager_history FROM manager_history;
