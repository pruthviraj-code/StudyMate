export default function Message({ type = 'error', children }) {
  const styles =
    type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-green-200 bg-green-50 text-green-700';

  return (
    <div role="alert" className={`mb-4 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
