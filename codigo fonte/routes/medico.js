const express = require("express");
const router = express.Router();

let medicos = []; // Lista para armazenar médicos

// Rota para adicionar um médico
router.post("/add", (req, res) => {
    const { idMedico, nome, especialidade } = req.body;
    if (!idMedico || !nome || !especialidade) {
        return res.status(400).json({ message: "Dados incompletos." });
    }
    medicos.push({ idMedico, nome, especialidade, horariosDisponiveis: [] });
    res.status(201).json({ message: "Médico adicionado com sucesso.", medico: { idMedico, nome, especialidade } });
});

// Rota para adicionar horários disponíveis a um médico
router.post("/:idMedico/horarios", (req, res) => {
    const { idMedico } = req.params;
    const { horario } = req.body;

    const medico = medicos.find((m) => m.idMedico == idMedico);
    if (!medico) {
        return res.status(404).json({ message: "Médico não encontrado." });
    }

    medico.horariosDisponiveis.push(horario);
    res.status(200).json({ message: "Horário adicionado com sucesso.", medico });
});

// Rota para obter todos os médicos
router.get("/", (req, res) => {
    res.status(200).json({ medicos });
});

module.exports = router;
