// AdminStatCard.tsx
interface Props {
  title: string;
  value: number;
}

export default function AdminStatCard({ title, value }: Props) {
  return (
    <div className="rounded-xl bg-navbar p-6 shadow-sm">
      <h3 className="text-sm text-nav-text">{title}</h3>

      <p className="mt-2 text-3xl font-bold text-heading">{value}</p>
    </div>
  );
}
