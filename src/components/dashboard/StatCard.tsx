import { ReactNode } from "react";

interface StatCardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  headerContent?: ReactNode;
}

export default function StatCard({ title, icon, children, footer, className = "", headerContent }: StatCardProps) {
  return (
    // UBAH: min-h-60 -> min-h-52, p-6 -> p-5
    <div className={`bg-white rounded-[20px] p-5 shadow-sm flex flex-col justify-between h-full min-h-52 transition-all hover:shadow-md ${className}`}>
      
      {/* Header Area */}
      {(title || icon || headerContent) && (
        <div className="flex justify-between items-start mb-2"> {/* UBAH: mb-4 -> mb-2 */}
           {headerContent ? headerContent : (
             <div className="flex items-center gap-2">
                {icon}
                <span className="font-bold text-[#A3AED0]">{title}</span>
             </div>
           )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center w-full py-1"> {/* UBAH: py-2 -> py-1 */}
        {children}
      </div>

      {/* Footer Area */}
      {footer && (
        <div className="mt-auto pt-1"> {/* UBAH: pt-2 -> pt-1 */}
          {footer}
        </div>
      )}
    </div>
  );
}