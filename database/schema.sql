-- MySQL 8+ / MariaDB 10.4+. Import into an existing empty Hostinger database.
-- No CREATE DATABASE, user creation, DROP, or destructive table replacement.
SET NAMES utf8mb4;
CREATE TABLE IF NOT EXISTS nombres_meta (
  meta_key VARCHAR(80) CHARACTER SET ascii COLLATE ascii_bin NOT NULL PRIMARY KEY,
  meta_value TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS nombres_names (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  name VARCHAR(160) NOT NULL,
  gender CHAR(1) CHARACTER SET ascii NOT NULL,
  origin VARCHAR(120) NOT NULL,
  meaning TEXT NOT NULL,
  note TEXT NULL,
  context TEXT NULL,
  native_form VARCHAR(160) NULL,
  saint VARCHAR(64) NULL,
  tags_json LONGTEXT NOT NULL,
  variants_json LONGTEXT NULL,
  review_json LONGTEXT NOT NULL,
  compare_json LONGTEXT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY nombres_slug_unique (slug),
  KEY nombres_gender (gender),
  KEY nombres_origin (origin),
  CONSTRAINT nombres_gender_valid CHECK (gender IN ('f','m','u')),
  CONSTRAINT nombres_tags_valid CHECK (JSON_VALID(tags_json)),
  CONSTRAINT nombres_variants_valid CHECK (variants_json IS NULL OR JSON_VALID(variants_json)),
  CONSTRAINT nombres_review_valid CHECK (JSON_VALID(review_json)),
  CONSTRAINT nombres_compare_valid CHECK (compare_json IS NULL OR JSON_VALID(compare_json))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO nombres_meta (meta_key,meta_value) VALUES ('schema_version','1')
ON DUPLICATE KEY UPDATE meta_value=VALUES(meta_value);
