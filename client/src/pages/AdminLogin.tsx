import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function AdminLogin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setLocation('/admin-panel');
      } else {
        setLocation('/');
      }
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <LoginForm isAdmin={true} onSuccess={() => {
        // Redirect will be handled by useEffect above
      }} />
    </div>
  );
}
