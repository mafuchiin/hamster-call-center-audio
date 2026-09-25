# Hamster Call Center

Aplicación estática de taller presencial. Versión con lógica y contenido de los cinco casos completos: nueve pantallas introductorias, motor reutilizable con cinco casos, dos investigaciones, temporizador, decisiones, consecuencias, revelación, fichas y resumen final. Con audio sintético original y opcional, sin servicios externos, frameworks ni instalación.

## Abrir y usar

1. Conserva toda la carpeta `hamster-call-center` unida.
2. Abre `index.html` con Edge, Chrome o Firefox. Funciona directamente desde el disco y sin conexión.
3. Usa la opción de pantalla completa de la esquina superior derecha, si el navegador la admite.
4. La persona facilitadora lee las situaciones, escucha la votación y pulsa la acción elegida.
5. Al final, `Reiniciar` vuelve a la portada y limpia puntos, evidencias y tiempo.

El diseño está preparado para laptop/proyector 16:9 y escala la escena completa para mantenerla sin desplazamiento vertical. Para una vista local servida, opcionalmente ejecuta `python -m http.server 8765` desde esta carpeta y abre `http://localhost:8765`. No es necesario un servidor para jugar.

Para Vercel posteriormente: usa esta carpeta como raíz, sin framework ni comando de construcción y con salida `.`. Esta entrega no se ha publicado.

## Archivos

- `index.html`: estructura y carga de recursos locales mediante scripts clásicos con `defer`.
- `css/styles.css`: componentes y estilo visual.
- `css/animations.css`: transiciones y avisos de tiempo, con respeto a movimiento reducido.
- `css/responsive.css`: ajustes de laptop, proyector y móvil.
- `js/cases.js`: configuración central, personajes, herramientas y los cinco casos.
- `js/scoring.js`: evaluación conjunta de evidencia y acción; recuento del turno.
- `js/timer.js`: cuenta regresiva basada en un plazo real con `performance.now`.
- `js/game.js`: reglas, estados y transiciones de cada caso.
- `js/navigation.js`: introducción, resumen y galería.
- `js/audio.js`: síntesis centralizada de voces y efectos originales.
- `js/motion.js`: texto progresivo, transición del canal, feedback y limpieza de animaciones.
- `js/ui.js`: componentes reutilizables y contenido de pantallas.
- `js/app.js`: controles, inicio y pantalla completa.
- `assets/backgrounds/office.png`: fondo limpio de oficina.
- `assets/characters/hamis.png`: arte transparente de los cinco personajes.
- `assets/icons/favicon_hamster_call_center.png`: icono local.
- `assets/generation-prompts.txt`: prompts de los dos recursos creados con ImageGen integrado a partir de referencias.
- `DECISIONES-Y-PENDIENTES.md`: matriz de evaluación, criterios pedagógicos y límites de la simulación.

`assets/ui` contiene el QR de evaluación y `assets/audio` queda disponible para una etapa posterior; el sonido se sintetiza localmente sin descargar audio. Algunas herramientas de compresión pueden omitir carpetas vacías.

## Recorrido técnico

La introducción avanza con `navigation`. `Iniciar turno` llama a `game.startCase(0)`, limpia los datos de ronda y deja el reloj en espera. Un registro de `cases.js` alimenta todas las pantallas del motor.

Estados: `incoming → unknown → dialogue → event (solo caso 1) → investigate → clue → investigate/decision → outcome → reveal → education`. Tras la ficha se inicia el siguiente caso; después del quinto se abre `summary`. `characters` permite consultar a los cinco personajes y regresar al resumen.

El HUD muestra el caso, puntos acumulados, tiempo restante y recursos disponibles. Una herramienta consume una verificación al abrirla; una consulta repetida no gasta ni añade evidencia. El resumen de evidencias ya consultadas está disponible al investigar y al decidir. Tras dos consultas se bloquean las cuatro herramientas.

El reloj empieza cuando se termina de mostrar la situación (incluido el SMS del caso 1), sigue al consultar herramientas y al votar, y se detiene al confirmar la decisión. Al llegar a cero cierra la investigación, conserva las pistas y muestra «Tiempo agotado» durante 1,4 segundos antes de presentar las acciones. No elige por el público, no genera Game Over y no modifica los puntos por velocidad.

La identidad, tipo y explicación se renderizan únicamente después de decidir. El caso legítimo usa un título visible neutro antes de la revelación. Una respuesta solo se registra una vez; las transiciones rechazan acciones fuera de estado.

## Configuración central

En `HCC.config` dentro de `js/cases.js`:

- `caseSeconds: 60`: segundos por caso.
- `timeoutTransitionMs: 1400`: duración del aviso de tiempo agotado.
- Aviso cálido a los 15 segundos; pulso a los 7 y más rápido a los 3.
- Máximo de 2 verificaciones.
- `RESOLVED`: 100 puntos; `PARTIAL`: 40; `RISK`: 0.

Los cinco casos mantienen el orden y nombres de las fichas. Cada uno contiene conversación del contacto, hechos de las cuatro herramientas, calidad interna de evidencia, reglas explícitas, consecuencias por acción y ficha educativa con revisión de pistas. No hay dominios reales, cuentas, enlaces externos ni datos que se envíen.

## Audio original

Sistema Web Audio local con mute y volúmenes General, Efectos y Voces. Preferencias por sesión; activación después de la primera interacción. Consulta `AUDIO.md` para presets, efectos, configuración y pruebas.

## Controles y experiencia visual

- Espacio / Enter: avanzar; mientras se escribe, completar el texto sin cambiar de fase. En un botón enfocado conservan su función nativa. En decisión no seleccionan automáticamente una respuesta.
- Clic en diálogo o «Mostrar texto completo»: completa inmediatamente con un solo clic. «Tomar decisión» funciona inmediatamente, incluso durante la escritura.
- 1–4: herramientas habilitadas durante la investigación. A/B/C o 1–3: decisiones cuando están visibles.
- Esc: cerrar relectura, volver de una herramienta, retroceder en introducción o volver de galería. No revierte una decisión ni recupera verificaciones.
- Teléfono vibrante, mensaje deslizante y correo con pequeño rebote; el canal se reduce hacia el avatar desconocido.
- Herramientas con volumen y presión; app entra, monitor se enciende, libreta se abre y teléfono conecta. Se animan recursos consumidos y puntos.
- Consecuencia separada del reveal: check, pausa amarilla o leve sacudida. Avatar → personaje → nombre → tipo, seguido de ficha educativa a demanda.
- Controles de 150–250 ms y transiciones principales de 350–700 ms. La escritura completa dura hasta 4 segundos, pero se puede omitir en cualquier momento. No hay esperas obligatorias.
- Movimiento reducido: texto inmediato, sin animaciones ni pulsos; también responde a cambios de esta preferencia con el juego abierto.
- La escena se escala sin desplazamiento; en las tres resoluciones de proyección las vistas caben completas.

## Integración opcional del navegador

Si el navegador expone `document.modelContext`, se registran dos herramientas locales: lectura de la pantalla visible y activación de controles habilitados. No exponen identidades ocultas ni crean acceso de red. En navegadores sin esa capacidad no se ejecutan. No se requiere esta integración para jugar.

## Verificación

La aplicación se probó en navegador con recorrido completo de los cinco casos, recuento, reinicio, galería, límite de herramientas, tiempo agotado, resultados verdes/amarillos/rojos y apertura directa del archivo sin conexión. Se recorrieron en la interfaz las 165 combinaciones distintas de caso, evidencias y acción, y se comprobó por separado que invertir el orden de dos herramientas no altera 90 evaluaciones. El informe final se encuentra en `VERIFICACION.md`.

## Cambios de la versión completa

- Código SMS y petición del interlocutor como evento del caso 1.
- Mensaje de premio y correo profesional con controles internos de simulación.
- Consecuencias específicas y razonamiento de puntuación para las 15 decisiones.
- Las pistas de redes y libreta del caso 5 no confirman la identidad; la llamada al número previo sí.
- Revelación de Hami Clon junto a una tarjeta de contacto de Milo real.
- Relectura de situación en decisión y explicación de evidencias en la ficha.
- PARTIAL vale 40 puntos; cero bonos por tiempo o número de herramientas.

## Pruebas incluidas

Ejecuta `node tests/scoring.test.cjs` para comprobar la matriz y los casos contra atajos sin instalar dependencias. `tests/branch-matrix.json` conserva los resultados de las 165 ramas recorridas en navegador.


## Ronda visual 1: proyección

`css/projection.css` aplica la paleta clara, texto ampliado y composición revisada después de las hojas anteriores. Consulta `CAMBIOS-VISUALES-RONDA-1.md` para ver variables, archivos, ajustes por pantalla y límites de la revisión visual. La lógica y las animaciones permanecen intactas. Los informes funcionales anteriores corresponden a la versión previa; esta ronda comprobó presentación y conservación de archivos, sin realizar una auditoría final.

## Nuevos iconos y evaluación final

Los iconos adjuntos se integraron como sprites transparentes en `assets/icons/{communication,fraud-types,psychology,tools}/sheet.png`. El catálogo está en `assets/icons/manifest.json`; los estilos en `css/assets.css`. El QR original está en `assets/ui/qr-forms.png`.

El resumen ahora permite continuar a la evaluación QR y luego al cierre, donde se puede reiniciar. Por decisión del usuario no se creó trivia: se dejó preparado un adaptador para conectarla antes del QR. Consulta `ASSETS-Y-QR.md` para ver archivos, recortes, flujo, enlace de futura trivia y validación de esta entrega.

## Corrección de pantallas fijas e iconos

La interfaz ahora encaja un único escenario completo dentro del viewport dinámico, sin desplazamiento de página ni scroll interno en relecturas. `js/viewport.js` ajusta el encuadre y `css/viewport.css` reorganiza las vistas expandidas en columnas. Esta actualización sustituye el comportamiento anterior de lectura vertical en ventanas pequeñas.

Portada, Primer turno, contacto entrante, icono flotante, contacto incógnito y cabeceras usan los nuevos sprites. Consulta `PANTALLAS-FIJAS-E-ICONOS.md` para la causa del scroll, referencias sustituidas y comprobaciones.

## Ronda actual: trivia y flujo corregido

Después del resumen: Comprobar lo aprendido → trivia de tres preguntas → resultado independiente → QR → cierre. Las preguntas, opciones y retroalimentación están en `js/trivia.js`. Reiniciar borra también las respuestas y los aciertos de la trivia.

Consulta `RONDA-TRIVIA-Y-TEMPORIZADOR.md` para los cambios y pruebas actuales; los demás informes describen rondas anteriores.

## Assets definitivos suministrados

Primer turno usa `assets/characters/hamster_protagonista_neutro.png`; las identidades por verificar usan `assets/characters/silueta_hamster_desconocido.png`. El favicon PNG se referencia en el head. Los tres originales se conservan sin transformación. Los SVG provisionales se conservan como archivos históricos sin referencias activas. La lógica del juego no se modifica en esta ronda.
