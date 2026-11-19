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
  if ((node.type === 'link' || node.type === 'definition') && node.url.startsWith('https://')) {
    externalLinks.add(node.url);
  }
});
assert.equal(diagramCount, 32, '知识图谱数量不完整');
assert.ok(expectedMath.length > 200, '公式数量异常');
assert.ok(externalLinks.size >= 27, '参考文献数量不完整');
assert.ok(!source.includes('chatgpt.com/space/'), '公开文章包含私人整理页面');

const siteUrl = process.env.BLOG_CHECK_URL ?? 'http://127.0.0.1:4173';
const server = process.env.BLOG_CHECK_URL ? null : httpServer.createServer({ root: '_site', cache: -1 });
const browser = await chromium.launch({ channel: process.env.BLOG_CHECK_BROWSER });
try {
  if (server) await new Promise(resolve => server.listen(4173, '127.0.0.1', resolve));
  for (const prefix of ['', '/en']) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const articlePath = `${prefix}/blog/optimization-convergence-map/`;
    const response = await page.goto(new URL(articlePath, siteUrl).href);
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => window.MathJax?.startup?.document, undefined, { timeout: 90000 });
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
    const tocLinks = page.locator('#article-toc a');
    const tocCount = await tocLinks.count();
    assert.equal(tocCount, await page.locator('#article-content h2, #article-content h3').count(), '目录未覆盖文章标题');
    const brokenAnchors = await page.locator('#article-toc a, #article-content a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(decodeURIComponent(link.hash.slice(1)))).map(link => link.href));
    assert.deepEqual(brokenAnchors, [], '文章存在无效跳转链接');

    const diagramSvgs = page.locator('#article-content .mermaid-diagram svg:visible');
    assert.equal(await diagramSvgs.count(), diagramCount, '桌面端的知识图谱未显示完整');
    await page.locator('#theme-toggle').click();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.mermaid-diagram')).every(node => node.dataset.renderedTheme === 'dark'), undefined, { timeout: 90000 });
    assert.equal(await diagramSvgs.count(), diagramCount, '深色模式的知识图谱未显示完整');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.article-toc > summary').click();
    const mapLink = page.locator('#article-toc').getByRole('link', { name: '7. 完整知识图谱', exact: true });
    const mapHash = await mapLink.evaluate(link => link.hash);
    await mapLink.click();
    await page.waitForURL(url => url.hash === mapHash);
    assert.equal(await diagramSvgs.count(), diagramCount, '手机端的知识图谱未显示完整');
    assert.deepEqual(errors, [], '浏览器报告脚本错误');
    console.log(JSON.stringify({ path: articlePath, toc: tocCount, formulas: actualMath.length, diagrams: diagramCount, tables: tableCount, references: externalLinks.size, theme: 'light/dark', viewport: '1280/390' }));
    await page.close();
  }

  const existing = await browser.newPage();
  await existing.goto(new URL('/blog/optimization-variations-and-discretization/', siteUrl).href);
  assert.equal(await existing.locator('script[src$="/assets/js/mermaid.js"]').count(), 0, '未使用图谱的文章加载了 Mermaid');
  await existing.close();
} finally {
  await browser.close();
  server?.close();
}
