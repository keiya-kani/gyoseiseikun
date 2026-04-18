const App = (() => {
  const PAGES = {
    home:       { label: 'ホーム' },
    quiz:       { label: '択一式' },
    essay:      { label: '記述式' },
    flashcard:  { label: '暗記カード' },
    dashboard:  { label: '進捗' },
    calculator: { label: '採点計算機' }
  };

  let currentPage = 'home';

  function renderHome() {
    const history = Storage.getQuizHistory();
    const total = history.length;
    const totalQ = history.reduce((s, r) => s + r.total, 0);
    const totalC = history.reduce((s, r) => s + r.correct, 0);
    const rate = totalQ > 0 ? Math.round(totalC / totalQ * 100) : '--';

    return `
      <div class="page-container">
        <div style="margin-bottom:1.5rem">
          <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:0.25rem">行政書士試験<br>完全攻略</h2>
          <p style="color:var(--color-text-muted);font-size:0.875rem">学習を続けて合格を目指そう</p>
        </div>

        ${total > 0 ? `
          <div class="stats-grid" style="margin-bottom:1.5rem">
            <div class="stat-card">
              <div class="stat-value">${total}</div>
              <div class="stat-label">演習回数</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${rate}%</div>
              <div class="stat-label">正答率</div>
            </div>
          </div>
        ` : ''}

        <div class="home-menu">
          <a href="#quiz" class="menu-card" data-page="quiz">
            <span class="menu-card-icon">📝</span>
            <span class="menu-card-label">択一式演習</span>
          </a>
          <a href="#essay" class="menu-card" data-page="essay">
            <span class="menu-card-icon">✍️</span>
            <span class="menu-card-label">記述式演習</span>
          </a>
          <a href="#flashcard" class="menu-card" data-page="flashcard">
            <span class="menu-card-icon">🃏</span>
            <span class="menu-card-label">暗記カード</span>
          </a>
          <a href="#dashboard" class="menu-card" data-page="dashboard">
            <span class="menu-card-icon">📊</span>
            <span class="menu-card-label">進捗確認</span>
          </a>
          <a href="#calculator" class="menu-card" data-page="calculator">
            <span class="menu-card-icon">🧮</span>
            <span class="menu-card-label">採点計算機</span>
          </a>
          <div class="menu-card" style="background:var(--color-primary-light);cursor:default">
            <span class="menu-card-icon">⚖️</span>
            <span class="menu-card-label" style="color:var(--color-primary)">${totalQ}問<br>学習済</span>
          </div>
        </div>

        <div class="card" style="background:linear-gradient(135deg,#1a56db,#7e3af2);color:white;text-align:center">
          <p style="font-size:0.875rem;opacity:0.85;margin-bottom:0.25rem">合格ライン</p>
          <p style="font-size:1.75rem;font-weight:800">300点中 180点以上</p>
          <p style="font-size:0.75rem;opacity:0.75;margin-top:0.5rem">※一般知識24点以上の足切基準あり</p>
        </div>
      </div>
    `;
  }

  function renderPage(page) {
    currentPage = page;
    const main = document.getElementById('main-content');

    let html = '';
    switch (page) {
      case 'home':       html = renderHome(); break;
      case 'quiz':       html = Quiz.render(); break;
      case 'essay':      html = Essay.render(); break;
      case 'flashcard':  html = Flashcard.render(); break;
      case 'dashboard':  html = Dashboard.render(); break;
      case 'calculator': html = Calculator.render(); break;
      default:           html = renderHome();
    }

    main.innerHTML = html;
    main.scrollTop = 0;
    window.scrollTo(0, 0);

    // Module bindings
    switch (page) {
      case 'quiz':       Quiz.bind(main); break;
      case 'essay':      Essay.bind(main); break;
      case 'flashcard':  Flashcard.bind(main); break;
      case 'dashboard':  Dashboard.bind(main); break;
      case 'calculator': Calculator.bind(main); break;
    }

    // Home menu cards binding
    if (page === 'home') {
      main.querySelectorAll('.menu-card[data-page]').forEach(card => {
        card.addEventListener('click', e => {
          e.preventDefault();
          navigate(card.dataset.page);
        });
      });
    }

    updateNav(page);
  }

  function navigate(page) {
    if (!PAGES[page]) return;
    history.pushState({ page }, '', '#' + page);
    renderPage(page);
  }

  function updateNav(page) {
    document.querySelectorAll('.nav-item').forEach(item => {
      const active = item.dataset.page === page;
      item.setAttribute('aria-current', active ? 'page' : 'false');
      item.classList.toggle('active', active);
    });
  }

  function init() {
    A11y.init();

    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', e => {
        e.preventDefault();
        navigate(item.dataset.page);
      });
    });

    window.addEventListener('popstate', e => {
      const page = (e.state && e.state.page) || 'home';
      renderPage(page);
    });

    const hash = location.hash.replace('#', '');
    const startPage = PAGES[hash] ? hash : 'home';
    renderPage(startPage);
  }

  return { init, renderPage, navigate };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
