export default function StatCard({ label, value, hint, icon: Icon, tone = 'pen' }) {
  const toneClass = { pen: 'text-pen', mint: 'text-mint', coral: 'text-coral' }[tone] || 'text-pen';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold text-muted">{label}</p>
        {Icon && <Icon size={18} className={toneClass} />}
      </div>
      <p className="mt-2 font-display text-[34px] leading-none">{value}</p>
      {hint && <p className="mt-2 text-[14px] text-muted">{hint}</p>}
    </div>
  );
}
