import { cn } from "@/lib/utils";
import { CircleAlert } from "lucide-react";

export default function Pill({
  className,
  message
}: {
  className?: string;
  message: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center w-fit gap-2 text-xs font-bold bg-destructive/80 text-destructive-foreground px-2 py-1 rounded-md",
        className
      )}
    >
      <CircleAlert size={16} />
      <span>{message}</span>
    </div>
  );
}
