// Achievement System - Gamification
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Zap, Crown, Star, Gift, CheckCircle } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  progress: number;
  total: number;
  unlocked: boolean;
}

export function AchievementSystem() {
  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/achievements', { credentials: 'include' });
        if (!res.ok) {
          // Fallback to default achievements if API not ready
          return [
            {
              id: 'first_sale',
              title: 'First Sale',
              description: 'Birinchi sotuvingiz',
              icon: '🎯',
              reward: 50,
              progress: 0,
              total: 1,
              unlocked: false
            },
            {
              id: 'speed_demon',
              title: 'Speed Demon',
              description: '24 soatda 10 mahsulot yuklash',
              icon: '⚡',
              reward: 100,
              progress: 0,
              total: 10,
              unlocked: false
            },
            {
              id: 'trendsetter',
              title: 'Trendsetter',
              description: '3 ta bestseller topish',
              icon: '🔥',
              reward: 200,
              progress: 0,
              total: 3,
              unlocked: false
            }
          ];
        }
        return res.json();
      } catch (error) {
        console.error('Achievement fetch error:', error);
        return [];
      }
    },
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalRewards = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.reward, 0);

  if (isLoading) {
    return (
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (achievements.length === 0) {
    return (
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">Hozircha achievement yo'q</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-600" />
            <div>
              <h3 className="text-xl font-bold">Achievements</h3>
              <p className="text-sm text-gray-600">{unlockedCount}/{achievements.length} unlocked</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-green-600">${totalRewards}</div>
            <div className="text-xs text-gray-600">Earned</div>
          </div>
        </div>

        <div className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300'
                  : 'bg-gray-50 border-gray-200 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <div className="font-bold text-gray-900">{achievement.title}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                </div>
                {achievement.unlocked ? (
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    ${achievement.reward}
                  </Badge>
                ) : (
                  <Badge variant="outline">${achievement.reward}</Badge>
                )}
              </div>
              {!achievement.unlocked && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
