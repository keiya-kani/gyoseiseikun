const A11y = {
  init() {
    const hcBtn = document.getElementById('btn-contrast');
    if (Storage.get('high_contrast', false)) {
      document.documentElement.classList.add('high-contrast');
      hcBtn.setAttribute('aria-pressed', 'true');
    }
    hcBtn.addEventListener('click', () => {
      const on = document.documentElement.classList.toggle('high-contrast');
      hcBtn.setAttribute('aria-pressed', String(on));
      Storage.set('high_contrast', on);
    });

    const fsBtn = document.getElementById('btn-fontsize');
    if (Storage.get('font_lg', false)) {
      document.documentElement.classList.add('font-lg');
    }
    fsBtn.addEventListener('click', () => {
      const on = document.documentElement.classList.toggle('font-lg');
      Storage.set('font_lg', on);
    });

    document.getElementById('btn-export').addEventListener('click', () => {
      const blob = new Blob([Storage.exportData()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gyoseishoshi_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
};
