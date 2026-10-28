import { useEffect, useState } from 'react';
import { api } from '../api';
import ActivityForm from '../components/ActivityForm';
import ActivityList from '../components/ActivityList';
import Message from '../components/Message';
import { buttonPrimary } from '../utils';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadActivities = async () => {
    try {
      const data = await api.getActivities();
      setActivities(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const handleSave = async (data) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.createActivity(data);
      setSuccess('Activity added successfully.');
      setShowForm(false);
      await loadActivities();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (activity) => {
    if (!window.confirm(`Delete "${activity.title}"? This cannot be undone.`)) return;
    setError('');
    setSuccess('');
    try {
      await api.deleteActivity(activity.id);
      setSuccess('Activity deleted.');
      await loadActivities();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Activities</h1>
          <p className="text-slate-500">Exams, seminars, practicals and events.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              setSuccess('');
            }}
            className={buttonPrimary}
          >
            + Add Activity
          </button>
        )}
      </div>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      {showForm && (
        <ActivityForm onSubmit={handleSave} onCancel={() => setShowForm(false)} saving={saving} />
      )}

      {loading ? (
        <p className="text-slate-500">Loading activities...</p>
      ) : activities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No activities yet. Click "Add Activity" to create your first one.
        </div>
      ) : (
        <ActivityList activities={activities} onDelete={handleDelete} />
      )}
    </div>
  );
}
