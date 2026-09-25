# Audio original — Hamster Call Center

## Módulos y archivos
`js/audio.js` sustituye el adaptador silencioso por síntesis Web Audio centralizada. `css/audio.css` presenta mute y tres deslizadores. `index.html` incorpora controles y CSS. `js/motion.js` detiene nodos al cambiar de pantalla. README actualizado. No se modifican casos, reglas, puntuación ni trivia.

## Controles
🔊/🔇 silencia todo. Audio abre General, Efectos y Voces. Las preferencias se guardan en sessionStorage y sobreviven a recargas de esa sesión. Reiniciar limpia sonidos y conserva preferencias. No hay música de fondo ni descargas de audio.

El contexto se crea solo después de interacción. Si Web Audio no está disponible, el juego sigue funcionando. Al ocultar la pestaña se cortan sonidos y se suspende el contexto. Todos los avisos visuales siguen presentes.

## Voces
Parámetros editables en VOICE_PRESETS, js/audio.js:

| Preset | Pitch Hz | Variación | Duración s | Intervalo mínimo s | Caracteres | Onda | Filtro Hz |
|---|---:|---:|---:|---:|---:|---|---:|
| unknown |285|7%|.065|.095|3|triangle|950|
| protagonist |390|9%|.075|.110|3|sine|1800|
| scammer |195|8%|.075|.110|3|sawtooth|700|
| promo |510|15%|.055|.075|2|triangle|2200|
| official |300|3.5%|.090|.140|4|sine|1300|
| supervisor |225|3.5%|.105|.170|4|triangle|1000|
| clone |330|13%|.075|.115|3|triangle|1500|

Pitch modifica la altura; interval establece el espacio mínimo entre vocalizaciones; characters regula la densidad por caracteres. duration y variation cambian duración y variabilidad. No se pronuncian palabras. La duración varía también ligeramente por sílaba.

Los eventos hcc:dialogue-progress sincronizan las sílabas con el texto, con limitación de frecuencia para no producir una por letra ni ráfagas al omitir texto. hcc:dialogue-complete y playVoice(stop) cortan la voz. Antes del reveal, safeSpeaker obliga a usar unknown incluso si se solicita otro preset. En el reveal se emite una vocalización del personaje; Primer turno usa protagonist. No se cambia el texto progresivo ni se introducen lecturas obligatorias.

## Volúmenes
DEFAULTS en js/audio.js: master .55, sfx .50, voice .38. Rango 0–1. La UI permite ajustarlos durante la sesión. HCC.audio.configure({master:.5,sfx:.4,voice:.3,muted:false}) permite configurarlos por código.

## Efectos implementados
- incomingCall, incomingMessage, incomingEmail.
- uiHover, uiClick, uiConfirm, uiBack.
- openPhoneTool, openComputerTool, openNotebookTool, openIndependentChannel, evidenceFound.
- timerWarning: uno, dos y tres beeps discretos para atención, urgente y últimos segundos; timeExpired al llegar a cero.
- resolvedSfx, partialSfx, riskSfx y revealSfx.
- triviaCorrect, triviaIncorrect, triviaComplete.
- shiftComplete: jingle original de aproximadamente 1.5 segundos.

SFX contiene motivos [frecuencia Hz, retraso s, duración s]. Todo se sintetiza mediante osciladores, filtros y envolventes de ganancia. No hay recursos de terceros, audio protegido ni canciones externas.

## Validación
Pruebas en Edge: contexto inicialmente sin crear, activación por interacción, mute/unmute, persistencia, deslizadores, siete presets, voz común antes de revelar, cancelación al completar texto, todos los motivos y limpieza al reiniciar. Recorrido completo con herramientas, avisos de tiempo, resultados, reveal, trivia y cierre. 153 vistas sin desbordamiento. El diagnóstico HCC.audio.status permite revisar estado del contexto y nodos activos. No se detectaron errores de JavaScript. La síntesis y rutas se verificaron automáticamente; el volumen percibido final dependerá del equipo de proyección.
