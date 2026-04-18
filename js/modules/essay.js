const Essay = (() => {
  let state = { idx: 0, answers: {}, shown: {} };

  function render() {
    const q = QUESTIONS_ESSAY[state.idx];
    const answer = state.answers[q.id] || '';
    const showAnswer = state.shown[q.id];

    return `
      <div class="page-container">
        <div class="page-header">
          <h2>✍️ 記述式演習</h2>
          <p>${state.idx + 1} / ${QUESTIONS_ESSAY.length} 問</p>
        </div>

        <div class="essay-question-card">
          <div class="quiz-subject-tag">${q.subject}</div>
          <div class="essay-question-text">${q.text}</div>
          <textarea
            id="essay-answer"
            class="form-textarea"
            placeholder="ここに解答を入力してください..."
            rows="5"
          >${answer}</textarea>
          <div class="essay-char-count" id="char-count">${answer.length}文字</div>
        </div>

        <button id="essay-check" class="btn btn-primary btn-full" style="margin-bottom:1rem">
          模範解答を確認する
        </button>

        ${showAnswer ? `
          <div class="essay-model-answer">
            <h3>📋 模範解答</h3>
            <p style="line-height:1.75">${q.modelAnswer}</p>
            <div style="margin-top:1rem">
              <p style="font-size:0.8rem;font-weight:700;color:var(--color-text-muted);margin-bottom:0.5rem">チェックポイント</p>
              <ul style="padding-left:1.2rem;font-size:0.875rem;line-height:2">
                ${q.points.map(p => `<li>✓ ${p}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="essay-self-eval" style="margin-top:1rem">
            <h3 style="font-size:0.9rem;margin-bottom:0.75rem">自己評価</h3>
            <div class="eval-btn-row">
              <button class="eval-btn eval-btn-good" data-eval="good">😊 よくできた</button>
              <button class="eval-btn eval-btn-ok" data-eval="ok">🤔 まあまあ</button>
              <button class="eval-btn eval-btn-bad" data-eval="bad">😓 難しかった</button>
            </div>
          </div>
        ` : ''}

        <div class="btn-row" style="margin-top:1rem">
          <button id="essay-prev" class="btn btn-secondary" ${state.idx === 0 ? 'disabled' : ''}>← 前へ</button>
          <button id="essay-next" class="btn btn-primary" ${state.idx === QUESTIONS_ESSAY.length - 1 ? 'disabled' : ''}>次へ →</button>
        </div>
      </div>
    `;
  }

  function bind(el) {
    const q = QUESTIONS_ESSAY[state.idx];

    const ta = el.querySelector('#essay-answer');
    const cc = el.querySelector('#char-count');
    if (ta) {
      ta.addEventListener('input', () => {
        state.answers[q.id] = ta.value;
        if (cc) cc.textContent = ta.value.length + '文字';
      });
    }

    el.querySelector('#essay-check').addEventListener('click', () => {
      state.shown[q.id] = true;
      App.renderPage('essay');
    });

    el.querySelectorAll('.eval-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Storage.saveFlashcardRating('essay_' + q.id, btn.dataset.eval);
        btn.style.transform = 'scale(0.95)';
        btn.textContent += ' ✓';
        btn.disabled = true;
      });
    });

    el.querySelector('#essay-prev').addEventListener('click', () => {
      if (state.idx > 0) { state.idx--; App.renderPage('essay'); }
    });
    el.querySelector('#essay-next').addEventListener('click', () => {
      if (state.idx < QUESTIONS_ESSAY.length - 1) { state.idx++; App.renderPage('essay'); }
    });
  }

  return { render, bind };
})();
