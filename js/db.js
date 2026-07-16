require("dotenv").config(); // variáveis de ambiente
const { Pool } = require("pg");

// Configuração do Pool - conexão com o banco Postgres
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,

  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erro ao conectar ao banco de dados:", err.stack);
  }
  console.log("Banco de dados conectado com sucesso!");
  release();
});

module.exports = pool;
