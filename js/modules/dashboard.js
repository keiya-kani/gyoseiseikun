const Dashboard = (() => {
  function render() {
    const history = Storage.getQuizHistory();
    const ratings = Storage.getFlashcardRatings();

    const total = history.length;
    const totalCorrect = history.reduce((s, r) => s + r.correct, 0);
    const totalQ = history.reduce((s, r) => s + r.total, 0);
    const rate = totalQ > 0 ? Math.round(totalCorrect / totalQ * 100) : 0;
    const fcDone = Object.keys(ratings).length;
    const fcMastered = Object.values(ratings).filter(r => r.rating >= 2).length;

    const bySubject = {};
    history.forEach(r => {
      if (!bySubject[r.subject]) bySubject[r.subject] = { correct: 0, total: 0, count: 0 };
      bySubject[r.subject].correct += r.correct;
      bySubject[r.subject].total += r.total;
      bySubject[r.subject].count++;
    });

    const recent = history.slice(0, 5);

    return `
      <div class="page-container">
        <div class="page-header">
          <h2>📊 進捗ダッシュボード</h2>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${total}</div>
            <div class="stat-label">演習回数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${rate}%</div>
            <div class="stat-label">正答率（累計）</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${fcDone}</div>
            <div class="stat-label">暗記カード学習済</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${fcMastered}</div>
            <div class="stat-label">定着済カード数</div>
          </div>
        </div>

        ${Object.keys(bySubject).length > 0 ? `
          <p class="dashboard-section-title">科目別成績</p>
          <div class="subject-list">
            ${Object.entries(bySubject).map(([subj, d]) => {
              const r = Math.round(d.correct / d.total * 100);
              return `
                <div class="subject-item">
                  <div class="subject-header">
                    <span class="subject-name">${subj}</span>
                    <span class="subject-score">${r}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" style="width:${r}%;background:${r >= 60 ? 'var(--color-success)' : 'var(--color-danger)'}"></div>
                  </div>
                  <div class="subject-attempts">${d.correct} / ${d.total} 問正解 · ${d.count}回</div>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}

        ${recent.length > 0 ? `
          <p class="dashboard-section-title" style="margin-top:1.5rem">最近の演習</p>
          <div class="history-list">
            ${recent.map(r => `
              <div class="history-item">
                <div class="history-info">
                  <div class="history-subject">${r.subject}</div>
                  <div class="history-date">${new Date(r.date).toLocaleDateString('ja-JP')}</div>
                </div>
                <div class="history-score">${r.correct}/${r.total}</div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="card" style="text-align:center;color:var(--color-text-muted);padding:2rem">
            <div style="font-size:3rem;margin-bottom:0.5rem">📈</div>
            <p>まだ演習履歴がありません</p>
            <p style="font-size:0.875rem">択一式演習を始めると<br>ここに記録されます</p>
          </div>
        `}

        <div style="margin-top:1.5rem">
          <button id="btn-export" class="btn btn-outline btn-full">📥 学習データをエクスポート</button>
        </div>
      </div>
    `;
  }

  function bind(el) {
    const expBtn = el.querySelector('#btn-export');
    if (expBtn) {
      expBtn.addEventListener('click', () => {
        const blob = new Blob([Storage.exportData()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gyoseishoshi_${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  return { render, bind };
})();
