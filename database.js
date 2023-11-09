import pkg from "pg";
const { Pool } = pkg;

const database = new Pool({
  user: "postgres",
  host: "localhost",
  password: "M9C6C53RTEQR",
  port: 5432,
  database: "digital_shop",
});

export default database;
