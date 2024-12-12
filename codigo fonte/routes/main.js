class Medico {
    constructor(id, nome, especialidade) {
        this.id = id;
        this.nome = nome;
        this.especialidade = especialidade;
        this.horariosDisponiveis = [];
    }

    adicionarHorarioDisponivel(horario) {
        this.horariosDisponiveis.push(horario);
    }

    removerHorarioDisponivel(horario) {
        this.horariosDisponiveis = this.horariosDisponiveis.filter(h => h !== horario);
    }

    toString() {
        return `${this.nome} (${this.especialidade})`;
    }
}

class Paciente {
    constructor(id, nome, email) {
        this.id = id;
        this.nome = nome;
        this.email = email;
    }
}

class Consulta {
    constructor(id, medico, horario, data, paciente) {
        this.id = id;
        this.medico = medico;
        this.horario = horario;
        this.data = data;
        this.paciente = paciente;
    }

    toString() {
        return `Consulta agendada:\n` +
            `Paciente: ${this.paciente.nome} (${this.paciente.email})\n` +
            `Médico: ${this.medico.nome} (${this.medico.especialidade})\n` +
            `Data: ${this.data}\n` +
            `Horário: ${this.horario}`;
    }
}

// Função principal
(async function main() {
    const medico1 = new Medico(1, "Dr. João Silva", "Cardiologista");
    ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"].forEach(h => medico1.adicionarHorarioDisponivel(h));

    const medico2 = new Medico(2, "Dra. Maria Costa", "Pediatra");
    ["08:30", "09:30", "10:30", "11:30", "13:30", "14:30", "15:30", "16:30"].forEach(h => medico2.adicionarHorarioDisponivel(h));

    const prompt = require("prompt-sync")({ sigint: true });

    console.log("Médicos disponíveis:");
    console.log(`${medico1}\nHorários disponíveis: ${medico1.horariosDisponiveis.join(", ")}`);
    console.log(`${medico2}\nHorários disponíveis: ${medico2.horariosDisponiveis.join(", ")}`);

    // Solicitar dados do paciente
    const nomePaciente = prompt("\nDigite o nome do paciente: ");
    const emailPaciente = prompt("Digite o e-mail do paciente: ");
    const paciente = new Paciente(1, nomePaciente, emailPaciente);

    // Solicitar médico desejado
    const escolhaMedico = parseInt(prompt("\nEscolha o médico (1 para Dr. João Silva, 2 para Dra. Maria Costa): "), 10);
    let medicoEscolhido;
    if (escolhaMedico === 1) {
        medicoEscolhido = medico1;
    } else if (escolhaMedico === 2) {
        medicoEscolhido = medico2;
    } else {
        console.log("Opção inválida. Encerrando o programa.");
        return;
    }

    console.log(`\nHorários disponíveis para ${medicoEscolhido.nome}:`);
    medicoEscolhido.horariosDisponiveis.forEach(h => console.log(`- ${h}`));

    // Solicitar horário da consulta
    const horarioEscolhido = prompt("Escolha um horário disponível: ");
    if (!medicoEscolhido.horariosDisponiveis.includes(horarioEscolhido)) {
        console.log("Horário escolhido não disponível. Encerrando o programa.");
        return;
    }

    // Solicitar data da consulta
    const dataString = prompt("\nDigite a data da consulta (formato dd/MM/yyyy): ");
    const [dia, mes, ano] = dataString.split("/").map(Number);
    const dataConsulta = new Date(ano, mes - 1, dia);
    if (isNaN(dataConsulta)) {
        console.log("Formato de data inválido. Encerrando o programa.");
        return;
    }

    // Criar a consulta e exibir o resumo
    const consulta = new Consulta(1, medicoEscolhido, horarioEscolhido, dataConsulta.toLocaleDateString("pt-BR"), paciente);
    medicoEscolhido.removerHorarioDisponivel(horarioEscolhido);

    console.log("\nConsulta agendada com sucesso!");
    console.log(consulta.toString());
})();
