# Auditoría HackEPS 2026

Revisión del repositorio `LleidaHack/hackeps` y del sitio publicado en
`www.lleidahack.dev`.

| | |
|---|---|
| **Rama** | `bepes/page-audit-fff391` |
| **Commit** | `d71884b` |
| **Fecha** | 4 de septiembre de 2026 |
| **Alcance** | 137 ficheros JS · 10.085 líneas |
| **Informe completo** | https://claude.ai/code/artifact/d4b8025f-0be5-4da5-88e2-afde34e4eb5a |

**Resumen:** 5 hallazgos de prioridad alta · 11 de prioridad media · 12 de
mantenimiento. Los marcados con ✓ se verificaron contra producción.

---

## Prioridad alta

### A-1 · Las 13 URLs del sitemap devuelven una página en blanco con HTTP 200 ✓

En modo `REACT_APP_LAUNCH_PENDING=1`, `src/App.js:26-44` registra solo tres
rutas: `/`, `/terms` y `/privacy`. No hay `path="*"`, así que React Router no
renderiza nada para el resto y el `<div id="root">` se queda vacío. Verificado
en producción: `/hackeps`, `/hackeps/faq` y `/login` devuelven 200 con el root
vacío.

Mientras tanto `public/sitemap.xml` sigue anunciando 13 URLs bajo `/hackeps/*`
— ninguna de las cuales existe siquiera en el router actual, que sirve las
rutas en la raíz (`/faq`, no `/hackeps/faq`). Google está indexando 13 páginas
en blanco como contenido válido.

**Arreglo:** añadir `<Route path="*" element={<Navigate to="/" replace />} />`
a la rama de launch pending y reducir el sitemap a las tres URLs existentes.

Ficheros: `src/App.js:26-44` · `public/sitemap.xml` · `src/config/routes.js`

### A-2 · La nueva contraseña viaja en la query string al restablecerla

`confirmResetPassword` pasa token y contraseña como `Query`, y `fetchPlus` los
concatena a la URL:

```
POST /v1/auth/confirm-reset-password?token=…&password=<contraseña en claro>
```

El cuerpo de una petición no se registra; la URL sí. Acaba en los logs de
acceso del proxy, en la telemetría del CDN, en cualquier APM y en el historial
de errores. El mismo patrón expone el correo en `resetPassword` y
`resendVerification`.

**Arreglo:** mover token, contraseña y correo de `Query` a `Body` en las cuatro
funciones (requiere el cambio equivalente en el backend).

Ficheros: `src/services/AuthenticationService.js:11-28` ·
`src/modules/fetchModule.js:40-51`

### A-3 · Un login fallido guarda la cadena `"undefined"` como token de sesión

El bloque `saveLoginInfo` de `fetchPlus` vive en un `.then()` por el que también
pasan las respuestas de error, que se resuelven como `{errCode, errMssg}`. Con
un 401, `data.access_token` es `undefined` y `localStorage.setItem` lo convierte
en el *string* `"undefined"`, que es truthy.

A partir de ahí la app cree que hay sesión: `Header.js:20` comprueba
`if (localStorage.getItem("userToken"))` y entra, `MainTitle.js:31` compara
contra `null` y falla, y se envían peticiones con
`Authorization: Bearer undefined`. `LoginForm.js:31` ya lleva el parche que
delata el problema: compara literalmente contra `"undefined"`.

**Arreglo:** guardar solo cuando la respuesta trae token
(`if (saveLoginInfo && data.access_token)`) y unificar la comprobación de sesión
en un único helper.

Ficheros: `src/modules/fetchModule.js:66-74` ·
`src/components/hackeps/Header/Header.js:20` ·
`src/components/loginForm/LoginForm.js:31` ·
`src/components/hackeps/Home/MainTitle.js:31`

### A-4 · Los botones «Següent» y «Anterior» del registro son botones de submit

`Button.js:29` renderiza `<button type={props.type}>`. En `HackerForm` nunca se
pasa `type`, así que queda `undefined` y el navegador aplica el valor por
defecto de HTML: `submit`. Los tres `<form>` no tienen `onSubmit`, y los
manejadores de paso (`onClick={() => setStep(2)}`) no llaman a
`preventDefault()`.

Resultado: al pulsar «Següent» el navegador ejecuta el envío por defecto del
formulario — una navegación GET a la propia URL que recarga la página, descarta
el estado del formulario y deja todos los campos con nombre, contraseña
incluida, en la barra de direcciones.

**Arreglo:** `type="button"` en los botones de navegación entre pasos y
`onSubmit={handleSubmit(onSubmit)}` en el formulario final. El mismo patrón está
en `LoginForm.js:48`, donde hoy funciona solo porque react-hook-form cancela el
evento de click.

Ficheros: `src/components/buttons/Button.js:29` ·
`src/components/hackeps/Forms/HackerForm.js:149,271-278,342-357`

### A-5 · Las cabeceras de seguridad del repositorio no llegan a producción ✓

`nginx.conf` define `X-Frame-Options`, `X-Content-Type-Options` y
`Referrer-Policy`. Pero producción no usa nginx: la respuesta de
`www.lleidahack.dev` llega con `server: Vercel`, y la única cabecera de
seguridad presente es `strict-transport-security`. Ni CSP, ni protección contra
framing.

Con la app cargando además CSS de terceros desde cdnjs
(`public/index.html:11`), una CSP es la diferencia entre un XSS contenido y uno
que se lleva los tokens del `localStorage`.

**Arreglo:** un `vercel.json` con el bloque `headers`: CSP,
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` y `Referrer-Policy`.
Y borrar `nginx.conf` o documentar que no está en uso (ver B-2).

Ficheros: `nginx.conf:37-43` · `public/index.html:11-13`

---

## Prioridad media

### M-1 · La página se declara en inglés y está escrita en catalán ✓

`<html lang="en">` con todo el contenido en catalán. Los lectores de pantalla
pronuncian «Preparant la celebració» con fonética inglesa, y los buscadores
clasifican mal el idioma. **Arreglo:** `lang="ca"`.

Fichero: `public/index.html:2`

### M-2 · Las previsualizaciones de Open Graph están rotas ✓

En el HTML servido, `og:url` queda vacío y `og:image` es
`/logoHackeps2026.png`: CRA sustituye `%PUBLIC_URL%` por cadena vacía en un
despliegue en raíz. Open Graph exige URLs absolutas, así que al compartir el
enlace en WhatsApp, LinkedIn o Slack no aparece ni imagen ni URL canónica.
Faltan además `og:type`, `twitter:card` y `<link rel="canonical">`.

Fichero: `public/index.html:19-24`

### M-3 · El manifest sigue siendo la plantilla de Create React App

`"short_name": "React App"`, `"name": "Create React App Sample"` y los tres
iconos genéricos. Es lo que ve quien instala el sitio como PWA.

Fichero: `public/manifest.json`

### M-4 · La cuenta atrás se congela el 29 de noviembre y se reinicia el 1 de enero ✓

La fecha objetivo es `new Date(new Date().getFullYear(), 10, 28)`: el 28 de
noviembre *del año en curso*. Del 29 de noviembre al 31 de diciembre la
diferencia es negativa y el contador muestra `0 mesos 0 dies 0 hores` — justo
durante y después del evento. El 1 de enero vuelve a saltar a once meses.

Dos detalles más: `mesos: Math.floor(days / 30)` convierte los 85 días reales
en «2 mesos 25 dies» (son 2 meses y 24 días), y el `setInterval` recalcula cada
segundo aunque la unidad más pequeña en pantalla sea la hora — 3.600 renders
inútiles por hora.

**Arreglo:** fecha del evento como constante explícita
(`2026-11-28T09:00:00+01:00`), estado terminal para cuando la fecha ya pasó, e
intervalo de 60 s.

Fichero: `src/components/hackeps/Waiting/Waiting.js:11,22-29,37-42`

### M-5 · La portada no dice qué es ni cuándo es ✓

Todo el texto de la página publicada es: «Preparant la celebració…», la cuenta
atrás y los enlaces del pie. No aparece «HackEPS», ni 2026, ni Lleida, ni la
fecha, ni un solo `<h1>` — la home no tiene ningún encabezado.

**Arreglo:** un `<h1>` con «HackEPS 2026», la fecha y la sede debajo del
contador.

Fichero: `src/components/hackeps/Waiting/Waiting.js:105-120`

### M-6 · El enlace a X no tiene nombre accesible

Instagram y LinkedIn llevan `aria-label` y sus SVG `aria-hidden`. El de X no
lleva ninguno de los dos.

Fichero: `src/components/hackeps/Waiting/Waiting.js:134-139`

### M-7 · Una clase de Tailwind rota y tres enlaces externos sin `rel`

`underline-offset-2text-black` son dos clases pegadas sin espacio: ni el offset
ni el color se aplican. En el mismo bloque, los enlaces a términos, privacidad
y código de conducta usan `target="_blank"` sin `rel="noreferrer"`, a diferencia
del resto del fichero. Aparte, «Politica de Privadesa» va sin acento
(*Política*).

Fichero: `src/components/hackeps/Waiting/Waiting.js:143-145,150`

### M-8 · Ningún campo de formulario declara `autoComplete`

Cero apariciones en todo `src/`. Los gestores de contraseñas no reconocen los
campos, el autorrelleno no funciona y el teclado móvil no se adapta. Es también
un criterio de WCAG (1.3.5, Identify Input Purpose).

Ficheros: `src/components/loginForm/LoginForm.js` ·
`src/components/hackeps/Forms/HackerForm.js` ·
`src/pages/hackeps/ResetPassword.js`

### M-9 · El avatar del menú de escritorio nunca se actualiza tras iniciar sesión

`Header` guarda JSX en el estado y construye `endContent` dentro de un
`useEffect([])`, así que ese árbol captura los valores iniciales de `icon` y
`validToken`. Cuando `checkToken()` resuelve, solo el segundo efecto refresca
`dropEndContent`.

Dos cosas más en el mismo fichero: `localStorage.setItem("validToken", false)`
se ejecuta durante el render, y la guarda de la imagen es una tautología —
`a !== null || a !== undefined || a !== "" || a !== "string"` es siempre
verdadera.

Fichero: `src/components/hackeps/Header/Header.js:16,31-36,50-158`

### M-10 · `RequireAuth` llama a `navigate()` durante el render

La rama de «no autenticado» devuelve `navigate("/login", …)` como si fuera JSX.
React avisa por consola y el comportamiento no está garantizado en modo
concurrente. **Arreglo:** `<Navigate to="/login" state={…} replace />`.

Fichero: `src/modules/RequireAuth.js:38`

### M-11 · Un hook dentro del array de dependencias de un efecto

`useEffect(() => {…}, [useParams(), isHacker])`. Infringe las reglas de hooks y
hace que la re-ejecución dependa de la identidad del objeto que devuelva
react-router. **Arreglo:** desestructurar `hacker_id` en el cuerpo y usar
`[hacker_id, isHacker]`.

Fichero: `src/components/hackeps/Profile/Profile.js:127`

---

## Mantenimiento

### B-1 · La cadena de build está sin mantenimiento

`react-scripts@5.0.1` — Create React App está archivado desde 2023. El lockfile
arrastra `nth-check@1.0.2` (ReDoS), `postcss@7.0.39` y
`serialize-javascript@4.0.0`, todas transitivas y sin arreglo posible sin
`overrides` o sin migrar. **Arreglo:** migrar a Vite.

### B-2 · Tres rutas de despliegue divergentes, ninguna en uso

`Dockerfile`, `nginx.conf` y `deployVPS.yml`, con producción en Vercel. Las tres
rotas por su cuenta: el Dockerfile hace `git clone` en lugar de usar el contexto
de build y falla sin `GIT_BRANCH`; declara `ARG REACT_APP_LAUNCH_PENDING` pero
nunca lo promociona a `ENV`, así que el flag de la página de espera se perdería.
`deployVPS.yml` entra por SSH con contraseña y lanza `npm run build` sin
instalar dependencias.

Ficheros: `Dockerfile:9,17,26` · `nginx.conf` ·
`.github/workflows/deployVPS.yml`

### B-3 · CI no ejecuta los tests, y el workflow que hay está roto

18 ficheros de test en `src/test/` y ningún job de CI que los ejecute. El único
workflow de PR, `formatter.yaml`, corre `npm install` seguido de `npm ci` sobre
Node 14 — y `package-lock.json` está en `.gitignore` porque el proyecto usa
pnpm, así que `npm ci` falla siempre. `install.yml` ni siquiera es un workflow:
son dos líneas de `apt-get` sueltas.

### B-4 · Las variables de entorno no cuadran con el código

El código compara `REACT_APP_DEBUG === "true"` en nueve sitios, pero
`.env.sample` documenta `REACT_APP_DEBUG=0`. `REACT_APP_LAUNCH_PENDING` —el flag
que decide qué sitio se publica— no aparece en el sample. `REACT_APP_API_KEY`
está declarada y no se usa; recordar que cualquier `REACT_APP_*` acaba en texto
plano dentro del bundle.

### B-5 · 29 llamadas a `console.*` llegan a producción

Veinte sin guarda de debug, incluidos `console.log("wefwefwefwefw")` en
`Team.js:79` y `:93`, y un `console.log(isOpen)` en el cuerpo de `PopupBody` que
se dispara en cada render.

### B-6 · 66 MB de imágenes en el repositorio; las más pesadas no se usan

`src/assets` 45 MB, `src/imgs` 15 MB, `src/icons` 6,2 MB. Los tres ficheros más
grandes —`foto_grupal_colonies.jpg`, `banner_hackeps_gif.gif` y
`Background_gif_big.gif`, 15 MB cada uno— no están importados desde ningún
sitio, igual que `devs.jpg` o los PNG originales de las olas ya sustituidos por
WebP.

### B-7 · 22 módulos que nadie importa

Cinco servicios completos (`ArticleService`, `ArticleTypeService`,
`CompanyUserService`, `MealService`, `UserConfigService`), los siete componentes
de `eventCards/`, `Body-old.js`, `AnimationsBlock.js`, `Toast.js`, cuatro iconos
y `AnnouncementPanel.js`. Además `src/context/context.js` y `src/hooks/hooks.js`
están vacíos.

### B-8 · Nueve `<img>` sin `alt`

De 74 imágenes, nueve no declaran `alt` — cinco en `Hero2.js`. Un `alt` ausente
y un `alt=""` no son lo mismo. La página de espera lo hace bien; el sitio
completo no.

Ficheros: `src/components/hackeps/Home/HeroSection/Hero2.js:353-373` ·
`src/components/hackeps/Hacking/Body.js:320` ·
`src/components/hackeps/Forms/HackerForm.js:135`

### B-9 · El precargado de fuentes no se está aprovechando ✓

La consola de producción avisa por los dos ficheros: *«space-mono-latin-400.woff2
was preloaded using link preload but not used within a few seconds from the
window's load event»*. Merece comprobar el emparejamiento entre el `preload` y
el `@font-face` (atributo `crossorigin` y `unicode-range`).

Ficheros: `public/index.html:8-10` · `public/style.css:4-20`

### B-10 · La Seu Vella queda cortada en pantallas anchas y bajas ✓

A 1280×720 la base del castillo se corta en el borde entre las dos bandas de
color. El posicionamiento absoluto en porcentajes sobre un contenedor de `66vh`
funciona en móvil y en escritorio alto, pero no en viewports bajos.

Fichero: `src/components/hackeps/Waiting/Waiting.js:48,83`

### B-11 · Restos de la edición 2025 y código muerto

La página de login sigue importando `logoHackeps2025.png`. En `Home.js` hay dos
líneas sin efecto (`start.setMonth(start.getMonth())`). En `HackerForm.js:449`
hay un paréntesis mal puesto: `!watch("termsConditions" || hideSubmit)` — el
`|| hideSubmit` quedó dentro de la llamada a `watch`.

### B-12 · Cerrar sesión no revoca nada en el servidor

`logOut()` hace solo `localStorage.clear()`. El `refresh_token` sigue siendo
válido en el backend hasta que caduque, y tampoco hay navegación después. Con
los tokens en `localStorage` (no en cookies `HttpOnly`), la ventana de
exposición ante un XSS es la vida completa del refresh token.

Fichero: `src/components/hackeps/Profile/Profile.js:130-132`

---

## Lo que está bien

- **128 ms de carga completa** en producción (TTFB 47 ms, DOM listo en 127 ms).
  60 KB de JS y 8 KB de CSS comprimidos.
- **El corte condicional de Bootstrap funciona.** El CSS servido no contiene ni
  una regla de Bootstrap: los `require()` condicionales de `src/index.js` se
  eliminan en build como estaba previsto.
- **Imágenes bien servidas.** WebP con `srcSet` y `sizes`, `width`/`height`
  declarados para evitar CLS, `fetchpriority="high"` en el LCP y `alt=""`
  correcto en las decorativas.
- **Fuentes autoalojadas** con `unicode-range` y `font-display: swap`.
- **Cero errores de consola** en producción, y `/terms` y `/privacy` cargan
  correctamente desde sus chunks diferidos.
- **Sin `dangerouslySetInnerHTML`** en todo el código, y el SRI del CSS de cdnjs
  está puesto.

---

## Evidencia en producción

Comprobado el 4 de septiembre de 2026 contra `www.lleidahack.dev`.

| Comprobación | Resultado |
|---|---|
| `GET /` | OK — página de espera, «2 mesos 25 dies 0 hores» |
| `GET /terms` · `/privacy` | OK — contenido renderizado desde chunk diferido |
| `GET /hackeps` | **200 con root vacío** — página en blanco |
| `GET /hackeps/faq` | **200 con root vacío** — está en el sitemap |
| `GET /login` | **200 con root vacío** |
| Cabeceras de respuesta | `server: Vercel` · solo `strict-transport-security`; **sin CSP ni X-Frame-Options** |
| `<html lang>` | **`en`** — contenido en catalán |
| `og:url` / `og:image` | **cadena vacía / ruta relativa** |
| Encabezados de la home | **ninguno** — sin `h1` |
| Rendimiento | load 128 ms · JS 60 KB · CSS 8 KB (comprimidos) |
| Consola | Sin errores; 2 avisos de `preload` de fuentes sin usar |

---

## Por dónde empezar

Ordenado por relación entre impacto y esfuerzo, no por gravedad.

1. **Ruta comodín y sitemap** (A-1). Media hora, y deja de haber 13 páginas en
   blanco indexadas.
2. **Cabeceras en `vercel.json`** (A-5). Un fichero nuevo, sin tocar código.
3. **El lote de una línea**: `lang="ca"`, URLs absolutas en Open Graph, el
   manifest, la clase Tailwind rota, el `aria-label` de X y un `h1` en la
   portada (M-1, M-2, M-3, M-5, M-6, M-7). Una tarde entera y arregla todo lo
   que hoy ve un visitante.
4. **Contraseña fuera de la query string** (A-2). Necesita coordinación con
   backend, así que conviene abrirlo pronto.
5. **Los dos bugs de formulario y sesión** (A-3, A-4). No molestan mientras el
   sitio esté en modo espera, pero tienen que estar cerrados *antes* de abrir
   inscripciones.
6. **Fecha del evento como constante** (M-4). Si no, el 29 de noviembre el
   contador se queda a cero durante el propio hackathon.
7. **CI que ejecute los 18 tests** (B-3). Es lo que evita que la siguiente tanda
   de hallazgos como estos llegue a producción.

---

## Alcance y límites

Auditoría estática del código más verificación en vivo contra producción.

- No se ejecutaron el build, la suite de tests ni un escaneo de dependencias con
  red — `node_modules` no está instalado en este worktree, así que B-1 se apoya
  en las versiones fijadas en `pnpm-lock.yaml`.
- No se probaron flujos autenticados (login, inscripción, perfil): esas rutas no
  están servidas en el despliegue actual.
