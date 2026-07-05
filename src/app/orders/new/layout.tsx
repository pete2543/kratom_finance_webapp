type SellLayoutProps = {
  children: React.ReactNode;
};

/** ยกเลิก padding ของ bottom nav — หน้านี้ซ่อน nav และใช้ action bar ชิดล่าง */
export default function SellLayout({ children }: SellLayoutProps) {
  return (
    <div className="-mb-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom,0px))] lg:mb-0">
      {children}
    </div>
  );
}
