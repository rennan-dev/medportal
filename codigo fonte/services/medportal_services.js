//importar o módulo de conexão com banco MySQL
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

        //salvar informações do usuário na sessão
        req.session.userId = results.insertId; // ID gerado do novo usuário
        req.session.userName = name; // Nome do usuário para exibição
        req.session.userType = 'cliente';
        req.session.successMessage = 'Usuário cadastrado com sucesso!';

        res.redirect('/home');
    });
}

function paginaHome(req, res) {
    const successMessage = req.session.successMessage || null;
    const userName = req.session.userName || 'Usuário';
    const userId = req.session.userId; 

    //consulta para buscar médicos e especialidades
    const queryMedicos = 'SELECT nome_completo, especialidade FROM medico_usuarios';

    //consulta para buscar os agendamentos do usuário logado com base no usuario_id
    const queryAgendamentos = `
    SELECT 
        agendamentos.data, 
        agendamentos.hora, 
        medico_usuarios.nome_completo AS medico_nome, 
        agendamentos.status 
    FROM agendamentos
    INNER JOIN medico_usuarios ON agendamentos.medico_id = medico_usuarios.id
    WHERE agendamentos.paciente_id = ?`;

    conexao.query(queryMedicos, (error, resultsMedicos) => {
        if (error) {
            console.error('Erro ao buscar lista de médicos:', error);
            return res.status(500).send('Erro ao buscar lista de médicos.');
        }

        //buscar os agendamentos do usuário com o userId
        conexao.query(queryAgendamentos, [userId], (error, resultsAgendamentos) => {
            if (error) {
                console.error('Erro ao buscar agendamentos:', error);
                return res.status(500).send('Erro ao buscar agendamentos.');
            }

            //passar dados dos médicos, agendamentos e mensagens para o EJS
            res.render('home', {
                successMessage,
                userName,
                medicos: resultsMedicos,
                agendamentos: resultsAgendamentos //lista de agendamentos do usuário
            });
        });
    });
}

function login(req, res) {
    const { email, password } = req.body;

    //consulta na tabela de clientes
    const queryCliente = 'SELECT * FROM usuarios WHERE email = ? AND senha = ?';
    conexao.query(queryCliente, [email, password], (error, resultsCliente) => {
        if (error) {
            console.error('Erro ao buscar usuário cliente:', error);
            return res.status(500).send('Erro ao buscar usuário cliente.');
        }

        if (resultsCliente.length > 0) {
            //usuário cliente encontrado
            req.session.userId = resultsCliente[0].id;
            req.session.userName = resultsCliente[0].nome_completo;
            req.session.userType = 'cliente'; // Define o tipo de usuário
            req.session.successMessage = 'Login realizado com sucesso!';
            return res.redirect('/home');
        }

        //caso não seja cliente, busca na tabela de médicos
        const queryMedico = 'SELECT * FROM medico_usuarios WHERE email = ? AND senha = ?';
        conexao.query(queryMedico, [email, password], (error, resultsMedico) => {
            if (error) {
                console.error('Erro ao buscar médico:', error);
                return res.status(500).send('Erro ao buscar médico.');
            }

            if (resultsMedico.length > 0) {
                req.session.userId = resultsMedico[0].id;
                req.session.userName = resultsMedico[0].nome_completo;
                req.session.userType = 'medico'; //define o tipo de usuário
                req.session.successMessage = 'Login realizado com sucesso!';
                return res.redirect('/home_medico');
            }

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
        return res.redirect(req.session.userType === 'cliente' ? '/home' : '/home_medico');
    } else {
        res.redirect('/login'); //rredireciona para a página de login se não estiver autenticado
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

        //configurar sessão do usuário
        req.session.userId = results.insertId; 
        req.session.userName = name; 
        req.session.userType = 'medico';
        req.session.successMessage = 'Cadastro de médico realizado com sucesso!';

        res.redirect('/home_medico');
    });
}

function paginaHomeMedico(req, res) {
    const successMessage = req.session.successMessage || null;
    const medicoName = req.session.medicoName || 'Médico';
    const userId = req.session.userId; 

    req.session.successMessage = null;

    //consultar agendamentos com base no id do médico logado (userId)
    const queryAgendamentos = `
    SELECT 
        agendamentos.data, 
        agendamentos.hora, 
        usuarios.nome_completo AS paciente_nome, 
        agendamentos.status 
    FROM agendamentos
    INNER JOIN usuarios ON agendamentos.paciente_id = usuarios.id
    WHERE agendamentos.medico_id = ?`;

    //executando a consulta com o userId (id do médico logado)
    conexao.query(queryAgendamentos, [userId], (error, resultsAgendamentos) => {
        if (error) {
            console.error('Erro ao buscar agendamentos:', error);
            return res.status(500).send('Erro ao buscar agendamentos.');
        }

        //debug: imprimir agendamentos encontrados
        if (resultsAgendamentos.length > 0) {
            console.log('Agendamentos encontrados:');
            resultsAgendamentos.forEach((agendamento) => {
                console.log(agendamento.paciente_nome, agendamento.data, agendamento.hora);
            });
        }

        //se não houver agendamentos, mostrar mensagem
        if (resultsAgendamentos.length === 0) {
            return res.render('home_medico', {
                successMessage,
                medicoName,
                agendamentos: [], // Lista vazia, já que não há agendamentos
                mensagem: 'Não há agendamentos para este médico.'
            });
        }

        res.render('home_medico', {
            successMessage,
            medicoName,
            agendamentos: resultsAgendamentos,
            mensagem: '' //sem mensagem de erro
        });
    });
}



function paginaAgendamento(req, res) {
    //consulta para buscar médicos e suas especialidades
    const query = 'SELECT nome_completo, especialidade FROM medico_usuarios';

    conexao.query(query, (error, results) => {
        if (error) {
            console.error('Erro ao buscar médicos:', error);
            return res.status(500).send('Erro ao buscar médicos.');
        }

        res.render('agendamento', { medicos: results });
    });
}

function verificaAutenticacaoCliente(req, res, next) {
    if (req.session && req.session.userType === 'cliente') {
        //usuário autenticado e é um cliente
        return next();
    } else {
        //redireciona para a página de login com mensagem de erro
        req.flash('error', 'Você precisa estar logado como cliente para acessar essa página.');
        res.redirect('/login');
    }
}

function agendamentoForm(req, res) {
    const { data, hora, medico_nome, nome_cliente, paciente_celular } = req.body;

    //verifica se o usuário está logado
    if (!req.session.userId) {
        return res.status(401).send('Usuário não autenticado.');
    }

    const usuarioId = req.session.userId;

    if (!data || !hora || !medico_nome || !nome_cliente || !paciente_celular) {
        return res.status(400).send('Todos os campos são obrigatórios.');
    }

    //consulta para buscar o ID do médico pelo nome
    const queryMedico = 'SELECT id FROM medico_usuarios WHERE nome_completo = ?';
    conexao.query(queryMedico, [medico_nome], (error, results) => {
        if (error) {
            console.error('Erro ao buscar ID do médico:', error);
            return res.status(500).send('Erro ao buscar médico.');
        }

        if (results.length === 0) {
            return res.status(404).send('Médico não encontrado.');
        }

        const medicoId = results[0].id;

        //inserir o agendamento no banco de dados
        const queryAgendamento = `
            INSERT INTO agendamentos (data, hora, paciente_id, medico_id, status)
            VALUES (?, ?, ?, ?, 'agendado')
        `;
        conexao.query(
            queryAgendamento,
            [data, hora, usuarioId, medicoId],
            (error, results) => {
                if (error) {
                    console.error('Erro ao inserir agendamento:', error);
                    return res.status(500).send('Erro ao realizar agendamento.');
                }

                req.flash('success', 'Agendamento realizado com sucesso!');
                res.redirect('/home'); 
            }
        );
    });
}

function atualizarStatusAgendamento(req, res) {
    const status = req.body.status;  
    const agendamentoId = req.body.agendamentoId;  

    if (!status || !agendamentoId) {
        return res.status(400).send('Status e agendamento são obrigatórios.');
    }

    const query = 'UPDATE agendamentos SET status = ? WHERE id = ?';
    
    conexao.query(query, [status, agendamentoId], (error, results) => {
        if (error) {
            console.error('Erro ao atualizar status:', error);
            return res.status(500).send('Erro ao atualizar status.');
        }

        res.redirect('/home_medico');
    });
}


//exportar funções
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
    agendamentoForm,
    atualizarStatusAgendamento
};