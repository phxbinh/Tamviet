'use client';

export function UserAvatar({ email, avatarUrl, size = "md" }: { email: string; avatarUrl?: string | null; size?: "sm" | "md" | "lg" }) {
  const initial = email?.charAt(0).toUpperCase() || "U";
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };

  return (
    <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border border-border bg-card shadow-inner shrink-0`}>
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center font-bold text-neon-cyan">
          {initial}
        </div>
      )}
    </div>
  );
}