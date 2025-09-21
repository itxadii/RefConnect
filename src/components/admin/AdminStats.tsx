import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  FileText,
  Building2,
  Award,
  Calendar
} from 'lucide-react';

interface AdminStatsProps {
  jobs: any[];
  applications: any[];
}

const AdminStats: React.FC<AdminStatsProps> = ({ jobs, applications }) => {
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(job => job.is_active).length,
    totalApplications: applications.length,
    hiredCandidates: applications.filter(app => app.status === 'hired').length,
    pendingApplications: applications.filter(app => 
      ['applied', 'reviewed'].includes(app.status)
    ).length,
    interviewScheduled: applications.filter(app => app.status === 'interview').length,
    avgMatchScore: applications.length > 0 
      ? Math.round(applications.reduce((sum, app) => sum + (app.match_score || 0), 0) / applications.length)
      : 0,
    topCompanies: getTopCompanies(jobs),
    recentActivity: getRecentActivity(applications)
  };

  function getTopCompanies(jobs: any[]) {
    const companyCounts = jobs.reduce((acc, job) => {
      acc[job.company] = (acc[job.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(companyCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([company, count]) => ({ company, count }));
  }

  function getRecentActivity(applications: any[]) {
    const recent = applications
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return recent.map(app => ({
      id: app.id,
      candidate: app.user?.full_name || 'Unknown',
      job: app.job?.title || 'Unknown Job',
      status: app.status,
      date: new Date(app.created_at).toLocaleDateString(),
      time: new Date(app.created_at).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hired': return 'text-green-600';
      case 'interview': return 'text-blue-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalJobs}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activeJobs} active job{stats.activeJobs !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Total Applications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalApplications}</div>
          <p className="text-xs text-muted-foreground">
            {stats.pendingApplications} pending review
          </p>
        </CardContent>
      </Card>

      {/* Hired Candidates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hired Candidates</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hiredCandidates}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalApplications > 0 
              ? Math.round((stats.hiredCandidates / stats.totalApplications) * 100)
              : 0}% success rate
          </p>
        </CardContent>
      </Card>

      {/* Average Match Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Match Score</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgMatchScore}%</div>
          <p className="text-xs text-muted-foreground">
            Candidate-job fit quality
          </p>
        </CardContent>
      </Card>

      {/* Top Companies */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Top Companies by Job Posts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topCompanies.map((company, index) => (
              <div key={company.company} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <span className="font-medium">{company.company}</span>
                </div>
                <Badge variant="secondary">{company.count} job{company.count !== 1 ? 's' : ''}</Badge>
              </div>
            ))}
            {stats.topCompanies.length === 0 && (
              <p className="text-muted-foreground text-sm">No companies found</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{activity.candidate}</div>
                  <div className="text-sm text-muted-foreground">
                    Applied for {activity.job}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {activity.date} at {activity.time}
                  </div>
                </div>
                <Badge 
                  variant={activity.status === 'hired' ? 'default' : 
                          activity.status === 'rejected' ? 'destructive' : 'secondary'}
                  className={getStatusColor(activity.status)}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <p className="text-muted-foreground text-sm">No recent activity</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium mb-1">Pending Reviews</h3>
              <p className="text-sm text-muted-foreground">
                {stats.pendingApplications} applications need review
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-medium mb-1">Interviews Scheduled</h3>
              <p className="text-sm text-muted-foreground">
                {stats.interviewScheduled} interviews scheduled
              </p>
            </div>
            
            <div className="p-4 border rounded-lg text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-medium mb-1">Success Rate</h3>
              <p className="text-sm text-muted-foreground">
                {stats.totalApplications > 0 
                  ? Math.round((stats.hiredCandidates / stats.totalApplications) * 100)
                  : 0}% of applications result in hires
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStats;
