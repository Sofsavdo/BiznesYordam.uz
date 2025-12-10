// Viral Share Button - One-click social sharing
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, CheckCircle } from 'lucide-react';

interface ShareData {
  earnings: number;
  growthPercent: number;
  partnerName: string;
}

export function ViralShareButton({ data }: { data: ShareData }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const shareText = `🚀 Men SellerCloudX AI Manager bilan ${data.growthPercent}% ko'proq ishladim va ${data.earnings}M so'm qo'shimcha daromad topdim!\n\n3 kunlik bepul trial: https://sellercloudx.onrender.com?ref=${data.partnerName}`;

  const shareLinks = {
    telegram: `https://t.me/share/url?url=https://sellercloudx.onrender.com&text=${encodeURIComponent(shareText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=https://sellercloudx.onrender.com&quote=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://sellercloudx.onrender.com`
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    toast({ title: '✅ Nusxalandi!' });
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        size="lg"
      >
        <Share2 className="w-5 h-5 mr-2" />
        Muvaffaqiyatni Ulashing - Bonus Oling!
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">🎉 Ulashing va Bonus Oling!</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Sizning natijangiz:</p>
              <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                {data.earnings}M so'm daromad
              </p>
              <p className="text-lg font-bold text-green-600">📈 {data.growthPercent}% o'sish</p>
            </div>

            <p className="text-sm text-gray-600 italic">"{shareText}"</p>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => window.open(shareLinks.telegram, '_blank')}
                className="bg-[#0088cc] hover:bg-[#0077b3]"
              >
                📱 Telegram
              </Button>
              <Button
                onClick={() => window.open(shareLinks.facebook, '_blank')}
                className="bg-[#1877f2] hover:bg-[#166fe5]"
              >
                📘 Facebook
              </Button>
              <Button
                onClick={() => window.open(shareLinks.whatsapp, '_blank')}
                className="bg-[#25d366] hover:bg-[#20bd5a]"
              >
                💬 WhatsApp
              </Button>
              <Button
                onClick={() => window.open(shareLinks.linkedin, '_blank')}
                className="bg-[#0077b5] hover:bg-[#006399]"
              >
                💼 LinkedIn
              </Button>
            </div>

            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full"
            >
              <Copy className="w-4 h-4 mr-2" />
              Matnni Nusxalash
            </Button>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
              <p className="text-sm font-bold text-yellow-800">
                💰 Har bir ulashish → 1 ta yangi hamkor → $14-21/oy bonus!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
