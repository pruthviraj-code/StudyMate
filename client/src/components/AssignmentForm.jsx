import { useState } from 'react';
import Field from './Field';
import { PRIORITIES, ASSIGNMENT_STATUSES, inputClass, buttonPrimary, buttonSecondary } from '../utils';

const emptyForm = {
  title: '',
  subject: '',
  description: '',
  due_date: '',
  priority: 'Medium',
  status: 'Pending',
};

export default function AssignmentForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(
    initial ? { ...emptyForm, ...initial, description: initial.description || '' } : emptyForm
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.due_date) newErrors.due_date = 'Due date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold">
        {initial ? 'Edit Assignment' : 'Add Assignment'}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *" error={errors.title}>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Subject *" error={errors.subject}>
          <input name="subject" value={form.subject} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Due Date *" error={errors.due_date}>
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
        <Field label="Priority">
          <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
            {PRIORITIES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            {ASSIGNMENT_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button type="submit" disabled={saving} className={buttonPrimary}>
          {saving ? 'Saving...' : initial ? 'Update Assignment' : 'Add Assignment'}
        </button>
        <button type="button" onClick={onCancel} className={buttonSecondary}>
          Cancel
        </button>
      </div>
    </form>
  );
}
