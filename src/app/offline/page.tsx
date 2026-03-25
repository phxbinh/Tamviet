export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">📡</span>
      </div>
      <h1 className="text-2xl font-bold mb-2">Mất kết nối mạng</h1>
      <p className="text-muted-foreground mb-8">
        Có vẻ bạn đang ở vùng sóng yếu. Đừng lo, các sản phẩm bạn đã xem vẫn có thể xem lại được!
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-black text-white rounded-full font-medium"
      >
        Thử lại
      </button>
    </div>
  );
}
