import Link from "next/link";

import { FaLeaf } from "react-icons/fa6";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  href?: string;
  showLink?: boolean;
  showTagline?: boolean;
  size?: "sm" | "md";
};

const sizeStyles = {
  sm: {
    wrap: "gap-2.5",
    icon: "h-9 w-9 rounded-xl",
    leaf: 15,
    kratom: "text-[9px] tracking-[0.26em]",
    finance: "text-[1.05rem]",
    tm: "text-[7px]",
    tagline: "mt-1.5 text-[10px]",
  },
  md: {
    wrap: "gap-3",
    icon: "h-11 w-11 rounded-2xl",
    leaf: 19,
    kratom: "text-[11px] tracking-[0.32em]",
    finance: "text-[1.4rem]",
    tm: "text-[8px]",
    tagline: "mt-2 text-xs",
  },
} as const;

function BrandMarkContent({
  size = "md",
  showTagline = false,
}: Pick<BrandMarkProps, "size" | "showTagline">) {
  const s = sizeStyles[size];

  return (
    <div className={cn("flex min-w-0 items-center", s.wrap)}>
      <span
        aria-hidden
        className={cn(
          "brand-mark__icon flex shrink-0 items-center justify-center",
          s.icon,
        )}
      >
        <FaLeaf size={s.leaf} />
      </span>

      <div className="min-w-0">
        <div className="flex flex-col leading-none">
          <span className={cn("brand-mark__kratom", s.kratom)}>KRATOM</span>
          <span className={cn("brand-mark__finance mt-1", s.finance)}>
            Finance
            <sup className={cn("brand-mark__tm ml-0.5 font-normal", s.tm)}>
              TM
            </sup>
          </span>
        </div>
        {showTagline ? (
          <p className={cn("text-muted", s.tagline)}>ระบบรายรับรายจ่าย</p>
        ) : null}
      </div>
    </div>
  );
}

export function BrandMark({
  className,
  href = "/",
  showLink = true,
  showTagline = false,
  size = "md",
}: BrandMarkProps) {
  const content = <BrandMarkContent size={size} showTagline={showTagline} />;

  if (!showLink) {
    return <div className={cn("inline-flex min-w-0", className)}>{content}</div>;
  }

  return (
    <Link
      href={href}
      aria-label={siteConfig.name}
      className={cn(
        "inline-flex min-w-0 transition-opacity active:opacity-80",
        className,
      )}
    >
      {content}
    </Link>
  );
}

/** @deprecated ใช้ BrandMark แทน */
export const BrandLogo = BrandMark;
