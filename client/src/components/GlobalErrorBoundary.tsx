// Global Error Boundary - Production Ready
import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // In production, send to error tracking service (Sentry, etc.)
    this.setState({
      error,
      errorInfo
    });

    // TODO: Send to error tracking service
    // sendErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full shadow-2xl border-2 border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardTitle className="flex items-center gap-3 text-red-700">
                <AlertTriangle className="h-8 w-8" />
                <div>
                  <div className="text-2xl font-bold">Xatolik Yuz Berdi</div>
                  <div className="text-sm font-normal text-slate-600 mt-1">
                    Nimadir noto'g'ri ketdi. Iltimos, qaytadan urinib ko'ring.
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Error Message */}
              {this.state.error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="font-semibold text-red-900 mb-2">
                    Xatolik xabari:
                  </div>
                  <div className="text-sm text-red-800 font-mono bg-white p-3 rounded border border-red-200 overflow-auto">
                    {this.state.error.message}
                  </div>
                </div>
              )}

              {/* Error Stack (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <summary className="cursor-pointer font-semibold text-slate-700 mb-2">
                    Texnik tafsilotlar (faqat development)
                  </summary>
                  <pre className="text-xs text-slate-600 overflow-auto max-h-64 bg-white p-3 rounded border border-slate-200 mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  size="lg"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Qaytadan Urinish
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                  size="lg"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Bosh Sahifaga
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center text-sm text-slate-600 pt-4 border-t">
                <p>Agar muammo davom etsa, iltimos support bilan bog'laning:</p>
                <a 
                  href="mailto:support@SellerCloudX.uz" 
                  className="text-blue-600 hover:underline font-semibold"
                >
                  support@SellerCloudX.uz
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
