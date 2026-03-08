// src/lib/md/markdown.ts
/*
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
*/

/*
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export async function parseMarkdown(content: string) {
  const rawHtml = await marked.parse(content);
  
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['id', 'class'] // Giữ lại ID để làm TOC
    }
  });
}
*/


import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export async function parseMarkdown(content: string) {
  // 1. Cấu hình Renderer để tự tạo ID cho heading
  const renderer = new marked.Renderer();
  renderer.heading = ({ text, depth }) => {
    // Tạo slug từ text: "Chào bạn" -> "chao-ban"
    const escapedText = text.toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Xóa ký tự đặc biệt
      .replace(/\s+/g, '-');    // Thay khoảng trắng bằng dấu gạch ngang

    return `<h${depth} id="${escapedText}">${text}</h${depth}>`;
  };

  // 2. Parse Markdown với Renderer vừa tạo
  const rawHtml = await marked.parse(content, { renderer });
  
  // 3. Sanitize (Quan trọng: Cho phép thuộc tính 'id' để TOC hoạt động)
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      // Cho phép 'id' trên TẤT CẢ các thẻ (hoặc chỉ cụ thể h1, h2, h3)
      '*': ['id', 'class'], 
    }
  });
}










