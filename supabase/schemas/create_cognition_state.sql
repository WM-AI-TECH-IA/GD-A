CREATE TABLE `cognition_state` (
  id serial PRIMARY KEY,
  present text,
  past text,
  future text,
  strategy text,
  timestamp timestamp DEFAULT NULL  REFERENCES current_date
);