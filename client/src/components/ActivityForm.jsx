import { useState } from 'react';
import Field from './Field';
import { ACTIVITY_TYPES, ACTIVITY_STATUSES, inputClass, buttonPrimary, buttonSecondary } from '../utils';

const emptyForm = {
  title: '',
  activity_type: 'Exam',
  activity_date: '',
  description: '',
  status: 'Upcoming',
};

export default function ActivityForm({ onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.activity_date) newErrors.activity_date = 'Date is required';
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
      <h2 className="mb-4 text-lg font-semibold">Add Activity</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *" error={errors.title}>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Activity Type">
          <select
            name="activity_type"
            value={form.activity_type}
            onChange={handleChange}
            className={inputClass}
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Date *" error={errors.activity_date}>
          <input
            type="date"
            name="activity_date"
            value={form.activity_date}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
        <Field label="Status">
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            {ACTIVITY_STATUSES.map((s) => (
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
          {saving ? 'Saving...' : 'Add Activity'}
        </button>
        <button type="button" onClick={onCancel} className={buttonSecondary}>
          Cancel
        </button>
      </div>
    </form>
  );
}
