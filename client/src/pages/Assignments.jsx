import { useEffect, useState } from 'react';
import { api } from '../api';
import AssignmentForm from '../components/AssignmentForm';
import AssignmentList from '../components/AssignmentList';
import Message from '../components/Message';
import { inputClass, buttonPrimary, buttonSecondary } from '../utils';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const loadAssignments = async () => {
    try {
      const data = await api.getAssignments();
      setAssignments(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const openAddForm = () => {
    setEditing(null);
    setShowForm(true);
    setSuccess('');
  };

  const openEditForm = (assignment) => {
    setEditing(assignment);
    setShowForm(true);
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSave = async (data) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (editing) {
        await api.updateAssignment(editing.id, data);
        setSuccess('Assignment updated successfully.');
      } else {
        await api.createAssignment(data);
        setSuccess('Assignment added successfully.');
      }
      closeForm();
      await loadAssignments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (assignment) => {
    if (!window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)) return;
    setError('');
    setSuccess('');
    try {
      await api.deleteAssignment(assignment.id);
      setSuccess('Assignment deleted.');
      await loadAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (assignment) => {
    const newStatus = assignment.status === 'Completed' ? 'Pending' : 'Completed';
    setError('');
    setSuccess('');
    try {
      await api.updateAssignmentStatus(assignment.id, newStatus);
      setSuccess(`Marked as ${newStatus}.`);
      await loadAssignments();
    } catch (err) {
      setError(err.message);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setSubjectFilter('All');
  };

  const subjects = [...new Set(assignments.map((a) => a.subject))].sort();

  const filtered = assignments.filter((a) => {
    const text = search.trim().toLowerCase();
    const matchesSearch =
      !text ||
      a.title.toLowerCase().includes(text) ||
      (a.description || '').toLowerCase().includes(text);
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchesSubject = subjectFilter === 'All' || a.subject === subjectFilter;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-slate-500">Track your coursework and deadlines.</p>
        </div>
        {!showForm && (
          <button onClick={openAddForm} className={buttonPrimary}>
            + Add Assignment
          </button>
        )}
      </div>

      {error && <Message type="error">{error}</Message>}
      {success && <Message type="success">{success}</Message>}

      {showForm && (
        <AssignmentForm
          key={editing ? editing.id : 'new'}
          initial={editing}
          onSubmit={handleSave}
          onCancel={closeForm}
          saving={saving}
        />
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search assignments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={inputClass}
        >
          <option value="All">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className={inputClass}
        >
          <option value="All">All subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading assignments...</p>
      ) : assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No assignments yet. Click "Add Assignment" to create your first one.
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          <p className="mb-3">No assignments match your filters.</p>
          <button onClick={clearFilters} className={buttonSecondary}>
            Clear filters
          </button>
        </div>
      ) : (
        <AssignmentList
          assignments={filtered}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
}
