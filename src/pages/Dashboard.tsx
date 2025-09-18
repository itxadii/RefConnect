import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Award, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Download,
  Edit,
  Plus
} from "lucide-react";

const Dashboard = () => {
  const userStats = {
    profileCompletion: 85,
    applicationsSubmitted: 12,
    referralsReceived: 3,
    interviewsScheduled: 1,
    totalPoints: 1250,
    currentLevel: 7,
  };

  const recentApplications = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      status: "Under Review",
      appliedDate: "2 days ago",
      matchScore: 95,
      statusColor: "text-yellow-600 bg-yellow-100",
    },
    {
      id: 2,
      title: "Product Manager Intern",
      company: "Innovation Labs",
      status: "Referral Received",
      appliedDate: "5 days ago",
      matchScore: 87,
      statusColor: "text-green-600 bg-green-100",
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "AI Solutions",
      status: "Interview Scheduled",
      appliedDate: "1 week ago",
      matchScore: 92,
      statusColor: "text-blue-600 bg-blue-100",
    },
    {
      id: 4,
      title: "UX Designer",
      company: "Creative Studios",
      status: "Application Sent",
      appliedDate: "1 week ago",
      matchScore: 78,
      statusColor: "text-gray-600 bg-gray-100",
    },
  ];

  const skillGaps = [
    { skill: "TypeScript", currentLevel: 3, requiredLevel: 5, progress: 60 },
    { skill: "System Design", currentLevel: 2, requiredLevel: 4, progress: 50 },
    { skill: "AWS", currentLevel: 1, requiredLevel: 3, progress: 33 },
  ];

  const recentAchievements = [
    { name: "First Application", icon: FileText, unlockedDate: "2 days ago" },
    { name: "Profile Expert", icon: Award, unlockedDate: "1 week ago" },
    { name: "Skill Hunter", icon: TrendingUp, unlockedDate: "2 weeks ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Your Career Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Track your progress and manage your job search journey
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{userStats.profileCompletion}%</div>
                <Progress value={userStats.profileCompletion} className="h-2" />
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{userStats.applicationsSubmitted}</div>
                <p className="text-sm text-muted-foreground">Total submitted</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{userStats.referralsReceived}</div>
                <p className="text-sm text-muted-foreground">Received this month</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Current Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-achievement">{userStats.currentLevel}</div>
                <p className="text-sm text-muted-foreground">{userStats.totalPoints} XP earned</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Recent Applications</CardTitle>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-semibold">{application.title}</h4>
                          <p className="text-sm text-muted-foreground">{application.company}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge className={application.statusColor}>
                              {application.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Applied {application.appliedDate}
                            </span>
                            <span className="text-xs font-medium text-primary">
                              {application.matchScore}% match
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Skill Development */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Skill Development</CardTitle>
                  <CardDescription>
                    Bridge the gap between your current skills and job requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {skillGaps.map((skill, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.skill}</span>
                          <span className="text-sm text-muted-foreground">
                            Level {skill.currentLevel}/{skill.requiredLevel}
                          </span>
                        </div>
                        <Progress value={skill.progress} className="h-2 mb-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Current skill level</span>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            Start Learning
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Resume Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resume</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-primary" />
                      <div>
                        <p className="font-medium">resume_updated.pdf</p>
                        <p className="text-sm text-muted-foreground">Updated 3 days ago</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Resume
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      AI Resume Builder
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAchievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-achievement/10 rounded-lg">
                        <div className="w-8 h-8 bg-achievement rounded-lg flex items-center justify-center">
                          <achievement.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Unlocked {achievement.unlockedDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    <Award className="w-4 h-4 mr-2" />
                    View All Achievements
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Skill
                  </Button>
                  <Button className="w-full" variant="outline">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Skill Assessment
                  </Button>
                  <Button className="w-full btn-primary">
                    <FileText className="w-4 h-4 mr-2" />
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;