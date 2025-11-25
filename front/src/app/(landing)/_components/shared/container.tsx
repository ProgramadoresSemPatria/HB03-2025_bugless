import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("mx-auto max-w-[1440px] px-6 md:px-12 lg:px-20", className)}>
      {children}
    </div>
  );
}
