# Integración de iconos y QR

## Archivos actualizados

- `index.html`: carga del catálogo de assets y estilos de integración.
- `js/ui.js`: iconos de introducción/herramientas, botón Continuar en resumen, pantalla QR y cierre.
- `js/navigation.js`: transición posterior al turno, enlace reservado a trivia, QR y cierre.
- `js/app.js`: controles de navegación nuevos y teclado correspondiente.
- `README.md`: referencia a esta entrega.

Nuevos: `js/assets.js`, `css/assets.css`, `assets/icons/manifest.json`, las cuatro láminas originales y `assets/ui/qr-forms.png`. `cases.js`, `game.js`, `scoring.js`, `timer.js`, `audio.js` y `motion.js` se conservaron idénticos, verificado mediante SHA-256.

## Organización de los iconos

Se eligió la opción de sprites autorizada: no se redibujaron ni recomprimieron las láminas. Cada PNG conserva sus bytes originales y transparencia. Los recortes se realizan mediante ventanas CSS cuadradas, con la misma escala horizontal y vertical y margen alrededor del dibujo. No hay deformación ni imágenes vecinas visibles.

| Lámina guardada | Claves de los iconos |
|---|---|
| `assets/icons/communication/sheet.png` | `communication/llamadas`, `communication/mensajes`, `communication/correo`, `communication/web`, `communication/apps` |
| `assets/icons/fraud-types/sheet.png` | `fraud-types/llamada-falsa`, `fraud-types/mensaje-enganoso`, `fraud-types/correo-pagina-falsa`, `fraud-types/solicitud-datos-codigos` |
| `assets/icons/psychology/sheet.png` | `psychology/urgencia`, `psychology/confianza`, `psychology/miedo-premio` |
| `assets/icons/tools/sheet.png` | `tools/celular-app`, `tools/computadora`, `tools/libreta`, `tools/canal-independiente` |
| `assets/ui/qr-forms.png` | QR original, sin recorte, cambios de color ni regeneración |

`assets/icons/manifest.json` documenta para cada clave la lámina, coordenadas `[x,y,ancho,alto]` y tamaño original (2172×724). `js/assets.js` contiene el mismo catálogo para que funcione al abrir el HTML desde disco, sin fetch ni servidor. `css/assets.css` contiene las ventanas y escalas. Las imágenes decorativas tienen `alt` vacío porque la etiqueta visible de cada tarjeta identifica su significado.

## Pantallas y composición

Actualizadas: Vivimos conectados, Qué es un fraude digital, Por qué funcionan y las cuatro herramientas de Cómo se juega. Para mantener coherencia, las herramientas de investigación y el encabezado de sus pistas usan los mismos iconos. Se mantienen los números de los pasos, los personajes, los demás símbolos y las animaciones existentes.

Se quitaron los marcos genéricos detrás de los nuevos iconos de las tarjetas, porque el propio arte ya incluye su marco. Se ajustaron tamaños, columnas y márgenes de herramientas. Los originales se muestran reducidos, no ampliados por encima de su resolución.

La pantalla «Queremos escucharte» muestra el QR sobre blanco, con espacio libre, título, instrucciones, «5 preguntas · menos de 2 minutos» y botón Finalizar. El cierre permite volver al QR o reiniciar. Mostrar el QR no envía respuestas ni abre automáticamente el formulario.

## Navegación y trivia pendiente

De acuerdo con la elección del usuario, **no se creó trivia**. Flujo actual:

`5 casos → Turno completado → Continuar → QR → Finalizar → cierre`.

La galería permanece disponible desde Turno completado y vuelve al resumen.

Para integrar la trivia posteriormente, un módulo puede implementar `HCC.trivia.start({ onComplete })`. `HCC.navigation.postTurn()` lo invocará si existe; de lo contrario abre el QR. El módulo deberá presentar sus preguntas y resultado, establecer la vista `trivia-result` y llamar a `onComplete` cuando el público continúe desde ese resultado. La transición `HCC.navigation.afterTrivia()` abre la evaluación. No se inventó una trivia ni una puntuación adicional.

## Validación de esta entrega

- 36 vistas de introducciones, herramientas, resumen, QR y cierre entre 1920×1080, 1366×768, 1280×720 y 390×844.
- Sin errores JavaScript ni desbordamientos de página en escritorio. En móvil, sin desbordamiento horizontal; lectura vertical.
- Revisión visual de recortes, proporciones, texto y QR en capturas de navegador.
- Navegación de resumen a QR, cierre, regreso al QR y reinicio; transición con un adaptador simulado de futura trivia.
- Recorrido completo real por los cinco casos, resumen, QR y cierre desde archivo local y sin conexión; 500 puntos en la ruta verificada.
- Prueba de puntuación: 165 combinaciones correctas; no se modificó su implementación.
- QR copiado exactamente del original. No se ha confirmado su destino mediante decodificación ni se ha ensayado con cámara/proyector físico; conviene probar su escaneo en la sala antes del taller.

## Siguiente ronda

Integrar la trivia cuando se facilite/autorice su contenido y comprobar el escaneo y legibilidad en el proyector real. No se agregaron voces, sonidos ni nuevos personajes.
