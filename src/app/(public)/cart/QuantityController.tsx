// components/cart/QuantityController.tsx
'use client';

import { Minus, Plus, Loader2 } from "lucide-react";
import { useState } from "react";

interface QuantityControllerProps {
  initialQuantity: number;
  onUpdate: (newQty: number) => Promise<void>;
}

export function QuantityController({ initialQuantity, onUpdate }: QuantityControllerProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (newQty: number) => {
    if (newQty < 1 || newQty === initialQuantity) return;
    
    setLoading(true);
    await onUpdate(newQty);
    setLoading(false);
  };

  return (
    <div className="flex items-center border border-border rounded-xl w-fit bg-background overflow-hidden shadow-sm">
      <button
        onClick={() => handleUpdate(initialQuantity - 1)}
        disabled={initialQuantity <= 1 || loading}
        className="p-2 hover:bg-muted hover:text-primary transition-colors disabled:opacity-30"
      >
        <Minus size={14} />
      </button>

      <div className="w-10 flex items-center justify-center">
        {loading ? (
          <Loader2 size={12} className="animate-spin text-primary" />
        ) : (
          <span className="text-sm font-bold">{initialQuantity}</span>
        )}
      </div>

      <button
        onClick={() => handleUpdate(initialQuantity + 1)}
        disabled={loading}
        className="p-2 hover:bg-muted hover:text-primary transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
