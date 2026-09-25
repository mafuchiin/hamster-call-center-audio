# Lógica de los cinco casos — versión completa

Fecha: 25 de septiembre de 2026.

## Regla de evaluación

El resultado depende de la evidencia **consultada** y la acción final. Cada caso admite 0, 1 o 2 investigaciones distintas. Abrir una herramienta devuelve hechos; no muestra su calidad interna ni el veredicto.

- RESOLVED: 100 puntos. Acción adecuada y evidencia suficiente para el caso.
- PARTIAL: 40 puntos. Evita el daño inmediato, pero falta comprobar o resolver la situación.
- RISK: 0 puntos. La acción expone dinero, credenciales o acceso.
- No hay bonos por rapidez ni por gastar dos verificaciones.

El clic final en «verificar» no realiza una tercera investigación ni añade evidencia. Es el siguiente paso elegido. Sin una comprobación suficiente, esa acción es incompleta aunque sea prudente.

## Matriz completa

| Caso | A | B | C | Fuentes que pueden respaldar C |
|---|---|---|---|---|
| Hami Estafador | Leer código: RISK | Guardarlo y seguir en llamada: PARTIAL | Cortar y usar canal oficial: RESOLVED con evidencia; PARTIAL sin ella | App o canal independiente |
| Hami Promo | Registrarse: RISK | Preguntar al mismo mensaje: PARTIAL | Ruta oficial sin enlace: RESOLVED con evidencia; PARTIAL sin ella | Computadora o canal independiente |
| Hami Oficial | Cancelar/bloquear: PARTIAL | Confiar sin límites: RISK | Continuar de manera limitada: RESOLVED con evidencia; PARTIAL sin ella | App, libreta o canal independiente |
| Hami Supervisor | Abrir actualización: RISK | Responder al mismo correo: PARTIAL | Ruta oficial independiente: RESOLVED con evidencia; PARTIAL sin ella | Computadora o canal independiente |
| Hami Clon | Transferir: RISK | Pedir más datos al número nuevo: PARTIAL | Contacto previo: RESOLVED con evidencia; PARTIAL sin ella | Solo canal independiente |

Cada fuente fuerte basta individualmente según la tabla de herramientas del material. Puede combinarse con otra. No se convierte automáticamente una pareja de pistas contextuales en evidencia fuerte. En el caso 3 hay tres rutas individuales y seis parejas válidas; consultar solo la información general de la computadora no resuelve el caso.

Se conserva el orden A/B/C solicitado. No se agregaron decisiones ni casos.

## Por qué las respuestas al mismo contacto son PARTIAL

El usuario autoriza PARTIAL o RISK para esas ramas. En esta versión, preguntar al mismo mensaje, correo o número **sin entregar información sensible ni transferir** es PARTIAL. No autentica al remitente ni da 100 puntos, incluso si antes se reunió evidencia fuerte. No se inventa un robo consumado por el simple hecho de responder. Las acciones de compartir, registrarse, abrir la actualización o transferir son RISK.

## Contenido completo

1. **Cargo:** conversación inicial, conocimiento de datos parciales, SMS «Código de verificación: 583921 / No lo compartas», solicitud de leerlo, cuatro pistas y tres consecuencias diferenciadas.
2. **Premio:** mensaje y enlace simulado, comparación de dominios, fuentes oficiales, decisiones, consecuencias y ficha.
3. **Reposición:** comunicación de trámite previo, ausencia de solicitudes de NIP/contraseña/CVV/SMS, múltiples verificaciones posibles, retraso por cancelar, peligro de confiar sin límites y revelación CONTACTO LEGÍTIMO.
4. **Seguridad:** correo de aspecto profesional, nombre correcto descrito sin inventar el nombre del protagonista, plazo de las 18:00, botón «ACTUALIZAR SEGURIDAD», remitente/destino contrastable, decisiones y ficha.
5. **Milo:** mensaje de cambio de número y préstamo de $1,200; redes y libreta contienen información verdadera que no autentica el número; llamada al contacto anterior; revelación de Hami Clon y tarjeta «Milo real».

La herramienta Computadora/Redes del caso 5 confirma coincidencias. No incluye una etiqueta de «engaño» durante la investigación. La explicación de por qué esos datos no autenticaban aparece después de decidir, en la ficha educativa.

Los enlaces de premio y el botón del correo son controles internos que abren las decisiones. No navegan a una web ni eligen una respuesta automáticamente. Los dominios ficticios `.example` solo ilustran la discrepancia; no se hacen peticiones a ellos.

## Evidencia y aprendizaje

Cada resultado muestra una consecuencia propia y la razón de la puntuación. La revelación conserva el resultado y los puntos ya sumados, sin sumarlos otra vez. La ficha explica señal, prevención, frase y, mediante «Qué demostraban sus pistas», el alcance de cada fuente realmente usada.

Al agotarse el tiempo se conserva la evidencia y se fuerza la decisión, sin Game Over ni resultado automático. «Releer situación» sigue disponible, incluso si el reloj terminó antes del SMS.

## Límites honestos del diseño

El programa verifica acciones observables, no pensamientos. Rechazar el trámite legítimo nunca alcanza el máximo; dos herramientas poco útiles tampoco; una decisión arriesgada sigue siendo roja aunque se haya investigado.

Una selección aleatoria podría coincidir por suerte con evidencia y acciones correctas. Ningún sistema basado solamente en estas elecciones puede hacer eso matemáticamente imposible y a la vez aceptar las mismas elecciones razonadas. Lo garantizado es que **el azar, la cantidad de clics o rechazar todo no garantizan la puntuación máxima**. Consultar una fuente realmente independiente y actuar de forma adecuada sí es la conducta que el taller enseña.

## Aspectos conservados

Sin audio, backend, APIs, CDN ni autenticación. Recursos locales. Temporizador inicial configurable de 75 segundos. El arte de los cinco personajes permanece; Milo real aparece mediante una tarjeta de contacto identificada con su nombre y testimonio, sin inventar un sexto diseño de personaje. La evaluación QR del antiguo guion no se incorporó porque no forma parte del alcance actual.

