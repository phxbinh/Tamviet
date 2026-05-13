// src/components/modals/ProductModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import ProductDetailClient from './ProductDetailClient';
//import { getProductCached } from "./getProductCached";

/*
interface ProductModalProps {
  slug: string;
  open: boolean;
  onClose: () => void;
}
*/

interface ProductModalProps {
  slug: string | null;
  open: boolean;
  onClose: () => void;
}

export function ProductModal({
  slug,
  open,
  onClose,
}: ProductModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);


  
//src/app/api/productchatbot/bot-sell/getProduct
  useEffect(() => {
  //if (!open) return;
  if (!open || !slug) return;

  async function loadProduct() {
    try {
      setLoading(true);

      const res = await fetch(`/api/productchatbot/bot-sell/getProduct/${slug}`);

      if (!res.ok) {
        throw new Error("Fetch failed");
      }

      const data = await res.json();

      setData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  loadProduct();
}, [slug, open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidth="max-w-6xl"
    >
      {loading ? (
        <div className="p-10">
          Đang tải sản phẩm...
        </div>
      ) : data ? (
        <ProductDetailClient data={data} />
      ) : (
        <div className="p-10">
          Không tìm thấy sản phẩm
        </div>
      )}
    </Modal>
  );
}