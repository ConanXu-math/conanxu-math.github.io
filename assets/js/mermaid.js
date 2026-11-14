import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.16.1/dist/mermaid.esm.min.mjs';

const root = document.documentElement;
const blocks = Array.from(document.querySelectorAll('#article-content pre code'))
  .filter(code => code.matches('.language-mermaid') || code.closest('.language-mermaid'));

const diagrams = blocks.map(code => {
  const source = code.textContent;
  const frame = document.createElement('figure');
  frame.className = 'mermaid-diagram';
  frame.style.overflowX = 'auto';
  frame.style.marginInline = '0';
  const node = document.createElement('div');
  node.className = 'mermaid';
  frame.append(node);
  const wrapper = code.closest('.highlighter-rouge');
  if (wrapper) wrapper.replaceWith(frame);
  else code.parentElement.replaceWith(frame);
  return { source, node, frame };
});

async function renderDiagrams(theme) {
  if (diagrams.length === 0) return;
  await document.fonts.ready;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: theme === 'dark' ? 'dark' : 'default',
    fontFamily: 'Roboto, sans-serif',
    flowchart: { htmlLabels: false, useMaxWidth: true }
  });
  for (const { source, node } of diagrams) {
    node.removeAttribute('data-processed');
    node.textContent = source;
  }
  await mermaid.run({ nodes: diagrams.map(diagram => diagram.node) });
  for (const { frame } of diagrams) frame.dataset.renderedTheme = theme;
}

let currentTheme = root.dataset.theme;
let rendering = renderDiagrams(currentTheme);
new MutationObserver(() => {
  const nextTheme = root.dataset.theme;
  if (nextTheme === currentTheme) return;
  currentTheme = nextTheme;
  rendering = rendering.then(() => renderDiagrams(nextTheme));
}).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
