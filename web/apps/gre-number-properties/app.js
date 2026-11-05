/* Number Properties: primes, factors, divisibility, remainders and integer counting. */
(function () {
  'use strict';
  const NAMES = SK.QUANT_TOPICS.numprop.concat(['qcNegative', 'qcSquare']);
  const RULES = [['2', 'Last digit is even'], ['3', 'Digit sum divisible by 3'], ['4', 'Last two digits divisible by 4'], ['5', 'Ends in 0 or 5'], ['6', 'Divisible by 2 and by 3'], ['8', 'Last three digits divisible by 8'], ['9', 'Digit sum divisible by 9'], ['10', 'Ends in 0'], ['11', 'Alternating digit sum divisible by 11']];
  // A factor tool: every factor and the prime factorization of a number up to a million.
  const factorize = (n) => { const out = []; let m = n; for (let p = 2; p * p <= m; p++) while (m % p === 0) { out.push(p); m /= p; } if (m > 1) out.push(m); return out; };
  const factors = (n) => { const a = []; for (let d = 1; d * d <= n; d++) if (n % d === 0) { a.push(d); if (d * d !== n) a.push(n / d); } return a.sort((x, y) => x - y); };
  const App = {
    about: 'Questions on primes, factors, multiples, remainders and signs, generated with full solutions. A factor tool shows the factors and prime factorization of any number, so you can check your own work.',
    how: ['Practise in **Practice**.', 'Learn the divisibility tests in **Rules**.', 'Use **Factor tool** to explore numbers: try 360, 1001 or 9973.'],
    tabs: [
      SK.quantTab('practice', 'Practice', NAMES),
      { id: 'rules', label: 'Rules', render(el) { el.appendChild(SK.card('Divisibility tests', SK.table(['Divisible by', 'Test'], RULES, false), SK.note('0 is even. 1 is not prime. 2 is the only even prime. Negative numbers can be even or odd.'))); } },
      { id: 'tool', label: 'Factor tool', render(el) {
        const out = SK.h('div', {});
        const inp = SK.h('input', { type: 'number', min: 2, max: 1000000, value: 360, style: { width: '12ch' }, oninput: () => show() });
        const show = () => {
          SK.clear(out);
          const n = Math.floor(Number(inp.value));
          if (!(n >= 2 && n <= 1000000)) { out.appendChild(SK.note('Enter a whole number from 2 to 1,000,000.', 'wrong')); return; }
          const pf = factorize(n), counts = {};
          pf.forEach((p) => { counts[p] = (counts[p] || 0) + 1; });
          const fs = factors(n);
          out.appendChild(SK.stats([['Prime?', pf.length === 1 ? 'Yes' : 'No'], ['Number of factors', fs.length], ['Sum of factors', SK.sum(fs)]]));
          out.appendChild(SK.h('p', {}, SK.rich('Prime factorization: ' + Object.entries(counts).map(([p, c]) => p + (c > 1 ? '^{' + c + '}' : '')).join(' × '))));
          out.appendChild(SK.h('p', { class: 'sk-small', text: 'Factors: ' + fs.join(', ') }));
        };
        el.appendChild(SK.card('Factor tool', SK.field('Number', inp), out));
        show();
      } },
    ],
    factorize, factors,
    checks: {
      'the factor tool agrees with brute force': (data, assert) => {
        for (const n of [2, 12, 97, 360, 1001, 9973, 65536, 720720]) {
          const brute = []; for (let d = 1; d <= n; d++) if (n % d === 0) brute.push(d);
          assert.deepEqual(factors(n), brute);
          assert.equal(factorize(n).reduce((a, b) => a * b, 1), n);
          for (const p of factorize(n)) assert.equal(factors(p).length, 2, p + ' is prime');
        }
      },
      'generated sets are valid': (data, assert) => { for (let s = 1; s < 30; s++) for (const q of SK.makeQuant(NAMES, 10, s)) assert.deepEqual(SK.validateItem(q), []); },
    },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
