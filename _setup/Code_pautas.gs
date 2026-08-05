// ════════════════════════════════════════════════════════════════════════════
// Code_pautas.gs — Asignación central de pautas AS · HUB Puesta en Marcha HDS
//
// Guarda las asignaciones de pautas (Autorización Sanitaria → recintos) hechas
// por los ASIGNADORES desde el HUB-PM (mpinto, mcanales, csepulveda). Una fila
// por recinto, que se ACTUALIZA en cada cambio (upsert por RecintoId).
//
// INSTALACIÓN (una vez, mismo ritual de siempre):
//   1. Crear una Google Sheet nueva (ej. "PAUTAS HDS").
//   2. Extensiones → Apps Script → pegar este archivo completo.
//   3. Implementar → Nueva implementación → "Aplicación web":
//        · Ejecutar como: Yo   · Acceso: Cualquier persona
//   4. Copiar la URL /exec y pegarla en pm_config.js → PAUTAS_URL.
//
// API:
//   POST accion=asignar  {rid, estado, p(JSON array), por}  → upsert, "ok"
//   POST accion=quitar   {rid, por}                          → borra fila, "ok"
//   GET  ?list=1  → JSON {rid: {estado, p:[...], fecha, por}, ...}
//   GET  (sin params) → "Pautas HDS activas" (prueba)
// ════════════════════════════════════════════════════════════════════════════
var TZ = 'America/Santiago';
var HOJA = 'ASIGNACIONES';
var COLS = ['RecintoId', 'Estado', 'Ambitos', 'Fecha', 'Hora', 'Por'];

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(HOJA) || ss.insertSheet(HOJA);
  if (sh.getLastRow() === 0) { sh.appendRow(COLS); sh.setFrozenRows(1); }
  return sh;
}
function _filaDe(sh, rid) {
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(rid)) return i + 1;
  }
  return 0;
}

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    var sh = _sheet();
    var rid = String(p.rid || '').slice(0, 40);
    if (!rid) return ContentService.createTextOutput('error: falta rid');
    var fila = _filaDe(sh, rid);
    if (p.accion === 'quitar') {
      if (fila) sh.deleteRow(fila);
      return ContentService.createTextOutput('ok');
    }
    // accion=asignar (default): upsert
    var now = new Date();
    var valores = [rid,
      String(p.estado || 'validada').slice(0, 20),
      String(p.p || '[]').slice(0, 45000),
      Utilities.formatDate(now, TZ, 'yyyy-MM-dd'),
      Utilities.formatDate(now, TZ, 'HH:mm:ss'),
      String(p.por || '').slice(0, 30)];
    if (fila) sh.getRange(fila, 1, 1, COLS.length).setValues([valores]);
    else sh.appendRow(valores);
    return ContentService.createTextOutput('ok');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.list) {
      var data = _sheet().getDataRange().getValues();
      var out = {};
      for (var i = 1; i < data.length; i++) {
        var amb = [];
        try { amb = JSON.parse(data[i][2] || '[]'); } catch (err) {}
        out[String(data[i][0])] = {
          estado: String(data[i][1] || 'validada'),
          p: amb,
          fecha: (Object.prototype.toString.call(data[i][3]) === '[object Date]')
                 ? Utilities.formatDate(data[i][3], TZ, 'yyyy-MM-dd') : String(data[i][3] || ''),
          por: String(data[i][5] || '')
        };
      }
      return ContentService.createTextOutput(JSON.stringify(out))
                           .setMimeType(ContentService.MimeType.JSON);
    }
    return ContentService.createTextOutput('Pautas HDS activas');
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err);
  }
}
