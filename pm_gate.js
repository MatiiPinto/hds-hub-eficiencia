// ════════════════════════════════════════════════════════════════════════════
// pm_gate.js — Puerta de acceso para cada plataforma del HUB Puesta en Marcha.
// Lo inyecta deploy_web_pm.py al inicio del <head> de cada plataforma publicada
// (justo después de pm_config.js). Si no hay sesión vigente → vuelve al index
// (con ?next= para retomar tras el login). Si hay sesión → registra el acceso.
// ════════════════════════════════════════════════════════════════════════════
(function(){
  var here = location.pathname.split('/').pop() || 'index.html';
  var s = null;
  try { s = pmSession(); } catch(e){}
  if (!s){
    location.replace('index.html?next=' + encodeURIComponent(here + location.search));
    return;
  }
  // Registrar el acceso a esta plataforma cuando el DOM esté listo
  var log = function(){ try { pmLog('abre', here); } catch(e){} };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', log);
  else log();
})();
