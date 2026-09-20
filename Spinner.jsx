export default function Spinner({ label = 'Working' }) {
  return (
    <span className="inline-flex items-center gap-2 text-[15px] text-muted" role="status">
      <span className="flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-pen animate-pulse-dot" />
        <span className="h-1.5 w-1.5 rounded-full bg-pen animate-pulse-dot [animation-delay:.15s]" />
        <span className="h-1.5 w-1.5 rounded-full bg-pen animate-pulse-dot [animation-delay:.3s]" />
      </span>
      {label}
    </span>
  );
}
