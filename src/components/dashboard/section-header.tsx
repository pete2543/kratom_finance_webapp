import Link from "next/link";

import { ArrowRightIcon } from "@/components/icons";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
};

export function SectionHeader({
  title,
  actionLabel,
  actionHref,
}: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="group flex items-center gap-0.5 text-sm font-medium text-accent transition-opacity hover:opacity-80"
        >
          {actionLabel}
          <ArrowRightIcon
            width={16}
            height={16}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  );
}
