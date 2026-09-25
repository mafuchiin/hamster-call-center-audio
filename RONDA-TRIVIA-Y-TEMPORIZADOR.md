# Ronda actual: flujo completo, temporizador y trivia

## Bloqueo corregido
El caso 3 usa el canal «Comunicación», que faltaba en el catálogo de iconos. Al continuar desde el caso 2 fallaba el renderizado. Se añadió la correspondencia y un respaldo al icono del caso. Las referencias CSS/JS llevan hashes para renovar archivos en caché.

## Cambios
- Avatar neutro provisional en Primer turno y silueta neutra antes de revelar la identidad. No se reutiliza un personaje de los casos.
- Reloj de 60 segundos que espera al texto completo; en el caso 1 espera también al SMS.
- Avisos progresivos a 15, 7 y 3 segundos. A cero se bloquean herramientas y se muestra Tiempo agotado antes de pasar a las decisiones.
- Texto progresivo más lento, completado inmediato mediante un clic o Enter; transiciones principales suavizadas.
- Resumen ampliado con Comprobar lo aprendido como acción principal.
- Trivia de tres preguntas, respuestas C/B/C, retroalimentación y avance manual. Contador independiente, resultados 0–3, QR original y reinicio completo.

## Archivos
Modificados: index.html, README.md, js/assets.js, js/cases.js, js/game.js, js/motion.js, js/ui.js, js/app.js.
Añadidos: js/trivia.js, css/round-trivia.css, assets/characters/protagonist-neutral.svg, assets/characters/hamster-silhouette.svg y este informe.

## Configuración
- Duración: HCC.config.caseSeconds en js/cases.js (60).
- Aviso de tiempo agotado: HCC.config.timeoutTransitionMs (1400 ms).
- Preguntas y explicaciones: questions en js/trivia.js.
- Estado: triviaScore, triviaAnswers y triviaIndex; reset limpia los tres.
- Audio futuro: eventos locales hcc:dialogue-start, hcc:dialogue-progress y hcc:dialogue-complete, además de hcc:voice y hcc:sfx. No se reproduce audio ni se añade backend.

## Verificación realizada
- Recorrido completo de cinco casos hasta resumen, galería, trivia, QR, cierre y reinicio.
- 165 combinaciones de caso, herramientas y decisión mediante controles de interfaz.
- 27 combinaciones de respuestas a trivia; comprobación de 0/3, 1/3, 2/3 y 3/3 y conservación de puntos de los casos.
- Temporizador detenido antes de lectura, umbrales 15/7, tiempo agotado, transición y continuación manual.
- Botones, desplegables, enlaces simulados, teclado ABC, herramientas 1–4, Escape, Enter, completar texto y pantalla completa.
- Texto con animaciones normales: un clic en botón, un clic en diálogo, Enter y finalización natural.
- 153 pantallas a 1920×1080, 1366×768 y 1280×720 sin desbordamiento ni imágenes faltantes.
- Apertura directa sin conexión. Sin errores de JavaScript en los recorridos automatizados.

El avatar de Primer turno es un SVG provisional, preparado para sustituirse por arte definitivo. El QR y los iconos originales se conservan.
