CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username varchar(255) UNIQUE NOT NULL,
  password varchar(255) NOT NULL
);

INSERT INTO users (username, password)
VALUES
  ('tim', 'sibelius'),
  ('emily', 'beethoven'),
  ('douglas', 'ravel'),
  ('elaine', 'wagner');

SELECT id, username, password FROM users WHERE username='elaine';