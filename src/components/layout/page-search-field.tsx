"use client";

import { SearchField } from "@heroui/react";

import { SearchIcon } from "@/components/icons";

type PageSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  "aria-label"?: string;
};

export function PageSearchField({
  value,
  onChange,
  placeholder = "ค้นหา...",
  "aria-label": ariaLabel,
}: PageSearchFieldProps) {
  return (
    <SearchField
      fullWidth
      value={value}
      onChange={onChange}
      aria-label={ariaLabel ?? placeholder}
    >
      <SearchField.Group>
        <SearchField.SearchIcon>
          <SearchIcon width={16} height={16} />
        </SearchField.SearchIcon>
        <SearchField.Input placeholder={placeholder} />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
}
