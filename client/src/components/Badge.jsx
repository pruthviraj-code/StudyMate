const styles = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-green-50 text-green-700 border-green-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Upcoming: 'bg-sky-50 text-sky-700 border-sky-200',
  Completed: 'bg-green-50 text-green-700 border-green-200',
  Overdue: 'bg-red-100 text-red-700 border-red-200',
};

const defaultStyle = 'bg-indigo-50 text-indigo-700 border-indigo-200';

export default function Badge({ label }) {
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[label] || defaultStyle
      }`}
    >
      {label}
    </span>
  );
}
