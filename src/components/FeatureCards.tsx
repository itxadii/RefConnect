import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Search, 
  Award, 
  Brain, 
  Mic, 
  BarChart3,
  Users,
  Target,
  Zap
} from "lucide-react";

const FeatureCards = () => {
  const features = [
    {
      icon: Upload,
      title: "Smart Resume Upload",
      description: "AI-powered resume analysis with keyword matching and skill gap identification.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Search,
      title: "Intelligent Job Matching",
      description: "Find perfect opportunities with our AI matching algorithm and skill-based filtering.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Award,
      title: "Gamified Rewards",
      description: "Earn badges, points, and achievements as you progress in your career journey.",
      gradient: "from-orange-500 to-yellow-500",
    },
    {
      icon: Brain,
      title: "Skill Development",
      description: "Personalized learning roadmaps with progress tracking and milestone celebrations.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Mic,
      title: "Voice-to-Voice AI",
      description: "Multilingual voice search and application in Hindi, Tamil, Telugu, and more.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your application progress with detailed insights and performance metrics.",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Alumni Network",
      description: "Connect with industry professionals and alumni for valuable referrals.",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: Target,
      title: "Referral Tracking",
      description: "Timeline-style progress tracking from application to hire with real-time updates.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "Instant Notifications",
      description: "Real-time updates on application status, new opportunities, and achievements.",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            Powerful Features for Your Success
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to land your dream job, all in one comprehensive platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="card-hover group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="btn-primary text-lg px-8 py-4">
            Explore All Features
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;