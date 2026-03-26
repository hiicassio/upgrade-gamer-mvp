require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path'); // 👈 FALTAVA ISSO

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 👈 IMPORTANTE

// 👇 SERVIR ARQUIVOS DO FRONTEND (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'Public')));

// CONFIGURAÇÃO DO BANCO DE DADOS
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Silent88$', 
    database: 'xpzonecg' 
});

// CONEXÃO COM O BANCO
db.connect((err) => {
    if (err) {
        console.error('❌ Erro ao conectar no MySQL:');
        console.error(err);
        process.exit(1);
    }
    console.log('✅ Conectado ao MySQL com sucesso!');
});

// ================= ROTA TESTE =================
app.get('/api', (req, res) => {
    res.send('API XPZone rodando 🚀');
});

// ================= AUTENTICAÇÃO =================

// ROTA DE CADASTRO DE USUÁRIO
app.post('/usuarios', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ erro: 'Preencha todos os campos' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
        db.query(sql, [nome, email, senhaHash], (err, result) => {
            if (err) {
                console.error(err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ erro: 'Este email já está em uso!' });
                }
                return res.status(500).json({ erro: 'Erro ao cadastrar no banco' });
            }
            res.status(201).json({ mensagem: 'Gamer cadastrado com sucesso!' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: 'Erro no servidor' });
    }
});

// ROTA DE LOGIN
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ erro: 'Preencha email e senha' });
    }

    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    db.query(sql, [email], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: 'Erro no servidor' });
        }

        if (results.length === 0) {
            return res.status(401).json({ erro: 'Usuário não encontrado' });
        }

        const usuario = results[0];

        try {
            const senhaValida = await bcrypt.compare(senha, usuario.senha);

            if (!senhaValida) {
                return res.status(401).json({ erro: 'Senha incorreta' });
            }

            res.json({
                mensagem: 'Login realizado!',
                nome: usuario.nome
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: 'Erro ao validar senha' });
        }
    });
});

// ================= ANÚNCIOS =================

// ROTA PARA PUBLICAR ANÚNCIO
app.post('/anuncios', (req, res) => {
    const { titulo, preco, plataforma, whatsapp, foto_url } = req.body;

    const sql = 'INSERT INTO anuncios (titulo, preco, plataforma, whatsapp, foto_url) VALUES (?, ?, ?, ?, ?)';
    
    db.query(sql, [titulo, preco, plataforma, whatsapp, foto_url], (err, result) => {
        if (err) {
            console.error('❌ Erro no MySQL:', err);
            return res.status(500).json({ erro: 'Erro ao salvar anúncio' });
        }
        res.status(201).json({ mensagem: 'Anúncio publicado!', id: result.insertId });
    });
});

// ROTA PARA BUSCAR ANÚNCIOS
app.get('/anuncios', (req, res) => {
    const sql = 'SELECT * FROM anuncios ORDER BY created_at DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: 'Erro ao buscar anúncios' });
        }
        res.json(results);
    });
});

// INICIALIZAÇÃO DO SERVIDOR
app.listen(3000, () => {
    console.log('🚀 Servidor rodando em http://localhost:3000');
});