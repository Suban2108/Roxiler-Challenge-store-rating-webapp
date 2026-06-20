import { useState, useCallback } from 'react';

export function useForm({ schema, initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValue(name, value);
  }, [setValue]);

  const validate = useCallback(() => {
    const result = schema.safeParse(values);
    if (result.success) {
      setErrors({});
      return { success: true, data: result.data };
    }

    const fieldErrors = {};
    const issues = result.error.issues || result.error.errors || [];
    issues.forEach((issue) => {
      const field = issue.path?.[0];
      if (field && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });
    setErrors(fieldErrors);
    return { success: false };
  }, [schema, values]);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault();
      const validation = validate();
      if (!validation.success) return;

      setIsSubmitting(true);
      try {
        await onSubmit(validation.data);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, onSubmit]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    handleChange,
    handleSubmit,
    validate,
  };
}
