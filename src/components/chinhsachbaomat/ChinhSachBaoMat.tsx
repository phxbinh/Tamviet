import React from 'react';
import { ShieldCheck, CreditCard, Truck, ShoppingBag, FileText, RefreshCw, ChevronDown, Scale } from 'lucide-react';

const PolicyAccordion = () => {
  const policies = [
    { 
      title: "Chính sách bảo mật", 
      icon: <ShieldCheck size={18} />, 
      content: "Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn với tiêu chuẩn mã hóa cao nhất. Thông tin chỉ được sử dụng để cải thiện trải nghiệm dịch vụ." 
    },
    { 
      title: "Chính sách đổi trả", 
      icon: <RefreshCw size={18} />, 
      content: "Hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu có lỗi từ nhà sản xuất. Quy trình nhanh chóng, minh bạch." 
    },
    { 
      title: "Chính sách thanh toán", 
      icon: <CreditCard size={18} />, 
      content: "Hỗ trợ đa dạng phương thức: Thẻ nội địa, Quốc tế, Ví điện tử và COD. Mọi giao dịch đều được giám sát bởi hệ thống an ninh ngân hàng." 
    },
    { 
      title: "Chính sách vận chuyển", 
      icon: <Truck size={18} />, 
      content: "Hợp tác với các đơn vị vận chuyển uy tín. Thời gian giao hàng dự kiến từ 2-4 ngày làm việc tùy khu vực." 
    },
    { 
      title: "Chính sách mua hàng", 
      icon: <ShoppingBag size={18} />, 
      content: "Hướng dẫn chi tiết từng bước đặt hàng, kiểm tra giỏ hàng và xác nhận đơn hàng qua Email/SMS." 
    },
    { 
      title: "Điều khoản dịch vụ", 
      icon: <FileText size={18} />, 
      content: "Quy định về quyền và trách nhiệm của người dùng khi truy cập website. Đảm bảo môi trường mua sắm văn minh, công bằng." 
    },
  ];

  return (
    <section className="w-full px-4 py-12 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Tiêu đề chính - Nghiêm túc & Minh bạch */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="p-3 rounded-full bg-primary/10 mb-4">
            <Scale className="text-primary" size={28} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground uppercase">Trung tâm Hỗ trợ & Pháp lý</h2>
          <p className="mt-2 text-foreground/60 max-w-md text-sm">
            Mọi hoạt động của chúng tôi đều dựa trên sự đồng thuận và minh bạch tuyệt đối với khách hàng.
          </p>
        </div>

        {/* Grid System: 1 cột trên Mobile, 2 cột từ Landscape (sm/md) trở lên */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((policy, index) => (
            <details 
              key={index} 
              className="group border border-border rounded-xl bg-card transition-all duration-300 hover:shadow-md overflow-hidden"
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none select-none">
                <div className="flex items-center gap-4">
                  <span className="text-primary/70 group-hover:text-primary transition-colors">
                    {policy.icon}
                  </span>
                  <span className="text-[15px] font-semibold text-foreground/90 tracking-wide">
                    {policy.title}
                  </span>
                </div>
                <ChevronDown 
                  size={18} 
                  className="text-foreground/30 transition-transform duration-300 group-open:rotate-180" 
                />
              </summary>
              
              <div className="px-5 pb-5 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="pl-9 border-l-2 border-primary/20 text-sm leading-relaxed text-foreground/70">
                  {policy.content}
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* Footer ghi chú sự đồng thuận */}
        <p className="mt-12 text-center text-[11px] text-foreground/40 uppercase tracking-[0.2em]">
          Bằng việc tiếp tục sử dụng, bạn xác nhận đã đọc và đồng ý với các điều khoản trên.
        </p>
      </div>
    </section>
  );
};

export default PolicyAccordion;
