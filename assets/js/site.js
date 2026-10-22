(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  const toc = document.getElementById('article-toc');
  document.querySelectorAll('#article-content h2, #article-content h3').forEach((heading, index) => {
    if (!toc) return;
    if (!heading.id) heading.id = `section-${index + 1}`;
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    if (heading.tagName === 'H3') link.className = 'toc-subheading';
    toc.append(link);
  });
  if (toc && !toc.children.length) toc.parentElement.hidden = true;

  const dialog = document.getElementById('search-dialog');
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const status = document.getElementById('search-status');
  const initialStatus = status.textContent;
  let articles;
  let loading;

  const render = () => {
    results.replaceChildren();
    const query = input.value.trim().toLocaleLowerCase();
    if (!query) { status.textContent = initialStatus; return; }
    if (!articles) return;
    const terms = query.split(/\s+/);
    const matches = articles.filter(article => {
      const text = `${article.title} ${article.categories} ${article.tags} ${article.content}`.toLocaleLowerCase();
      return terms.every(term => text.includes(term));
    });
    status.textContent = matches.length ? '' : dialog.dataset.empty;
    for (const article of matches) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = article.url;
      link.textContent = article.title;
      const category = document.createElement('small');
      category.textContent = article.categories;
      item.append(link, category);
      results.append(item);
    }
  };
  const openSearch = async () => {
    if (!dialog.open) dialog.showModal();
    input.focus();
    if (!articles) {
      try {
        loading ||= fetch(dialog.dataset.searchUrl).then(response => {
          if (!response.ok) throw new Error('Search could not be loaded');
          return response.json();
        });
        articles = await loading;
      } catch (_) {
        loading = null;
        status.textContent = dialog.dataset.failed;
        return;
      }
    }
    render();
  };
  document.getElementById('search-open').addEventListener('click', openSearch);
  document.getElementById('search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
  input.addEventListener('input', render);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
})();
