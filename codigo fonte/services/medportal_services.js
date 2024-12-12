// Importar o módulo de conexão com banco MySQL
const conexao = require('../bd/conexao_mysql');

function paginaLogin(req,res) {
    res.render('login');
}

function cadastroPaciente(req,res) {
    console.log('Entrou em cadastroPaciente');
    res.render('cadastro');
}

function paginaInicial(req,res) {
    res.render('index');
}

function paginaCadastroMedico(req,res) {
    res.render('cadastroMedico');
}

function cadastroPacienteForm(req, res) {
    console.log('Entrou em cadastroPacienteForm');
    
    // Extrair dados do formulário
    const { name, email, phone, password, cpf } = req.body;

    // Validação básica 
    if (!name || !email || !phone || !password || !cpf) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const query = 'INSERT INTO usuarios (nome_completo, email, celular, senha, cpf) VALUES (?, ?, ?, ?, ?)';
    
    conexao.query(query, [name, email, phone, password, cpf], (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar usuário:', error);
            return res.status(500).send('Erro ao cadastrar usuário.');
        }

        // Redirecionar para a página inicial com uma mensagem de sucesso
        res.redirect('/home?success=true'); // Adiciona um parâmetro de consulta
    });
}


function paginaHome(req, res) {
    // Captura a mensagem de sucesso da sessão
    const successMessage = req.query.success ? 'Usuário cadastrado com sucesso!' : null;
    
    res.render('home', { successMessage }); // Passa a mensagem para a view home.ejs
}

function login(req, res) {
    const { email, password } = req.body;

    const query = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    conexao.query(query, [email, password], (error, results) => {
        if (error) {
            console.error('Erro ao buscar usuário:', error);
            return res.status(500).send('Erro ao buscar usuário.');
        }

        if (results.length > 0) {
            //usuário encontrado, armazena informações na sessão
            req.session.userId = results[0].id; //armazena o ID do usuário na sessão
            req.session.successMessage = 'Login realizado com sucesso!';
            return res.redirect('/home'); 
        } else {
            return res.status(401).send('Email ou senha inválidos.');
        }
    });
}

//função para verificar se o usuário está autenticado ou não
function verificaAutenticacao(req, res, next) {
    if (req.session.userId) {
        next(); // O usuário está autenticado, continua para a próxima função
    } else {
        res.redirect('/login'); // Redireciona para a página de login se não estiver autenticado
    }
}



// Exportar funções
module.exports = {
    paginaLogin,
    cadastroPaciente,
    paginaInicial,
    paginaCadastroMedico,
    cadastroPacienteForm,
    paginaHome,
    login,
    verificaAutenticacao
};