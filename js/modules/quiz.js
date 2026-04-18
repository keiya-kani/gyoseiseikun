const Quiz = (() => {
  const ALL_QUESTIONS = () => [
    ...QUESTIONS_GYOSEI,
    ...QUESTIONS_KENPO,
    ...QUESTIONS_MINPO,
    ...QUESTIONS_IPPAN
  ];

  const SUBJECTS = {
    all:    { label: 'すべて',   questions: () => ALL_QUESTIONS() },
    gyosei: { label: '行政法',   questions: () => QUESTIONS_GYOSEI },
    kenpo:  { label: '憲法',     questions: () => QUESTIONS_KENPO },
    minpo:  { label: '民法',     questions: () => QUESTIONS_MINPO },
    ippan:  { label: '一般知識', questions: () => QUESTIONS_IPPAN }
  };

  let state = null;

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderSetup() {
    return `
      <div class="page-container quiz-setup">
        <div class="page-header">
          <h2>📝 択一式演習</h2>
          <p>科目と問題数を選んで演習を始めましょう</p>
        </div>
        <div class="card">
          <div class="form-group">
            <label class="form-label" for="quiz-subject">科目</label>
            <div class="select-wrapper">
              <select id="quiz-subject" class="form-select">
                ${Object.entries(SUBJECTS).map(([k, v]) =>
                  `<option value="${k}">${v.label}</option>`
                ).join('')}
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="quiz-count">問題数</label>
            <div class="select-wrapper">
              <select id="quiz-count" class="form-select">
                <option value="5">5問</option>
                <option value="10" selected>10問</option>
                <option value="20">20問</option>
                <option value="all">全問</option>
              </select>
            </div>
          </div>
          <button id="quiz-start" class="btn btn-primary btn-full">演習を開始する</button>
        </div>
      </div>
    `;
  }

  function renderQuestion() {
    const q = state.questions[state.current];
    const answered = state.answers[state.current] !== undefined;
    const selected = state.answers[state.current];
    const pct = Math.round(((state.current) / state.questions.length) * 100);

    return `
      <div class="page-container">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-meta">
            <span>${state.current + 1} / ${state.questions.length} 問</span>
            <span>${state.correct} 正解</span>
          </div>
          <div class="progress-bar"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </div>

        <div class="quiz-question-card">
          <div class="quiz-subject-tag">${q.subject}</div>
          <div class="quiz-question-text">${q.text}</div>
        </div>

        <div class="choice-list">
          ${q.choices.map((c, i) => {
            let cls = 'choice-item';
            if (answered) {
              if (i === q.answer) cls += ' correct';
              else if (i === selected) cls += ' incorrect';
            } else if (i === selected) {
              cls += ' selected';
            }
            return `
              <button class="${cls}" data-idx="${i}" ${answered ? 'disabled' : ''}>
                <span class="choice-num">${i + 1}</span>
                <span>${c}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${answered ? `
          <div class="result-banner ${selected === q.answer ? 'correct' : 'incorrect'}">
            <span class="result-icon">${selected === q.answer ? '⭕' : '❌'}</span>
            ${selected === q.answer ? '正解！' : `不正解（正解：${q.answer + 1}番）`}
          </div>
          <div class="explanation">${q.explanation}</div>
          <div style="margin-top:1rem">
            ${state.current + 1 < state.questions.length
              ? `<button id="quiz-next" class="btn btn-primary btn-full">次の問題 →</button>`
              : `<button id="quiz-finish" class="btn btn-success btn-full">結果を見る</button>`
            }
          </div>
        ` : `
          <div style="margin-top:1rem">
            <button id="quiz-submit" class="btn btn-primary btn-full" ${selected === undefined ? 'disabled' : ''}>回答する</button>
          </div>
        `}
      </div>
    `;
  }

  function renderResult() {
    const pct = Math.round((state.correct / state.questions.length) * 100);
    return `
      <div class="page-container">
        <div class="quiz-final-card">
          <div style="font-size:0.8rem;color:var(--color-text-muted);margin-bottom:0.5rem">演習結果</div>
          <div class="quiz-final-score">${state.correct}<span style="font-size:1.5rem"> / ${state.questions.length}</span></div>
          <div class="quiz-final-label">正答率 ${pct}%</div>
          <div class="progress-bar" style="margin-bottom:1rem">
            <div class="progress-bar-fill" style="width:${pct}%;background:${pct >= 60 ? 'var(--color-success)' : 'var(--color-danger)'}"></div>
          </div>
          <span class="badge ${pct >= 60 ? 'badge-success' : 'badge-danger'}" style="font-size:1rem;padding:0.4rem 1rem">
            ${pct >= 60 ? '合格ライン達成！' : 'もう一度チャレンジ'}
          </span>
        </div>
        <div class="btn-row">
          <button id="quiz-retry" class="btn btn-outline">同じ条件で再挑戦</button>
          <button id="quiz-back" class="btn btn-primary">設定に戻る</button>
        </div>
      </div>
    `;
  }

  function bind(el) {
    if (state && !state.finished) {
      el.querySelectorAll('.choice-item').forEach(btn => {
        btn.addEventListener('click', () => {
          if (state.answers[state.current] !== undefined) return;
          state.answers[state.current] = parseInt(btn.dataset.idx);
          App.renderPage('quiz');
        });
      });
      const submit = el.querySelector('#quiz-submit');
      if (submit) {
        submit.addEventListener('click', () => {
          if (state.answers[state.current] === undefined) return;
          const q = state.questions[state.current];
          if (state.answers[state.current] === q.answer) state.correct++;
          App.renderPage('quiz');
        });
      }
      const next = el.querySelector('#quiz-next');
      if (next) {
        next.addEventListener('click', () => { state.current++; App.renderPage('quiz'); });
      }
      const finish = el.querySelector('#quiz-finish');
      if (finish) {
        finish.addEventListener('click', () => {
          state.finished = true;
          Storage.saveQuizResult(state.subjectLabel, state.correct, state.questions.length);
          App.renderPage('quiz');
        });
      }
    } else if (state && state.finished) {
      el.querySelector('#quiz-retry').addEventListener('click', () => {
        startQuiz(state.subjectKey, state.countKey);
        App.renderPage('quiz');
      });
      el.querySelector('#quiz-back').addEventListener('click', () => {
        state = null;
        App.renderPage('quiz');
      });
    } else {
      el.querySelector('#quiz-start').addEventListener('click', () => {
        const subjectKey = el.querySelector('#quiz-subject').value;
        const countKey = el.querySelector('#quiz-count').value;
        startQuiz(subjectKey, countKey);
        App.renderPage('quiz');
      });
    }
  }

  function startQuiz(subjectKey, countKey) {
    const sub = SUBJECTS[subjectKey];
    let qs = shuffle(sub.questions());
    if (countKey !== 'all') {
      const n = parseInt(countKey);
      qs = qs.slice(0, Math.min(n, qs.length));
    }
    state = {
      subjectKey, subjectLabel: sub.label, countKey,
      questions: qs, current: 0, answers: {}, correct: 0, finished: false
    };
  }

  return {
    render() {
      if (!state) return renderSetup();
      if (state.finished) return renderResult();
      return renderQuestion();
    },
    bind
  };
})();
