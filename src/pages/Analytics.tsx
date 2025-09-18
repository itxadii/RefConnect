import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  Target,
  Award,
  Briefcase,
  Eye,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Analytics = () => {
  const overviewStats = [
    {
      title: "Application Success Rate",
      value: "78%",
      change: "+12%",
      trend: "up",
      description: "Higher than average",
      icon: Target,
    },
    {
      title: "Response Time",
      value: "3.2 days",
      change: "-0.8 days",
      trend: "up",
      description: "Faster responses",
      icon: Clock,
    },
    {
      title: "Profile Views",
      value: "247",
      change: "+23",
      trend: "up",
      description: "This month",
      icon: Eye,
    },
    {
      title: "Skill Match Score",
      value: "89%",
      change: "+5%",
      trend: "up",
      description: "Average match rate",
      icon: Award,
    },
  ];

  const applicationAnalytics = [
    { month: "Jan", applied: 12, responses: 8, interviews: 3 },
    { month: "Feb", applied: 15, responses: 11, interviews: 4 },
    { month: "Mar", applied: 18, responses: 14, interviews: 6 },
    { month: "Apr", applied: 22, responses: 17, interviews: 8 },
    { month: "May", applied: 25, responses: 19, interviews: 10 },
  ];

  const skillInsights = [
    { skill: "React", demand: 95, myLevel: 85, gap: -10, trending: "High" },
    { skill: "TypeScript", demand: 88, myLevel: 75, gap: -13, trending: "Growing" },
    { skill: "Python", demand: 82, myLevel: 60, gap: -22, trending: "Stable" },
    { skill: "System Design", demand: 90, myLevel: 45, gap: -45, trending: "Critical" },
    { skill: "AWS", demand: 85, myLevel: 40, gap: -45, trending: "High" },
  ];

  const topCompanies = [
    { name: "TechCorp", applications: 8, responses: 6, success: 75 },
    { name: "Innovation Labs", applications: 5, responses: 4, success: 80 },
    { name: "AI Solutions", applications: 6, responses: 3, success: 50 },
    { name: "Creative Studios", applications: 4, responses: 3, success: 75 },
    { name: "CloudTech", applications: 7, responses: 5, success: 71 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Career Analytics
            </h1>
            <p className="text-xl text-muted-foreground">
              Insights and data to optimize your job search strategy
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {overviewStats.map((stat, index) => (
              <Card key={index} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <stat.icon className="w-8 h-8 text-primary" />
                    <Badge 
                      variant={stat.trend === "up" ? "default" : "secondary"}
                      className={stat.trend === "up" ? "bg-green-100 text-green-800" : ""}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <CardTitle className="text-sm text-muted-foreground">{stat.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Application Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Application Activity</CardTitle>
                <CardDescription>Monthly breakdown of your job search activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applicationAnalytics.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="font-medium">{month.month}</div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span>{month.applied} Applied</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-success rounded-full"></div>
                          <span>{month.responses} Responses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-achievement rounded-full"></div>
                          <span>{month.interviews} Interviews</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skill Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Skill Gap Analysis</CardTitle>
                <CardDescription>Compare your skills with market demand</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skillInsights.map((skill, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{skill.skill}</span>
                        <Badge 
                          variant={skill.trending === "Critical" ? "destructive" : "outline"}
                          className={
                            skill.trending === "High" ? "bg-green-100 text-green-800" :
                            skill.trending === "Growing" ? "bg-blue-100 text-blue-800" :
                            skill.trending === "Critical" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {skill.trending}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Market Demand</span>
                          <span>{skill.demand}%</span>
                        </div>
                        <Progress value={skill.demand} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Your Level</span>
                          <span>{skill.myLevel}%</span>
                        </div>
                        <Progress value={skill.myLevel} className="h-2" />
                        {skill.gap < -20 && (
                          <div className="flex items-center gap-2 text-xs text-orange-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>Significant skill gap detected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Company Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Company Performance</CardTitle>
                <CardDescription>Your success rate by company</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCompanies.map((company, index) => (
                    <div key={index} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{company.name}</h4>
                        <Badge 
                          className={
                            company.success >= 75 ? "bg-green-100 text-green-800" :
                            company.success >= 60 ? "bg-blue-100 text-blue-800" :
                            "bg-orange-100 text-orange-800"
                          }
                        >
                          {company.success}% success
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Applied</div>
                          <div className="font-medium">{company.applications}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Responses</div>
                          <div className="font-medium">{company.responses}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Success Rate</div>
                          <div className="font-medium">{company.success}%</div>
                        </div>
                      </div>
                      <Progress value={company.success} className="h-2 mt-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>Personalized insights to improve your job search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-800 mb-2">Focus on TypeScript</h4>
                  <p className="text-sm text-blue-700">
                    TypeScript skills are in high demand. Consider taking a course to boost your profile.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-green-800 mb-2">Apply to More Startups</h4>
                  <p className="text-sm text-green-700">
                    Your success rate with startups is 85%. Consider targeting more early-stage companies.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">Improve Response Time</h4>
                  <p className="text-sm text-orange-700">
                    Responding to opportunities within 24 hours increases your success rate by 40%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Analytics;