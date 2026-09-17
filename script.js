const records = [
  {
    expediente: "EA-2026-014",
    projectName: "Parque Solar La Esperanza",
    province: "Panamá Oeste",
    company: "Eco Energía, S.A.",
    status: "En revisión técnica",
    dates: [
      "Recepción: 02/08/2026",
      "Última actualización: 12/09/2026",
      "Próxima revisión: 25/09/2026",
    ],
    documents: [
      "Resolución preliminar",
      "Resumen ejecutivo",
      "Mapa de ubicación",
    ],
    observations: [
      "La comunidad solicitó mayor claridad sobre medidas de mitigación.",
      "Se publicó una actualización del cronograma del trámite.",
    ],
    timeline: [
      "Solicitud creada por la empresa solicitante.",
      "Validación inicial completada.",
      "Documentación pública disponible para consulta.",
      "Expediente en revisión técnica.",
    ],
  },
  {
    expediente: "EA-2026-021",
    projectName: "Centro de Reciclaje Verde Norte",
    province: "Colón",
    company: "Servicios Ambientales del Caribe",
    status: "Pendiente de subsanación",
    dates: [
      "Recepción: 18/07/2026",
      "Observación emitida: 01/09/2026",
      "Fecha límite de respuesta: 22/09/2026",
    ],
    documents: [
      "Resolución de observaciones",
      "Ficha técnica del proyecto",
    ],
    observations: [
      "Falta anexar el plano definitivo del sitio.",
      "Debe completarse la descripción del manejo de residuos.",
    ],
    timeline: [
      "Solicitud registrada.",
      "Checklist inicial con requisitos faltantes.",
      "Observaciones enviadas al solicitante.",
    ],
  },
  {
    expediente: "EA-2026-031",
    projectName: "Mejoramiento Vial Río Sereno",
    province: "Chiriquí",
    company: "Infraestructura del Istmo",
    status: "Aprobado con resolución",
    dates: [
      "Recepción: 10/05/2026",
      "Resolución emitida: 30/08/2026",
      "Publicación: 02/09/2026",
    ],
    documents: [
      "Resolución final",
      "Informe técnico",
      "Condiciones de seguimiento",
    ],
    observations: [
      "El expediente cuenta con resolución pública disponible.",
    ],
    timeline: [
      "Solicitud presentada.",
      "Revisión documental completada.",
      "Evaluación técnica finalizada.",
      "Resolución publicada.",
    ],
  },
];

const searchForm = document.querySelector("#search-form");
const resultsList = document.querySelector("#results-list");
const resultsCount = document.querySelector("#results-count");
const detailTitle = document.querySelector("#detail-title");
const detailStatus = document.querySelector("#detail-status");
const detailMeta = document.querySelector("#detail-meta");
const detailDocuments = document.querySelector("#detail-documents");
const detailObservations = document.querySelector("#detail-observations");
const detailTimeline = document.querySelector("#detail-timeline");
const requestForm = document.querySelector("#request-form");
const formFeedback = document.querySelector("#form-feedback");

function normalizeValue(value) {
  return value.trim().toLowerCase();
}

function includesText(source, value) {
  return normalizeValue(source).includes(normalizeValue(value));
}

function renderResults(filteredRecords) {
  resultsList.innerHTML = "";
  resultsCount.textContent = `${filteredRecords.length} expediente${filteredRecords.length === 1 ? "" : "s"}`;

  if (!filteredRecords.length) {
    resultsList.innerHTML = `
      <div class="result-item">
        <strong>No se encontraron expedientes</strong>
        <p>Pruebe con otro nombre de proyecto, provincia, empresa o número.</p>
      </div>
    `;
    resetDetail();
    return;
  }

  filteredRecords.forEach((record, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `result-item${index === 0 ? " active" : ""}`;
    button.innerHTML = `
      <strong>${record.projectName}</strong>
      <p>${record.expediente} · ${record.company}</p>
      <p>${record.province} · ${record.status}</p>
    `;
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".result-item")
        .forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderDetail(record);
    });
    resultsList.appendChild(button);
  });

  renderDetail(filteredRecords[0]);
}

function renderDetail(record) {
  detailTitle.textContent = `${record.projectName} (${record.expediente})`;
  detailStatus.textContent = record.status;
  detailMeta.textContent = `${record.company} · ${record.province} · ${record.dates.join(" · ")}`;

  detailDocuments.innerHTML = record.documents
    .map((document) => `<li>${document}</li>`)
    .join("");
  detailObservations.innerHTML = record.observations
    .map((observation) => `<li>${observation}</li>`)
    .join("");
  detailTimeline.innerHTML = record.timeline
    .map((step) => `<li>${step}</li>`)
    .join("");
}

function resetDetail() {
  detailTitle.textContent = "Seleccione un expediente";
  detailStatus.textContent = "Sin selección";
  detailMeta.textContent =
    "Use el buscador para revisar fechas, documentos, observaciones y la línea de tiempo del proceso.";
  detailDocuments.innerHTML = "";
  detailObservations.innerHTML = "";
  detailTimeline.innerHTML = "";
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const expediente = document.querySelector("#filter-expediente").value;
  const proyecto = document.querySelector("#filter-proyecto").value;
  const provincia = document.querySelector("#filter-provincia").value;
  const empresa = document.querySelector("#filter-empresa").value;

  const filteredRecords = records.filter((record) => {
    return (
      (!expediente || includesText(record.expediente, expediente)) &&
      (!proyecto || includesText(record.projectName, proyecto)) &&
      (!provincia || includesText(record.province, provincia)) &&
      (!empresa || includesText(record.company, empresa))
    );
  });

  renderResults(filteredRecords);
});

function setFieldError(field, message) {
  field.classList.add("field-error");
  const error = field.parentElement.querySelector(".error-message");
  if (error) {
    error.textContent = message;
  }
}

function clearFieldError(field) {
  field.classList.remove("field-error");
  const error = field.parentElement.querySelector(".error-message");
  if (error) {
    error.textContent = "";
  }
}

function validateField(field) {
  if (field.type === "checkbox") {
    const checkboxError = requestForm.querySelector(".checkbox-error");
    if (!field.checked) {
      checkboxError.textContent = "Debe confirmar que la información está completa.";
      return false;
    }
    checkboxError.textContent = "";
    return true;
  }

  if (field.type === "file") {
    if (!field.files.length) {
      setFieldError(field, "Adjunte un archivo antes de continuar.");
      return false;
    }
    clearFieldError(field);
    return true;
  }

  if (!field.value.trim()) {
    setFieldError(field, "Este campo es obligatorio.");
    return false;
  }

  clearFieldError(field);
  return true;
}

requestForm.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("change", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.type !== "file" && field.type !== "checkbox") {
      validateField(field);
    }
  });
});

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent = "";
  formFeedback.className = "form-feedback";

  const fields = Array.from(requestForm.querySelectorAll("[required]"));
  const isValid = fields.every((field) => validateField(field));

  if (!isValid) {
    formFeedback.textContent =
      "Revise los campos resaltados y complete los requisitos pendientes.";
    formFeedback.classList.add("error");
    return;
  }

  formFeedback.textContent =
    "Solicitud validada visualmente. Lista para integrarse con endpoints de backend.";
  formFeedback.classList.add("success");
  requestForm.reset();
});

renderResults(records);
