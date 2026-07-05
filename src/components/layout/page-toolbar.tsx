import { Card } from "@heroui/react";

import { PageSearchField } from "@/components/layout/page-search-field";
import {
  SegmentedControl,
  type SegmentedControlItem,
} from "@/components/layout/segmented-control";

type PageToolbarProps<T extends string> = {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchAriaLabel?: string;
  filters?: SegmentedControlItem<T>[];
  filter?: T;
  onFilterChange?: (value: T) => void;
  filterAriaLabel?: string;
  children?: React.ReactNode;
};

export function PageToolbar<T extends string>({
  search,
  onSearchChange,
  searchPlaceholder,
  searchAriaLabel,
  filters,
  filter,
  onFilterChange,
  filterAriaLabel,
  children,
}: PageToolbarProps<T>) {
  return (
    <Card className="ds-card mb-4">
      <Card.Content className="space-y-3 p-3">
        <PageSearchField
          value={search}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          aria-label={searchAriaLabel}
        />
        {filters && filter !== undefined && onFilterChange ? (
          <SegmentedControl
            items={filters}
            value={filter}
            onChange={onFilterChange}
            ariaLabel={filterAriaLabel}
          />
        ) : null}
        {children}
      </Card.Content>
    </Card>
  );
}
