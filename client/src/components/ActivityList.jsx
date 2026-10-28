import Badge from './Badge';
import { formatDate } from '../utils';

export default function ActivityList({ activities, onDelete }) {
  return (
    <ul className="space-y-3">
      {activities.map((a) => (
        <li
          key={a.id}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800">{a.title}</h3>
            <p className="text-sm text-slate-500">{formatDate(a.activity_date)}</p>
            {a.description && (
              <p className="mt-1 break-words text-sm text-slate-600">{a.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge label={a.activity_type} />
              <Badge label={a.status} />
            </div>
          </div>

          <button
            onClick={() => onDelete(a)}
            className="shrink-0 self-start rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-rose-400 hover:bg-red-50"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
