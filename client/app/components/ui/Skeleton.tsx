/**
 * Loading Skeleton Component
 * Used for placeholder content while loading
 */

import { Card } from "./Card";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`bg-muted animate-pulse rounded-lg ${className}`} />;
}

interface CardSkeletonProps {
  count?: number;
  height?: string;
}

/**
 * Card skeleton loader - useful for list loading states
 */
export function CardSkeleton({ count = 3, height = "h-32" }: CardSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-2">
          <div className={`${height} rounded-lg bg-muted animate-pulse`} />
        </Card>
      ))}
    </div>
  );
}

/**
 * Grid skeleton loader
 */
export function GridSkeleton({
  count = 6,
  columns = 3,
}: {
  count?: number;
  columns?: number;
}) {
  const colClass = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[columns] || "grid-cols-3";

  return (
    <div className={`grid ${colClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-2">
          <div className="h-40 rounded-lg bg-muted animate-pulse" />
        </Card>
      ))}
    </div>
  );
}
