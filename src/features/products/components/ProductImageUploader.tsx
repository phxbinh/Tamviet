
// src/features/products/components/ProductImageUploader.tsx

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/clientSupabase'
import { getPublicImageUrl } from '@/lib/supabase/publicURL'

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

export default function ProductImageUploader({
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




