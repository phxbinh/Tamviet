import { ArrowUpRight, CheckCircle2, Clock, ListTodo } from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    { label: 'Tổng nhiệm vụ', value: '12', icon: ListTodo, color: 'text-blue-500' },
    { label: 'Đang thực hiện', value: '05', icon: Clock, color: 'text-amber-500' },
    { label: 'Đã hoàn thành', value: '07', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chào buổi sáng!</h1>
        <p className="text-muted-foreground mt-1 text-sm">Hôm nay bạn có 5 nhiệm vụ cần xử lý.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card/20 border border-border/40 p-6 rounded-3xl group hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <button className="text-muted-foreground hover:text-white transition-colors">
                <ArrowUpRight size={20} />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-1 tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder cho danh sách Todo sắp tới */}
      <div className="bg-card/10 border border-dashed border-border/40 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
          <ListTodo size={32} className="text-muted-foreground/40" />
        </div>
        <h3 className="font-medium text-muted-foreground">Chưa có nhiệm vụ mới nào</h3>
        <p className="text-xs text-muted-foreground/60 mt-1">Hãy nhấn nút "Thêm nhiệm vụ" để bắt đầu.</p>
      </div>
    </div>
  );
}
