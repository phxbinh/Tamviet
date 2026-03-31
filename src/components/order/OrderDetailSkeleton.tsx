// src/components/order/OrderDetailSkeleton.tsx
export default function OrderDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
      <div className="h-4 w-1/4 bg-gray-200 rounded"></div>

      <div className="border rounded-xl p-4 space-y-4">
        <div className="h-5 w-1/2 bg-gray-300 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
      </div>

      <div className="border rounded-xl p-4 space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="flex justify-between border p-3 rounded-lg"
          >
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
              <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-1 text-right">
              <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
              <div className="h-4 w-16 bg-gray-300 rounded mx-auto"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-xl p-4 space-y-2">
        <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}