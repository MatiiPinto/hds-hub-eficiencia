// ════════════════════════════════════════════════════════════════════════════
// Code.gs — Registro de accesos del HUB Puesta en Marcha (HDS)
//
// Recibe POST del HUB-PM (pm_config.js → pmLog) y agrega una fila a la hoja
// "LOG" de la planilla contenedora: Fecha · Hora · Usuario · Evento ·
// Plataforma · IP · Navegador.
//
// INSTALACIÓN (una vez):
//   1. Crear una Google Sheet nueva (ej. "LOG Accesos HUB-PM HDS").
//   2. Extensiones → Apps Script → pegar este archivo completo.
//   3. Implementar → Nueva implementación → tipo "Aplicación web":
//        · Ejecutar como: Yo
//        · Acceso: Cualquier persona
//   4. Copiar la URL /exec y pegarla en pm_config.js → LOG_URL.
// ════════════════════════════════════════════════════════════════════════════
var TZ = 'America/Santiago';

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName('LOG') || ss.insertSheet('LOG');
    if (sh.getLastRow() === 0) {
      sh.appendRow(['Fecha', 'Hora', 'Usuario', 'Evento', 'Plataforma', 'IP', 'Navegador']);
      sh.setFrozenRows(1);
    }
    var p = (e && e.parameter) || {};
    var now = new Date();
    // ── Sugerencias de los visitantes → hoja SUGERENCIAS ──
    if (p.tipo === 'sugerencia') {
      var sg = ss.getSheetByName('SUGERENCIAS') || ss.insertSheet('SUGERENCIAS');
      if (sg.getLastRow() === 0) {
        sg.appendRow(['Fecha', 'Hora', 'Nombre', 'Sugerencia', 'Origen']);
        sg.setFrozenRows(1);
      }
      sg.appendRow([
        Utilities.formatDate(now, TZ, 'yyyy-MM-dd'),
        Utilities.formatDate(now, TZ, 'HH:mm:ss'),
        String(p.nombre || '').slice(0, 60),
        String(p.sugerencia || '').slice(0, 1500),
        String(p.origen || '').slice(0, 40)
      ]);
      return ContentService.createTextOutput('ok');
    }

    sh.appendRow([
      Utilities.formatDate(now, TZ, 'yyyy-MM-dd'),
      Utilities.formatDate(now, TZ, 'HH:mm:ss'),
      String(p.u || '').slice(0, 60),
      String(p.evento || '').slice(0, 80),
      String(p.plataforma || '').slice(0, 80),
      String(p.ip || '').slice(0, 45),
      String(p.ua || '').slice(0, 250)
    ]);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

// GET de prueba: abrir la URL /exec en el navegador debe responder "HUB-PM log activo".
function doGet() {
  return ContentService.createTextOutput('HUB-PM log activo');
}
