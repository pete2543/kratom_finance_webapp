"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Label } from "@heroui/react";

import { CameraIcon } from "@/components/icons";

type ProductPhotoFieldProps = {
  photo: File | null;
  onPhotoChange: (file: File | null) => void;
  disabled?: boolean;
};

export function ProductPhotoField({
  photo,
  onPhotoChange,
  disabled = false,
}: ProductPhotoFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  return (
    <div className="space-y-2">
      <Label>รูปสินค้า</Label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled}
        onChange={(e) => onPhotoChange(e.target.files?.[0] ?? null)}
      />

      {previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-separator">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="ตัวอย่างรูปสินค้า"
            className="aspect-square w-full object-cover"
          />
          <div className="flex gap-2 border-t border-separator p-3">
            <Button
              variant="secondary"
              className="flex-1"
              onPress={() => fileInputRef.current?.click()}
              isDisabled={disabled}
            >
              เปลี่ยนรูป
            </Button>
            <Button
              variant="tertiary"
              className="flex-1"
              onPress={() => onPhotoChange(null)}
              isDisabled={disabled}
            >
              ลบรูป
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-separator bg-default/40 px-4 py-8 text-muted transition-colors active:bg-default"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent">
            <CameraIcon width={24} height={24} />
          </span>
          <span className="text-sm font-medium text-foreground">
            ถ่ายรูปหรือเลือกจากแกลเลอรี
          </span>
          <span className="text-xs">ใช้แสดงในรายการสินค้าและหน้าอื่นๆ</span>
        </button>
      )}
    </div>
  );
}
