'use strict';
HCC.trivia = (() => {
  const questions = [
    { question:'Un contacto conoce tu nombre, algunos datos personales y se comunica de forma profesional. ¿Eso demuestra que realmente sea quien dice ser?', options:['Sí, porque conoce información que no cualquiera sabría.','Sí, si además usa un lenguaje profesional.','No. Debo comprobar su identidad mediante otro canal.'], correct:2, good:['¡Bien verificado!','Conocer información sobre ti o parecer profesional no demuestra la identidad de una persona.'], bad:['Cuidado.','Los datos personales y una apariencia profesional también pueden utilizarse para generar confianza.'] },
    { question:'Recibes una comunicación relacionada con un trámite que recuerdas haber iniciado. ¿Qué deberías hacer?', options:['Rechazarla automáticamente porque podría ser fraude.','Verificar el trámite por un canal independiente y continuar solo si la información coincide.','Confiar inmediatamente porque recuerdas haber iniciado el trámite.'], correct:1, good:['¡Exacto!','Verificar también sirve para confirmar cuándo una situación sí es legítima.'], bad:['Recuerda.','Verificar no significa desconfiar de todo; significa comprobar antes de actuar.'] },
    { question:'Un número nuevo dice ser alguien que conoces y menciona información real que publicaste en redes. Antes de enviarle dinero, ¿qué deberías hacer?', options:['Pedirle más datos personales por ese mismo número.','Enviarle una cantidad pequeña para comprobar.','Contactar a esa persona mediante un canal que ya conocías.'], correct:2, good:['¡Muy bien!','Que alguien conozca información real no demuestra que realmente sea esa persona.'], bad:['Ojo.','La información publicada en redes puede utilizarse para hacer una suplantación más convincente.'] }
  ];
  let onComplete = null;
  function reset() { Object.assign(HCC.state,{triviaScore:0,triviaAnswers:[],triviaIndex:0}); onComplete=null; }
  reset();
  return {
    questions,
    reset,
    start(options={}) { if(HCC.state.view!=='summary')return; reset(); onComplete=options.onComplete; HCC.state.view='trivia-intro';HCC.ui.render(); },
    begin() { if(HCC.state.view!=='trivia-intro')return;HCC.state.view='trivia-question';HCC.ui.render(); },
    answer(value) {
      const s=HCC.state,index=Number(value);
      if(s.view!=='trivia-question'||s.triviaAnswers.length>s.triviaIndex||!Number.isInteger(index)||index<0||index>2)return;
      const correct=index===questions[s.triviaIndex].correct;
      s.triviaAnswers.push({question:s.triviaIndex+1,selected:'ABC'[index],correct});
      if(correct)s.triviaScore++;
      HCC.ui.render();HCC.ui.announce((correct?questions[s.triviaIndex].good:questions[s.triviaIndex].bad).join(' '));
    },
    next() { const s=HCC.state;if(s.view!=='trivia-question'||s.triviaAnswers.length!==s.triviaIndex+1)return;if(s.triviaIndex<questions.length-1)s.triviaIndex++;else s.view='trivia-result';HCC.ui.render(); },
    complete() { if(HCC.state.view!=='trivia-result')return;if(onComplete)onComplete();else HCC.navigation.afterTrivia(); },
    render({e,button,heading}) {
      const s=HCC.state;
      if(s.view==='trivia-intro')return `<section class="screen trivia-screen trivia-intro">${heading('','Trivia final','¿Qué tanto verificaste?')}<div class="trivia-welcome"><span>${HCC.assets.markup('tools/libreta')}</span><p>Responde 3 preguntas y comprueba lo que aprendiste.</p></div>${button('Comenzar trivia','trivia-begin')}</section>`;
      if(s.view==='trivia-result'){
        const messages=s.triviaScore===3?['Verificaste las tres situaciones.','Antes de confiar, verifica.']:s.triviaScore===2?['Vas por buen camino.','Recuerda que una señal aislada no siempre demuestra identidad.']:['Todavía hay señales por revisar.','La clave no es desconfiar de todo: es comprobar antes de actuar.'];
        return `<section class="screen trivia-screen trivia-result">${heading('','Resultado de verificación')}<div class="trivia-result-card"><strong>${s.triviaScore} / 3</strong><h2>${messages[0]}</h2><p>${messages[1]}</p><small>Aciertos de trivia · independientes del puntaje del turno</small></div>${button('Continuar','trivia-complete')}</section>`;
      }
      const q=questions[s.triviaIndex],answer=s.triviaAnswers[s.triviaIndex],feedback=answer?(answer.correct?q.good:q.bad):null;
      return `<section class="screen trivia-screen trivia-question"><div class="trivia-top"><strong>Pregunta ${s.triviaIndex+1} de 3</strong><span>Aciertos: ${s.triviaScore} / 3</span></div><h1 class="trivia-prompt">${e(q.question)}</h1><div class="trivia-options">${q.options.map((option,i)=>`<button class="decision ${answer?.selected==='ABC'[i]?'selected':''}" data-action="trivia-answer" data-id="${i}" ${answer?'disabled':''}><span class="option-letter">${'ABC'[i]}</span><span>${e(option)}</span></button>`).join('')}</div>${feedback?`<div class="trivia-feedback ${answer.correct?'correct':'review'}" role="status"><div><h2>${e(feedback[0])}</h2><p>${e(feedback[1])}</p></div>${button(s.triviaIndex===2?'Ver resultado':'Siguiente','trivia-next')}</div>`:'<p class="trivia-instruction">Elijan una respuesta · A / B / C</p>'}</section>`;
    }
  };
})();
