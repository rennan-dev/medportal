// Importar o módulo express
const express = require('express');

// Extraindo a função Router do módulo express
const router = express.Router();

//importar o módulo para armanezar a sessão de login
const session = require('express-session');

// Configuração do middleware de sessão
router.use(session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: true
}));

// Importar módulo de serviços
const servico = require('../services/medportal_services');
const conexao = require('../bd/conexao_mysql');

// Defina suas rotas aqui
router.get('/', (req, res) => {
    res.send('Rota principal');
});

//rota de login no sistema
router.get('/login', function(req,res) {
    servico.paginaLogin(req,res);
});

// Exportar o router
module.exports = router;

// Ou se estiver usando CommonJS
// module.exports = router; 
