(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.getElementById('site-menu');
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  const toc = document.getElementById('article-toc');
  const headings = Array.from(document.querySelectorAll('#article-content h2, #article-content h3'));
  let tocChildren;
  headings.forEach((heading, index) => {
    if (!toc) return;
    if (!heading.id) heading.id = `section-${index + 1}`;
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    const section = heading.closest('details.diagram-section');
    if (section) link.addEventListener('click', () => { section.open = true; });
    if (heading.tagName === 'H2') {
      tocChildren = null;
      if (headings[index + 1]?.tagName === 'H3') {
        const group = document.createElement('details');
        group.className = 'toc-group';
        const summary = document.createElement('summary');
        summary.append(link);
        tocChildren = document.createElement('div');
        tocChildren.className = 'toc-children';
        group.append(summary, tocChildren);
        toc.append(group);
      } else {
        toc.append(link);
      }
    } else {
      link.className = 'toc-subheading';
      (tocChildren || toc).append(link);
    }
  });
  if (toc && !toc.children.length) {
    toc.parentElement.hidden = true;
    document.querySelector('.article-page').classList.remove('article-with-toc');
    document.getElementById('main').classList.remove('article-main');
  }
  if (toc?.children.length) {
    const diagramHeadings = Array.from(document.querySelectorAll('#article-content details.diagram-section [id]'));
    const revealTocGroup = () => {
      const link = Array.from(toc.querySelectorAll('a')).find(item => item.hash === location.hash);
      const group = link?.closest('.toc-group');
      if (group) group.open = true;
      const heading = diagramHeadings.find(item => `#${encodeURIComponent(item.id)}` === location.hash);
      const section = heading?.closest('details.diagram-section');
      if (section) section.open = true;
    };
    revealTocGroup();
    window.addEventListener('hashchange', revealTocGroup);
    const disclosure = toc.closest('details');
    const summary = disclosure.querySelector('summary');
    const desktop = window.matchMedia('(min-width: 1100px)');
    const syncTocLayout = () => {
      disclosure.open = desktop.matches;
      summary.tabIndex = desktop.matches ? -1 : 0;
    };
    syncTocLayout();
    desktop.addEventListener('change', syncTocLayout);
    summary.addEventListener('click', event => {
      if (desktop.matches) event.preventDefault();
    });
  }

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
