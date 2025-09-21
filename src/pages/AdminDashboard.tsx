import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Plus,
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useAuth } from '@/contexts/AuthContext';
import JobPostingForm from '@/components/admin/JobPostingForm';
import ApplicationsTable from '@/components/admin/ApplicationsTable';
import AdminStats from '@/components/admin/AdminStats';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showJobForm, setShowJobForm] = useState(false);
  const { user, profile } = useAuth();
  const { jobs, loading: jobsLoading, refetch: refetchJobs } = useJobs();
  const { applications, loading: appsLoading, refetch: refetchApps } = useApplications();

  // Check if user is admin: prefer profile.role; also allow email contains 'admin' for demo convenience
  const isAdmin = (profile?.role === 'admin') || (user?.email?.includes('admin') ?? false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleJobCreated = () => {
    setShowJobForm(false);
    refetchJobs();
  };

  const handleApplicationUpdated = () => {
    refetchApps();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage job postings and candidate applications
            </p>
          </div>
          <Button 
            onClick={() => setShowJobForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <AdminStats 
              jobs={jobs || []} 
              applications={applications || []} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Recent Job Postings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobs?.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{job.title}</h4>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                        <Badge variant={job.isActive ? "default" : "secondary"}>
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    ))}
                    {jobsLoading && <div>Loading jobs...</div>}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications?.slice(0, 5).map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">Application #{app.id.slice(-6)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(app.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={
                          app.status === 'hired' ? 'default' :
                          app.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                    {appsLoading && <div>Loading applications...</div>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <JobPostingForm 
              isOpen={showJobForm}
              onClose={() => setShowJobForm(false)}
              onJobCreated={handleJobCreated}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>All Job Postings</CardTitle>
                <CardDescription>
                  Manage your job postings and view application statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs?.map((job) => (
                    <div key={job.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {job.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salaryRange}
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-4">{job.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">{job.jobType}</Badge>
                            <Badge variant={job.isActive ? "default" : "secondary"}>
                              {job.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-4">
                          <span>
                            {applications?.filter(app => app.jobId === job.id).length || 0} applications
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {jobsLoading && <div>Loading jobs...</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-6">
            <ApplicationsTable 
              applications={applications || []}
              onApplicationUpdated={handleApplicationUpdated}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Jobs Posted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{jobs?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">
                    {jobs?.filter(job => job.isActive).length || 0} active
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{applications?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">
                    {applications?.filter(app => app.status === 'hired').length || 0} hired
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hiring Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {applications?.length ? 
                      Math.round((applications.filter(app => app.status === 'hired').length / applications.length) * 100) 
                      : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">Success rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
