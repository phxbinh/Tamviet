import React from 'react';
import { ShieldCheck, ArrowRight, Scale, CreditCard, Truck, ShoppingBag, FileText } from 'lucide-react';

const SupportPolicies = () => {
  const policies = [
    { title: "Chính sách bảo mật", icon: <ShieldCheck size={18} /> },
    { title: "Chính sách đổi trả", icon: <ArrowRight size={18} /> },
    { title: "Chính sách thanh toán", icon: <CreditCard size={18} /> },
    { title: "Chính sách vận chuyển", icon: <Truck size={18} /> },
    { title: "Chính sách mua hàng", icon: <ShoppingBag size={18} /> },
    { title: "Điều khoản dịch vụ", icon: <FileText size={18} /> },
  ];

  return (
    <div className="w-full max-w-sm p-6 bg-card border border-border rounded-xl shadow-sm transition-all duration-300">
      {/* Header Section: Tạo sự nghiêm túc & rõ ràng */}
      <div className="mb-6 pb-4 border-b border-border/60">
        <h3 className="text-sm font-bold tracking-widest text-foreground uppercase flex items-center gap-2">
          <Scale size={20} className="text-primary" />
          Hỗ trợ & Pháp lý
        </h3>
        <p className="text-xs text-foreground/60 mt-2 font-medium">
          Cam kết minh bạch và quyền lợi khách hàng
        </p>
      </div>

      {/* Policy List */}
      <nav className="flex flex-col gap-1">
        {policies.map((policy, index) => (
          <a
            key={index}
            href="#"
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <span className="text-foreground/40 group-hover:text-primary transition-colors">
                {policy.icon}
              </span>
              <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                {policy.title}
              </span>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight size={14} className="text-primary" />
            </div>
          </a>
        ))}
      </nav>

      {/* Footer nhỏ: Tạo sự đồng thuận */}
      <div className="mt-8 pt-4 border-t border-border/40 text-[10px] text-center text-foreground/40 italic">
        Bằng việc sử dụng dịch vụ, bạn đã đồng ý với các điều khoản nêu trên.
      </div>
    </div>
  );
};

export default SupportPolicies;
