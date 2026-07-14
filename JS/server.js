require("dotenv").config(); // carregar variáveis de ambiente do arquivo .env

//  configurações do servidor
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); // gerenciar conexões com o PostgreSQL

const app = express();

app.use(cors());
app.use(express.json());


// config de conexão com o PostGres
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


pool.connect((err, client, release) => {
  if(err) {
    return console.error("Erro ao conectar ao banco de dados", err.strack);
  }

  console.log(`Conectado ao banco ${process.env.DB_NAME} com sucesso!`);
});


const porta = 3000;

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
