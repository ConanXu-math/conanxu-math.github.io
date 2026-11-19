import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.16.1/dist/mermaid.esm.min.mjs';

const root = document.documentElement;
const blocks = Array.from(document.querySelectorAll('#article-content pre code'))
  .filter(code => code.matches('.language-mermaid') || code.closest('.language-mermaid'));

const diagrams = blocks.map((code, index) => {
  const source = code.textContent;
  const frame = document.createElement('figure');
  frame.className = 'mermaid-diagram';
  frame.style.overflowX = 'auto';
  frame.style.marginInline = '0';
  const wrapper = code.closest('.highlighter-rouge');
  if (wrapper) wrapper.replaceWith(frame);
  else code.parentElement.replaceWith(frame);
  return { source, frame, id: `article-diagram-${index + 1}` };
});

async function renderVisibleDiagrams() {
  await document.fonts.ready;
  const theme = root.dataset.theme === 'dark' ? 'dark' : 'light';
  const pending = diagrams.filter(({ frame }) =>
    frame.dataset.renderedTheme !== theme && !frame.closest('details:not([open])')
  );
  if (!pending.length) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: theme === 'dark' ? 'dark' : 'default',
    fontFamily: 'Roboto, sans-serif',
    flowchart: { htmlLabels: false, useMaxWidth: true }
  });
  for (const { source, frame, id } of pending) {
    const { svg, bindFunctions } = await mermaid.render(`${id}-${theme}`, source);
    frame.innerHTML = svg;
    const width = frame.querySelector('svg').viewBox.baseVal.width;
    frame.style.setProperty('--diagram-width', `${width}px`);
    bindFunctions?.(frame);
    frame.dataset.renderedTheme = theme;
  }
}

let rendering = Promise.resolve();
const scheduleRender = () => {
  rendering = rendering.then(renderVisibleDiagrams);
};

for (const section of document.querySelectorAll('#article-content details.diagram-section')) {
  section.addEventListener('toggle', scheduleRender);
}
new MutationObserver(scheduleRender).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
scheduleRender();
