
// src/features/products/components/ProductImageUploader.tsx

'use client'

import { useState } from 'react'
//import { supabase } from '@/lib/supabase/server'
import { supabase } from '@/lib/supabase/clientSupabase';
import { getPublicImageUrl } from '@/lib/supabase/publicUrl'

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
        .from("product-images")
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

