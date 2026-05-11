-- genders table for storing gender codes and labels
CREATE TABLE genders (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  gender_label VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- gender selections table to track which genders are assigned to users
CREATE TABLE gender_selections (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  gender_id INT NOT NULL,
  selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gender_id) REFERENCES genders(id) ON DELETE CASCADE
);

-- insert sample data
INSERT INTO genders (code, gender_label, description) 
VALUES 
  ('1', 'Male - ذكر', 'Male gender'),
  ('2', 'Female - أنثى', 'Female gender');