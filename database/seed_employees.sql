-- Seed script untuk menambah data dummy employees dan menyalin ke tabel frontend
-- File: database/seed_employees.sql
-- Cara pakai:
-- 1) Jalankan file ini di MySQL: `mysql -u <user> -p < manager_sdm_db < database/seed_employees.sql`
-- 2) Atau source dari client MySQL: `SOURCE database/seed_employees.sql;`

USE manager_sdm_db;

-- Opsi A: Stored procedure untuk menambahkan N dummy employees
DROP PROCEDURE IF EXISTS proc_insert_dummy_n;
DELIMITER //
CREATE PROCEDURE proc_insert_dummy_n(IN p_count INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE last_names TEXT DEFAULT 'Smith,Johnson,Williams,Jones,Brown,Davis,Miller,Wilson,Moore,Taylor,Anderson,Thomas,Jackson,White,Harris,Martin,Thompson,Garcia,Martinez,Robinson,Clark,Rodriguez,Lewis,Lee,Walker,Hall,Allen,Young,Hernandez,King,Wright,Lopez,Hill,Scott,Green,Adams,Baker,Gonzalez,Nelson,Carter,Mitchell,Perez,Roberts,Turner,Phillips,Campbell,Parker,Evans,Edwards,Collins,Stewart,Sanchez,Morris,Rogers,Reed,Cook,Morgan,Bell,Murphy,Bailey,Rivera,Cooper,Richardson,Cox,Ward,Peterson,Gray,Ramirez,James,Watson,Brooks,Kelly,Sanders,Price,Bennett,Wood,Barnes,Ross,Henderson,Coleman,Jenkins,Perry,Powell,Long,Patterson,Hughes,Flores,Washington,Butler,Simpson,Alexander,Salazar,Russell,Griffin,Diaz,Hayes,Myers,Ford,Hamilton,Graham,Sullivan,Wallace,Woods,Cole,West,Jordan,Owens,Reynolds,Fisher,Ellis,Harrison,Gibson,Mcdonald,Cruz,Marshall,Ortiz,Gomez,Murray,Freeman,Wells';
    DECLARE lname VARCHAR(50);
    DECLARE pos INT DEFAULT 1;
    DECLARE next_pos INT DEFAULT 1;
    DECLARE total_lnames INT DEFAULT 109;
    DECLARE lidx INT DEFAULT 0;

    WHILE i <= p_count DO
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
            CONCAT('User', LPAD(i, 6, '0')),
            lname,
            CONCAT('user', LPAD(i, 6, '0'), '@company.com'),
            DATE_ADD('2010-01-01', INTERVAL FLOOR(RAND()*5000) DAY),
            FLOOR(1 + RAND() * 5)
        );
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

-- Contoh pemanggilan: tambahkan 1000 dummy
-- CALL proc_insert_dummy_n(1000);

-- Opsi B: Buat tabel `frontend_employees` dan salin semua data dari `employees`
-- Pilihan 1: membuat table hasil select (sederhana, tanpa constraints/index)
DROP TABLE IF EXISTS frontend_employees;
CREATE TABLE frontend_employees AS
SELECT * FROM employees;

-- Jika ingin mempertahankan struktur lengkap (index/constraints), gunakan:
-- DROP TABLE IF EXISTS frontend_employees;
-- CREATE TABLE frontend_employees LIKE employees;
-- INSERT INTO frontend_employees SELECT * FROM employees;

-- Contoh: jika ingin menyinkronkan ulang data kapan saja, jalankan:
-- TRUNCATE TABLE frontend_employees;
-- INSERT INTO frontend_employees SELECT * FROM employees;

-- Tambahan: buat index pada kolom last_name di frontend_employees untuk pencarian cepat
CREATE INDEX IF NOT EXISTS idx_frontend_last_name ON frontend_employees(last_name);

-- Verifikasi jumlah baris
SELECT COUNT(*) AS total_employees FROM employees;
SELECT COUNT(*) AS total_frontend_employees FROM frontend_employees;
