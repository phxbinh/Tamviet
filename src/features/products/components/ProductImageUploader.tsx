
// src/features/products/components/ProductImageUploader.tsx

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/clientSupabase';
import { getPublicImageUrl } from '@/lib/supabase/publicUrl'
import { 
  UploadCloud, 
  Trash2, 
  Image as ImageIcon, 
  CheckCircle2, 
  Loader2, 
  Plus 
} from "lucide-react";



/*
export interface ProductImage {
  id: string
  image_url: string
  alt_text?: string | null
  display_order: number
  is_thumbnail: boolean
}

interface Props {
  productId?: string
  variantId?: string
  images: any[]
  onUploaded: () => void
}

//export default 
function ProductImageUploader_({
  productId,
  variantId,
  images,
  onUploaded
}: Props) {

  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setUploading(true)

    const uploaded: string[] = []

    for (const file of files) {

      if (!file.type.startsWith('image/')) continue

      const path = productId
        ? `products/${productId}/${crypto.randomUUID()}-${file.name}`
        : `variants/${variantId}/${crypto.randomUUID()}-${file.name}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, file)

      if (!error) {
        uploaded.push(path)
      }
    }

    if (uploaded.length) {
      await fetch('/api/products/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          variantId,
          paths: uploaded
        })
      })

      onUploaded()
    }

    setUploading(false)
    e.target.value = ''
  }

  return (
    <div className="space-y-4">

      <input
        type="file"
        multiple
        accept="image/*"
        disabled={uploading}
        onChange={handleUpload}
      />

      <ImageGrid images={images} onChange={onUploaded} />

    </div>
  )
}


function ImageGrid({ images, onChange }: any) {

  return (
    <div className="grid grid-cols-4 gap-4">

      {images.map((img: any) => (
        <ImageItem
          key={img.id}
          image={img}
          onChange={onChange}
        />
      ))}

    </div>
  )
}


function ImageItem({ image, onChange }: any) {

  const src = getPublicImageUrl(image.image_url)

  async function handleDelete() {

    await fetch(`/api/products/images/${image.id}`, {
      method: 'DELETE'
    })

    onChange()
  }

  async function setThumbnail() {

    await fetch(`/api/products/images/${image.id}/thumbnail`, {
      method: 'PATCH'
    })

    onChange()
  }

  return (
    <div className="border rounded p-2 space-y-2">

      <img
        src={src}
        className="w-full h-32 object-cover rounded"
      />

      <div className="flex gap-2">

        <button onClick={setThumbnail}>
          Thumbnail
        </button>

        <button onClick={handleDelete}>
          Delete
        </button>

      </div>

      {image.is_thumbnail && (
        <div className="text-xs text-green-600">
          Thumbnail
        </div>
      )}

    </div>
  )
}
*/

/*
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/clientSupabase";
import { getPublicImageUrl } from "@/lib/supabase/publicURL";
*/

interface ImageItem {
  id: string;
  image_url: string;
  alt_text?: string | null;
  display_order: number;
  is_thumbnail: boolean;
}

//export default 
function ProductImageUploader_({
  productId,
  variantId,
  images,
  onUploaded,
}: {
  productId?: string;
  variantId?: string;
  images: ImageItem[];
  onUploaded: () => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    // PRECHECK
    const check = await fetch("/api/products/images/precheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        variantId,
      }),
    });

    if (!check.ok) {
      alert("Không có quyền upload");
      setUploading(false);
      return;
    }

    const uploaded: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const path = productId
        ? `products/${productId}/${crypto.randomUUID()}-${file.name}`
        : `variants/${variantId}/${crypto.randomUUID()}-${file.name}`;

      const { error } = await supabase.storage
        .from("products-images")
        .upload(path, file);

      if (error) {
        console.error(error);
        alert(error.message);
      } else {
        uploaded.push(path);
      }
    }

    // INSERT DB
    if (uploaded.length) {
      await fetch("/api/products/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          variantId,
          paths: uploaded,
        }),
      });

      onUploaded();
    }

    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(id: string) {
    const ok = confirm("Xóa ảnh này?");
    if (!ok) return;

    await fetch(`/api/products/images/${id}`, {
      method: "DELETE",
    });

    onUploaded();
  }

  async function setThumbnail(id: string) {
    await fetch(`/api/products/images/${id}/thumbnail`, {
      method: "PATCH",
    });

    onUploaded();
  }

  return (
    <div className="space-y-6">

      {/* UPLOAD INPUT */}
      <input
        type="file"
        multiple
        accept="image/*"
        disabled={uploading}
        onChange={handleUpload}
        className="block text-xs"
      />

      {/* IMAGES GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => {
          const src = getPublicImageUrl(img.image_url);

          return (
            <div
              key={img.id}
              className="border border-border rounded overflow-hidden relative group"
            >
              <img
                src={src}
                alt={img.alt_text ?? ""}
                className="w-full h-32 object-cover"
              />

              {/* THUMBNAIL BADGE */}
              {img.is_thumbnail && (
                <div className="absolute top-2 left-2 bg-primary text-white text-[9px] px-2 py-1 font-bold">
                  THUMBNAIL
                </div>
              )}

              {/* ACTIONS */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] flex justify-between p-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setThumbnail(img.id)}
                  className="hover:underline"
                >
                  Thumbnail
                </button>

                <button
                  onClick={() => handleDelete(img.id)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}





export default function ProductImageUploader({
  productId,
  variantId,
  images,
  onUploaded,
}: {
  productId?: string;
  variantId?: string;
  images: ImageItem[];
  onUploaded: () => void;
}) {
  
  const [uploading, setUploading] = useState(false);

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    // PRECHECK
    const check = await fetch("/api/products/images/precheck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        variantId,
      }),
    });

    if (!check.ok) {
      alert("Không có quyền upload");
      setUploading(false);
      return;
    }

    const uploaded: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const path = productId
        ? `products/${productId}/${crypto.randomUUID()}-${file.name}`
        : `variants/${variantId}/${crypto.randomUUID()}-${file.name}`;

      const { error } = await supabase.storage
        .from("products-images")
        .upload(path, file);

/*
await supabase.storage
  .from("products-images")
  .upload(path, file, {
    contentType: file.type, // QUAN TRỌNG
    cacheControl: "31536000",
  });
*/


      if (error) {
        console.error(error);
        alert(error.message);
      } else {
        uploaded.push(path);
      }
    }

    // INSERT DB
    if (uploaded.length) {
      await fetch("/api/products/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          variantId,
          paths: uploaded,
        }),
      });

      onUploaded();
    }

    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(id: string) {
    const ok = confirm("Xóa ảnh này?");
    if (!ok) return;

    await fetch(`/api/products/images/${id}`, {
      method: "DELETE",
    });

    onUploaded();
  }

  async function setThumbnail(id: string) {
    await fetch(`/api/products/images/${id}/thumbnail`, {
      method: "PATCH",
    });

    onUploaded();
  }
  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. SMART UPLOAD ZONE */}
      <div className="relative">
        <input
          type="file"
          multiple
          accept="image/*"
          disabled={uploading}
          onChange={handleUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          id="file-upload"
        />
        <label 
          htmlFor="file-upload"
          className={`
            flex flex-col items-center justify-center w-full py-12 border-2 border-dashed 
            rounded-[2rem] transition-all duration-300 group
            ${uploading 
              ? "bg-muted/50 border-primary/20" 
              : "bg-card border-border hover:border-primary/50 hover:bg-muted/30"
            }
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Synchronizing Assets...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-background rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-widest text-foreground">Drop product assets here</p>
                <p className="text-[9px] font-medium text-muted-foreground mt-1 uppercase">PNG, JPG, WEBP up to 5MB</p>
              </div>
            </div>
          )}
        </label>
      </div>

      {/* 2. IMAGE REGISTRY GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {images.map((img) => {
          const src = getPublicImageUrl(img.image_url);

          return (
            <div
              key={img.id}
              className="group relative aspect-[4/5] bg-muted rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <img
                src={src}
                alt={img.alt_text ?? ""}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* OVERLAY: STATUS & ACTIONS */}
              <div className="absolute inset-0 bg-black/40 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                
                {/* Top Action: Set Thumbnail */}
                <div className="flex justify-end">
                  {!img.is_thumbnail && (
                    <button
                      onClick={() => setThumbnail(img.id)}
                      className="p-2 bg-white/10 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full transition-all"
                      title="Set as Main Image"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Bottom Action: Delete */}
                <div className="flex justify-between items-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-[9px] font-black text-white/60 uppercase tracking-tighter">
                    Order: {img.display_order}
                  </span>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white backdrop-blur-md rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* THUMBNAIL INDICATOR (Luôn hiện nếu là thumbnail) */}
              {img.is_thumbnail && (
                <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-fade-in border border-white/20">
                  <ImageIcon className="w-3 h-3" />
                  PRIMARY ASSET
                </div>
              )}
            </div>
          );
        })}

        {/* Placeholder for "Add more" vibe */}
        {images.length > 0 && (
           <label htmlFor="file-upload" className="aspect-[4/5] border-2 border-dashed border-border/50 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/20 transition-all opacity-40 hover:opacity-100">
             <Plus className="w-6 h-6" />
             <span className="text-[9px] font-black uppercase tracking-widest">Add Asset</span>
           </label>
        )}
      </div>

    </div>
  );
}



