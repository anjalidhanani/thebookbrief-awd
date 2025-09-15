export default function DivLoader({ className }: { className?: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className={`animate-spin rounded-full border-2 ${className}`}></div>
    </div>
  );
}
