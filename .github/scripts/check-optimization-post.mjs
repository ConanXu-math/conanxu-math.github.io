import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from '../../.blog-check/node_modules/playwright/index.mjs';
import { unified } from '../../.blog-check/node_modules/unified/index.js';
import remarkParse from '../../.blog-check/node_modules/remark-parse/index.js';
import remarkMath from '../../.blog-check/node_modules/remark-math/index.js';
import remarkGfm from '../../.blog-check/node_modules/remark-gfm/index.js';
import remarkFrontmatter from '../../.blog-check/node_modules/remark-frontmatter/index.js';
import { visit } from '../../.blog-check/node_modules/unist-util-visit/index.js';
import httpServer from '../../.blog-check/node_modules/http-server/lib/http-server.js';

const source = await readFile('_posts/2026-11-14-optimization-convergence-map.zh-CN.md', 'utf8');
const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMath).use(remarkFrontmatter).parse(source);
const expectedMath = [];
const externalLinks = new Set();
let diagramCount = 0;
let tableCount = 0;

visit(tree, node => {
  if (node.type === 'math' || node.type === 'inlineMath') {
    expectedMath.push({ value: node.value.replace(/\s+/g, ' ').trim(), display: node.type === 'math' });
  }
  if (node.type === 'code' && node.lang === 'mermaid') diagramCount += 1;
  if (node.type === 'table') tableCount += 1;
  if (node.type === 'link' && node.url.startsWith('https://')) externalLinks.add(node.url);
});
assert.equal(diagramCount, 5, '知识图谱数量不完整');
assert.ok(expectedMath.length > 200, '公式数量异常');
assert.ok(externalLinks.size >= 27, '参考文献数量不完整');
assert.ok(!source.includes('chatgpt.com/space/'), '公开文章包含私人整理页面');

const server = httpServer.createServer({ root: '_site', cache: -1 });
await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
const browser = await chromium.launch();
try {
  for (const prefix of ['', '/en']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(`http://127.0.0.1:4173${prefix}/blog/optimization-convergence-map/`);
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => window.MathJax?.startup?.document, { timeout: 90000 });
    await page.evaluate(() => MathJax.startup.promise);
    await page.waitForFunction(count => document.querySelectorAll('#article-content .mermaid-diagram svg').length === count, diagramCount, { timeout: 90000 });

    const actualMath = await page.evaluate(() => Array.from(MathJax.startup.document.math, item => ({
      value: item.math.replace(/\s+/g, ' ').trim(), display: Boolean(item.display)
    })));
    assert.deepEqual(actualMath, expectedMath, '网页公式与 Markdown 中的 TeX 不一致');
    assert.equal(await page.locator('mjx-merror, [data-mjx-error]').count(), 0, 'MathJax 报告公式错误');
    assert.equal(await page.locator('#article-content table').count(), tableCount, '表格结构不完整');
    const renderedLinks = new Set(await page.locator('#article-content a').evaluateAll(links => links.map(link => link.getAttribute('href'))));
    for (const link of externalLinks) assert.ok(renderedLinks.has(link), `缺少文献链接：${link}`);
    const brokenToc = await page.locator('#article-toc a').evaluateAll(links => links.filter(link => !document.getElementById(decodeURIComponent(link.hash.slice(1)))).map(link => link.href));
    assert.deepEqual(brokenToc, [], '目录存在无效锚点');

    await page.locator('#theme-toggle').click();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.mermaid-diagram')).every(node => node.dataset.renderedTheme === 'dark'), { timeout: 90000 });
    assert.equal(await page.locator('#article-content .mermaid-diagram svg').count(), diagramCount);
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.locator('#article-content .mermaid-diagram svg').count(), diagramCount);
    assert.deepEqual(errors, [], '浏览器报告脚本错误');
    console.log(JSON.stringify({ path: `${prefix}/blog/optimization-convergence-map/`, formulas: actualMath.length, diagrams: diagramCount, tables: tableCount, references: externalLinks.size, theme: 'light/dark', viewport: '1280/390' }));
    await page.close();
  }

  const existing = await browser.newPage();
  await existing.goto('http://127.0.0.1:4173/blog/optimization-variations-and-discretization/');
  assert.equal(await existing.locator('script[src$="/assets/js/mermaid.js"]').count(), 0, '未使用图谱的文章加载了 Mermaid');
  await existing.close();
} finally {
  await browser.close();
  server.close();
}
