const COLORS = [
  "bg-indigo-600", "bg-emerald-600", "bg-amber-600",
  "bg-pink-600", "bg-cyan-600", "bg-violet-600", "bg-rose-600",
];

function colorFor(initials: string) {
  const idx = initials.charCodeAt(0) % COLORS.length;
  return COLORS[idx];
}

interface AvatarProps {
  initials: string;
  size?: "xs" | "sm" | "md" | "lg";
}

export function Avatar({ initials, size = "md" }: AvatarProps) {
  const sz = {
    xs: "w-6 h-6 text-xs",
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  }[size];

  return (
    <div className={`${sz} ${colorFor(initials)} rounded-full text-white flex items-center justify-center font-semibold flex-shrink-0 select-none`}>
      {initials}
    </div>
  );
}
