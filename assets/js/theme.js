(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { preference = localStorage.getItem('color-theme'); } catch (_) {}
  const apply = () => {
    const theme = preference || (system.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    const light = document.getElementById('highlight-light');
    const dark = document.getElementById('highlight-dark');
    if (light) light.media = theme === 'light' ? 'all' : 'not all';
    if (dark) dark.media = theme === 'dark' ? 'all' : 'not all';
  };
  apply();
  system.addEventListener('change', apply);
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('color-theme', preference); } catch (_) {}
      apply();
    });
  });
})();
