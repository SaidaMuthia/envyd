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
    <div className={`bg-white p-5 rounded-[30px] shadow-[0_20px_25px_-5px_rgba(112,144,176,0.1)] flex flex-col justify-between h-full min-h-[220px] transition-all hover:shadow-lg ${className}`}>
      {/* Header Card */}
      <div className="flex items-center gap-2 text-[#A3AED0] mb-2">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>

      {/* Main Content */}
      <div className="grow flex flex-col items-center justify-center w-full">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-3">
        {footer}
      </div>
    </div>
  );
}