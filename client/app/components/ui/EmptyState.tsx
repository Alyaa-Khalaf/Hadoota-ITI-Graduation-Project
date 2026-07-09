/**
 * Empty State Component
 * Used across the app when there's no data to display
 */

import { Card, CardContent } from "./Card";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed bg-muted/50">
      <CardContent className="pt-12 pb-12 text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
            {description}
          </p>
        )}
        {action && (
          <Button onClick={action.onClick} size="lg">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
