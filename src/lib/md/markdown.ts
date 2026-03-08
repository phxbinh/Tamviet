// src/lib/md/markdown.ts
import { marked } from 'marked';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

export async function parseMarkdown(content: string) {
  // Chuyển Markdown thành HTML
  const rawHtml = await marked.parse(content);
  
  // Chống XSS bằng cách xóa bỏ các tag/attribute nguy hiểm
  const sanitizedHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target'], // Cho phép mở link tab mới nếu cần
  });

  return sanitizedHtml;
}
