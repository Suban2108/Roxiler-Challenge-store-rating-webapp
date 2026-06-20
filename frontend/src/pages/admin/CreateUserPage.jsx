import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/FormField';
import { useForm } from '@/hooks/useForm';
import { createUserSchema } from '@/lib/validators';
import api, { getErrorMessage } from '@/lib/api';

export default function CreateUserPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit } = useForm({
    schema: createUserSchema,
    initialValues: { name: '', email: '', address: '', password: '', role: 'user' },
    onSubmit: async (data) => {
      setApiError('');
      try {
        await api.post('/admin/users', data);
        navigate('/admin/users');
      } catch (err) {
        setApiError(getErrorMessage(err));
      }
    },
  });

  return (
    <AppLayout title="Add User" description="Create admin, user, or store owner">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>User details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} touched={touched.name} />
            <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} touched={touched.email} />
            <FormField label="Address" name="address" as="textarea" value={values.address} onChange={handleChange} error={errors.address} touched={touched.address} />
            <FormField label="Password" name="password" type="password" value={values.password} onChange={handleChange} error={errors.password} touched={touched.password} />
            <FormField
              label="Role"
              name="role"
              as="select"
              value={values.role}
              onChange={handleChange}
              options={[
                { value: 'user', label: 'Normal User' },
                { value: 'admin', label: 'Admin' },
                { value: 'store_owner', label: 'Store Owner' },
              ]}
            />

            {apiError && <p className="text-sm text-destructive">{apiError}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create user'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/users')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
