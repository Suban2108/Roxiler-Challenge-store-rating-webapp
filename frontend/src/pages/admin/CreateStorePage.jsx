import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/FormField';
import { useForm } from '@/hooks/useForm';
import { createStoreSchema } from '@/lib/validators';
import api, { getErrorMessage } from '@/lib/api';

export default function CreateStorePage() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState([]);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    api.get('/admin/users', { params: { role: 'store_owner', limit: 100 } })
      .then((res) => setOwners(res.data.data.users));
  }, []);

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit, setValue } = useForm({
    schema: createStoreSchema,
    initialValues: { name: '', email: '', address: '', ownerId: '' },
    onSubmit: async (data) => {
      setApiError('');
      try {
        await api.post('/admin/stores', data);
        navigate('/admin/stores');
      } catch (err) {
        setApiError(getErrorMessage(err));
      }
    },
  });

  return (
    <AppLayout title="Add Store" description="Register a new store on the platform">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Store details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Store Name" name="name" value={values.name} onChange={handleChange} error={errors.name} touched={touched.name} />
            <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} touched={touched.email} />
            <FormField label="Address" name="address" as="textarea" value={values.address} onChange={handleChange} error={errors.address} touched={touched.address} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Store Owner</label>
              <select
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
                value={values.ownerId}
                onChange={(e) => setValue('ownerId', e.target.value)}
              >
                <option value="">Select owner</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
                ))}
              </select>
              {touched.ownerId && errors.ownerId && (
                <p className="text-sm text-destructive">{errors.ownerId}</p>
              )}
            </div>

            {apiError && <p className="text-sm text-destructive">{apiError}</p>}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create store'}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/stores')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
