//importar modulo mysql
const mysql = require('mysql2');

//configuração de conexão
const conexao = mysql.createConnection({
    host:'localhost',
    user:'xxxxxx',
    password: 'xxxxx',
    database:'medportal'
});

//teste de conexão
conexao.connect(function(erro){
    if(erro) throw erro;
    console.log('conexao efetuada com sucesso!');
    const url = `http://${conexao.config.host}:${conexao.config.port}/${conexao.config.database}`;
    console.log('Acesse a URL:', url);
    console.log('Entre no site aqui: http://localhost:8080/index');
});

//exportar modulo 
module.exports = conexao;