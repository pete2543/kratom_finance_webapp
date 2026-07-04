type PlaceholderPageProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function PlaceholderPage({
  title,
  description,
  icon,
}: PlaceholderPageProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/12 text-accent">
        {icon}
      </span>
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
    </div>
  );
}
