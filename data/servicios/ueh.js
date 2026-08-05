/* ============================================================================
 * SERVICIOS CLÍNICOS HDS — Datos del servicio: UNIDAD DE EMERGENCIA (UEH)
 * ----------------------------------------------------------------------------
 * Fuente: "PLANILLA DE RESUMEN DE INDICADORES Y CONSTATACIONES" (Google Sheets)
 *   - GES UEH, COMGES, SISQ/DIGERA, Ley 20.707, Acreditación (GCL/AOC/REG)
 * Patrón HDS: este archivo expone window.SVC_UEH y se registra en el shell.
 * Para sumar un servicio nuevo: copiar este esquema en data/servicios/<id>.js
 *   (window.SVC_<ID>) y agregarlo a window.SVC_REGISTRY (ver final del archivo).
 * Esquema estable → el shell renderiza cualquier servicio sin tocar código.
 * ========================================================================== */
(function () {
  "use strict";

  const UEH = {
    id: "ueh",
    sigla: "UEH",
    nombre: "Unidad de Emergencia Hospitalaria",
    descripcion:
      "Atención de urgencia adulto. Garantías GES con reloj, ayuda de categorización, " +
      "protocolos de acreditación y metas de gestión exigibles a la unidad.",
    estado: "activo",
    fuente: "Planilla de Indicadores y Constataciones UEH · ref. solo lectura",

    /* Portal oficial para el detalle de cada garantía GES (botón en el modal) */
    gesPortal: { label: "Ver garantía oficial (MINSAL · DIPRECE)", url: "https://diprece.minsal.cl/garantias-explicitas-en-salud-auge-o-ges/" },

    /* Normativa y fuentes oficiales (sitios web de respaldo de cada marco) */
    normativas: [
      { origen: "GES / AUGE", titulo: "Garantías Explícitas en Salud (GES / AUGE)",
        entidad: "MINSAL · DIPRECE / Superintendencia de Salud / FONASA",
        desc: "Acceso, oportunidad (plazos), calidad y protección financiera de las 17 garantías de urgencia.",
        enlaces: [
          { label: "Problemas de salud y guías (DIPRECE)", url: "https://diprece.minsal.cl/garantias-explicitas-en-salud-auge-o-ges/" },
          { label: "Decretos GES (MINSAL)", url: "https://www.minsal.cl/ges-auge-documentos/" },
          { label: "GES — Superintendencia de Salud", url: "https://www.supersalud.gob.cl/consultas/667/w3-propertyvalue-3460.html" },
          { label: "Protección financiera (FONASA)", url: "https://www.fonasa.cl/sites/fonasa/beneficiarios/auge" },
        ] },
      { origen: "COMGES", titulo: "Compromisos de Gestión (COMGES)",
        entidad: "MINSAL · Subsecretaría de Redes Asistenciales (DIGERA)",
        desc: "Indicadores 1.9 (abandonos ≤10%) y 1.10 (ESI-2 ≤30 min).",
        enlaces: [
          { label: "Compromisos de Gestión Institucional (MINSAL)", url: "https://www.minsal.cl/redes-asistenciales-compromisos-de-gestion-institucional/" },
          { label: "Orientaciones Técnicas COMGES (PDF)", url: "https://www.minsal.cl/wp-content/uploads/2023/03/Orientaciones-Tecnicas-Compromisos-de-Gestion-Ano-2024-Version-1.0.pdf" },
        ] },
      { origen: "SISQ / DIGERA", titulo: "Evaluación de Establecimientos Autogestionados en Red (EAR · BSC-SISQ)",
        entidad: "MINSAL · DIGERA — Unidad de Autogestión Hospitalaria",
        desc: "Indicadores B.4_1.2 (estadía ≤6 h) y B.4_1.6 (ESI-2 ≤30 min).",
        enlaces: [
          { label: "Instrumento EAR (Resolución MINSAL, PDF)", url: "https://www.minsal.cl/wp-content/uploads/2023/03/948-aprueba-instrumento-tecnico-para-la-evaluacion-de-los-establecimientos-de-autogestion-en-red-ear-2023.pdf" },
        ] },
      { origen: "Ley 20.707", titulo: "Metas de Producción y Calidad — Ley 20.707",
        entidad: "Congreso Nacional (BCN) · DIPRES / DIGERA",
        desc: "Producción 1 (ESI-2 ≤30 min) y 3 (cama de dotación <12 h).",
        enlaces: [
          { label: "Ley 20.707 — BCN / LeyChile", url: "https://www.bcn.cl/historiadelaley/historia-de-la-ley/vista-expandida/4781/" },
        ] },
      { origen: "Acreditación", titulo: "Estándar de Acreditación de Prestadores Institucionales",
        entidad: "Superintendencia de Salud — Intendencia de Prestadores",
        desc: "Características GCL, AOC y REG evaluadas en la UEH.",
        enlaces: [
          { label: "Acreditación — Superintendencia de Salud", url: "https://www.supersalud.gob.cl/difusion/665/w3-propertyvalue-6060.html" },
          { label: "Prestador institucional — requisitos", url: "https://supersalud.gob.cl/difusion/665/w3-propertyvalue-1992.html" },
        ] },
    ],

    /* ---- Categorías GES (para agrupar el cockpit) ---- */
    gesCategorias: [
      { id: "cardio", nombre: "Cardiovascular / Neurovascular", color: "rose" },
      { id: "resp", nombre: "Respiratorio", color: "sky" },
      { id: "metab", nombre: "Metabólico", color: "amber" },
      { id: "mental", nombre: "Salud Mental", color: "violet" },
      { id: "trauma", nombre: "Trauma", color: "orange" },
      { id: "otros", nombre: "Odontológico / Otros", color: "teal" },
    ],

    /* ---- GES exigibles en urgencia (17) ---- */
    ges: [
      {
        num: 5, cat: "cardio", glosa: "Infarto agudo del miocardio",
        plazoClave: "ECG ≤30 min desde sospecha · trombólisis ≤30 min desde confirmación",
        definicion: "Infarto agudo, infarto recurrente, infarto transmural, isquemia, reinfarto.",
        acceso: "Con dolor torácico no traumático y/o síntomas de IAM: confirmación diagnóstica. Confirmado: tratamiento médico y prevención secundaria. Con revascularización: prevención secundaria.",
        oportunidad: "Diagnóstico: EKG dentro de 30 min desde la sospecha en SU. Tratamiento: trombólisis dentro de 30 min desde la confirmación de supradesnivel ST en EKG según indicación médica.",
        proteccion: "Sospecha, confirmación y tratamiento de IAM (con y sin trombólisis).",
      },
      {
        num: 25, cat: "cardio", glosa: "Trastornos de conducción que requieren marcapasos (≥15 a)",
        plazoClave: "Estudio electrofisiológico · compensación",
        definicion: "Bloqueos, síncopes, fibrilaciones.",
        acceso: "Con sospecha: confirmación diagnóstica. Confirmado: tratamiento y seguimiento.",
        oportunidad: "Diagnóstico: estudio electrofisiológico de arritmias. Tratamiento: compensación.",
        proteccion: "Confirmación trastorno de conducción.",
      },
      {
        num: 37, cat: "cardio", glosa: "Ataque cerebrovascular isquémico (≥15 a)",
        plazoClave: "Confirmación ≤24 h · tratamiento ≤24 h · hospitalización ≤24 h",
        definicion: "Infarto cerebral.",
        acceso: "Con sospecha: confirmación diagnóstica. Confirmado: tratamiento médico, estudio etiológico, prevención secundaria y hospitalización en prestador con capacidad resolutiva.",
        oportunidad: "Diagnóstico ≤24 h desde la sospecha. Tratamiento ≤24 h desde la confirmación. Hospitalización en prestador con capacidad resolutiva ≤24 h desde la indicación médica.",
        proteccion: "Confirmación y tratamiento de ACV isquémico.",
      },
      {
        num: 42, cat: "cardio", glosa: "Hemorragia subaracnoidea por ruptura de aneurisma cerebral",
        plazoClave: "TAC ≤24 h · angio ≤48 h · tratamiento ≤24 h",
        definicion: "Hemorragia — ruptura de uno o más aneurismas cerebrales.",
        acceso: "Con sospecha: confirmación diagnóstica y tratamiento.",
        oportunidad: "TAC ≤24 h desde la sospecha. Angio-TAC multicorte o angiografía digital ≤48 h desde confirmar HSA. Tratamiento en establecimiento resolutivo ≤24 h desde confirmar aneurisma roto.",
        proteccion: "Confirmación y tratamiento (quirúrgico o coil) de ruptura de aneurisma cerebral.",
      },
      {
        num: 20, cat: "resp", glosa: "Neumonía adquirida en la comunidad (≥65 a, manejo ambulatorio)",
        plazoClave: "Confirmación ≤48 h · tratamiento desde la sospecha",
        definicion: "Bronconeumonía, neumonía, neumopatía aguda, pleuroneumonía, neumonitis infecciosa.",
        acceso: "Con sospecha: confirmación diagnóstica y tratamiento farmacológico.",
        oportunidad: "Confirmación diagnóstica ≤48 h desde la sospecha. Tratamiento farmacológico iniciado desde la sospecha.",
        proteccion: "Confirmación y tratamiento de neumonía.",
      },
      {
        num: 38, cat: "resp", glosa: "EPOC de tratamiento ambulatorio",
        plazoClave: "Tratamiento desde la confirmación",
        definicion: "EPOC con exacerbación aguda, no especificada.",
        acceso: "Con sospecha: confirmación diagnóstica. Confirmado: tratamiento.",
        oportunidad: "Tratamiento iniciado desde la confirmación diagnóstica según indicación médica.",
        proteccion: "Evaluación inicial. Compensación en urgencias.",
      },
      {
        num: 61, cat: "resp", glosa: "Asma bronquial (≥15 a)",
        plazoClave: "Tratamiento desde la confirmación",
        definicion: "Asma aguda severa.",
        acceso: "Con confirmación de asma grave no controlada e inflamación T2: tratamiento según equipo tratante.",
        oportunidad: "Tratamiento iniciado desde la confirmación diagnóstica según indicación médica.",
        proteccion: "Tratamiento de exacerbaciones y de asma grave refractaria (≥15 a).",
      },
      {
        num: 6, cat: "metab", glosa: "Diabetes mellitus tipo 1 (cetoacidosis o coma)",
        plazoClave: "Glicemia ≤30 min desde la atención en urgencia",
        definicion: "DM I con cetoacidosis o coma.",
        acceso: "Con sospecha: confirmación diagnóstica. Con descompensación: tratamiento de urgencia y hospitalización según indicación médica.",
        oportunidad: "Glicemia ≤30 min desde la atención en urgencia por sospecha de descompensación.",
        proteccion: "Evaluación inicial cetoacidosis DM1. Compensación en urgencias.",
      },
      {
        num: 15, cat: "mental", glosa: "Esquizofrenia",
        plazoClave: "Compensación de la exacerbación",
        definicion: "Psicosis esquizofreniforme, estado paranoide, ideas delirantes.",
        acceso: "Con sospecha: evaluación inicial, confirmación diagnóstica y tratamiento.",
        oportunidad: "Compensación de la exacerbación.",
        proteccion: "Evaluación inicial. Compensación en urgencias.",
      },
      {
        num: 34, cat: "mental", glosa: "Depresión grave con síntomas psicóticos (≥15 a)",
        plazoClave: "Tratamiento desde la confirmación",
        definicion: "Episodio depresivo grave con síntomas psicóticos; trastorno depresivo recurrente, episodio grave con psicosis.",
        acceso: "Con confirmación diagnóstica: tratamiento.",
        oportunidad: "Tratamiento iniciado desde la confirmación diagnóstica.",
        proteccion: "Tratamiento de depresión con psicosis, alto riesgo suicida o refractariedad.",
      },
      {
        num: 75, cat: "mental", glosa: "Trastorno bipolar (≥15 a)",
        plazoClave: "Tratamiento ≤24 h · hospitalización ≤24 h",
        definicion: "Trastorno bipolar, episodio maniaco o depresivo grave con síntomas psicóticos.",
        acceso: "Con confirmación por médico especialista: tratamiento.",
        oportunidad: "Tratamiento ≤24 h desde la confirmación. Hospitalización ≤24 h desde la indicación médica.",
        proteccion: "Tratamiento y hospitalización.",
      },
      {
        num: 48, cat: "trauma", glosa: "Politraumatizado grave",
        plazoClave: "Tratamiento <24 h desde el rescate",
        definicion: "Herida penetrante, ruptura, contusión (politrauma).",
        acceso: "Tratamiento en centro con capacidad resolutiva.",
        oportunidad: "Tratamiento según patología predominante antes de 24 h desde el rescate.",
        proteccion: "Tratamiento de politraumatizado con y sin lesión medular.",
      },
      {
        num: 49, cat: "trauma", glosa: "Traumatismo cráneo-encefálico moderado o grave",
        plazoClave: "Diagnóstico ≤12 h · tratamiento ≤24 h",
        definicion: "Fractura, traumatismo, hemorragia (TEC).",
        acceso: "Con sospecha: confirmación diagnóstica. Confirmado: tratamiento.",
        oportunidad: "Diagnóstico ≤12 h desde la sospecha. Tratamiento ≤24 h desde la confirmación.",
        proteccion: "Confirmación de TEC moderado y grave.",
      },
      {
        num: 50, cat: "trauma", glosa: "Trauma ocular grave",
        plazoClave: "Diagnóstico ≤12 h · especialista ≤60 h",
        definicion: "Herida penetrante, ruptura, contusión ocular.",
        acceso: "Con sospecha: confirmación diagnóstica. Confirmado: tratamiento y seguimiento.",
        oportunidad: "Diagnóstico ≤12 h desde la sospecha. Atención por especialista ≤60 h desde la confirmación.",
        proteccion: "Confirmación y tratamiento médico-quirúrgico de trauma ocular grave.",
      },
      {
        num: 55, cat: "trauma", glosa: "Gran quemado",
        plazoClave: "Estabilización inicial ≤8 h (>15 a) · tratamiento ≤72 h",
        definicion: "Quemado grave y crítico.",
        acceso: "Tendrá acceso a tratamiento y seguimiento.",
        oportunidad: "Tratamiento ≤72 h desde la confirmación en prestador resolutivo. En >15 a, estabilización inicial en centro de origen ≤8 h desde la confirmación.",
        proteccion: "Tratamiento y cirugía.",
      },
      {
        num: 46, cat: "otros", glosa: "Urgencia odontológica ambulatoria",
        plazoClave: "Confirmación ≤24 h · tratamiento inmediato",
        definicion: "Absceso submucoso/subperióstico/apical odontogénico; absceso de espacios bucomaxilofaciales.",
        acceso: "Con confirmación de abscesos bucomaxilofaciales o flegmón orocervicofacial odontológico: tratamiento inicial en urgencia.",
        oportunidad: "Confirmación ≤24 h desde la sospecha. Tratamiento iniciado inmediatamente desde la confirmación.",
        proteccion: "Tratamiento de abscesos y flegmones.",
      },
      {
        num: 86, cat: "otros", glosa: "Atención integral en agresión sexual aguda",
        plazoClave: "Primera respuesta inmediata (≤72 h de ocurrencia)",
        definicion: "Toda persona afectada por violencia sexual aguda (72 h o menos de ocurrencia).",
        acceso: "Consulta por agresión sexual aguda: primera respuesta en un servicio de emergencia hospitalaria.",
        oportunidad: "Primera respuesta entregada inmediatamente desde la solicitud de atención en UEH.",
        proteccion: "Primera respuesta.",
      },
    ],

    /* ---- Ayuda de categorización (referencia; alinear a procedimiento AOC 1.2 del HDS) ---- */
    categorizacion: [
      { cat: "C1", nombre: "Resucitación", color: "red", meta: "Atención inmediata", desc: "Riesgo vital inmediato. Atención médica sin demora." },
      { cat: "C2", nombre: "Emergencia", color: "orange", meta: "≤30 min", desc: "Riesgo vital potencial. Meta GES/COMGES/SISQ: primera atención ≤30 min." },
      { cat: "C3", nombre: "Urgencia", color: "amber", meta: "Prioritaria", desc: "Condición estable con potencial de deterioro." },
      { cat: "C4", nombre: "Urgencia menor", color: "lime", meta: "Diferible", desc: "Sin riesgo vital; puede esperar según flujo." },
      { cat: "C5", nombre: "No urgente", color: "emerald", meta: "Diferible", desc: "Consulta no urgente; orientar a nivel asistencial pertinente." },
    ],

    /* ---- Indicadores de gestión (metas; sin cifras de desempeño cargadas) ---- */
    indicadores: [
      { origen: "COMGES", sigla: "1.9", nombre: "Personas que abandonan durante el proceso de atención en UEH", meta: "≤10%", periodicidad: "Mensual", proceso: "At. Urgencia",
        objetivo: "Disminuir el porcentaje de pacientes que no completan el proceso de atención médica.",
        formula: "(Total DAU generados en UEH − Total altas desde UEH) / Total DAU generados en UEH" },
      { origen: "COMGES", sigla: "1.10", nombre: "Personas categorizadas ESI 2 atendidas oportunamente en UEH", meta: "≥90%", periodicidad: "Mensual", proceso: "At. Urgencia",
        objetivo: "Mejorar la oportunidad de atención médica a pacientes ESI 2 (C2).",
        formula: "N° pacientes ESI 2 atendidos en ≤30 min / N° total de pacientes ESI 2" },
      { origen: "SISQ / DIGERA", sigla: "B.4_1.2", nombre: "Personas atendidas dentro del estándar en UEH (estadía)", meta: "≥90%", periodicidad: "Trimestral", proceso: "At. Urgencia",
        objetivo: "Optimizar el tiempo total del subproceso de atención clínica (permanencia).",
        formula: "(Pacientes con estadía ≤6 h en UEH / Total pacientes con alta médica en UEH) × 100" },
      { origen: "SISQ / DIGERA", sigla: "B.4_1.6", nombre: "Personas ESI 2 atendidas oportunamente en UEH", meta: "≥90%", periodicidad: "Mensual", proceso: "At. Urgencia",
        objetivo: "Mejorar la oportunidad de atención médica a pacientes ESI 2.",
        formula: "(Pacientes ESI 2 atendidos en ≤30 min / Total pacientes ESI 2 en UEH) × 100" },
      { origen: "Ley 20.707", sigla: "Prod. 1", nombre: "Usuarios ESI 2 atendidos oportunamente en UEH", meta: "70%", periodicidad: "Mensual", proceso: "At. Urgencia",
        objetivo: "Tiempo de espera del paciente ESI 2 hasta la primera atención médica desde su categorización.",
        formula: "(Usuarios ESI 2 con 1ª atención médica ≤30 min desde categorización / Usuarios ESI 2 en UEH) × 100" },
      { origen: "Ley 20.707", sigla: "Prod. 3", nombre: "Hospitalización desde UEH a cama de dotación en <12 h", meta: "70%", periodicidad: "Mensual", proceso: "At. Urgencia",
        objetivo: "Pacientes con indicación de hospitalización que acceden a cama de dotación en <12 h desde la indicación.",
        formula: "(Pacientes con indicación de hospitalización que esperan <12 h por cama de dotación / Total con indicación de hospitalización en UEH) × 100" },
    ],

    /* ---- Acreditación (Superintendencia) — características exigibles a UEH ---- */
    acreditacion: [
      { ambito: "Gestión Clínica", caracteristica: "GCL 1.2", obligatoria: false,
        denominacion: "Programa de evaluación y mejoría de prácticas clínicas: atención de enfermería.",
        indicadores: [
          { nombre: "Cumplimiento del procedimiento de recepción de vacunas (UEH)", umbral: "≥90%" },
          { nombre: "Cumplimiento en la instalación de catéter venoso periférico (UEH)", umbral: "≥90%" },
        ],
        documentos: ["Instalación, mantención y retiro de catéter urinario", "Administración de medicamentos endovenosos", "Instalación y manejo de vías venosas periféricas", "Manejo de CVC", "Manejo de TET/TQT", "Inmunización y cadena de frío"] },
      { ambito: "Gestión Clínica", caracteristica: "GCL 1.7", obligatoria: true,
        denominacion: "Programa de evaluación y mejoría: indicación de transfusión.",
        indicadores: [{ nombre: "Pertinencia clínica de la transfusión de hemocomponentes (UEH)", umbral: "≥90%" }],
        documentos: ["Protocolo de indicación de terapia transfusional"] },
      { ambito: "Gestión Clínica", caracteristica: "GCL 1.9", obligatoria: false,
        denominacion: "Contención física de pacientes en agitación psicomotora (prevención de EA).",
        indicadores: [
          { nombre: "Medidas de prevención de EA asociados a contención física", umbral: "100%" },
          { nombre: "Disponibilidad de elementos de contención física (UEH)", umbral: "≥95%" },
        ],
        documentos: ["Prevención de EA asociados a la contención", "Contención física en agitación psicomotora (Psiquiatría)"] },
      { ambito: "Gestión Clínica", caracteristica: "GCL 2.2", obligatoria: true,
        denominacion: "Medidas de prevención de eventos adversos asociados a procesos asistenciales.",
        indicadores: [
          { nombre: "Aplicación de medidas de prevención de error de medicación", umbral: "≥90%" },
          { nombre: "Aplicación de medidas de prevención de caídas", umbral: "≥95%" },
        ],
        documentos: ["Prevención de lesiones por presión", "Prevención de error de medicación", "Prevención de caídas"] },
      { ambito: "Gestión Clínica", caracteristica: "GCL 3.3", obligatoria: true,
        denominacion: "Supervisión del cumplimiento de la normativa de control y prevención de IAAS.",
        indicadores: [{ nombre: "Uso de antisépticos y desinfectantes en áreas clínicas (UEH)", umbral: "≥95%" }],
        documentos: ["Prevención de infección sitio quirúrgico", "Técnica aséptica fuera de pabellón", "Prevención ITS por dispositivos vasculares", "Prevención ITU por cateterismo urinario", "Uso de antisépticos y desinfectantes", "Precauciones por mecanismo de transmisión", "Programa de supervisión de prácticas de prevención de IAAS"] },
      { ambito: "Acceso, Oportunidad y Continuidad", caracteristica: "AOC 1.2", obligatoria: true,
        denominacion: "Sistema de priorización de la atención de urgencia.",
        indicadores: [{ nombre: "Pacientes categorizados oportunamente en UEH según procedimiento", umbral: "≥90%" }],
        documentos: ["Sistema de categorización de pacientes en la unidad de emergencia"] },
      { ambito: "Acceso, Oportunidad y Continuidad", caracteristica: "AOC 2.2", obligatoria: false,
        denominacion: "Sistemas de entrega de turnos que enfatizan la seguridad de la atención.",
        indicadores: [
          { nombre: "Entrega de turno de enfermería (UEH)", umbral: "≥85%" },
          { nombre: "Entrega de turno médico (UEH)", umbral: "≥85%" },
        ],
        documentos: ["Entrega de turno médico UEH", "Protocolo entrega de turno enfermería"] },
      { ambito: "Registros", caracteristica: "REG 1.2", obligatoria: false,
        denominacion: "Cumplimiento de los contenidos mínimos del Dato de Atención de Urgencia (DAU).",
        indicadores: [{ nombre: "Contenidos mínimos del DAU", umbral: "≥90%" }],
        documentos: ["Protocolo estandarización de registros clínicos"] },
      { ambito: "Registros", caracteristica: "REG 1.3", obligatoria: false,
        denominacion: "Entrega de información relevante al paciente post alta de urgencia.",
        indicadores: [{ nombre: "Entrega de información relevante al paciente post alta", umbral: "100%" }],
        documentos: ["Protocolo de entrega de información de prestaciones realizadas al alta"] },
    ],

    /* ---- Documentos asociados sin indicador (referencia de protocolos) ---- */
    documentosSinIndicador: [
      { grupo: "Respeto a la dignidad del paciente (DP)", docs: ["Manual de gestión de solicitudes ciudadanas", "Gestión de reclamos (apéndice)", "Programa de supervisión de prácticas clínicas", "Procedimientos y actividades de alumnos de pregrado"] },
      { grupo: "Gestión Clínica (GCL)", docs: ["Reanimación cardiopulmonar en adultos", "Manejo y mantención de carro de paro", "Criterios de ingreso/egreso a UPC", "Manejo de pacientes con intento de suicidio", "Sistema de vigilancia de eventos adversos"] },
      { grupo: "Competencias del recurso humano (RH)", docs: ["Accidentes laborales con material contaminado (sangre/fluidos)", "Accidentes laborales con citostáticos"] },
      { grupo: "Seguridad de las instalaciones (INS)", docs: ["Plan de emergencia y evacuación"] },
      { grupo: "Servicios de apoyo (APF/API/APL)", docs: ["Notificación de RAM", "Devolución de medicamentos e insumos a Farmacia/Bodega", "Almacenamiento y conservación de medicamentos e insumos", "Medicamentos controlados", "Solicitud de exámenes imagenológicos", "Manual de toma de muestras"] },
    ],
  };

  // Exponer servicio
  window.SVC_UEH = UEH;

  // Registry de servicios (el shell lo lee para construir el selector y crecer).
  // Sumar un servicio = agregar su <script src> en el HTML + una entrada aquí.
  window.SVC_REGISTRY = window.SVC_REGISTRY || [];
  if (!window.SVC_REGISTRY.some((s) => s.id === UEH.id)) {
    window.SVC_REGISTRY.push({ id: UEH.id, sigla: UEH.sigla, nombre: UEH.nombre, ref: "SVC_UEH", estado: UEH.estado });
  }
})();
