import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Award, 
  Crown, 
  Medal,
  Target,
  Zap,
  Gift,
  Clock,
  Users,
  BookOpen,
  Video,
  Coffee,
  Sparkles
} from "lucide-react";
import achievementBadge from "@/assets/achievement-badge.jpg";

const Rewards = () => {
  const userProgress = {
    currentLevel: 7,
    currentXP: 1250,
    nextLevelXP: 1500,
    totalPoints: 850,
    achievementsUnlocked: 8,
    totalAchievements: 24,
  };

  const levelProgress = (userProgress.currentXP / userProgress.nextLevelXP) * 100;

  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your profile setup",
      icon: Star,
      rarity: "Common",
      points: 50,
      unlocked: true,
      unlockedDate: "2 weeks ago",
      progress: 100,
    },
    {
      id: 2,
      name: "Application Master",
      description: "Submit 10 job applications",
      icon: Trophy,
      rarity: "Rare",
      points: 150,
      unlocked: true,
      unlockedDate: "1 week ago",
      progress: 100,
    },
    {
      id: 3,
      name: "Skill Collector",
      description: "Complete 5 skill assessments",
      icon: Target,
      rarity: "Rare",
      points: 200,
      unlocked: false,
      progress: 80,
    },
    {
      id: 4,
      name: "Network Builder",
      description: "Connect with 20 alumni",
      icon: Users,
      rarity: "Epic",
      points: 300,
      unlocked: false,
      progress: 45,
    },
    {
      id: 5,
      name: "Interview Ace",
      description: "Successfully complete 3 interviews",
      icon: Medal,
      rarity: "Epic",
      points: 500,
      unlocked: false,
      progress: 33,
    },
    {
      id: 6,
      name: "Dream Job Hunter",
      description: "Land your first job",
      icon: Crown,
      rarity: "Legendary",
      points: 1000,
      unlocked: false,
      progress: 0,
    },
  ];

  const rewards = [
    {
      id: 1,
      name: "1-on-1 Mentorship Session",
      description: "45-minute session with industry expert",
      points: 500,
      icon: Users,
      category: "Mentorship",
      available: true,
    },
    {
      id: 2,
      name: "Resume Review",
      description: "Professional resume review and feedback",
      points: 200,
      icon: BookOpen,
      category: "Career Services",
      available: true,
    },
    {
      id: 3,
      name: "Mock Interview",
      description: "Practice interview with real feedback",
      points: 300,
      icon: Video,
      category: "Interview Prep",
      available: true,
    },
    {
      id: 4,
      name: "Coffee Chat Credit",
      description: "$10 credit for networking coffee chats",
      points: 150,
      icon: Coffee,
      category: "Networking",
      available: true,
    },
    {
      id: 5,
      name: "Premium Course Access",
      description: "1-month access to premium learning platform",
      points: 800,
      icon: BookOpen,
      category: "Learning",
      available: false,
    },
    {
      id: 6,
      name: "Career Coaching Package",
      description: "3-session career coaching program",
      points: 1200,
      icon: Target,
      category: "Coaching",
      available: false,
    },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-100 text-gray-800";
      case "Rare": return "bg-blue-100 text-blue-800";
      case "Epic": return "bg-purple-100 text-purple-800";
      case "Legendary": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-achievement to-yellow-500 bg-clip-text text-transparent">
              Rewards & Achievements
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock achievements, earn points, and redeem amazing rewards on your career journey
            </p>
          </div>

          {/* User Progress Card */}
          <Card className="mb-8 bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold achievement-badge"
                      style={{ 
                        backgroundImage: `url(${achievementBadge})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {userProgress.currentLevel}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-achievement rounded-full flex items-center justify-center animate-bounce-achievement">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">Level {userProgress.currentLevel} Career Explorer</h2>
                    <p className="text-lg text-muted-foreground">
                      {userProgress.currentXP} / {userProgress.nextLevelXP} XP to next level
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userProgress.totalPoints} points available • {userProgress.achievementsUnlocked}/{userProgress.totalAchievements} achievements unlocked
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-achievement mb-2">{userProgress.totalPoints}</div>
                  <p className="text-sm text-muted-foreground">Available Points</p>
                </div>
              </div>
              <Progress value={levelProgress} className="w-full h-4 progress-glow mt-4" />
            </CardHeader>
          </Card>

          {/* Achievements and Rewards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Achievements Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Achievements</h2>
                <Badge variant="outline" className="text-sm">
                  {userProgress.achievementsUnlocked}/{userProgress.totalAchievements} Unlocked
                </Badge>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={`transition-all duration-300 ${
                      achievement.unlocked 
                        ? "ring-2 ring-achievement shadow-lg" 
                        : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            achievement.unlocked 
                              ? "bg-gradient-to-r from-achievement to-yellow-500" 
                              : "bg-muted"
                          }`}>
                            <achievement.icon className={`w-6 h-6 ${
                              achievement.unlocked ? "text-white" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{achievement.name}</h3>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <p className="text-sm font-medium text-achievement mt-1">
                            +{achievement.points} pts
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {!achievement.unlocked && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      </CardContent>
                    )}
                    
                    {achievement.unlocked && achievement.unlockedDate && (
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 text-sm text-success">
                          <Clock className="w-4 h-4" />
                          Unlocked {achievement.unlockedDate}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Rewards Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Redeem Rewards</h2>
                <div className="flex items-center gap-2 text-achievement">
                  <Gift className="w-5 h-5" />
                  <span className="font-semibold">{userProgress.totalPoints} pts</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {rewards.map((reward) => (
                  <Card 
                    key={reward.id} 
                    className={`transition-all duration-300 ${
                      reward.available ? "card-hover" : "opacity-60"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            reward.available ? "bg-primary" : "bg-muted"
                          }`}>
                            <reward.icon className={`w-5 h-5 ${
                              reward.available ? "text-white" : "text-muted-foreground"
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">{reward.name}</h3>
                            <p className="text-sm text-muted-foreground">{reward.description}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {reward.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-achievement">
                            {reward.points}
                          </div>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <Button 
                        className={`w-full ${
                          reward.available && userProgress.totalPoints >= reward.points
                            ? "btn-achievement" 
                            : ""
                        }`}
                        variant={
                          reward.available && userProgress.totalPoints >= reward.points
                            ? "default"
                            : "outline"
                        }
                        disabled={!reward.available || userProgress.totalPoints < reward.points}
                      >
                        {!reward.available 
                          ? "Coming Soon"
                          : userProgress.totalPoints >= reward.points
                            ? "Redeem Now"
                            : `Need ${reward.points - userProgress.totalPoints} more points`
                        }
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rewards;