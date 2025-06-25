import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, Crown } from 'lucide-react';
import { UserTier } from '@/hooks/useUserTier';

interface UsageTrackerProps {
  userTier: UserTier;
  dailyUsage: number;
  promptLimit: number;
  remainingPrompts: number;
  onUpgrade: () => void;
  onJoinWaitlist: () => void;
}

export const UsageTracker = ({ 
  userTier, 
  dailyUsage, 
  promptLimit, 
  remainingPrompts,
  onJoinWaitlist
}: UsageTrackerProps) => {
  const usagePercentage = (dailyUsage / promptLimit) * 100;
  
  const getTierInfo = () => {
    switch (userTier) {
      case 'free':
        return {
          name: 'Free User',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: Zap
        };
      case 'premium':
        return {
          name: 'Premium',
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
          icon: Crown
        };
      default:
        return {
          name: 'Free User',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: Zap
        };
    }
  };

  const tierInfo = getTierInfo();
  const TierIcon = tierInfo.icon;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TierIcon className={`h-4 w-4 ${tierInfo.color}`} />
          <span className={`text-sm font-medium ${tierInfo.color}`}>
            {tierInfo.name}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Daily Usage</span>
            <span className="font-medium">
              {dailyUsage}/{promptLimit}
            </span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
          <p className="text-xs text-gray-500">
            {remainingPrompts} prompts remaining
          </p>
        </div>

        {userTier === 'free' && (
          <Button onClick={onJoinWaitlist} variant="outline" size="sm" className="w-full">
            <Crown className="h-4 w-4 mr-2" />
            Join Premium Waitlist
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
