const Flashcard = (() => {
  let state = { idx: 0, flipped: false, category: 'all' };

  const CATEGORIES = ['all', '行政法', '憲法', '民法', '一般知識'];

  function filtered() {
    if (state.category === 'all') return FLASHCARDS;
    return FLASHCARDS.filter(c => c.category === state.category);
  }

  function render() {
    const cards = filtered();
    const card = cards[state.idx] || cards[0];
    const ratings = Storage.getFlashcardRatings();
    const r = ratings[card.id];
    const ratingLabels = { 0: '😓 未定着', 1: '🤔 うろ覚え', 2: '😊 だいたい覚えた', 3: '🎯 完全定着' };

    return `
      <div class="page-container">
        <div class="page-header">
          <h2>🃏 暗記カード</h2>
        </div>

        <div class="form-group">
          <div class="select-wrapper">
            <select id="fc-category" class="form-select">
              ${CATEGORIES.map(c => `<option value="${c}" ${c === state.category ? 'selected' : ''}>${c === 'all' ? 'すべてのカテゴリ' : c}</option>`).join('')}
            </select>
          </div>
        </div>

        <div style="text-align:center;font-size:0.8rem;color:var(--color-text-muted);margin-bottom:0.75rem">
          ${state.idx + 1} / ${cards.length} 枚
          ${r ? `<span class="badge" style="margin-left:0.5rem">${ratingLabels[r.rating] || ''}</span>` : ''}
        </div>

        <div class="flashcard-wrap" id="fc-wrap" style="min-height:220px;position:relative">
          <div class="flashcard ${state.flipped ? 'flipped' : ''}" id="fc-card">
            <div class="flashcard-face">
              <div class="flashcard-tag">${card.category} — 表</div>
              <div class="flashcard-text">${card.front}</div>
              <div class="flashcard-hint">タップして答えを見る</div>
            </div>
            <div class="flashcard-face flashcard-back">
              <div class="flashcard-tag">${card.category} — 裏</div>
              <div class="flashcard-text" style="white-space:pre-line">${card.back}</div>
            </div>
          </div>
        </div>

        ${state.flipped ? `
          <div style="margin-bottom:1rem">
            <p style="font-size:0.8rem;font-weight:700;color:var(--color-text-muted);text-align:center;margin-bottom:0.75rem">定着度を評価</p>
            <div class="rating-btns">
              <button class="rating-btn rating-btn-0" data-rating="0">😓<br>未定着</button>
              <button class="rating-btn rating-btn-1" data-rating="1">🤔<br>うろ覚え</button>
              <button class="rating-btn rating-btn-2" data-rating="2">😊<br>だいたい</button>
              <button class="rating-btn rating-btn-3" data-rating="3">🎯<br>完全</button>
            </div>
          </div>
        ` : ''}

        <div class="btn-row">
          <button id="fc-prev" class="btn btn-secondary" ${state.idx === 0 ? 'disabled' : ''}>← 前</button>
          <button id="fc-next" class="btn btn-primary" ${state.idx === cards.length - 1 ? 'disabled' : ''}>次 →</button>
        </div>
      </div>
    `;
  }

  function bind(el) {
    const cards = filtered();
    const card = cards[state.idx] || cards[0];

    el.querySelector('#fc-wrap').addEventListener('click', () => {
      state.flipped = !state.flipped;
      App.renderPage('flashcard');
    });

    el.querySelector('#fc-category').addEventListener('change', e => {
      state.category = e.target.value;
      state.idx = 0;
      state.flipped = false;
      App.renderPage('flashcard');
    });

    el.querySelectorAll('.rating-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        Storage.saveFlashcardRating(card.id, parseInt(btn.dataset.rating));
        const next = state.idx + 1 < cards.length ? state.idx + 1 : state.idx;
        state.idx = next;
        state.flipped = false;
        App.renderPage('flashcard');
      });
    });

    el.querySelector('#fc-prev').addEventListener('click', () => {
      if (state.idx > 0) { state.idx--; state.flipped = false; App.renderPage('flashcard'); }
    });
    el.querySelector('#fc-next').addEventListener('click', () => {
      if (state.idx < cards.length - 1) { state.idx++; state.flipped = false; App.renderPage('flashcard'); }
    });
  }

  return { render, bind };
})();
