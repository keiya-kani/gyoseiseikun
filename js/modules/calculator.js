const Calculator = (() => {
  const PASS_SCORE = 180;

  function render() {
    return `
      <div class="page-container">
        <div class="page-header">
          <h2>🧮 採点計算機</h2>
          <p>各科目の得点を入力して合否を確認</p>
        </div>

        <div class="calc-card">
          <h3>択一式（各4点）</h3>
          <div class="calc-row">
            <label for="c-gyosei">行政法<br><small style="font-weight:normal;font-size:0.75rem">19問 / 最大76点</small></label>
            <input type="number" id="c-gyosei" class="calc-input" min="0" max="76" placeholder="0" inputmode="numeric">
          </div>
          <div class="calc-row">
            <label for="c-kenpo">憲法・行政法以外<br><small style="font-weight:normal;font-size:0.75rem">民法・商法等 19問 / 最大76点</small></label>
            <input type="number" id="c-kenpo" class="calc-input" min="0" max="76" placeholder="0" inputmode="numeric">
          </div>
          <div class="calc-row">
            <label for="c-ippan">一般知識<br><small style="font-weight:normal;font-size:0.75rem">14問 / 最大56点</small></label>
            <input type="number" id="c-ippan" class="calc-input" min="0" max="56" placeholder="0" inputmode="numeric">
          </div>
        </div>

        <div class="calc-card">
          <h3>記述式（各20点）</h3>
          <div class="calc-row">
            <label for="c-essay1">記述① 得点</label>
            <input type="number" id="c-essay1" class="calc-input" min="0" max="20" placeholder="0" inputmode="numeric">
          </div>
          <div class="calc-row">
            <label for="c-essay2">記述② 得点</label>
            <input type="number" id="c-essay2" class="calc-input" min="0" max="20" placeholder="0" inputmode="numeric">
          </div>
          <div class="calc-row">
            <label for="c-essay3">記述③ 得点</label>
            <input type="number" id="c-essay3" class="calc-input" min="0" max="20" placeholder="0" inputmode="numeric">
          </div>
        </div>

        <button id="calc-run" class="btn btn-primary btn-full" style="margin-bottom:1rem">合計点を計算する</button>

        <div id="calc-result" hidden></div>
      </div>
    `;
  }

  function calcResult(gyosei, kenpo, ippan, e1, e2, e3) {
    const択一 = gyosei + kenpo + ippan;
    const記述 = e1 + e2 + e3;
    const total = 択一 + 記述;
    const pass = total >= PASS_SCORE && ippan >= 24;
    const pct = Math.round(total / 300 * 100);

    return `
      <div class="calc-result-card">
        <div style="font-size:0.8rem;color:var(--color-text-muted);margin-bottom:0.25rem">合計得点</div>
        <div class="calc-result-score">${total}<span class="calc-result-unit">点</span></div>
        <div class="calc-result-label">300点満点中 (${pct}%)</div>
        <div class="progress-bar" style="margin-bottom:1rem">
          <div class="progress-bar-fill" style="width:${pct}%;background:${pass ? 'var(--color-success)' : 'var(--color-danger)'}"></div>
        </div>
        <div class="calc-pass-badge ${pass ? 'pass' : 'fail'}">
          ${pass ? '🎉 合格ライン達成！' : `😓 合格まで${PASS_SCORE - total}点`}
        </div>
      </div>
      <div class="card">
        <div class="calc-breakdown">
          <div class="calc-breakdown-item">
            <span class="calc-breakdown-label">択一式（行政法）</span>
            <span class="calc-breakdown-value">${gyosei}点</span>
          </div>
          <div class="calc-breakdown-item">
            <span class="calc-breakdown-label">択一式（その他）</span>
            <span class="calc-breakdown-value">${kenpo}点</span>
          </div>
          <div class="calc-breakdown-item">
            <span class="calc-breakdown-label">一般知識${ippan < 24 ? ' ⚠️足切' : ''}</span>
            <span class="calc-breakdown-value" style="color:${ippan < 24 ? 'var(--color-danger)' : 'inherit'}">${ippan}点</span>
          </div>
          <div class="calc-breakdown-item">
            <span class="calc-breakdown-label">記述式合計</span>
            <span class="calc-breakdown-value">${記述}点</span>
          </div>
          <div class="calc-breakdown-item" style="font-weight:800">
            <span class="calc-breakdown-label">合計</span>
            <span class="calc-breakdown-value">${total}点 / 300点</span>
          </div>
        </div>
        ${ippan < 24 ? `<p style="font-size:0.8rem;color:var(--color-danger);margin-top:0.75rem">⚠️ 一般知識が足切基準（24点）未満です。合計点に関わらず不合格となります。</p>` : ''}
        <p style="font-size:0.75rem;color:var(--color-text-muted);margin-top:0.75rem">※合格基準は年度により変動する場合があります。参考値としてご利用ください。</p>
      </div>
    `;
  }

  function bind(el) {
    el.querySelector('#calc-run').addEventListener('click', () => {
      const v = id => Math.max(0, parseInt(el.querySelector(`#${id}`).value) || 0);
      const gyosei = v('c-gyosei');
      const kenpo = v('c-kenpo');
      const ippan = v('c-ippan');
      const e1 = v('c-essay1'), e2 = v('c-essay2'), e3 = v('c-essay3');
      const resultEl = el.querySelector('#calc-result');
      resultEl.innerHTML = calcResult(gyosei, kenpo, ippan, e1, e2, e3);
      resultEl.hidden = false;
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return { render, bind };
})();
