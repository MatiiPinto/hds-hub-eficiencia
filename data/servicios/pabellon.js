/* ============================================================================
 * SERVICIOS CLÍNICOS HDS — Datos del servicio: PABELLÓN QUIRÚRGICO (PAB)
 * ----------------------------------------------------------------------------
 * ⚠️ ESQUELETO / BORRADOR — estructura lista, contenido por completar.
 * Todas las entradas están marcadas "(ejemplo · por validar)" y son ilustrativas
 * para mostrar cómo renderiza el shell. Reemplazar con la planilla oficial de
 * Pabellón (indicadores, características de acreditación, clasificación, etc.).
 *
 * Mismo esquema que data/servicios/ueh.js. El shell usa `labels` para rotular
 * las secciones según el servicio (Pabellón NO usa GES/triage de urgencia).
 * ========================================================================== */
(function () {
  "use strict";

  const PAB = {
    id: "pabellon",
    sigla: "PAB",
    nombre: "Pabellón Quirúrgico",
    descripcion:
      "Esqueleto en construcción. Cargar procesos críticos perioperatorios, " +
      "clasificación de cirugías, indicadores de gestión y acreditación quirúrgica.",
    estado: "activo",
    enConstruccion: true,
    fuente: "Esqueleto — pendiente planilla oficial de Pabellón",

    /* Etiquetas de sección propias del servicio (override de los textos UEH) */
    labels: {
      garantias: "Procesos críticos perioperatorios",
      garantiasDesc: "Hitos con tiempo/checklist del proceso quirúrgico. Toca una tarjeta para el detalle. (contenido por completar)",
      kpiGarantias: "Procesos",
      itemPrefix: "Paso",
      buscar: "Buscar proceso, etapa…",
      triage: "Clasificación de cirugías",
      triageDesc: "Tipos/prioridad de cirugía. Alinear a la nomenclatura oficial del HDS. (por completar)",
    },

    /* Agrupación de los "procesos críticos" (equivalente a categorías GES) */
    gesCategorias: [
      { id: "pre", nombre: "Preoperatorio", color: "sky" },
      { id: "intra", nombre: "Intraoperatorio", color: "rose" },
      { id: "post", nombre: "Postoperatorio", color: "teal" },
    ],

    /* Procesos críticos — EJEMPLOS por validar. TODO: completar con datos reales. */
    ges: [
      {
        num: 1, cat: "pre", glosa: "Lista de verificación de cirugía segura — Entrada (ejemplo · por validar)",
        plazoClave: "Antes de la inducción anestésica",
        definicion: "Checklist OMS, fase de entrada (sign in).",
        acceso: "(por completar)", oportunidad: "(por completar)", proteccion: "(por completar)",
      },
      {
        num: 2, cat: "intra", glosa: "Pausa quirúrgica / Time-out (ejemplo · por validar)",
        plazoClave: "Antes de la incisión",
        definicion: "Confirmación de paciente, sitio y procedimiento correctos.",
        acceso: "(por completar)", oportunidad: "(por completar)", proteccion: "(por completar)",
      },
      {
        num: 3, cat: "post", glosa: "Conteo de gasas e instrumental — Salida (ejemplo · por validar)",
        plazoClave: "Antes del cierre / fin de cirugía",
        definicion: "Checklist OMS, fase de salida (sign out).",
        acceso: "(por completar)", oportunidad: "(por completar)", proteccion: "(por completar)",
      },
    ],
    // TODO: agregar el resto de procesos perioperatorios y su detalle real.

    /* Clasificación de cirugías — EJEMPLOS por validar (equivalente al triage). */
    categorizacion: [
      { cat: "URG", nombre: "Urgencia", color: "red", meta: "Inmediata/diferible", desc: "(ejemplo) Cirugía no programable; según prioridad clínica." },
      { cat: "ELE", nombre: "Electiva", color: "amber", meta: "Programada", desc: "(ejemplo) Cirugía programada en tabla." },
      { cat: "CMA", nombre: "Cir. mayor ambulatoria", color: "emerald", meta: "Mismo día", desc: "(ejemplo) Egreso el mismo día, sin pernoctación." },
    ],
    // TODO: usar la clasificación/prioridad oficial del HDS.

    /* Indicadores de gestión — EJEMPLOS por validar. TODO: cargar metas reales. */
    indicadores: [
      { origen: "Gestión", sigla: "PAB-01", nombre: "Tasa de suspensión de cirugías (ejemplo · por validar)", meta: "(por definir)", periodicidad: "Mensual", proceso: "Pabellón",
        objetivo: "Reducir las cirugías suspendidas respecto de las programadas.",
        formula: "(N° cirugías suspendidas / N° cirugías programadas) × 100" },
      { origen: "Gestión", sigla: "PAB-02", nombre: "Porcentaje de cirugía mayor ambulatoria (ejemplo · por validar)", meta: "(por definir)", periodicidad: "Mensual", proceso: "Pabellón",
        objetivo: "Aumentar la resolución ambulatoria de cirugía mayor.",
        formula: "(N° CMA / N° total cirugía mayor) × 100" },
    ],

    /* Acreditación — EJEMPLOS por validar. TODO: cargar características reales. */
    acreditacion: [
      { ambito: "Gestión Clínica", caracteristica: "GCL (por confirmar)", obligatoria: true,
        denominacion: "Aplicación de la lista de verificación de cirugía segura (ejemplo · por validar).",
        indicadores: [{ nombre: "Cumplimiento de la lista de verificación de cirugía segura", umbral: "(por definir)" }],
        documentos: ["Protocolo de cirugía segura (por cargar)"] },
    ],

    /* Protocolos de apoyo — EJEMPLOS por validar. */
    documentosSinIndicador: [
      { grupo: "Pabellón (por completar)", docs: ["Protocolo de profilaxis antibiótica perioperatoria (ejemplo)", "Protocolo de recambio y aseo de pabellón (ejemplo)"] },
    ],

    /* Normativa y fuentes oficiales — completar con los marcos de Pabellón. */
    normativas: [
      { origen: "Acreditación", titulo: "Estándar de Acreditación de Prestadores Institucionales",
        entidad: "Superintendencia de Salud — Intendencia de Prestadores",
        desc: "Características quirúrgicas (cirugía segura, etc.) — por mapear.",
        enlaces: [
          { label: "Acreditación — Superintendencia de Salud", url: "https://www.supersalud.gob.cl/difusion/665/w3-propertyvalue-6060.html" },
        ] },
      // TODO: agregar COMGES/EAR/otras normativas aplicables a Pabellón.
    ],
  };

  // Exponer servicio
  window.SVC_PABELLON = PAB;

  // Auto-registro en el registry leído por el shell.
  window.SVC_REGISTRY = window.SVC_REGISTRY || [];
  if (!window.SVC_REGISTRY.some((s) => s.id === PAB.id)) {
    window.SVC_REGISTRY.push({ id: PAB.id, sigla: PAB.sigla, nombre: PAB.nombre, ref: "SVC_PABELLON", estado: PAB.estado });
  }
})();
