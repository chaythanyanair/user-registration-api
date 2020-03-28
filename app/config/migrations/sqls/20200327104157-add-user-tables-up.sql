CREATE TYPE roles AS enum('admin', 'observer', 'editor');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL,
  email VARCHAR(255),
  first_name VARCHAR(255) DEFAULT NULL,
  last_name VARCHAR(255) DEFAULT NULL,
  password VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS user_role (
  user_id INTEGER NOT NULL ,
  role roles,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INTEGER DEFAULT 1,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id),
  PRIMARY KEY (user_id, role)
);

