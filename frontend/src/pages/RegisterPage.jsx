import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/FormField';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useForm } from '@/hooks/useForm';
import { useAuth } from '@/context/AuthContext';
import { registerSchema } from '@/lib/validators';
import { getErrorMessage } from '@/lib/api';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const { values, errors, touched, isSubmitting, handleChange, handleSubmit } = useForm({
    schema: registerSchema,
    initialValues: { name: '', email: '', address: '', password: '' },
    onSubmit: async (data) => {
      setApiError('');
      try {
        await register(data);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setApiError(getErrorMessage(err));
      }
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <CardDescription>Sign up as a normal user to rate stores</CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <p className="text-center text-emerald-600 dark:text-emerald-400">
                Registration successful! Redirecting to login...
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Name (20-60 characters)"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name}
                  touched={touched.name}
                  placeholder="Your full name"
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  touched={touched.email}
                  placeholder="you@example.com"
                />
                <FormField
                  label="Address"
                  name="address"
                  as="textarea"
                  value={values.address}
                  onChange={handleChange}
                  error={errors.address}
                  touched={touched.address}
                  placeholder="Your address"
                />
                <FormField
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={errors.password}
                  touched={touched.password}
                  placeholder="8-16 chars, uppercase & special"
                />

                {apiError && <p className="text-sm text-destructive">{apiError}</p>}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </Button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
