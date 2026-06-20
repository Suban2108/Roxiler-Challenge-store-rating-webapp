import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/FormField';
import { useForm } from '@/hooks/useForm';
import { changePasswordSchema } from '@/lib/validators';
import api, { getErrorMessage } from '@/lib/api';

export default function ChangePasswordPage() {
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit } = useForm({
    schema: changePasswordSchema,
    initialValues: { currentPassword: '', newPassword: '' },
    onSubmit: async (data) => {
      setApiError('');
      setSuccess(false);
      try {
        await api.patch('/auth/password', data);
        setSuccess(true);
      } catch (err) {
        setApiError(getErrorMessage(err));
      }
    },
  });

  return (
    <AppLayout title="Change Password" description="Update your account password">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Update password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              label="Current password"
              name="currentPassword"
              type="password"
              value={values.currentPassword}
              onChange={handleChange}
              error={errors.currentPassword}
              touched={touched.currentPassword}
            />
            <FormField
              label="New password"
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={handleChange}
              error={errors.newPassword}
              touched={touched.newPassword}
              placeholder="8-16 chars, uppercase & special"
            />

            {apiError && <p className="text-sm text-destructive">{apiError}</p>}
            {success && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Password updated successfully. Please log in again if needed.
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
