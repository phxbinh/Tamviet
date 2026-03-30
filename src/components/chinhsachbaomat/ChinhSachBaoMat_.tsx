import React from 'react';
import { ShieldCheck, CreditCard, Truck, ShoppingBag, FileText, RefreshCw, ChevronDown, Scale } from 'lucide-react';

const PolicyAccordion = () => {
  const policies = [
    { 
      title: "CHÍNH SÁCH BẢO MẬT", 
      icon: <ShieldCheck size={18} />, 
      content: "Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn với tiêu chuẩn mã hóa cao nhất. Thông tin chỉ được sử dụng để cải thiện trải nghiệm dịch vụ." 
    },
    { 
      title: "CHÍNH SÁCH ĐỔI TRẢ", 
      icon: <RefreshCw size={18} />, 
      content: "Hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng nếu có lỗi từ nhà sản xuất. Quy trình nhanh chóng, minh bạch." 
    },
    { 
      title: "CHÍNH SÁCH THANH TOÁN", 
      icon: <CreditCard size={18} />, 
      content: "Hỗ trợ đa dạng phương thức: Thẻ nội địa, Quốc tế, Ví điện tử và COD. Mọi giao dịch đều được giám sát bởi hệ thống an ninh ngân hàng." 
    },
    { 
      title: "CHÍNH SÁCH VẬN CHUYỂN", 
      icon: <Truck size={18} />, 
      content: "Hợp tác với các đơn vị vận chuyển uy tín. Thời gian giao hàng dự kiến từ 2-4 ngày làm việc tùy khu vực." 
    },
    { 
      title: "CHÍNH SÁCH MUA HÀNG", 
      icon: <ShoppingBag size={18} />, 
      content: "Hướng dẫn chi tiết từng bước đặt hàng, kiểm tra giỏ hàng và xác nhận đơn hàng qua Email/SMS." 
    },
    { 
      title: "ĐIỀU KHOẢN DỊCH VỤ", 
      icon: <FileText size={18} />, 
      content: "Quy định về quyền và trách nhiệm của người dùng khi truy cập website. Đảm bảo môi trường mua sắm văn minh, công bằng." 
    },
  ];

  return (
    <section className="w-full bg-background text-foreground py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header - Style đồng bộ với CSS biến số 2 */}
        <div className="mb-8 border-b border-border pb-6">
           <h2 className="text-xl font-bold tracking-wider uppercase flex items-center gap-3">
             <div className="p-2 rounded-lg bg-primary/10">
                <Scale size={20} className="text-primary" />
             </div>
             Trung tâm Hỗ trợ & Pháp lý
           </h2>
           <p className="mt-2 text-foreground/60 text-sm">
             Mọi hoạt động của chúng tôi đều dựa trên sự đồng thuận và minh bạch tuyệt đối.
           </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col">
          {policies.map((policy, index) => (
            <details 
              key={index} 
              className="group border-b border-border last:border-b-0"
            >
              <summary className="flex items-center justify-between py-4 cursor-pointer list-none select-none hover:bg-primary/5 transition-colors px-2 rounded-lg">
                <div className="flex items-center gap-4">
                  {/* Icon từ list (Số 1) kết hợp style mũi tên (Số 2) */}
                  <div className="text-primary/70 group-hover:text-primary transition-colors">
                    {policy.icon}
                  </div>
                  <span className="text-[14px] font-bold tracking-[0.05em] uppercase text-foreground/90">
                    {policy.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <ChevronDown 
                    size={18} 
                    className="text-foreground/40 transition-transform duration-300 group-open:rotate-180" 
                  />
                </div>
              </summary>
              
              {/* Nội dung sử dụng animation định nghĩa ở số 2 */}
              <div className="px-12 pb-6 text-sm leading-relaxed text-foreground/70 animate-in fade-in">
                <div className="pl-4 border-l border-primary/30">
                  {policy.content}
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* Bottom Footer - Theo style Overstock của số 2 */}
        <div className="mt-12 pt-8 border-t border-border text-[12px] text-foreground/50 space-y-4">
          <p className="font-medium">© 2026 Tâm Việt Platform</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 underline underline-offset-4">
            <a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-primary transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-primary transition-colors">Yêu cầu hỗ trợ</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolicyAccordion;
