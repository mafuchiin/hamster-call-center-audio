'use strict';
window.HCC = window.HCC || {};
HCC.config = Object.freeze({ caseSeconds: 60, timeoutTransitionMs: 1400, warningSeconds: 15, urgentSeconds: 7, finalSeconds: 3, maxChecks: 2, points: { RESOLVED: 100, PARTIAL: 40, RISK: 0 } });
HCC.tools = [
  { id: 'app', label: 'Celular / App', icon: 'tools/celular-app', color: 'blue' },
  { id: 'computer', label: 'Computadora', icon: 'tools/computadora', color: 'purple' },
  { id: 'notebook', label: 'Libreta', icon: 'tools/libreta', color: 'pink' },
  { id: 'independent', label: 'Canal independiente', icon: 'tools/canal-independiente', color: 'yellow' }
];
HCC.characters = [
  { name: 'Hami Estafador', role: 'Vishing / fraude telefónico', color: 'purple' },
  { name: 'Hami Promo', role: 'Smishing / falsa promoción', color: 'pink' },
  { name: 'Hami Oficial', role: 'Contacto legítimo', color: 'blue' },
  { name: 'Hami Supervisor', role: 'Phishing / suplantación institucional', color: 'green' },
  { name: 'Hami Clon', role: 'Suplantación de identidad por mensajería', color: 'yellow' }
];
// OR between evidence groups, AND within a group; no generic clue-count bonus.
HCC.cases = [
  {
    "id": "cargo",
    "title": "El cargo que no reconoces",
    "displayTitle": "El cargo que no reconoces",
    "difficulty": "Fácil",
    "channel": "Llamada",
    "channelIcon": "communication/llamadas",
    "sender": "Número desconocido",
    "incomingContent": "Tienes una llamada entrante",
    "dialogue": [
      "Detectamos un cargo de $2,840 que parece irregular.",
      "Necesitamos cancelarlo antes de que sea procesado.",
      "Te llegará un código para confirmar la cancelación."
    ],
    "context": "La persona conoce tu nombre y algunos datos parciales de tu tarjeta.",
    "summary": "Una persona que conoce tus datos afirma que debes cancelar con urgencia un cargo de $2,840.",
    "request": "Léeme el código para cancelar el movimiento.",
    "event": {
      "title": "Llega un mensaje a tu celular",
      "lines": [
        "Código de verificación: 583921",
        "No lo compartas."
      ],
      "reply": "Léeme el código para cancelar el movimiento."
    },
    "clues": {
      "app": "No aparece ningún cargo por $2,840 en la app oficial.",
      "computer": "La información general de seguridad indica que las aclaraciones deben hacerse mediante canales oficiales.",
      "notebook": "No existe registrada una compra pendiente de $2,840.",
      "independent": "La institución confirma que no existe ese cargo ni una aclaración abierta."
    },
    "evidenceQuality": {
      "app": "strong",
      "computer": "useful",
      "notebook": "context",
      "independent": "strong"
    },
    "resolutionEvidence": [
      [
        "app"
      ],
      [
        "independent"
      ]
    ],
    "evidenceReview": {
      "app": "Contrastaste el cargo con un registro oficial, fuera de la llamada.",
      "computer": "Conociste el procedimiento seguro, pero no comprobaste este cargo concreto.",
      "notebook": "La falta de una compra anotada no confirma el estado de la cuenta.",
      "independent": "La institución comprobó el cargo y la aclaración por otra vía."
    },
    "decisions": [
      {
        "id": "share",
        "text": "Leer el código.",
        "kind": "risk",
        "consequence": "El interlocutor recibe el código que el mensaje indicaba no compartir. La seguridad de tu cuenta queda en riesgo."
      },
      {
        "id": "stay",
        "text": "No compartirlo, pero seguir en la llamada.",
        "kind": "partial",
        "consequence": "Conservas el código, pero sigues en una llamada cuya identidad no está verificada. La situación queda sin resolver."
      },
      {
        "id": "official",
        "text": "Colgar y verificar mediante un canal oficial independiente.",
        "kind": "safe"
      }
    ],
    "outcomes": {
      "RESOLVED": "Comprobaste que el cargo no aparece o no existe y cortaste la llamada sin compartir el código. Cualquier aclaración queda en el canal oficial.",
      "PARTIAL": "Elegiste colgar sin entregar el código. Es una salida segura, pero todavía falta comprobar el cargo en la app o con la institución."
    },
    "character": 0,
    "fraudType": "Vishing",
    "lesson": "Pidió un código, aunque el mensaje decía «No lo compartas».",
    "prevention": "Corta la llamada y verifica por un canal oficial obtenido por tu cuenta.",
    "quote": "Que sepa cosas de ti no demuestra quién es.",
    "reveal": "Usé un cargo urgente y datos verdaderos para intentar conseguir tu código."
  },
  {
    "id": "premio",
    "title": "¡Ganaste!",
    "displayTitle": "Un premio inesperado",
    "difficulty": "Media",
    "channel": "Mensaje",
    "channelIcon": "communication/mensajes",
    "sender": "Remitente desconocido",
    "incomingContent": "Recibiste un mensaje",
    "dialogue": [
      "¡Felicidades!",
      "Ganaste un premio.",
      "Reclámalo aquí."
    ],
    "context": "El mensaje incluye un enlace para reclamar el premio.",
    "summary": "Un mensaje te anuncia un premio inesperado y te invita a registrarte desde su enlace.",
    "request": "Reclámalo aquí.",
    "link": "https://premios-regalo.example/reclamar",
    "clues": {
      "app": "No existe una comunicación equivalente en ninguna app oficial relacionada.",
      "computer": "El enlace lleva a premios-regalo.example. El dominio oficial de la organización es premios.example. Son dominios distintos.",
      "notebook": "No recuerdas haber participado en el supuesto concurso.",
      "independent": "La organización confirma que esa promoción no existe."
    },
    "evidenceQuality": {
      "app": "useful",
      "computer": "strong",
      "notebook": "context",
      "independent": "strong"
    },
    "resolutionEvidence": [
      [
        "computer"
      ],
      [
        "independent"
      ]
    ],
    "evidenceReview": {
      "app": "No ver un aviso en la app aporta contexto, pero no comprueba por sí solo la promoción.",
      "computer": "Comparaste el destino del enlace con el dominio oficial y encontraste una diferencia concreta.",
      "notebook": "No recordar una inscripción es una señal para investigar, no una comprobación de la organización.",
      "independent": "Consultaste a la organización fuera del mensaje que originó la duda."
    },
    "decisions": [
      {
        "id": "register",
        "text": "Abrir el enlace y registrarse.",
        "kind": "risk",
        "consequence": "Al registrarte desde ese enlace entregas información a una página que no corresponde a la organización."
      },
      {
        "id": "reply",
        "text": "Responder al mensaje preguntando si el premio es real.",
        "kind": "partial",
        "consequence": "Todavía no entregas tus datos de registro, pero preguntas al mismo remitente que ofreció el premio. Su respuesta no verifica la promoción."
      },
      {
        "id": "official",
        "text": "Comprobar la promoción por un canal oficial independiente y no utilizar el enlace.",
        "kind": "safe"
      }
    ],
    "outcomes": {
      "RESOLVED": "Contrastaste el dominio o consultaste a la organización. Elegiste la ruta oficial y no entregaste datos mediante el enlace recibido.",
      "PARTIAL": "No usaste el enlace. Falta contrastar su dominio con el oficial o consultar a la organización para completar la comprobación."
    },
    "character": 1,
    "fraudType": "Smishing / promoción falsa",
    "lesson": "Un premio inesperado y un enlace externo. La urgencia también puede presionar para actuar.",
    "prevention": "Comprueba la promoción fuera del mensaje recibido.",
    "quote": "Una oferta atractiva también necesita evidencia.",
    "reveal": "Usé la emoción de un premio y un enlace para llevarte a registrarte fuera de la organización."
  },
  {
    "id": "tramite",
    "title": "Esta vez sí es real",
    "displayTitle": "Un trámite en proceso",
    "difficulty": "Media / alta",
    "channel": "Comunicación",
    "channelIcon": "communication/mensajes",
    "sender": "Atención de trámites · identidad por verificar",
    "incomingContent": "Hay una comunicación sobre tu trámite",
    "dialogue": [
      "Nos comunicamos por tu solicitud de reposición de tarjeta.",
      "La reposición se encuentra en proceso."
    ],
    "context": "La comunicación se refiere a una reposición solicitada anteriormente. Antes de continuar, puedes contrastar ese antecedente.",
    "summary": "Te contactan por una reposición de tarjeta solicitada anteriormente.",
    "request": "No solicitan NIP, contraseña, CVV ni código SMS.",
    "clues": {
      "app": "En la app oficial aparece una reposición de tarjeta en proceso.",
      "computer": "La información general sobre el trámite de reposición coincide con lo indicado en la comunicación.",
      "notebook": "Encuentras una anotación previa: «Solicité la reposición de mi tarjeta».",
      "independent": "La institución confirma que tu trámite de reposición existe."
    },
    "evidenceQuality": {
      "app": "strong",
      "computer": "useful",
      "notebook": "strong",
      "independent": "strong"
    },
    "resolutionEvidence": [
      [
        "app"
      ],
      [
        "notebook"
      ],
      [
        "independent"
      ]
    ],
    "evidenceReview": {
      "app": "El registro oficial confirma tu trámite concreto. No autoriza a entregar credenciales.",
      "computer": "La coincidencia con un procedimiento general no demuestra que tu solicitud exista.",
      "notebook": "Tu anotación previa confirma que tú solicitaste la reposición; permite continuar de forma limitada, no confiar sin límites.",
      "independent": "Comprobaste con la institución que el trámite existe. Las credenciales siguen siendo privadas."
    },
    "decisions": [
      {
        "id": "cancel",
        "text": "Cancelar o bloquear todo porque cualquier contacto puede ser fraude.",
        "kind": "partial",
        "consequence": "No entregas datos sensibles, pero cancelas o bloqueas un trámite legítimo. La reposición se retrasa y tendrás que retomarla por el canal oficial."
      },
      {
        "id": "share",
        "text": "Confiar completamente y proporcionar cualquier información que soliciten.",
        "kind": "risk",
        "consequence": "Aunque el trámite existe, ofrecer cualquier información sin límites pone en riesgo tus credenciales. Verificar el contexto no autoriza a compartirlas."
      },
      {
        "id": "continue",
        "text": "Después de confirmar independientemente el trámite, continuar solo con lo necesario, sin entregar credenciales sensibles.",
        "kind": "safe"
      }
    ],
    "outcomes": {
      "RESOLVED": "Contrastaste el trámite con un registro previo u oficial. Puedes continuar con lo necesario sin entregar NIP, contraseña, CVV ni códigos SMS.",
      "PARTIAL": "Elegiste limitar la información, pero falta confirmar tu trámite concreto. La descripción general del proceso no basta para continuar con evidencia."
    },
    "character": 2,
    "fraudType": "CONTACTO LEGÍTIMO",
    "lesson": "La reposición coincide con una solicitud previa y no pide credenciales sensibles.",
    "prevention": "Confirma el trámite con tus registros o por un canal oficial independiente. Continúa solo con lo necesario.",
    "quote": "Verificar también sirve para saber cuándo sí continuar.",
    "reveal": "La reposición sí correspondía a tu solicitud. Verificar permite continuar con límites, sin entregar credenciales."
  },
  {
    "id": "antifraude",
    "title": "Área antifraude",
    "displayTitle": "Una actualización de seguridad",
    "difficulty": "Alta",
    "channel": "Correo",
    "channelIcon": "communication/correo",
    "sender": "Departamento de Seguridad",
    "incomingContent": "Tienes un correo nuevo",
    "subject": "Actualización de identidad",
    "recipient": "Para: tu nombre completo, escrito correctamente",
    "dialogue": [
      "Es necesario completar una actualización de identidad antes de las 18:00.",
      "Accede al proceso mediante el botón que aparece a continuación."
    ],
    "context": "El correo usa tu nombre correcto, buena ortografía y una presentación profesional.",
    "summary": "El Departamento de Seguridad exige actualizar tu identidad antes de las 18:00.",
    "request": "ACTUALIZAR SEGURIDAD",
    "mailButton": true,
    "clues": {
      "app": "No aparece ninguna actualización de identidad pendiente en la app oficial.",
      "computer": "El remitente es avisos@institucion-seguridad.example y el botón lleva a institucion-seguridad.example/identidad. El dominio oficial es institucion.example.",
      "notebook": "No existe anotado ningún trámite de actualización de identidad.",
      "independent": "La institución confirma que no existe esa actualización de identidad."
    },
    "evidenceQuality": {
      "app": "useful",
      "computer": "strong",
      "notebook": "context",
      "independent": "strong"
    },
    "resolutionEvidence": [
      [
        "computer"
      ],
      [
        "independent"
      ]
    ],
    "evidenceReview": {
      "app": "La ausencia de una actualización es útil, pero falta contrastar el correo o consultar a la institución.",
      "computer": "El remitente y el destino parecen institucionales, pero su dominio no coincide con el oficial.",
      "notebook": "No tenerlo anotado no comprueba por sí solo una solicitud de la institución.",
      "independent": "La institución negó la actualización por una vía distinta del correo recibido."
    },
    "decisions": [
      {
        "id": "update",
        "text": "Abrir «Actualizar seguridad».",
        "kind": "risk",
        "consequence": "Sigues el botón hacia una página ajena al dominio oficial. La solicitud de identidad abre una situación de riesgo; no se ha comprobado la actualización."
      },
      {
        "id": "reply",
        "text": "Responder al mismo correo preguntando si es auténtico.",
        "kind": "partial",
        "consequence": "No has entregado datos de identidad, pero una respuesta del mismo correo no autentica al remitente. La actualización queda sin comprobar."
      },
      {
        "id": "official",
        "text": "Cerrar el correo y comprobar cualquier actualización desde una ruta oficial independiente.",
        "kind": "safe"
      }
    ],
    "outcomes": {
      "RESOLVED": "Detectaste la diferencia de dominio o consultaste a la institución. Cerraste el correo y elegiste comprobar por una ruta oficial independiente.",
      "PARTIAL": "Cerrar el correo evita seguir su botón, pero falta contrastar el dominio o consultar a la institución para comprobar la actualización."
    },
    "character": 3,
    "fraudType": "Phishing / suplantación institucional",
    "lesson": "El remitente y el dominio del botón difieren de los de la institución.",
    "prevention": "Comprueba las actualizaciones desde una ruta oficial obtenida independientemente; no desde el correo que genera la duda.",
    "quote": "Profesional no significa auténtico.",
    "reveal": "Usé tu nombre, lenguaje profesional y una hora límite para aparentar autoridad."
  },
  {
    "id": "milo",
    "title": "Soy yo, cambié de número",
    "displayTitle": "«Soy yo, cambié de número»",
    "difficulty": "Muy alta / final",
    "channel": "Mensaje",
    "channelIcon": "communication/mensajes",
    "sender": "Número nuevo · dice ser Milo",
    "incomingContent": "Un número nuevo te escribe",
    "dialogue": [
      "Holaaa, soy Milo. Cambié de número. Necesito un favor urgente.",
      "¿Me prestas $1,200? Te los regreso esta noche."
    ],
    "context": "Usa tu nombre, tu apodo y menciona información reciente de tus redes.",
    "summary": "Un número nuevo dice ser Milo y conoce tu nombre, tu apodo y detalles recientes.",
    "request": "¿Me prestas $1,200? Te los regreso esta noche.",
    "toolLabels": {
      "app": "Celular / Contactos",
      "computer": "Computadora / Redes"
    },
    "clues": {
      "app": "El antiguo número de Milo continúa guardado en tus contactos.",
      "computer": "Las publicaciones públicas en redes coinciden con varios detalles que menciona el supuesto Milo: tu apodo y la información reciente aparecen allí.",
      "notebook": "Milo existe y es tu amigo. En el pasado incluso te pidió favores.",
      "independent": "Llamas al número anterior de Milo. Responde: «No cambié de número. Nunca te pedí dinero»."
    },
    "evidenceQuality": {
      "app": "useful",
      "computer": "misleading-context",
      "notebook": "misleading-context",
      "independent": "strong"
    },
    "resolutionEvidence": [
      [
        "independent"
      ]
    ],
    "evidenceReview": {
      "app": "Tener un número anterior ofrece una vía para comprobar, pero guardarlo no equivale a llamar.",
      "computer": "Los detalles eran verdaderos y públicos: también podía conocerlos otra persona. Coincidencia no es autenticación.",
      "notebook": "Que Milo exista y haya pedido favores antes no confirma quién está usando el número nuevo.",
      "independent": "Hablaste con Milo por el contacto previo, fuera del número que estaba pidiendo dinero."
    },
    "decisions": [
      {
        "id": "transfer",
        "text": "Transferir $1,200.",
        "kind": "risk",
        "consequence": "Envías $1,200 a partir de una identidad no verificada. Los detalles personales no demostraban que el nuevo número fuera de Milo."
      },
      {
        "id": "ask",
        "text": "Pedir al mismo número desconocido más información personal para confirmar.",
        "kind": "partial",
        "consequence": "No transfieres todavía, pero sigues comprobando con el número que pide dinero. Más datos personales no confirman su identidad."
      },
      {
        "id": "contact",
        "text": "Contactar a Milo mediante un canal que ya existía antes de transferir.",
        "kind": "safe"
      }
    ],
    "outcomes": {
      "RESOLVED": "Hablaste con Milo por el número anterior y comprobaste que no pidió dinero. Elegiste confirmar por esa vía antes de transferir.",
      "PARTIAL": "Elegiste contactar antes de transferir, pero todavía falta hacerlo por el número anterior. Los datos personales y los favores pasados no autentican al remitente."
    },
    "character": 4,
    "fraudType": "Suplantación de identidad",
    "lesson": "Combinó cercanía, información personal y urgencia para aparentar ser Milo.",
    "prevention": "Contacta a Milo por el número que ya tenías, antes de transferir. No uses al número nuevo como su propia prueba.",
    "quote": "Saber cosas de alguien tampoco demuestra ser esa persona.",
    "reveal": "La información personal era verdadera. La identidad de quien te escribía no lo era.",
    "witness": {
      "name": "Milo real",
      "channel": "Contacto anterior",
      "quote": "No cambié de número. Nunca te pedí dinero."
    }
  }
];
