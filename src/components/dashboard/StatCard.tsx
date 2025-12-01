import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function StatCard({ title, icon, children, footer, className = "" }: StatCardProps) {
  return (
    <div className={`bg-white p-6 rounded-[2.5rem] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] flex flex-col justify-between h-full min-h-60 ${className}`}>
      {/* Header Card */}
      <div className="flex items-center gap-2 text-gray-500 mb-2">
        {icon}
        <span className="font-semibold text-sm">{title}</span>
      </div>

      {/* Main Visual Content */}
      <div className="grow flex flex-col items-center justify-center py-2 w-full">
        {children}
      </div>

      {/* Footer Text */}
      <div className="mt-2">
        {footer}
      </div>
    </div>
  );
}