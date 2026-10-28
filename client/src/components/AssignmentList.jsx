import Badge from './Badge';
import { formatDate, todayString, buttonSecondary } from '../utils';

// Action buttons are only shown when handlers are passed (the dashboard shows a read-only list)
export default function AssignmentList({ assignments, onEdit, onDelete, onToggle }) {
  const today = todayString();

  return (
    <ul className="space-y-3">
      {assignments.map((a) => {
        const overdue = a.status === 'Pending' && a.due_date < today;
        const done = a.status === 'Completed';

        return (
          <li
            key={a.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0">
              <h3 className={`font-semibold ${done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                {a.title}
              </h3>
              <p className="text-sm text-slate-500">
                {a.subject} · Due {formatDate(a.due_date)}
              </p>
              {a.description && (
                <p className="mt-1 break-words text-sm text-slate-600">{a.description}</p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge label={a.priority} />
                <Badge label={a.status} />
                {overdue && <Badge label="Overdue" />}
              </div>
            </div>

            {onEdit && (
              <div className="flex shrink-0 flex-wrap gap-2">
                <button onClick={() => onToggle(a)} className={buttonSecondary}>
                  {done ? 'Mark Pending' : 'Mark Completed'}
                </button>
                <button onClick={() => onEdit(a)} className={buttonSecondary}>
                  Edit
                </button>
                <button
                  onClick={() => onDelete(a)}
                  className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-400 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
