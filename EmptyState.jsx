import { Link } from 'react-router-dom';

export default function EmptyState({ title, body, actionLabel, actionTo, onAction, icon: Icon }) {
  return (
    <div className="card-quiet ruled grid place-items-center px-6 py-14 text-center">
      {Icon && (
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-surface text-pen shadow-card">
          <Icon size={22} />
        </span>
      )}
      <h3 className="font-display text-xl">{title}</h3>
      {body && <p className="mt-2 max-w-md text-[15px] text-muted">{body}</p>}
      {actionTo && (
        <Link to={actionTo} className="btn btn-primary mt-5">
          {actionLabel}
        </Link>
      )}
      {!actionTo && onAction && (
        <button onClick={onAction} className="btn btn-primary mt-5">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
