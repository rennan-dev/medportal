class Consulta {
    constructor(idConsulta, medico, horario, data, paciente) {
        this.idConsulta = idConsulta;
        this.medico = medico;
        this.horario = horario;
        this.data = new Date(data); // Converte a string para um objeto Date
        this.paciente = paciente;
    }

    getIdConsulta() {
        return this.idConsulta;
    }

    getMedico() {
        return this.medico;
    }

    getHorario() {
        return this.horario;
    }

    getData() {
        return this.data;
    }

    getPaciente() {
        return this.paciente;
    }

    toString() {
        return `Consulta [id=${this.idConsulta}, médico=${this.medico.getNome()}, horário=${this.horario}, data=${this.data.toLocaleDateString()}]`;
    }
}

// Exemplo de uso:
const medico = {
    getNome: () => "Dr. João Silva"
}; // Representação básica da classe Medico

const paciente = {
    getNome: () => "Maria Silva",
    getEmail: () => "maria.silva@example.com"
}; // Representação básica da classe Paciente

const consulta = new Consulta(1, medico, "10:00", "2024-12-12", paciente);
console.log(consulta.toString());
