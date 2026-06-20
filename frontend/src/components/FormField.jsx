import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  touched,
  placeholder,
  as = 'input',
  options = [],
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {as === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={3}
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
      {touched && error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
