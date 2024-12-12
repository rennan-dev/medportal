// Importar o módulo de conexão com banco MySQL
const conexao = require('../bd/conexao_mysql');

function paginaLogin(req,res) {
    res.render('login');
}

// Exportar funções
module.exports = {
    paginaLogin
};