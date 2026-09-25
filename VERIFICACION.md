# Verificación de los cinco casos completos

Fecha: 25 de septiembre de 2026.

## Pruebas y resultados

| Comprobación | Resultado |
|---|---|
| 165 ramas mediante controles de la interfaz | Correcto: 5 casos × 11 conjuntos de herramientas × 3 acciones |
| 0 herramientas | Las 15 decisiones recorrieron consecuencia, reveal y ficha |
| 1 herramienta | Las 60 combinaciones recorrieron consecuencia, reveal y ficha |
| 2 herramientas | Las 90 combinaciones recorrieron consecuencia, reveal y ficha |
| Cambiar el orden de dos herramientas | 90 comparaciones adicionales: mismo resultado |
| Tercera investigación | Bloqueada por interfaz y motor |
| Repetir herramienta | No consume ni crea evidencia adicional |
| HUD | 2 → 1 → 0 recursos; puntos y tiempo conservados |
| Temporizador real del motor | 75 → 65 al avanzar el reloj; investigar mantiene 65; avisos a 15, 7 y 3; a 0 fuerza decisión |
| Vencimiento con pista abierta | Conserva esa evidencia; no asigna respuesta ni Game Over |
| Vencimiento antes del diálogo | Relectura de situación y código SMS disponible |
| Decisión repetida | No suma puntos dos veces |
| Reloj después de decidir | Permanece detenido |
| Nuevo caso | Reinicia a 75 segundos y dos recursos |
| Caso 3 | App, libreta y canal independiente permiten resolver; cancelar retrasa el trámite |
| Caso 5 | Computadora + libreta no autentican; el canal anterior sí |
| Cinco reveals | Presentes en todas las ramas; CONTACTO LEGÍTIMO y Milo real verificados |
| Turno mixto completo | 280 puntos: 2 resueltos, 2 a salvo, 1 riesgo |
| Galería y reinicio | Cinco personajes; reinicio limpia los resultados |
| Enlace y botón simulados | Abren decisiones internas sin navegar a servicios externos |
| Archivo local sin conexión | Recursos cargados y caso resuelto correctamente |
| Errores JavaScript / consola | 0 en el recorrido |
| Solicitudes externas | 0 |
| 1280×720 y 1440×900 | Vistas de investigación, relectura, pistas y decisión ajustadas sin desbordamiento de página |
| Móvil 390×844 | Sin desbordamiento horizontal; lectura vertical |

Los 165 resultados se distribuyeron en **34 RESOLVED, 76 PARTIAL y 55 RISK**, conforme a la matriz esperada. Los datos de cada rama están en `tests/branch-matrix.json`.

## Comprobaciones contra atajos

- Elegir la ruta segura sin investigar en los cinco casos: **200/500**.
- Obtener evidencia buena, pero cancelar el trámite legítimo: **440/500**.
- Usar siempre computadora + libreta y elegir C: **380/500**.
- Usar un canal independiente y actuar correctamente en cada caso: **500/500**.
- Elegir transferir en el caso 5 sigue siendo RISK aunque se haya hablado con Milo real.

No se atribuye comprensión a la persona a partir de sus pensamientos: el programa evalúa las decisiones y evidencias observables. La selección aleatoria podría acertar por coincidencia; no obtiene puntos extra por ser aleatoria ni por gastar ambas herramientas.

## Método

Se recorrieron las 165 ramas con automatización de navegador sobre botones y transiciones reales, no solo llamando a la función de puntuación. Se verificaron todos los reveals y fichas, y se revisaron visualmente capturas representativas del SMS, correo, evidencia contextual, consecuencias, contacto legítimo y Milo real.

Las pruebas de interfaz usaron Playwright y Microsoft Edge con movimiento reducido. El reloj virtual avanzó el temporizador de producción para comprobar sus manejadores sin esperar 75 segundos por ensayo.

La regresión independiente de puntuación incluida en el proyecto usa únicamente Node.js: ejecutar `node tests/scoring.test.cjs`. No requiere npm ni se carga en la aplicación.

## Límites

No se ha ensayado con público/proyector físico ni publicado esta versión. No hay audio. La integración opcional del navegador con `document.modelContext` no está disponible nativamente en Edge y no es necesaria para jugar.


## Actualización visual y de interacción

Se repitieron las **165 ramas completas de interfaz** y las **90 comparaciones de orden** tras integrar las animaciones. Sin errores JavaScript, solicitudes externas ni desbordamientos en ese recorrido. El motor de estados (`game.js`) y la evaluación (`scoring.js`) conservan su SHA-256 previo. Los contenidos educativos de los casos se mantienen; solo cambian los umbrales visuales del reloj y los iconos de herramientas en la configuración.

Se verificaron **280 vistas** entre 1920×1080, 1366×768, 1280×720 y 390×844: nueve introducciones, canales, avatar, diálogo, evento SMS, investigación, cuatro herramientas por caso, decisión, consecuencia, revelación y ficha. Sin desbordamientos en escritorio ni horizontales en móvil. En móvil hay lectura vertical.

Pruebas adicionales con movimiento activo: Espacio/Enter, herramientas por número, rechazo de herramienta repetida, bloqueo al agotar dos recursos, Esc, decisión por letra, no duplicación de puntos, aceleración y segundo clic para completar, decisión inmediata durante escritura, preferencia de movimiento reducido activada durante diálogo y eventos silenciosos de voz/efectos. Se probaron avisos del reloj a 15/7/3 y transición a decisión al agotarse.

Capturas revisadas: app, libreta, revelación y ficha educativa. Se corrigieron líneas de libreta transparentes y se reforzó el contraste del texto de revelación. Informes resumidos en `tests/visual-report.json` y `tests/interface-report.json`. Los ensayos automatizados usaron Edge; no sustituyen una prueba con proyector físico.
