"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * حدوتة brand logo — one reusable component for the whole app.
 *
 * variant="wordmark"  → crisp CSS gradient text + sparkle (navbars, headers)
 * variant="image"     → the full illustrated logo (auth pages, footer, hero)
 *
 * Wrap in a link by passing `href`. Size presets keep it consistent everywhere.
 */

type LogoVariant = "wordmark" | "image";
type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  href?: string;
  showIcon?: boolean;
  className?: string;
  priority?: boolean;
}

const wordmarkSize: Record<LogoSize, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
};

const iconSize: Record<LogoSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-7 h-7",
};

const imageDims: Record<LogoSize, number> = {
  sm: 48,
  md: 72,
  lg: 120,
  xl: 200,
};

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2.5c.3 0 .56.2.64.49l1.2 4.02a2 2 0 0 0 1.35 1.35l4.02 1.2a.67.67 0 0 1 0 1.28l-4.02 1.2a2 2 0 0 0-1.35 1.35l-1.2 4.02a.67.67 0 0 1-1.28 0l-1.2-4.02a2 2 0 0 0-1.35-1.35l-4.02-1.2a.67.67 0 0 1 0-1.28l4.02-1.2a2 2 0 0 0 1.35-1.35l1.2-4.02A.67.67 0 0 1 12 2.5Z"
        fill="url(#logoSparkleGradient)"
      />
      <circle cx="19" cy="5" r="1.4" fill="url(#logoSparkleGradient)" opacity="0.85" />
      <defs>
        <linearGradient id="logoSparkleGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C4D9E" />
          <stop offset="0.5" stopColor="#3AA89A" />
          <stop offset="1" stopColor="#D5456E" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function Logo({
  variant = "wordmark",
  size = "md",
  href,
  showIcon = true,
  className = "",
  priority = false,
}: LogoProps) {
  const inner =
    variant === "image" ? (
      <Image
        src="/assets/logo.jpg"
        alt="حدوتة"
        width={imageDims[size]}
        height={imageDims[size]}
        priority={priority}
        className="h-auto w-auto object-contain select-none"
      />
    ) : (
      <span className="group inline-flex items-center gap-2">
        {showIcon && (
          <Sparkle
            className={`${iconSize[size]} shrink-0 transition-transform duration-300 group-hover:rotate-[18deg] group-hover:scale-110`}
          />
        )}
        <span
          className={`logo-gradient font-black tracking-tight leading-none ${wordmarkSize[size]}`}
        >
          حدوتة
        </span>
      </span>
    );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="حدوتة"
        className={`inline-flex items-center transition-transform duration-300 hover:scale-[1.03] ${className}`}
      >
        {inner}
      </Link>
    );
  }

  return <span className={`inline-flex items-center ${className}`}>{inner}</span>;
}
