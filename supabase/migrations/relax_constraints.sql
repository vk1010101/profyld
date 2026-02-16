-- Relax constraints on Education table
ALTER TABLE education ALTER COLUMN year_range TYPE TEXT;
ALTER TABLE education ALTER COLUMN degree TYPE TEXT;
ALTER TABLE education ALTER COLUMN institution TYPE TEXT;
ALTER TABLE education ALTER COLUMN specialization TYPE TEXT;

-- Relax constraints on Experiences table
ALTER TABLE experiences ALTER COLUMN date_range TYPE TEXT;
ALTER TABLE experiences ALTER COLUMN title TYPE TEXT;
ALTER TABLE experiences ALTER COLUMN location TYPE TEXT;

-- Relax constraints on Skills table
ALTER TABLE skills ALTER COLUMN name TYPE TEXT;
ALTER TABLE skills ALTER COLUMN category TYPE TEXT;

-- Relax constraints on Projects table
ALTER TABLE projects ALTER COLUMN title TYPE TEXT;
ALTER TABLE projects ALTER COLUMN slug TYPE TEXT;
