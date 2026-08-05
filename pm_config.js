// ════════════════════════════════════════════════════════════════════════════
// pm_config.js — Configuración del HUB Eficiencia Hospitalaria (🟣)
//
// Mismo motor de acceso que el HUB-PM (pm_gate.js), con su propio padrón de
// usuarios: acá entra el equipo de Eficiencia Hospitalaria, no el de PM.
//
// USUARIOS: la clave se guarda como SHA-256 de "usuario:clave" (nunca en claro).
// Para generar el hash de un usuario nuevo: abrí la consola del navegador en
// este index y ejecutá  pmHash('usuario','clave')  — copiá el resultado acá.
//
// LOG_URL: comparte el mismo Apps Script de registro de accesos del HUB-PM
// (una sola hoja con todos los ingresos; la columna "plataforma" distingue).
//
// ⚠ LÍMITE HONESTO: GitHub Pages es un sitio estático. Este control de acceso
// disuade el acceso casual y registra quién entra, pero NO es seguridad de
// servidor: los archivos del repo siguen siendo descargables por URL directa.
// Por eso acá NUNCA se publican datos sensibles (RUT, correos, etc.).
// ════════════════════════════════════════════════════════════════════════════
window.PM_CONFIG = {
  LOG_URL: 'https://script.google.com/macros/s/AKfycbx-v6nDDB2YLNszxh3qg5eWJcxtKrBTlzKK1f91OQwV1NKAm6zKBQ6J_fBJvL9jrEA_/exec', /*__PM_LOG_URL__*/
  SESSION_HOURS: 12,
  USERS: {
    // usuario : sha256("usuario:clave")
    // Equipo Eficiencia Hospitalaria (clave inicial: primeros 4 dígitos del RUT)
    'mpinto':  '405ce04bf68d5cf8cb2e74ae353d946916bd9676253c68b4ab2894bb850456b3',
    // EU Javiera Flores Díaz · Eficiencia Hospitalaria.
    // ⚠ Persona DISTINTA de Javiera Pacheco Navarro ('jpacheco', padrón del
    //   HUB-PM): padrones independientes, no reutilizar credenciales.
    'jflores': 'ec64c3c0dc2cb721c6bb2b9adbdd7b3e01675188e30ce050d916857fe89de76f'
  }
};

// ── Sesión (localStorage, expira a las SESSION_HOURS) ───────────────────────
function pmSession(){
  try{
    var s = JSON.parse(localStorage.getItem('pm_session') || 'null');
    if (s && s.u && s.exp && Date.now() < s.exp) return s;
  }catch(e){}
  return null;
}
function pmSetSession(u){
  localStorage.setItem('pm_session', JSON.stringify({
    u: u, exp: Date.now() + window.PM_CONFIG.SESSION_HOURS * 3600 * 1000
  }));
}
function pmLogout(){
  var s = pmSession();
  if (s) pmLog('logout', 'index');
  localStorage.removeItem('pm_session');
  location.reload();
}
// SHA-256 de "usuario:clave" (hex)
async function pmHash(u, p){
  var buf = new TextEncoder().encode(u + ':' + p);
  var d   = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(d)).map(function(b){
    return b.toString(16).padStart(2, '0');
  }).join('');
}
// Registro de accesos (no bloquea la navegación si falla)
function pmLog(evento, plataforma){
  try{
    var url = window.PM_CONFIG.LOG_URL;
    if (!url) return;
    var s = pmSession();
    var body = new URLSearchParams({
      usuario: (s && s.u) || '—', evento: evento || 'acceso',
      plataforma: 'EFI · ' + (plataforma || ''), ua: navigator.userAgent.slice(0, 180)
    });
    fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString() });
  }catch(e){}
}
