// src/components/ui/Breadcrumb.tsx
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3 md:mb-6 mt-1 md:mt-2">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        {/* Trang chủ luôn là điểm bắt đầu */}
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Về trang chủ"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Icon phân cách */}
              <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0" />

              {isLast ? (
                // Mục cuối cùng (Tên sản phẩm) - không có link, in đậm hoặc màu khác
                <span className="font-medium text-foreground truncate max-w-[150px] md:max-w-[300px]" aria-current="page">
                  {item.label}
                </span>
              ) : (
                // Các cấp danh mục trung gian
                <Link
                  href={item.href || "#"} prefetch={true}
                  className="hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
