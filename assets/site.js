(() => {
  const search = document.querySelector('#post-search');
  const filters = [...document.querySelectorAll('.category-filters button')];
  const posts = [...document.querySelectorAll('[data-post]')];
  const empty = document.querySelector('#empty-state');
  const filterStatus = document.querySelector('#filter-status');
  let category = 'all';

  function filterPosts() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    posts.forEach(post => {
      const match = (category === 'all' || post.dataset.category === category)
        && post.dataset.search.toLocaleLowerCase().includes(query);
      post.hidden = !match;
      if (match) count += 1;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
    empty.hidden = count > 0;
    filterStatus.textContent = `找到 ${count} 篇文章`;
  }

  if (search) {
    search.value = new URLSearchParams(window.location.search).get('q') || '';
    search.addEventListener('input', filterPosts);
    filters.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.category;
      filterPosts();
    }));
    document.querySelector('#reset-search').addEventListener('click', () => {
      category = 'all';
      search.value = '';
      filterPosts();
      search.focus();
    });
    filterPosts();
  }

  const toc = document.querySelector('#article-toc');
  if (toc) {
    document.querySelectorAll('#article-content h2').forEach((heading, index) => {
      if (!heading.id) heading.id = `section-${index + 1}`;
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      toc.append(link);
    });
  }

  const copy = document.querySelector('#copy-link');
  if (copy) {
    const status = document.querySelector('#copy-status');
    copy.addEventListener('click', async () => {
      const link = new URL(window.location.href);
      link.hash = '';
      try {
        await navigator.clipboard.writeText(link.href);
        status.textContent = '链接已复制，可以分享给朋友了。';
      } catch {
        status.textContent = '浏览器未允许复制，请从地址栏复制文章链接。';
      }
    });
  }
})();
