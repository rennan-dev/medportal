//importar módulo Express
const express = require('express');

const flash = require('connect-flash');

//importar módulo de rotas
const system_routes = require('./routes/system_routes');

//app
const app = express();

//configurando EJS como o mecanismo de visualização
app.set('view engine', 'ejs'); //definindo o mecanismo como EJS
app.set('views', './views'); //definindo o diretório das views

//adicionar CSS
app.use('/css', express.static('./css'));

//referenciar a pasta de imagens
app.use('/img', express.static('./img'));

app.use(flash());

//manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//rotas
app.use('/', system_routes);

//servidor
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
