// src/components/TOC.tsx

export function TOC({ toc }: any) {
  return (
    <aside className="sticky top-20 text-sm">
      <div className="font-bold mb-2">Mục lục</div>

      <ul className="space-y-1">
        {toc.map((item: any) => (
          <li
            key={item.id}
            style={{ marginLeft: (item.level - 1) * 12 }}
          >
            <a
              href={`#${item.id}`}
              className="text-gray-600 hover:text-black"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}