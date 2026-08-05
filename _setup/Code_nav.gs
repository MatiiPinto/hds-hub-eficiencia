// ════════════════════════════════════════════════════════════════════════════
// Code_nav.gs — Autoguardado central de Navegación · HUB Puesta en Marcha HDS
//
// Guarda el estado de 8.Navegacion.html (circulación peatonal y vertical,
// marcadores, puntos de flujo y calibración de planos) en un archivo JSON de
// Drive, para que el trabajo NO viva solo en el navegador de quien edita.
//
// Por qué Drive y no una celda: el estado pesa cientos de KB — más que el
// límite de PropertiesService (9 KB) y de una celda (50.000 caracteres).
//
// MODELO: un solo editor a la vez (mpinto / rvargas). Cada guardado sobrescribe
// el estado vigente y deja una VERSIÓN fechada; se conservan las últimas 20
// para poder volver atrás si algo se pisa.
//
// INSTALACIÓN (una vez, mismo ritual de siempre):
//   1. Ir a script.google.com → Nuevo proyecto (nombre: "NAV HDS").
//   2. Pegar este archivo completo.
//   3. Implementar → Nueva implementación → "Aplicación web":
//        · Ejecutar como: Yo   · Acceso: Cualquier persona
//   4. Autorizar cuando lo pida (necesita permiso de Drive).
//   5. Copiar la URL /exec y pegarla en pm_config.js → NAV_URL.
//
// API:
//   POST  (body = JSON del estado, Content-Type text/plain)  → {ok, version, guardado}
//   GET   ?meta=1  → {version, guardado, por, bytes}   (barato: para comparar)
//   GET   ?get=1   → el JSON del estado completo
//   GET   ?versiones=1 → lista de respaldos disponibles
//   GET   (sin params) → texto de prueba
// ════════════════════════════════════════════════════════════════════════════
var TZ         = 'America/Santiago';
var CARPETA    = 'NAV HDS · estado';   // se crea sola en tu Drive
var ARCHIVO    = 'nav_estado.json';
var MAX_VERS   = 20;

function _carpeta() {
  var it = DriveApp.getFoldersByName(CARPETA);
  return it.hasNext() ? it.next() : DriveApp.createFolder(CARPETA);
}
function _archivo(nombre) {
  var it = _carpeta().getFilesByName(nombre || ARCHIVO);
  return it.hasNext() ? it.next() : null;
}
function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);   // evita que dos guardados simultáneos se pisen
    var cuerpo = (e && e.postData && e.postData.contents) || '';
    if (!cuerpo) return _json({ ok: false, error: 'sin datos' });

    var datos;
    try { datos = JSON.parse(cuerpo); }
    catch (err) { return _json({ ok: false, error: 'JSON inválido' }); }

    var ahora   = new Date();
    var sello   = Utilities.formatDate(ahora, TZ, 'yyyy-MM-dd HH:mm:ss');
    datos._guardado = sello;
    datos._version  = ahora.getTime();
    var texto = JSON.stringify(datos);

    // 1 · versión fechada (historial)
    var carp = _carpeta();
    carp.createFile(Utilities.formatDate(ahora, TZ, 'yyyyMMdd_HHmmss') + '_' + ARCHIVO,
                    texto, 'application/json');

    // 2 · estado vigente (se sobrescribe)
    var act = _archivo();
    if (act) act.setContent(texto);
    else carp.createFile(ARCHIVO, texto, 'application/json');

    _podarVersiones(carp);
    return _json({ ok: true, version: datos._version, guardado: sello, bytes: texto.length });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// Conserva solo las MAX_VERS copias fechadas más recientes.
function _podarVersiones(carp) {
  try {
    var vers = [], it = carp.getFiles();
    while (it.hasNext()) {
      var f = it.next();
      if (f.getName() !== ARCHIVO && f.getName().indexOf(ARCHIVO) !== -1) {
        vers.push({ f: f, t: f.getDateCreated().getTime() });
      }
    }
    if (vers.length <= MAX_VERS) return;
    vers.sort(function (a, b) { return b.t - a.t; });
    for (var i = MAX_VERS; i < vers.length; i++) vers[i].f.setTrashed(true);
  } catch (e) {}
}

function doGet(e) {
  var p = (e && e.parameter) || {};
  var f = _archivo();

  if (p.versiones) {
    var out = [], it = _carpeta().getFiles();
    while (it.hasNext()) {
      var v = it.next();
      if (v.getName() !== ARCHIVO) {
        out.push({ nombre: v.getName(),
                   fecha: Utilities.formatDate(v.getDateCreated(), TZ, 'yyyy-MM-dd HH:mm'),
                   kb: Math.round(v.getSize() / 1024) });
      }
    }
    out.sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
    return _json(out);
  }

  if (p.meta) {
    if (!f) return _json({ vacio: true });
    try {
      var d = JSON.parse(f.getBlob().getDataAsString());
      return _json({ version: d._version || 0, guardado: d._guardado || '',
                     por: d._por || '', bytes: f.getSize() });
    } catch (err) { return _json({ vacio: true, error: String(err) }); }
  }

  if (p.get) {
    if (!f) return _json({ vacio: true });
    return ContentService.createTextOutput(f.getBlob().getDataAsString())
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(
    'NAV HDS · autoguardado activo' + (f ? ' · estado presente (' + Math.round(f.getSize() / 1024) + ' KB)'
                                          : ' · sin estado guardado todavía'));
}
