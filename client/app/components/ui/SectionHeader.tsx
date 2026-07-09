/**
 * Section Header Component
 * Used for consistent section titles across the app
 */

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`py-4 sm:py-6 space-y-1 ${className}`} dir="rtl">
      <h2 className="text-3xl sm:text-4xl font-bold text-primary">
        {title}
      </h2>
      {description && (
        <p className="text-sm sm:text-base text-muted-foreground font-medium">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Section Divider Component
 * Visual separator between sections
 */
export function SectionDivider() {
  return <div className="h-px bg-border my-8 sm:my-12" />;
}

/**
 * Section Container
 * Wrapper component for sections with consistent spacing
 */
interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  title,
  description,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={`space-y-6 ${className}`}>
      <SectionHeader title={title} description={description} />
      {children}
    </section>
  );
}
