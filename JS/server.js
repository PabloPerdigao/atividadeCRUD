// configurações do servidor
const express = require('express');  // rotas API
const cors = require('cors');  
const pool = require('./db'); //

const app = express(); 

app.use(cors()); 
app.use(express.json()); 


app.use(express.static('public'));


// ROTAS

// POST - Cria integrante
app.post('/integrantes', async (req, res) => {
    try {
        const { nome, email, github, linkedin } = req.body;
        const query = `
            INSERT INTO integrantes_netuno (nome, email, github, linkedin)
            VALUES ($1, $2, $3, $4) 
            RETURNING *;
        `;
        const result = await pool.query(query, [nome, email, github, linkedin]);
        res.status(201).json({ mensagem: 'Integrante cadastrado com sucesso!', integrante: result.rows[0] });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro interno no servidor ao tentar cadastrar integrante.' });
    }
});

// GET - Lista integrantes
app.get('/integrantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM integrantes_netuno ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar a lista de integrantes.' });
    }
});


// inicializa o servidor 
const porta = 3000;
app.listen(porta, () => {
    console.log(`Servidor rodando e escutando na porta ${porta}`);
});