// Importar módulo Express
const express = require('express');

// Importar módulo de rotas
const system_routes = require('./routes/system_routes');

// App
const app = express();

// Configurar EJS como o mecanismo de visualização
app.set('view engine', 'ejs'); // Defina o mecanismo como EJS
app.set('views', './views'); // Defina o diretório das views

// Adicionar CSS
app.use('/css', express.static('./css'));

// Referenciar a pasta de imagens
app.use('/img', express.static('./img'));

// Manipulação de dados via rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rotas
app.use('/', system_routes);

// Servidor
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
