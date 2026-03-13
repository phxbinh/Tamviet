
/*"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCategoryPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();

    await fetch("/api/admin/categories", {
      method: "POST",
      body: JSON.stringify({
        name,
        slug
      })
    });

    router.push("/admin/categories");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-xl space-y-4"
    >
      <h1 className="text-xl font-bold">Create Category</h1>

      <input
        placeholder="Name"
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Slug"
        className="border p-2 w-full"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </form>
  );
}
*/


/*
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";

export default function NewCategoryPage_() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    setName(value);

    // chỉ auto slug khi user chưa chỉnh slug
    if (!slugEdited) {
      setSlug(
        slugify(value, {
          lower: true,
          strict: true,
          locale: "vi"
        })
      );
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugEdited(true);
    setSlug(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("/api/admin/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        slug
      })
    });

    router.push("/admin/categories");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-xl space-y-4"
    >
      <h1 className="text-xl font-bold">Create Category</h1>

      <input
        placeholder="Name"
        className="border p-2 w-full"
        value={name}
        onChange={handleNameChange}
      />

      <input
        placeholder="Slug"
        className="border p-2 w-full"
        value={slug}
        onChange={handleSlugChange}
      />

      <button
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </form>
  );
}
*/



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import slugify from "slugify";
import { ArrowLeft, Hash, Tag, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NewCategoryPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    if (!slugEdited) {
      setSlug(slugify(value, { lower: true, strict: true, locale: "vi" }));
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlugEdited(true);
    setSlug(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
      router.push("/admin/categories");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 animate-fade-in">
      {/* Header Quay lại */}
      <div className="max-w-2xl mx-auto mb-8">
        <Link 
          href="/admin/categories" 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          Quay lại danh sách
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto space-y-8 bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5"
      >
        {/* Tiêu đề trang */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase italic">
            New Category <span className="text-primary">.</span>
          </h1>
          <p className="text-[10px] font-bold text-foreground/30 tracking-[0.3em] uppercase">
            Thiết lập danh mục sản phẩm mới
          </p>
        </div>

        <div className="space-y-6">
          {/* Input Tên */}
          <div className="group space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-foreground/60 group-focus-within:text-primary transition-colors">
              <Tag className="w-3 h-3" /> Tên danh mục
            </label>
            <input
              required
              placeholder="Ví dụ: Đồ gia dụng cao cấp"
              className="w-full bg-background border border-border px-5 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-[6px] focus:ring-primary/5 focus:border-primary/40 transition-all duration-300"
              value={name}
              onChange={handleNameChange}
            />
          </div>

          {/* Input Slug */}
          <div className="group space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-foreground/60 group-focus-within:text-primary transition-colors">
              <Hash className="w-3 h-3" /> Đường dẫn (Slug)
            </label>
            <div className="relative">
              <input
                required
                placeholder="do-gia-dung-cao-cap"
                className={`w-full bg-background border px-5 py-4 rounded-2xl text-sm font-mono transition-all duration-300 outline-none
                  ${slugEdited ? 'border-primary/40' : 'border-border'}
                  focus:ring-[6px] focus:ring-primary/5 focus:border-primary/40
                `}
                value={slug}
                onChange={handleSlugChange}
              />
              {slugEdited && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="text-[9px] font-bold text-primary uppercase tracking-tighter bg-primary/10 px-2 py-1 rounded">Manual</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nút bấm Hành động */}
        <div className="pt-6 border-t border-border/50">
          <button
            disabled={isSubmitting || !name}
            className={`
              w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] transition-all duration-500 flex items-center justify-center gap-3
              ${isSubmitting || !name
                ? "bg-border text-foreground/20 cursor-not-allowed" 
                : "bg-foreground text-background hover:bg-primary hover:shadow-[0_20px_40px_rgba(var(--primary),0.2)] active:scale-[0.98] group"}
            `}
          >
            {isSubmitting ? (
              <span className="animate-breathe-fast">Đang khởi tạo...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                Xác nhận tạo danh mục
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preview nhẹ nhàng bên dưới */}
      <div className="max-w-2xl mx-auto mt-6 px-8 py-4 bg-primary/5 rounded-2xl border border-primary/10 animate-breathe-slow">
        <p className="text-[10px] text-primary/60 font-medium">
          <span className="font-black uppercase mr-2">Preview:</span> 
          yourshop.com/categories/<span className="font-bold underline italic">{slug || "..."}</span>
        </p>
      </div>
    </div>
  );
}








