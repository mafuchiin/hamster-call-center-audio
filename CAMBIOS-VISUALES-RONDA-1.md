# Ronda visual 1 — legibilidad y composición

Esta entrega modifica la presentación de la copia local existente. No es una auditoría final ni una revisión funcional de los casos.

## Archivos

- `index.html`: carga `css/projection.css` después de las hojas existentes.
- `css/projection.css` (nuevo): paleta, escalas tipográficas, aclarado de la oficina, fondos de contraste, encabezado, composición y ajustes por resolución.
- `README.md`: referencia a esta ronda y a la nueva hoja de estilo.
- `CAMBIOS-VISUALES-RONDA-1.md` (nuevo): estas notas.

Los archivos JavaScript, las imágenes, los iconos y `css/animations.css` conservan exactamente su SHA-256 anterior a esta ronda. No se tocaron casos, decisiones, puntuación, reloj, investigación, sonido ni animaciones. El fondo se aclara mediante CSS; no se sustituyó el archivo de imagen.

## Variables globales

| Variable | Valor base | Uso |
|---|---|---|
| `--ink` | `#20344c` | Texto principal azul marino |
| `--muted` | `#45566d` | Texto secundario oscuro |
| `--cream` | `#fff8e9` | Superficies de lectura |
| `--blue` | `#b9d6f4` | Información y app |
| `--yellow` | `#ffcf68` | Decisiones y atención |
| `--green` | `#b8ddbc` | Verificación / resolución |
| `--pink` | `#f2bacc` | Comunicación y alertas suaves |
| `--purple` | `#d2bced` | Herramientas y datos |
| `--shadow` | `0 10px 26px #29455b24` | Sombras menos oscuras |
| `--text-body` | `clamp(24px,1.8vw,30px)` | Texto principal de casos |
| `--text-title` | `clamp(44px,3.7vw,68px)` | Títulos |
| `--text-secondary` | `20px` | Referencia para texto secundario |
| `--text-button` | `24px` | Botones; 22px en laptop compacta |
| `--text-hud` | `30px` | Valores del HUD; 28px en laptop compacta |

Se conserva la familia tipográfica. Las reglas de laptop reorganizan espacios y columnas para conservar texto legible en 1280×720 y 1366×768. La microinformación auxiliar (atajos pequeños, fecha, nota de simulación y pie) utiliza tamaños menores; las instrucciones y mensajes principales tienen mayor prioridad.

## Cambios por pantalla

- Portada: título, subtítulo, personajes y frase central ampliados; halo claro para reducir la competencia del fondo. La escala se adapta a la altura disponible en lugar de ampliar todo mediante transformaciones que corten contenido.
- Encabezado: logotipo repetido oculto; el nombre del juego permanece en la portada. Frase superior centrada respecto al área completa, con soporte crema y mayor tamaño.
- Introducciones: microtítulos decorativos ocultos; títulos sobre superficies sólidas; tarjetas más grandes y con colores/bordes distinguibles. Se conservaron los iconos.
- Primer turno y misión: texto más grande y superficies crema opacas.
- Cómo se juega: tarjetas, instrucciones y muestras de herramientas más legibles.
- Casos: diálogo de 24px en laptop, título/contexto ampliados, HUD separado, botones y decisiones mayores. Investigación en columnas ajustadas para que el control de decisión permanezca dentro de pantalla.
- Herramientas: misma interacción y animación, con mayor texto y un ancho extra para Canal independiente que evita colisiones con su atajo.
- Consecuencias y revelación: paleta reforzada, texto oscuro; ficha de revelación crema para conservar contraste sobre la oficina clara.
- Fichas educativas: espacio mayor para texto, jerarquía de nombre/tipo/señal/prevención y contraste reforzado.
- Turno completado: título, puntuación, recuentos, grupo descubierto y frase de cierre ampliados.
- Galería: texto ampliado y personajes ajustados al espacio de laptop para evitar recortes.

## Revisión de esta ronda

Se abrieron las nueve introducciones y los estados principales de los cinco casos, herramientas, revelación, ficha, cierre y galería. Se inspeccionaron capturas de composición y se midieron los límites de página en Edge.

- 288 vistas de composición entre 1920×1080, 1366×768, 1280×720 y 390×844.
- 45 vistas adicionales de consecuencias (tres opciones por caso y tres resoluciones de escritorio).
- Sin desbordamiento de página en las tres resoluciones prioritarias; sin desbordamiento horizontal en móvil. En móvil se mantiene lectura vertical.
- Se corrigieron excesos de altura en portada, investigación, consecuencias, ficha y galería, además de la cercanía entre el nombre de una herramienta y su atajo.
- Esta revisión no sustituye una prueba de legibilidad con el proyector real. No se ejecutó una auditoría funcional final ni se modificaron las reglas.

## Para la siguiente ronda

- El arte actual de personajes procede de una lámina recortada por CSS; se aprecian pequeños fragmentos vecinos en algunos bordes. Conviene sustituirla por archivos individuales cuando se autorice trabajar en personajes/assets. Se dejó intacta en esta ronda.
- Esta copia local no incluye módulos de trivia, QR ni Google Forms. No se añadieron ni modificaron; si existen en otra versión, deberá incorporarse esa copia antes de trabajar sobre ellos.
- Calibrar la claridad del fondo y el tamaño final con el proyector que se usará en el taller.
