// Platform Demo Page - Interactive Dashboard Preview
import { DemoShowcase } from '@/components/DemoShowcase';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function PlatformDemo() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/')}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Orqaga
              </Button>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SellerCloudX
                </h1>
                <p className="text-sm text-gray-600">Platform Demo</p>
              </div>
            </div>
            <Button 
              onClick={() => setLocation('/partner-registration')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Bepul Boshlash
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DemoShowcase />
      </div>
    </div>
  );
}
