'use client';

import { useFormContext } from 'react-hook-form';

export default function PreferencesFields() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <textarea
        {...register('trip_description')}
        placeholder="Tell us about your dream trip..."
        className="w-full p-2 border rounded resize-none"
        rows={4}
      />

      <input
        {...register('group_size', { valueAsNumber: true })}
        type="number"
        placeholder="Group size (optional)"
        className="w-full p-2 border rounded"
      />

      <select {...register('budget')} className="w-full p-2 border rounded">
        <option value="">Select Budget</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Add multiselects and dates in next steps */}
    </div>
  );
}
