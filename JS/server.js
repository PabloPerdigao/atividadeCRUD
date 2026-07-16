// configuração do servidor
const express = require('express'); // rota API
const cors = require('cors');
const pool = require('./db'); 
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../'))); // config para entregar arquivos estáticos (HTML, CSS, JS) da pasta raiz do projeto

// ROTAS

// GET - Lista integrantes
app.get('/integrantes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM integrantes_netuno ORDER BY id ASC');
        res.status(200).json(result.rows);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao buscar a lista.' });
    }
});

// POST - Cria integrante
app.post('/integrantes', async (req, res) => {
    try {
        const { nome, email, github, linkedin } = req.body;
        const query = `
            INSERT INTO integrantes_netuno (nome, email, github, linkedin)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const result = await pool.query(query, [nome, email, github, linkedin]);
        res.status(201).json({ mensagem: 'Cadastrado com sucesso!', integrante: result.rows[0] });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao cadastrar.' });
    }
});

// PUT - Atualiza dados do integrante
app.put('/integrantes/:id', async (req, res) => {
    console.log(`[RASTREADOR] Recebeu pedido para EDITAR o ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        const { nome, email, github, linkedin } = req.body;

        const query = `
            UPDATE integrantes_netuno 
            SET nome = $1, email = $2, github = $3, linkedin = $4, data_atualizacao = NOW()
            WHERE id = $5 RETURNING *;
        `;
        const result = await pool.query(query, [nome, email, github, linkedin, id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ erro: 'Integrante não encontrado no banco.' });
        }
        res.status(200).json({ mensagem: 'Atualizado com sucesso!', integrante: result.rows[0] });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao atualizar.' });
    }
});

// DELETE - Exclui integrante
app.delete('/integrantes/:id', async (req, res) => {
    // console.log(`Pedido para EXCLUIR o ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM integrantes_netuno WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ erro: 'Integrante não encontrado no banco.' });
        }
        res.status(200).json({ mensagem: 'Excluído com sucesso!' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao excluir.' });
    }
});


const porta = process.env.PORT || 3000; // Define a porta do servidor, usando a variável de ambiente PORT se disponível, caso contrário, usa 3000.
app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});