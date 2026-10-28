export const PRIORITIES = ['Low', 'Medium', 'High'];
export const ASSIGNMENT_STATUSES = ['Pending', 'Completed'];
export const ACTIVITY_TYPES = ['Exam', 'Seminar', 'Practical', 'Event', 'Other'];
export const ACTIVITY_STATUSES = ['Upcoming', 'Completed'];

// Today as YYYY-MM-DD in the local timezone (same format as MySQL DATE strings)
export function todayString() {
  return new Date().toLocaleDateString('en-CA');
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

export const buttonPrimary =
  'rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60';

export const buttonSecondary =
  'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50';
