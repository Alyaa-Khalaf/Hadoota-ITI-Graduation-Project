import React from "react";

type AdventureHeaderProps = {
  header: string;
  subHeader?: string;
};

export default function AdventureHeader({
  header,
  subHeader,
}: AdventureHeaderProps) {
  return (
    <div className="py-4 sm:py-6 flex justify-center" dir="rtl">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
          {header}
        </h2>
        {subHeader && (
          <p className="text-sm sm:text-base text-muted-foreground font-medium">
            {subHeader}
          </p>
        )}
      </div>
    </div>
  );
}