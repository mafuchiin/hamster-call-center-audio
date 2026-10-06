'use strict';
HCC.scoring = {
  labels: { RESOLVED: 'Resuelto', PARTIAL: 'A salvo, pero incompleto', RISK: 'Riesgo / daño' },
  evaluate(data, evidence, decisionId) {
    const decision = data.decisions.find(item => item.id === decisionId);
    if (!decision) throw new Error('Decisión inexistente');
    if (!Array.isArray(evidence) || evidence.length > HCC.config.maxChecks || new Set(evidence).size !== evidence.length || evidence.some(id => !Object.hasOwn(data.clues, id))) throw new Error('Evidencia inválida');
    const matched = data.resolutionEvidence.find(group => group.every(id => evidence.includes(id))) || [];
    const sufficient = matched.length > 0;
    const status = decision.kind === 'risk' ? 'RISK' : decision.kind === 'safe' && sufficient ? 'RESOLVED' : 'PARTIAL';
    const consequence = decision.consequence || data.outcomes[status];
    const reason = decision.kind === 'risk' ? 'La evidencia no compensa una acción que expone dinero, datos o acceso.'
      : decision.kind === 'partial' ? 'Evitar el daño inmediato no completa la resolución del caso.'
      : sufficient ? 'La acción elegida está respaldada por evidencia relevante para este caso.'
      : 'Elegir verificar como siguiente paso no sustituye la comprobación que todavía falta.';
    return { status, points: HCC.config.points[status], consequence, sufficient, matchedEvidence: [...matched], decisionId, action: decision.text, reason };
  },
  summarize(results) {
    return results.reduce((summary, result) => { summary.total += result.points; summary[result.status]++; return summary; }, { total: 0, RESOLVED: 0, PARTIAL: 0, RISK: 0 });
  }
};

