import { LoginForm } from '@/components/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useLocation } from 'wouter';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

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
      {/* Back to Home Button */}
      <Button
        onClick={() => setLocation('/')}
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-2 hover:bg-white/50"
      >
        <Home className="w-5 h-5" />
        Bosh sahifa
      </Button>

      <LoginForm isAdmin={true} onSuccess={() => {
        // Redirect will be handled by useEffect above
      }} />
    </div>
  );
}
