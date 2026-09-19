export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <span className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );
}
