import React from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { useAchievements } from '@/hooks/useAchievements';
import { Link } from 'react-router-dom';
import ResumeUpload from '@/components/ResumeUpload';
import VoiceSearch from '@/components/VoiceSearch';
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Award, 
  Clock,
  CheckCircle,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Briefcase,
  User,
  Target
} from "lucide-react";

const Dashboard = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { applications, loading: applicationsLoading } = useApplications();
  const { userAchievements, loading: achievementsLoading } = useAchievements();

  const loading = profileLoading || applicationsLoading || achievementsLoading;

  const handleVoiceSearch = (transcript: string) => {
    console.log('Voice search:', transcript);
    // Handle voice search functionality here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8 flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  // Calculate profile completion
  const completionItems = [
    { completed: !!profile?.full_name, label: 'Basic information added' },
    { completed: !!profile?.resume_url, label: 'Resume uploaded' },
    { completed: !!profile?.skills && profile.skills.length > 0, label: 'Skills added' },
    { completed: !!profile?.university, label: 'Education details added' },
  ];
  const completedCount = completionItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedCount / completionItems.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                {profile?.full_name ? `Welcome, ${profile.full_name}!` : 'Your Career Dashboard'}
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your progress and manage your job search journey
              </p>
            </div>
            <VoiceSearch onTranscript={handleVoiceSearch} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile Completion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{completionPercentage}%</div>
                <Progress value={completionPercentage} className="h-2" />
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{applications.length}</div>
                <p className="text-sm text-muted-foreground">Total submitted</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Interviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">
                  {applications.filter(app => app.status === 'interview').length}
                </div>
                <p className="text-sm text-muted-foreground">Interview stage</p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Current Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-achievement">{profile?.level || 1}</div>
                <p className="text-sm text-muted-foreground">{profile?.points || 0} XP earned</p>
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
                    <Link to="/jobs">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.length > 0 ? (
                      applications.slice(0, 3).map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-semibold">{application.jobs?.title || 'Unknown Role'}</h4>
                            <p className="text-sm text-muted-foreground">{application.jobs?.company}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge 
                                variant={
                                  application.status === 'interview' ? 'default' : 
                                  application.status === 'reviewed' || application.status === 'referred' ? 'secondary' : 
                                  application.status === 'hired' ? 'default' :
                                  application.status === 'rejected' ? 'destructive' :
                                  'outline'
                                }
                              >
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Applied {new Date(application.created_at).toLocaleDateString()}
                              </span>
                              {application.match_score && (
                                <span className="text-xs font-medium text-primary">
                                  {application.match_score}% match
                                </span>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No applications yet. Start applying for jobs!</p>
                        <Link to="/jobs">
                          <Button className="mt-4" variant="outline">
                            Browse Jobs
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Recent Achievements</CardTitle>
                  <CardDescription>
                    Your latest accomplishments and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userAchievements.length > 0 ? (
                      userAchievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-center gap-3 p-3 bg-achievement/10 rounded-lg">
                          <div className="w-8 h-8 bg-achievement rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg">{achievement.achievements.icon}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{achievement.achievements.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Unlocked {new Date(achievement.earned_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <Badge variant="secondary">+{achievement.achievements.points_reward} XP</Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No achievements yet. Complete your profile to get started!</p>
                      </div>
                    )}
                  </div>
                  <Link to="/rewards">
                    <Button variant="outline" className="w-full mt-4">
                      <Award className="w-4 h-4 mr-2" />
                      View All Achievements
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Resume Section */}
              <ResumeUpload />

              {/* Profile Completion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profile Progress</span>
                      <span>{completionPercentage}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  <div className="space-y-2 text-sm">
                    {completionItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-muted" />
                        )}
                        <span className={item.completed ? '' : 'text-muted-foreground'}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
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
                  <Link to="/jobs">
                    <Button className="w-full btn-primary">
                      <FileText className="w-4 h-4 mr-2" />
                      Browse Jobs
                    </Button>
                  </Link>
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