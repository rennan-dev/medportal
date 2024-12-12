document.addEventListener("DOMContentLoaded", () => {
    // Controle de alternância de classes
    const btnSignin = document.querySelector("#signin");
    const btnSignup = document.querySelector("#signup");
    const body = document.querySelector("body");

    btnSignin.addEventListener("click", () => {
        body.className = "sign-in-js";
    });

    btnSignup.addEventListener("click", () => {
        body.className = "sign-up-js";
    });

    // Carrossel de imagens
    let currentSlide = 0;
    const slides = document.querySelectorAll(".slides img");

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove("active");
            if (i === index) slide.classList.add("active");
        });
    }

    function changeSlide(direction) {
        currentSlide += direction;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        if (currentSlide >= slides.length) currentSlide = 0;
        showSlide(currentSlide);
    }

    setInterval(() => {
        changeSlide(1);
    }, 3000);

    showSlide(currentSlide);

    // Verificação de login para páginas protegidas
    function checkLogin() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            alert("Você precisa estar logado para acessar esta funcionalidade.");
            window.location.href = "/login.html";
        }
        return isLoggedIn;
    }

    // Agendamento de consultas
    const availableSlots = [
        "08:00", "09:00", "10:00", "11:00", "12:00",
        "14:00", "15:00", "16:00", "17:00", "18:00"
    ];
    const appointments = {};

    const dateInput = document.getElementById("agendamento-date");
    const timeSlotsContainer = document.getElementById("time-slots");
    const appointmentsContainer = document.getElementById("appointments");
    const scheduleBtn = document.getElementById("schedule-btn");
    const nameInput = document.getElementById("client-name");
    const phoneInput = document.getElementById("client-phone");
    const cutTypesContainer = document.getElementById("cut-types");
    let selectedCut = null;

    cutTypesContainer.addEventListener("click", (e) => {
        if (e.target.tagName.toLowerCase() === "button") {
            selectedCut = e.target.dataset.cut;
            document.querySelectorAll("#cut-types button").forEach((btn) => btn.classList.remove("selected"));
            e.target.classList.add("selected");
        }
    });

    dateInput.addEventListener("change", () => {
        if (!checkLogin()) return;
        const selectedDate = dateInput.value;
        if (selectedDate) {
            renderTimeSlots(selectedDate);
        }
    });

    scheduleBtn.addEventListener("click", () => {
        if (!checkLogin()) return;

        const selectedDate = dateInput.value;
        const selectedSlot = document.querySelector("#time-slots button.selected");

        if (!selectedDate || !selectedSlot || !selectedCut) {
            alert("Por favor, selecione uma data, horário e tipo de corte.");
            return;
        }

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        if (!name || !phone) {
            alert("Por favor, preencha todas as informações.");
            return;
        }

        const slotTime = selectedSlot.dataset.time;

        if (!appointments[selectedDate]) {
            appointments[selectedDate] = {};
        }

        appointments[selectedDate][slotTime] = { name, phone, cut: selectedCut };
        updateAppointments();
        renderTimeSlots(selectedDate);
    });

    function renderTimeSlots(date) {
        timeSlotsContainer.innerHTML = "";
        availableSlots.forEach((slot) => {
            const button = document.createElement("button");
            button.textContent = slot;
            button.dataset.time = slot;

            if (appointments[date] && appointments[date][slot]) {
                button.classList.add("disabled");
                button.textContent += " - Indisponível";
            } else {
                button.addEventListener("click", () => {
                    document.querySelectorAll("#time-slots button").forEach((btn) => btn.classList.remove("selected"));
                    button.classList.add("selected");
                });
            }

            timeSlotsContainer.appendChild(button);
        });
    }

    function updateAppointments() {
        appointmentsContainer.innerHTML = "";
        Object.keys(appointments).forEach((date) => {
            const slots = appointments[date];
            Object.keys(slots).forEach((slot) => {
                const appointmentDiv = document.createElement("div");
                appointmentDiv.textContent = `Data: ${date}, Horário: ${slot}, Corte: ${slots[slot].cut}, Cliente: ${slots[slot].name}, Contato: ${slots[slot].phone}`;

                const removeButton = document.createElement("button");
                removeButton.textContent = "Remover";
                removeButton.addEventListener("click", () => {
                    delete appointments[date][slot];
                    if (Object.keys(appointments[date]).length === 0) {
                        delete appointments[date];
                    }
                    updateAppointments();
                    renderTimeSlots(dateInput.value);
                });

                appointmentDiv.appendChild(removeButton);
                appointmentsContainer.appendChild(appointmentDiv);
            });
        });

        if (appointmentsContainer.innerHTML === "") {
            appointmentsContainer.innerHTML = "<p>Nenhum horário agendado.</p>";
        }
    }

    // Inicialização
    checkLogin(); // Verifica login ao carregar a página
});

document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("upload-form");
    const uploadStatus = document.getElementById("upload-status");

    // Verifica se o usuário está logado antes de permitir enviar exames
    function checkLogin() {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        if (!isLoggedIn) {
            alert("Você precisa estar logado para enviar exames.");
            window.location.href = "/login.html";
        }
        return isLoggedIn;
    }

    // Submissão do formulário de upload
    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!checkLogin()) return;

        const examType = document.getElementById("exam-type").value;
        const examFile = document.getElementById("exam-file").files[0];

        if (!examType || !examFile) {
            alert("Por favor, preencha todos os campos e anexe um arquivo.");
            return;
        }

        // Simula o envio do exame
        setTimeout(() => {
            uploadStatus.textContent = `Exame "${examFile.name}" do tipo "${examType}" enviado com sucesso.`;
            uploadStatus.classList.remove("hidden");
            uploadStatus.classList.add("success");
        }, 1000);
    });

    // Verifica login ao carregar a página
    checkLogin();
});
