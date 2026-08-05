# HUB Puesta en Marcha (HUB-PM) — Instructivo

HUB de **acceso controlado** para el equipo de Puesta en Marcha del Nuevo HDS.
URL (cuando esté publicado): `https://matiipinto.github.io/hds-hub-pm/`

**Plataformas (6, solo consulta):** Atlas (versión web), QuirurBox, EquiBox,
Dotación, Autorización Sanitaria, Cartera de Servicios.

---

## Flujo de trabajo (igual que el HUB público)

1. Toda modificación se hace en las plataformas de `7.PLATAFORMAS/` (HUB HDS local).
2. Para Atlas: usar en `6.AtlasHDS.html` → Exportar → **“Actualizar versión web (datos)”**
   (regenera `WEB_DATA/atlas_web_data.js`, que es lo que ve el HUB-PM).
3. Publicar acumulado:  `python3 _DEV/deploy_web_pm.py`   (o `--dry-run` para revisar).
   El script: invierte el flag público, inyecta la puerta de acceso (pm_config +
   pm_gate), reescribe el botón HUB → index, copia datos y **depura la dotación**
   (sin RUT, sin correos, sin fechas contractuales) con verificación anti-fuga.

## Usuarios y claves

- Los usuarios viven en `pm_config.js` → `PM_CONFIG.USERS` como
  `usuario: sha256("usuario:clave")`.
- Iniciales (⚠ cambiar la clave de mpinto al primer uso real):
  - `mpinto` / `HDS-pm-2026`
  - `invitado` / `HDSpm.invitado`
- Para agregar/cambiar: abrir el index del HUB-PM, consola del navegador (F12) y
  ejecutar `await pmHash('usuario','clave')` → pegar el hash en `pm_config.js` y
  volver a publicar.
- La sesión dura 12 h (`SESSION_HOURS`).

## Registro de accesos (usuario · fecha · hora · IP)

1. Crear una Google Sheet nueva (ej. “LOG Accesos HUB-PM HDS”).
2. Extensiones → Apps Script → pegar `_setup/Code.gs` completo.
3. Implementar → Nueva implementación → **Aplicación web**:
   “Ejecutar como: Yo” · “Acceso: Cualquier persona”.
4. Copiar la URL `/exec` y pegarla en `pm_config.js` → `LOG_URL`. Re-publicar.
5. Cada login, intento fallido y apertura de plataforma agrega una fila a la
   hoja LOG. La IP se obtiene vía api.ipify.org desde el navegador del visitante.

## Publicación inicial (una vez)

1. Crear el repo **público** `hds-hub-pm` en github.com/MatiiPinto (sin README).
2. En GitHub: Settings → Pages → Branch `main` / root.
3. Local (ya hecho por Claude si ves .git en esta carpeta):
   `git init` + `git remote add origin https://github.com/MatiiPinto/hds-hub-pm.git`
4. `python3 _DEV/deploy_web_pm.py` → commit + push automático.

## Autoguardado de Navegación (Code_nav.gs) — pendiente de activar

Sin esto, lo que se dibuja en Navegación vive **solo en el navegador de quien
edita**. Con esto, cada cambio se guarda solo en un JSON de Drive y se recupera
al abrir desde cualquier equipo. Modelo de **un editor a la vez** (mpinto /
rvargas); el backend conserva las últimas 20 versiones fechadas.

1. script.google.com → **Nuevo proyecto**, nombre `NAV HDS`.
2. Pegar `_setup/Code_nav.gs` completo.
3. **Implementar → Nueva implementación → Aplicación web**
   · Ejecutar como: **Yo** · Acceso: **Cualquier persona**.
4. Autorizar (pide permiso de Drive: crea la carpeta `NAV HDS · estado`).
5. Copiar la URL `/exec` y pegarla en **dos** lugares:
   - `pm_config.js` → `NAV_URL` (para el 🟡 HUB-PM)
   - `SHARED_DATA/nav_central.js` → `url` (para el entorno local 🔴)
6. `python3 _DEV/deploy_web_pm.py`

Verificación: abrir Navegación, mover algo y esperar 3 s — arriba a la derecha
debe aparecer **☁ guardado HH:MM**. Al abrir en otro equipo: **☁ cargado del
servidor**. Probar la URL `/exec` en el navegador responde el estado del backend.

## ⚠ Límite honesto de seguridad

GitHub Pages es un sitio **estático**: el login disuade el acceso casual y deja
registro de quién entra, pero **no es seguridad de servidor** — los archivos del
repo (incluidos los datos) son técnicamente descargables por URL directa por
quien conozca la ruta, y el repo es público. Por eso:

- La dotación se publica SIEMPRE en versión slim (sin RUT, correos ni datos
  contractuales). El deploy aborta si detecta fugas.
- No publicar aquí nada que no pueda ser visto por un tercero persistente
  (Matriz SIS, correos personales, etc.).
- Si más adelante se necesita seguridad real (asignación de pautas con datos
  sensibles), conviene migrar a un hosting con auth de servidor (p. ej.
  Cloudflare Access, Netlify con password, o un servidor del hospital).
