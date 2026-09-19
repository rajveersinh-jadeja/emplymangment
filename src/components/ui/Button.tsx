import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "success" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:   "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600",
  secondary: "bg-white hover:bg-slate-50 text-slate-700 border-slate-200",
  danger:    "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
  success:   "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200",
  ghost:     "bg-transparent hover:bg-slate-100 text-slate-600 border-transparent",
};

const SIZES: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({ variant = "secondary", size = "md", loading, children, disabled, className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 font-medium rounded-lg border transition-all
        focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {loading && (
        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
