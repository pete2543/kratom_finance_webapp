"use client";

import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar, DateField, DatePicker, Label } from "@heroui/react";

type DueDatePickerProps = {
  value: DateValue | null;
  onChange: (value: DateValue | null) => void;
  disabled?: boolean;
};

function DueDateCalendar() {
  return (
    <Calendar
      aria-label="เลือกวันครบกำหนดชำระ"
      className="due-date-picker__calendar"
    >
      <Calendar.Header className="pb-2">
        <Calendar.YearPickerTrigger>
          <Calendar.YearPickerTriggerHeading />
          <Calendar.YearPickerTriggerIndicator />
        </Calendar.YearPickerTrigger>
        <Calendar.NavButton slot="previous" />
        <Calendar.NavButton slot="next" />
      </Calendar.Header>
      <Calendar.Grid weekdayStyle="short">
        <Calendar.GridHeader>
          {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
        </Calendar.GridHeader>
        <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
      </Calendar.Grid>
      <Calendar.YearPickerGrid>
        <Calendar.YearPickerGridBody>
          {({ year }) => <Calendar.YearPickerCell year={year} />}
        </Calendar.YearPickerGridBody>
      </Calendar.YearPickerGrid>
    </Calendar>
  );
}

export function DueDatePicker({ value, onChange, disabled }: DueDatePickerProps) {
  return (
    <DatePicker
      className="w-full"
      value={value}
      onChange={onChange}
      minValue={today(getLocalTimeZone())}
      isDisabled={disabled}
      aria-label="วันครบกำหนดชำระ"
    >
      <Label>วันครบกำหนดชำระ</Label>
      <DateField.Group fullWidth>
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger aria-label="เปิดปฏิทิน">
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePicker.Popover placement="bottom start" className="due-date-picker__popover">
        <DueDateCalendar />
      </DatePicker.Popover>
    </DatePicker>
  );
}

export function dueDateToIso(value: DateValue | null): string | undefined {
  if (!value) return undefined;
  return value.toString();
}
