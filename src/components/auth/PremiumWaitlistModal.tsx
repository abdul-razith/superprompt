
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Crown, Sparkles, Zap, Clock } from 'lucide-react';

interface PremiumWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumWaitlistModal = ({ isOpen, onClose }: PremiumWaitlistModalProps) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Store in localStorage for now
    const waitlist = JSON.parse(localStorage.getItem('premium_waitlist') || '[]');
    waitlist.push({ email, joinedAt: new Date().toISOString() });
    localStorage.setItem('premium_waitlist', JSON.stringify(waitlist));
    
    setTimeout(() => {
      setIsLoading(false);
      onClose();
      toast({
        title: "You're on the list! 🎉",
        description: "We'll notify you when premium features launch."
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            Join Premium Waitlist
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Be the first to access premium AI models when they launch
            </p>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-purple-600" />
                <span><strong>Claude 3.5 Sonnet</strong> - Advanced reasoning</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-blue-600" />
                <span><strong>GPT-4.1</strong> - Superior performance</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Crown className="h-4 w-4 text-gold-600" />
                <span><strong>Unlimited prompts</strong> + priority processing</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-green-600" />
                <span><strong>Early bird pricing</strong> - $4.99/month</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="waitlist-email">Email Address</Label>
              <Input
                id="waitlist-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Maybe Later
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Joining..." : "Join Waitlist"}
              </Button>
            </div>
          </form>
          
          <p className="text-xs text-gray-500 text-center">
            We'll email you when premium launches. No spam, unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
