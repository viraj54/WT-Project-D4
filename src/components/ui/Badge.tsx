import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IssueStatus } from "../../types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  status: IssueStatus;
  className?: string;
}

export function Badge({ status, className }: BadgeProps) {
  const styles = {
    pending: 'bg-accent-100 text-accent-700 border-accent-200',
    in_progress: 'bg-primary-100 text-primary-700 border-primary-200',
    resolved: 'bg-secondary-100 text-secondary-700 border-secondary-200',
  };

  const labels = {
    pending: 'Pending',
    in_progress: 'In Progress',
    resolved: 'Resolved',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
