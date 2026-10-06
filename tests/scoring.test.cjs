// Run with: node tests/scoring.test.cjs (Node only; no npm dependencies).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = vm.createContext({});
context.window = context;
for (const name of ['cases.js', 'scoring.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', name), 'utf8'), context);
const { cases, scoring } = context.HCC;
const strong = [['app','independent'], ['computer','independent'], ['app','notebook','independent'], ['computer','independent'], ['independent']];
const risk = ['share','register','share','update','transfer'];
const safe = ['official','official','continue','official','contact'];
const tools = ['app','computer','notebook','independent'];
const groups = [[], ...tools.map(id => [id])];
tools.forEach((id, i) => tools.slice(i + 1).forEach(other => groups.push([id, other])));
let checked = 0;
for (const [i, data] of cases.entries()) {
  for (const evidence of groups) for (const decision of data.decisions) {
    const expected = decision.id === risk[i] ? 'RISK' : decision.id === safe[i] && evidence.some(id => strong[i].includes(id)) ? 'RESOLVED' : 'PARTIAL';
    const result = scoring.evaluate(data, evidence, decision.id);
    assert.equal(result.status, expected, `${data.id}: ${evidence} / ${decision.id}`);
    assert.equal(result.points, {RESOLVED:100, PARTIAL:40, RISK:0}[expected]);
    assert(result.consequence && result.reason);
    assert.equal(scoring.evaluate(data, [...evidence].reverse(), decision.id).status, expected);
    checked++;
  }
  assert.throws(() => scoring.evaluate(data, ['app','computer','notebook'], safe[i]));
  assert.throws(() => scoring.evaluate(data, ['app','app'], safe[i]));
  assert.throws(() => scoring.evaluate(data, ['missing'], safe[i]));
  assert.throws(() => scoring.evaluate(data, [], 'missing'));
}
const total = (evidence, actions = safe) => cases.reduce((sum, c, i) => sum + scoring.evaluate(c, evidence[i], actions[i]).points, 0);
assert.equal(total(cases.map(() => [])), 200, 'Choosing the safe action alone is incomplete');
assert.equal(total(cases.map(() => ['independent']), ['official','official','cancel','official','contact']), 440, 'Rejecting the legitimate case cannot earn the maximum');
assert.equal(total(cases.map(() => ['computer','notebook'])), 380, 'Two tools are not automatically sufficient');
assert.equal(total(cases.map(() => ['independent'])), 500, 'Independent evidence and appropriate actions resolve all cases');
for (const tool of ['app','notebook','independent']) assert.equal(scoring.evaluate(cases[2], [tool], 'continue').status, 'RESOLVED');
assert.equal(scoring.evaluate(cases[4], ['computer','notebook'], 'contact').status, 'PARTIAL');
assert.equal(scoring.evaluate(cases[4], ['independent'], 'transfer').status, 'RISK');
console.log(`${checked} combinations passed. Invalid evidence rejected. Anti-shortcut checks passed.`);
