-- medportal

# medportal

## crie o db e depois as suas tabelas

show databases;
use medportal;
show tables;
describe usuarios;
select * from usuarios;
describe medico_usuarios;
select * from medico_usuarios;
describe agendamentos;
select * from agendamentos;

-- esse comando desativa o modo seguro, antes nao podia fazer delete sem where
SET SQL_SAFE_UPDATES = 0;
DELETE FROM usuarios;
DELETE FROM medico_usuarios;

CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    celular CHAR(11) NOT NULL, 
    senha VARCHAR(255) NOT NULL,
    cpf CHAR(11) UNIQUE NOT NULL
);

CREATE TABLE medico_usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(15) NOT NULL,
    data_nascimento DATE NOT NULL,
    crm VARCHAR(20) NOT NULL,
    especialidade VARCHAR(50) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

ALTER TABLE agendamentos DROP COLUMN especialidade;
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    medico_nome VARCHAR(255) NOT NULL,
    paciente_nome VARCHAR(255) NOT NULL,
    paciente_celular VARCHAR(11) NOT NULL,
    status ENUM('agendado', 'cancelado', 'concluido') DEFAULT 'agendado',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



