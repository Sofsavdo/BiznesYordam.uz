import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function Login() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'admin') {
        setLocation('/admin-panel');
      } else if (user.role === 'partner') {
        setLocation('/partner-dashboard');
      } else {
        setLocation('/');
      }
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <LoginForm onSuccess={() => {
        // Redirect will be handled by useEffect above
      }} />
    </div>
  );
}
