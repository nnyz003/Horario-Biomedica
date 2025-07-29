const horario = [
  "08:00 - 09:59",
  "14:00 - 15:59",
  "16:00 - 17:59",
  "19:00 - 22:59"
];

const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const datosIniciales = {
  "lunes": {
    "08:00 - 09:59": "📘 Formación Profesional\nD-512\nGrupo: NA",
    "16:00 - 17:59": "📝 Habilidades Comunicativas\nD-406\nGrupo: NA"
  },
  "martes": {
    "14:00 - 15:59": "📐 Geometría Vectorial\nC-307\nGrupo: Jauder",
    "16:00 - 17:59": "➕ Matemáticas Básicas\nC-506\nGrupo: Jaime"
  },
  "miércoles": {
    "16:00 - 17:59": "📝 Habilidades Comunicativas\nD-406\nGrupo: NA"
  },
  "jueves": {
    "14:00 - 15:59": "📐 Geometría Vectorial\nC-307\nGrupo: Jauder",
    "16:00 - 17:59": "➕ Matemáticas Básicas\nC-506\nGrupo: Jaime"
  },
  "domingo": {
    "19:00 - 22:59": "💻 Informática (Virtual)\nGrupo: NA"
  }
};

// 🗓 CREAR HORARIO
function crearHorario() {
  const tbody = document.getElementById("horario-body");
  tbody.innerHTML = "";
  const guardado = JSON.parse(localStorage.getItem("horario")) || datosIniciales;

  horario.forEach(hora => {
    const fila = document.createElement("tr");
    const celdaHora = document.createElement("td");
    celdaHora.textContent = hora;
    fila.appendChild(celdaHora);

    dias.forEach(dia => {
      const celda = document.createElement("td");
      celda.className = "editable";
      celda.textContent = guardado[dia]?.[hora] || "";
      celda.style.backgroundColor = obtenerColor(guardado[dia]?.[hora]);
      celda.addEventListener("click", () => editarCelda(dia, hora));
      fila.appendChild(celda);
    });

    tbody.appendChild(fila);
  });
}

function editarCelda(dia, hora) {
  const nuevoTexto = prompt("Edita materia (puedes incluir íconos, aula y grupo):");
  const color = prompt("Color de fondo (rosa, morado, rojo, fucsia, naranja):");
  const horarioGuardado = JSON.parse(localStorage.getItem("horario")) || datosIniciales;
  if (!horarioGuardado[dia]) horarioGuardado[dia] = {};
  horarioGuardado[dia][hora] = nuevoTexto;
  horarioGuardado[dia][`${hora}_color`] = color;
  localStorage.setItem("horario", JSON.stringify(horarioGuardado));
  crearHorario();
}

function obtenerColor(texto) {
  if (!texto) return "#ffe6f0";
  const colores = {
    "rosa": "#ffc0cb",
    "morado": "#dda0dd",
    "rojo": "#f08080",
    "fucsia": "#ff00ff",
    "naranja": "#ffb347"
  };
  return colores[texto.toLowerCase()] || "#ffe6f0";
}

function reiniciarHorario() {
  if (confirm("¿Reiniciar todo el horario y tareas?")) {
    localStorage.clear();
    crearHorario();
    cargarTareas();
  }
}

// 🌗 CAMBIAR MODO
function cambiarTema() {
  document.body.classList.toggle("dark");
}

// 📆 CALENDARIO DE TAREAS Y PARCIALES
function agregarTarea() {
  const fecha = document.getElementById("fecha-tarea").value;
  const desc = document.getElementById("descripcion-tarea").value;
  if (!fecha || !desc) return alert("Completa la fecha y descripción");

  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareas.push({ fecha, desc });
  localStorage.setItem("tareas", JSON.stringify(tareas));
  cargarTareas();
}

function cargarTareas() {
  const lista = document.getElementById("lista-tareas");
  lista.innerHTML = "";
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareas.forEach((t, i) => {
    const li = document.createElement("li");
    li.textContent = `${t.fecha}: ${t.desc}`;
    lista.appendChild(li);
  });
}

// 🔔 ALARMA PARA CLASES Y TAREAS
function verificarAlarmas() {
  const ahora = new Date();
  const horaActual = ahora.getHours().toString().padStart(2, "0") + ":" + ahora.getMinutes().toString().padStart(2, "0");
  const tareas = JSON.parse(localStorage.getItem("tareas")) || [];

  tareas.forEach(t => {
    const fechaTarea = new Date(t.fecha + "T00:00:00");
    const hoy = new Date();
    if (fechaTarea.toDateString() === hoy.toDateString()) {
      notificar(`📌 Hoy: ${t.desc}`);
    }
  });
}

function notificar(msg) {
  const sonido = document.getElementById("alarma-sonido");
  sonido.play();
  alert(msg);
}

// AUTOEJECUTAR
crearHorario();
cargarTareas();
setInterval(verificarAlarmas, 60000); // cada minuto
