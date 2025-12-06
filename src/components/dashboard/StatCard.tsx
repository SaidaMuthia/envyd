import { ReactNode } from "react";

interface StatCardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerContent?: ReactNode; // Tambahan untuk fleksibilitas header custom
}

export default function StatCard({ title, icon, children, footer, className = "", headerContent }: StatCardProps) {
  return (
    <div className={`bg-white rounded-[20px] p-6 shadow-sm flex flex-col justify-between h-full min-h-60 transition-all hover:shadow-md ${className}`}>
      
      {/* Header Area */}
      {(title || icon || headerContent) && (
        <div className="flex justify-between items-start mb-4">
           {headerContent ? headerContent : (
             <div className="flex items-center gap-2">
                {icon}
                <span className="font-bold text-[#A3AED0]">{title}</span>
             </div>
           )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full py-2">
        {children}
      </div>

      {/* Footer Area */}
      {footer && (
        <div className="mt-auto pt-2">
          {footer}
        </div>
      )}
    </div>
  );
}