const Storage = {
  get(key, def = null) {
    try { return JSON.parse(localStorage.getItem(key)) ?? def; }
    catch { return def; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
  saveQuizResult(subject, correct, total) {
    const history = this.get('quiz_history', []);
    history.unshift({ subject, correct, total, date: Date.now() });
    if (history.length > 200) history.splice(200);
    this.set('quiz_history', history);
  },
  getQuizHistory() { return this.get('quiz_history', []); },
  saveFlashcardRating(id, rating) {
    const ratings = this.get('fc_ratings', {});
    ratings[id] = { rating, date: Date.now() };
    this.set('fc_ratings', ratings);
  },
  getFlashcardRatings() { return this.get('fc_ratings', {}); },
  exportData() {
    return JSON.stringify({
      quiz_history: this.get('quiz_history', []),
      fc_ratings: this.get('fc_ratings', {}),
      exported_at: new Date().toISOString()
    }, null, 2);
  }
};
