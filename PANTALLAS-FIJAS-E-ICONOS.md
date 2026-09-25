# Corrección: pantallas fijas e iconos unificados

## Causa del scroll

Solo se renderizaba un estado a la vez; no había pantallas apiladas. El problema era geométrico: `.screen` usaba altura mínima, y el contenido podía aumentar su altura natural. Las reglas móviles permitían apilar columnas. Además, `.replay`, `.decision-context`, `.evidence-review`, algunas evidencias y el cuerpo de investigación tenían `max-height` y `overflow:auto`, lo que generaba desplazamiento interno aunque la página principal cupiera.

## Solución

- `html` y `body` ocupan la ventana dinámica (`100dvh`) sin desplazamiento horizontal ni vertical.
- `.app-shell` es un escenario fijo. Se conserva el motor existente que reemplaza el contenido de `#app` por un único estado.
- `js/viewport.js` calcula el área visible, mide la altura natural de contenido/controles y encaja el escenario completo mediante escala uniforme, sin deformarlo. Recalcula tras render, resize, cambios del viewport visual, apertura de relecturas, carga de imágenes y fuentes.
- Las relecturas ya no tienen scroll interno ni límites que oculten texto.
- Las vistas extensas usan columnas: decisiones + evidencias + situación; resumen + conversación; aprendizaje + explicación de pistas. Esto aprovecha el ancho antes de reducir la escala.
- La escala es una protección adicional para ventanas pequeñas o contenido expandido. En esas situaciones el texto puede ser menor; no se elimina texto ni controles. El fondo ocupa siempre la ventana y el escenario queda centrado.

## Auditoría de iconos

| Referencia anterior | Dónde aparecía | Sustitución |
|---|---|---|
| `☎` | Portada, logotipo oculto del encabezado, Primer turno, datos de llamada, contacto entrante, avatar incógnito, cabecera de conversación | `communication/llamadas`; se eliminó el logotipo oculto redundante |
| `▤` | Primer turno, mensajes de casos, contacto entrante, cabecera, marcador del HUD | `communication/mensajes`; el marcador de caso usa `tools/libreta` |
| `✉` | Primer turno y correo entrante/cabecera | `communication/correo` |
| `📱`, `💻`, `📒`, `☎` | Metadatos de herramientas, todavía disponibles como valores antiguos aunque sus botones ya usaban sprites | Claves oficiales de `tools` |
| `◎` | Marcador auxiliar de señal en la ficha | Asset oficial de urgencia/alerta |
| Texto del símbolo clonado | Icono flotante durante incoming → unknown | Se clona el nodo del nuevo sprite; duración y trayectoria originales conservadas |

Los nuevos iconos de fraude, factores, comunicación y herramientas de las introducciones ya estaban integrados y se conservaron. Tutorial, investigación y pistas comparten el mismo generador y catálogo de assets.

La búsqueda incluyó HTML, JavaScript, datos, CSS, pseudo-elementos, SVG e imágenes referenciadas. No quedan emojis/símbolos de los canales o herramientas anteriores en los archivos de interfaz ni en sus metadatos. Los sprites oficiales siguen siendo los archivos suministrados, sin versiones alternativas.

## Símbolos y recursos conservados

- Números de pasos, letras A/B/C, flechas de navegación, puntos de verificaciones, interrogación de identidad y señales ✓ / − / ! de resultado: expresan estado o controles; no tienen un reemplazo exacto en las láminas y no son iconos de comunicación/herramientas.
- `favicon.svg`: hámster de la pestaña del navegador; no existe un favicon nuevo suministrado. No representa llamada, mensaje ni herramienta.
- Oficina, personajes y QR: conservados. Los objetos ilustrados del fondo no son controles ni fallbacks de iconos.

## Archivos

Actualizados: `index.html`, `js/assets.js`, `js/cases.js` (solo metadatos visuales), `js/ui.js`, `js/motion.js` (solo transporte del sprite) y `README.md`.

Nuevos: `js/viewport.js`, `css/viewport.css` y este informe. Los estilos de viewport se cargan después de las hojas existentes para anular los límites/scroll anteriores sin retirar estilos necesarios.

## Validación

- 297 estados comprobados entre 1920×1080, 1366×768 y 1280×720: nueve introducciones, cinco casos, cuatro herramientas por caso, relecturas, evidencias abiertas simultáneamente, decisiones, consecuencias, revelaciones, fichas, resumen, galería, QR y cierre.
- Cero desbordamientos de documento; títulos, textos, HUD y botones dentro de los límites visibles, incluyendo referencias desplegadas.
- Ningún símbolo antiguo de comunicación/herramientas en el texto visible recorrido.
- Transición con movimiento activo: el sprite de llamada existe durante el vuelo y se retira al terminar.
- 165 combinaciones de puntuación correctas; recorrido sin conexión de cinco casos → resumen → QR → cierre correcto.
- `game.js`, `scoring.js`, `timer.js` y `audio.js` mantienen SHA-256. La comparación de `cases.js` con la entrega anterior confirma que solo variaron los campos de iconos, no contenidos ni configuración.

No se implementaron trivia, temporizador nuevo, sonidos ni voces. La lectura física desde proyector no se ha ensayado; estas comprobaciones se realizaron en navegador.
