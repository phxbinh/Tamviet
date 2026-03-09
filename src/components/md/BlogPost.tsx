export default function BlogPost() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <article>
      <header><h1>Tiêu đề bài viết</h1></header>
      
      {/* Truyền ref bài viết vào đây */}
      <TableOfContents htmlContent={html} contentRef={contentRef} />

      {/* Vùng nội dung chính dùng để tính % cuộn */}
      <div ref={contentRef} className="prose lg:prose-xl">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
