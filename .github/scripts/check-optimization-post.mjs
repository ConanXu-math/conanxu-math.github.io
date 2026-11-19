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
    const diagramSections = page.locator('#article-content details.diagram-section');
    assert.equal(await diagramSections.count(), 15, '图谱小节应各有一个折叠控件');
    assert.equal(await page.locator('#article-content details.diagram-section[open]').count(), 0, '分图应默认折叠');
    await page.waitForFunction(count => document.querySelectorAll('#article-content .mermaid-diagram').length === count, diagramCount, { timeout: 90000 });
    await page.waitForFunction(() => document.querySelectorAll('#article-content .mermaid-diagram svg').length >= 2, undefined, { timeout: 90000 });
    assert.equal(await diagramSections.locator('svg').count(), 0, '分图应在展开时绘制');

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
    assert.equal(await diagramSvgs.count(), 2, '默认应显示正文中的图和第 7 节总图');
    await page.locator('#theme-toggle').click();
    await page.waitForFunction(() => document.querySelectorAll('.mermaid-diagram[data-rendered-theme="dark"]').length === 2, undefined, { timeout: 90000 });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.article-toc > summary').click();
    const mapLink = page.locator('#article-toc').getByRole('link', { name: /^7\. / });
    const mapHash = await mapLink.evaluate(link => link.hash);
    await mapLink.click();
    await page.waitForURL(url => url.hash === mapHash);
    const subsectionLink = page.locator('#article-toc').getByRole('link', { name: /^7\.9 / });
    const subsectionHash = await subsectionLink.evaluate(link => link.hash);
    await subsectionLink.click();
    await page.waitForURL(url => url.hash === subsectionHash);
    await page.waitForFunction(hash => {
      const heading = document.getElementById(decodeURIComponent(hash.slice(1)));
      const bounds = heading.getBoundingClientRect();
      const navbar = document.querySelector('.navbar').getBoundingClientRect();
      return heading.closest('details.diagram-section')?.open && bounds.top >= navbar.bottom && bounds.bottom <= innerHeight;
    }, subsectionHash);

    for (const section of await diagramSections.all()) {
      if (await section.getAttribute('open') === null) await section.locator(':scope > summary').click();
      const lastDiagram = section.locator('.mermaid-diagram').last();
      if (await lastDiagram.count()) await lastDiagram.locator('svg:visible').waitFor({ timeout: 90000 });
    }
    assert.equal(await diagramSvgs.count(), diagramCount, '展开后应显示全部 Mermaid 图');
    assert.deepEqual(await diagramSvgs.evaluateAll(svgs => svgs.filter(svg => {
      const { width, height } = svg.viewBox.baseVal;
      const frame = svg.parentElement;
      return width <= 0 || height <= 0 || !svg.querySelector('.node')
        || svg.getBoundingClientRect().width < width - 1
        || (width > frame.clientWidth + 1 && frame.scrollWidth <= frame.clientWidth);
    }).map(svg => svg.id)), [], '手机端分图应保留原宽，宽图可在图框内滑动');
    assert.equal(await page.locator('.mermaid-diagram[data-rendered-theme="dark"]').count(), diagramCount);

    await page.reload();
    await page.waitForFunction(hash => {
      const heading = document.getElementById(decodeURIComponent(hash.slice(1)));
      return heading.closest('details.diagram-section')?.querySelectorAll('.mermaid-diagram svg').length === 6;
    }, subsectionHash);
    assert.equal(await page.locator('#article-content details.diagram-section[open]').count(), 1, '带小节地址访问时应展开目标小节');
    assert.deepEqual(errors, [], '浏览器报告脚本错误');
    console.log(JSON.stringify({ path: articlePath, toc: tocCount, formulas: actualMath.length, diagrams: diagramCount, tables: tableCount, references: externalLinks.size, theme: 'light/dark', viewport: '1280/390' }));
    await page.close();
  }

  const existing = await browser.newPage();
  await existing.goto(new URL('/blog/optimization-variations-and-discretization/', siteUrl).href);
  assert.equal(await existing.locator('script[src*="/assets/js/mermaid.js"]').count(), 0, '未使用图谱的文章加载了 Mermaid');
  await existing.close();
} finally {
  await browser.close();
  server?.close();
}
