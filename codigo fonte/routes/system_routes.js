//importar o módulo express
const express = require('express');

//extraindo a função Router do módulo express
const router = express.Router();

//importar o módulo para armanezar a sessão de login
const session = require('express-session');

//configuração do middleware de sessão
router.use(session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: true
}));

//importar módulo de serviços
const servico = require('../services/medportal_services');
const conexao = require('../bd/conexao_mysql');

//rota de login no sistema
router.get('/login', function(req,res) {
    servico.paginaLogin(req,res);
});

//rota feita para o usuário deslogar de forma segura do sistema
router.get('/logout', function(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao destruir a sessão:', err);
            return res.status(500).send('Erro ao sair.');
        }
        res.redirect('/login'); 
    });
});

//rota para cadastro do usuário comum no sistema
router.get('/cadastro', function(req,res) {
    servico.cadastroPaciente(req,res);
});
//rota para cadastro de usuário comum no sistema
router.post('/cadastro', function(req, res) {
    servico.cadastroPacienteForm(req, res);
});

//rota que mostra a tela inicial do sistema
router.get('/index', function(req,res) {
    servico.paginaInicial(req,res);
});
router.get('/', function(req,res) {
    servico.paginaInicial(req,res);
});

//rota para a criação de um perfil de um profissional da saúde
router.get('/cadastroMedico', function(req,res) {
    servico.paginaCadastroMedico(req,res);
});

//redirecionado para a pagina home ao ser cadastrado ou feito login
router.get('/home', servico.verificaAutenticacao, function(req, res) {
    servico.paginaHome(req, res);
});

router.post('/login', function(req, res) {
    servico.login(req, res);
});

//rota para cadastro de médicos
router.post('/cadastroMedico', function(req, res) {
    servico.cadastroMedicoForm(req, res);
});

//rota para página home_medico (após autenticação do médico)
router.get('/home_medico', servico.verificaAutenticacao, function(req, res) {
    servico.paginaHomeMedico(req, res);
});

//rota que somente o cliente poderá acessar
router.get('/agendamento', servico.verificaAutenticacaoCliente, function(req, res) {
    servico.paginaAgendamento(req, res);
});

router.post('/agendamento', servico.verificaAutenticacaoCliente, function(req,res) {
    servico.agendamentoForm(req,res);
});

//rota para atualizar o status do agendamento
router.post('/atualizarStatus', function(req, res) {
    servico.atualizarStatusAgendamento(req, res);
});


//exportar o router
module.exports = router;