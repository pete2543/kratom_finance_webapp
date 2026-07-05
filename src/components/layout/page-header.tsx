type PageHeaderProps = {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, action }: PageHeaderProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-muted">{eyebrow}</p>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
