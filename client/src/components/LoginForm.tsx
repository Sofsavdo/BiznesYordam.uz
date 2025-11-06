import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
  isAdmin?: boolean;
}

export function LoginForm({ onSuccess, isAdmin = false }: LoginFormProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (result?.user?.role === 'admin') {
        window.location.href = '/admin-panel';
      } else if (result?.user?.role === 'partner') {
        window.location.href = '/partner-dashboard';
      } else {
        onSuccess?.();
      }
    } catch (error: any) {
      setError(error.message || 'Kirish jarayonida xatolik yuz berdi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-start mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            data-testid="button-back-to-home"
          >
            <ArrowLeft className="w-4 h-4" />
            Bosh sahifaga qaytish
          </Button>
        </div>
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <LogIn className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">
          {isAdmin ? 'Admin Paneli' : 'Partner Kirish'}
        </CardTitle>
        <p className="text-slate-600">
          {isAdmin ? 'Admin hisobingizga kiring' : 'Partner hisobingizga kiring'}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="Username kiriting"
              required
              data-testid="input-username"
            />
          </div>

          <div>
            <Label htmlFor="password">Parol</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Parol kiriting"
                required
                data-testid="input-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
            data-testid="button-login"
          >
            {isLoading ? 'Kirilmoqda...' : 'Kirish'}
          </Button>
        </form>

        {!isAdmin && (
          <div className="text-center mt-6">
            <p className="text-slate-600 text-sm">
              Hali hamkor emassizmi?{' '}
              <button
                onClick={() => window.location.href = '/partner-registration'}
                className="text-primary hover:underline font-medium"
              >
                Ro'yxatdan o'ting
              </button>
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="text-center mt-6">
            <p className="text-slate-600 text-sm">
              Default: admin / BiznesYordam2024!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
