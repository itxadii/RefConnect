import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Star, 
  Target, 
  Award, 
  Medal,
  Crown,
  Zap,
  Flame
} from "lucide-react";
import achievementBadge from "@/assets/achievement-badge.jpg";

const GamificationSection = () => {
  const achievements = [
    {
      icon: Trophy,
      title: "First Application",
      description: "Submit your first job application",
      progress: 100,
      unlocked: true,
      rarity: "Common",
    },
    {
      icon: Star,
      title: "Profile Complete",
      description: "Complete 100% of your profile",
      progress: 85,
      unlocked: false,
      rarity: "Common",
    },
    {
      icon: Target,
      title: "Skill Master",
      description: "Complete 5 skill assessments",
      progress: 60,
      unlocked: false,
      rarity: "Rare",
    },
    {
      icon: Award,
      title: "Referral Received",
      description: "Get your first referral",
      progress: 0,
      unlocked: false,
      rarity: "Epic",
    },
    {
      icon: Medal,
      title: "Interview Ace",
      description: "Successfully complete 3 interviews",
      progress: 33,
      unlocked: false,
      rarity: "Rare",
    },
    {
      icon: Crown,
      title: "Job Secured",
      description: "Land your dream job",
      progress: 0,
      unlocked: false,
      rarity: "Legendary",
    },
  ];

  const rarityColors = {
    Common: "bg-gray-100 text-gray-800",
    Rare: "bg-blue-100 text-blue-800",
    Epic: "bg-purple-100 text-purple-800",
    Legendary: "bg-orange-100 text-orange-800",
  };

  const userLevel = 7;
  const currentXP = 1250;
  const nextLevelXP = 1500;
  const levelProgress = (currentXP / nextLevelXP) * 100;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-achievement to-yellow-500 bg-clip-text text-transparent">
            Level Up Your Career
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Unlock achievements, earn rewards, and track your progress with our gamified career platform
          </p>
        </div>

        {/* User Progress */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-gradient-to-r from-primary/10 to-success/10 border-primary/20">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-success rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userLevel}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-achievement rounded-full flex items-center justify-center animate-bounce-achievement">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <CardTitle className="text-2xl">Level {userLevel} Career Explorer</CardTitle>
                  <CardDescription className="text-lg">
                    {currentXP} / {nextLevelXP} XP to next level
                  </CardDescription>
                </div>
              </div>
              <Progress value={levelProgress} className="w-full h-3 progress-glow" />
            </CardHeader>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {achievements.map((achievement, index) => (
            <Card 
              key={index} 
              className={`card-hover relative overflow-hidden ${
                achievement.unlocked 
                  ? "ring-2 ring-achievement shadow-lg" 
                  : "opacity-75"
              }`}
            >
              {achievement.unlocked && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-achievement rounded-full flex items-center justify-center animate-glow">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                    achievement.unlocked 
                      ? "bg-gradient-to-r from-achievement to-yellow-500" 
                      : "bg-muted"
                  }`}>
                    <achievement.icon className={`w-6 h-6 ${
                      achievement.unlocked ? "text-white" : "text-muted-foreground"
                    }`} />
                  </div>
                  <Badge className={rarityColors[achievement.rarity as keyof typeof rarityColors]}>
                    {achievement.rarity}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{achievement.title}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <Progress 
                    value={achievement.progress} 
                    className={`h-2 ${achievement.unlocked ? "progress-glow" : ""}`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Achievement Showcase */}
        <div className="text-center">
          <div 
            className="inline-block w-32 h-32 rounded-full mb-6 achievement-badge animate-bounce-achievement"
            style={{ 
              backgroundImage: `url(${achievementBadge})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <h3 className="text-2xl font-bold mb-4">Ready to Start Achieving?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join thousands of students and professionals who are leveling up their careers with our gamified platform.
          </p>
          <Button size="lg" className="btn-achievement text-lg px-8 py-4">
            Start Your Journey
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;