class Paciente {
    constructor(idPaciente, nome, email) {
        this.idPaciente = idPaciente;
        this.nome = nome;
        this.email = email;
    }

    getIdPaciente() {
        return this.idPaciente;
    }

    getNome() {
        return this.nome;
    }

    getEmail() {
        return this.email;
    }

    toString() {
        return `Paciente [id=${this.idPaciente}, nome=${this.nome}, email=${this.email}]`;
    }
}

// Exemplo de uso
const paciente = new Paciente(1, "Maria Silva", "maria.silva@example.com");
console.log(paciente.toString());
