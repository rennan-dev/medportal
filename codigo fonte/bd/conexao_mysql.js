//importar modulo mysql
const mysql = require('mysql2');

//configuração de conexão
const conexao = mysql.createConnection({
    host:'localhost',
    user:'mysql',
    password: 'mysql',
    database:'medportal'
});

//teste de conexão
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('conexao efetuada com sucesso!');
    const url = `http://${conexao.config.host}:${conexao.config.port}/${conexao.config.database}`;
    console.log('Acesse a URL:', url);
});

//exportar modulo 
module.exports = conexao;