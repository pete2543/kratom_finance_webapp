"use client";

function getGreeting(hour: number) {
  if (hour < 12) return "สวัสดีตอนเช้า";
  if (hour < 17) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

export function DashboardGreeting() {
  const now = new Date();
  const today = now.toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const greeting = getGreeting(now.getHours());

  return (
    <header
      className="dashboard-stagger mb-5"
      style={{ "--stagger": 0 } as React.CSSProperties}
    >
      <p className="text-sm text-muted">{today}</p>
      <h1 className="mt-0.5 text-xl font-semibold tracking-tight sm:text-2xl">
        {greeting},{" "}
        <span className="bg-gradient-to-r from-brand-kratom to-accent bg-clip-text text-transparent">
          ร้านกระท่อม
        </span>
      </h1>
    </header>
  );
}
