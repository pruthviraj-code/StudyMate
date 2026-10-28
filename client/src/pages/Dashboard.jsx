import { useEffect, useState } from 'react';
import { api } from '../api';
import StatCard from '../components/StatCard';
import AssignmentList from '../components/AssignmentList';
import Badge from '../components/Badge';
import Message from '../components/Message';
import { formatDate, todayString, buttonPrimary } from '../utils';

export default function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [statsData, assignmentData] = await Promise.all([
          api.getStats(),
          api.getAssignments(),
        ]);
        setStats(statsData);
        setAssignments(assignmentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-slate-500">Loading dashboard...</p>;
  if (error) return <Message type="error">{error}</Message>;

  const today = todayString();
  const upcomingDeadlines = assignments
    .filter((a) => a.status === 'Pending')
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5);
  const recentAssignments = assignments.slice(0, 5); // API returns newest first

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-slate-500">Here is an overview of your academic work.</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Assignments" value={stats.totalAssignments} accent="text-indigo-600" />
        <StatCard label="Pending" value={stats.pendingAssignments} accent="text-amber-600" />
        <StatCard label="Completed" value={stats.completedAssignments} accent="text-green-600" />
        <StatCard label="Upcoming Activities" value={stats.upcomingActivities} accent="text-sky-600" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Upcoming Deadlines</h2>
          {upcomingDeadlines.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              No pending deadlines. You are all caught up!
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm">
              {upcomingDeadlines.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.title}</p>
                    <p className="text-sm text-slate-500">{a.subject}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm text-slate-600">{formatDate(a.due_date)}</p>
                    {a.due_date < today && <Badge label="Overdue" />}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Recent Assignments</h2>
          {recentAssignments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
              <p className="mb-3">No assignments yet.</p>
              <button onClick={() => onNavigate('assignments')} className={buttonPrimary}>
                Add your first assignment
              </button>
            </div>
          ) : (
            <AssignmentList assignments={recentAssignments} />
          )}
        </section>
      </div>
    </div>
  );
}
