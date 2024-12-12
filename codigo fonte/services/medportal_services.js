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
    
    const { name, email, phone, password, cpf } = req.body;

    if (!name || !email || !phone || !password || !cpf) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const query = 'INSERT INTO usuarios (nome_completo, email, celular, senha, cpf) VALUES (?, ?, ?, ?, ?)';
    
    conexao.query(query, [name, email, phone, password, cpf], (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar usuário:', error);
            return res.status(500).send('Erro ao cadastrar usuário.');
        }

        // Salvar informações do usuário na sessão
        req.session.userId = results.insertId; // ID gerado do novo usuário
        req.session.userName = name; // Nome do usuário para exibição
        req.session.userType = 'cliente';
        req.session.successMessage = 'Usuário cadastrado com sucesso!';

        // Redirecionar para a página home
        res.redirect('/home');
    });
}

function paginaHome(req, res) {
    const successMessage = req.session.successMessage || null;
    const userName = req.session.userName || 'Usuário';

    // Consulta para buscar médicos e especialidades
    const query = 'SELECT nome_completo, especialidade FROM medico_usuarios';

    conexao.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar lista de médicos:', error);
            return res.status(500).send('Erro ao buscar lista de médicos.');
        }

        // Passar dados dos médicos e mensagens para o EJS
        res.render('home', {
            successMessage,
            userName,
            medicos: results // Lista de médicos com nome e especialidade
        });
    });
}

function login(req, res) {
    const { email, password } = req.body;

    // Consulta na tabela de clientes
    const queryCliente = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    conexao.query(queryCliente, [email, password], (error, resultsCliente) => {
        if (error) {
            console.error('Erro ao buscar usuário cliente:', error);
            return res.status(500).send('Erro ao buscar usuário cliente.');
        }

        if (resultsCliente.length > 0) {
            // Usuário cliente encontrado
            req.session.userId = resultsCliente[0].id;
            req.session.userName = resultsCliente[0].nome_completo;
            req.session.userType = 'cliente'; // Define o tipo de usuário
            req.session.successMessage = 'Login realizado com sucesso!';
            return res.redirect('/home');
        }

        // Caso não seja cliente, busca na tabela de médicos
        const queryMedico = 'SELECT * FROM medico_usuarios WHERE email = ? AND senha = ?';
        conexao.query(queryMedico, [email, password], (error, resultsMedico) => {
            if (error) {
                console.error('Erro ao buscar médico:', error);
                return res.status(500).send('Erro ao buscar médico.');
            }

            if (resultsMedico.length > 0) {
                // Médico encontrado
                req.session.userId = resultsMedico[0].id;
                req.session.userName = resultsMedico[0].nome_completo;
                req.session.userType = 'medico'; // Define o tipo de usuário
                req.session.successMessage = 'Login realizado com sucesso!';
                return res.redirect('/home_medico');
            }

            // Email ou senha inválidos
            return res.status(401).send('Email ou senha inválidos.');
        });
    });
}

//função para verificar se o usuário está autenticado ou não
function verificaAutenticacao(req, res, next) {
    if (req.session.userId) {
        if (req.session.userType === 'cliente' && req.originalUrl.startsWith('/home')) {
            return next();
        }
        if (req.session.userType === 'medico' && req.originalUrl.startsWith('/home_medico')) {
            return next();
        }
        // Redireciona para a página correta caso o tipo de usuário não corresponda à rota
        return res.redirect(req.session.userType === 'cliente' ? '/home' : '/home_medico');
    } else {
        res.redirect('/login'); // Redireciona para a página de login se não estiver autenticado
    }
}

function cadastroMedicoForm(req, res) {
    console.log('Entrou em cadastroMedicoForm');

    const { name, email, phone, birthdate, crm, specialty, password } = req.body;

    if (!name || !email || !phone || !birthdate || !crm || !specialty || !password) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    const query = `
        INSERT INTO medico_usuarios (nome_completo, email, telefone, data_nascimento, crm, especialidade, senha)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    conexao.query(query, [name, email, phone, birthdate, crm, specialty, password], (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar médico:', error);
            return res.status(500).send('Erro ao cadastrar médico.');
        }

        // Configurar sessão do usuário
        req.session.userId = results.insertId; // ID do médico recém-cadastrado
        req.session.userName = name; // Nome do médico para exibição
        req.session.userType = 'medico'; // Tipo de usuário para controle de acesso
        req.session.successMessage = 'Cadastro de médico realizado com sucesso!';

        // Redirecionar para a página home_medico
        res.redirect('/home_medico');
    });
}

function paginaHomeMedico(req, res) {
    const successMessage = req.session.successMessage || null;
    const medicoName = req.session.medicoName || 'Médico';

    req.session.successMessage = null;

    res.render('home_medico', { successMessage, medicoName });
}

function paginaAgendamento(req, res) {
    // Consulta para buscar médicos e suas especialidades
    const query = 'SELECT nome_completo, especialidade FROM medico_usuarios';

    conexao.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar médicos:', error);
            return res.status(500).send('Erro ao buscar médicos.');
        }

        // Passa a lista de médicos e especialidades para o EJS
        res.render('agendamento', { medicos: results });
    });
}

function verificaAutenticacaoCliente(req, res, next) {
    if (req.session && req.session.userType === 'cliente') {
        // Usuário autenticado e é um cliente
        return next();
    } else {
        // Redireciona para a página de login com mensagem de erro
        req.flash('error', 'Você precisa estar logado como cliente para acessar essa página.');
        res.redirect('/login');
    }
}

function agendamentoForm(req, res) {
    const { data, hora, nome_cliente, paciente_celular, medico_nome } = req.body;

    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!data || !hora || !nome_cliente || !paciente_celular || !medico_nome) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    // Verificar se o médico já tem um agendamento para esse horário
    const checkQuery = 'SELECT * FROM agendamentos WHERE data = ? AND hora = ? AND medico_nome = ?';
    conexao.query(checkQuery, [data, hora, medico_nome], (error, results) => {
        if (error) {
            console.error('Erro ao verificar agendamento:', error);
            return res.status(500).send('Erro ao verificar agendamento.');
        }

        if (results.length > 0) {
            // Já existe um agendamento nesse horário para o médico
            return res.status(400).send('Já existe um agendamento nesse horário para esse médico.');
        }

        // Inserir o novo agendamento no banco de dados
        const insertQuery = 'INSERT INTO agendamentos (data, hora, medico_nome, paciente_nome, paciente_celular, status) VALUES (?, ?, ?, ?, ?, "agendado")';
        conexao.query(insertQuery, [data, hora, medico_nome, nome_cliente, paciente_celular], (error, results) => {
            if (error) {
                console.error('Erro ao agendar consulta:', error);
                return res.status(500).send('Erro ao agendar consulta.');
            }

            // Redirecionar para uma página de sucesso ou mostrar confirmação
            res.send('Agendamento confirmado com sucesso!');
        });
    });
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
    verificaAutenticacao,
    cadastroMedicoForm,
    paginaHomeMedico,
    verificaAutenticacaoCliente,
    paginaAgendamento,
    agendamentoForm
};