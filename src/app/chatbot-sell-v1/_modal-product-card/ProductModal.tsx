// src/components/modals/ProductModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import ProductDetailClient from './ProductDetailClient';

interface ProductModalProps {
  slug: string;
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

  useEffect(() => {
    if (!open) return;

    setLoading(true);

    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
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