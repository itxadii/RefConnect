import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star
} from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/use-toast';
import type { Application } from '@/integrations/aws/dynamodb';

interface ApplicationsTableProps {
  applications: any[];
  onApplicationUpdated: () => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({ 
  applications, 
  onApplicationUpdated 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const { updateApplication } = useApplications();
  const { jobs } = useJobs();
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { variant: 'secondary' as const, icon: Clock, label: 'Applied' },
      reviewed: { variant: 'default' as const, icon: Eye, label: 'Reviewed' },
      referred: { variant: 'default' as const, icon: Star, label: 'Referred' },
      interview: { variant: 'default' as const, icon: Calendar, label: 'Interview' },
      hired: { variant: 'default' as const, icon: CheckCircle, label: 'Hired' },
      rejected: { variant: 'destructive' as const, icon: XCircle, label: 'Rejected' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.applied;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: Application['status']) => {
    setIsUpdating(true);
    try {
      await updateApplication(applicationId, { status: newStatus });
      toast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}.`,
      });
      onApplicationUpdated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: error.message || "Failed to update application status.",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      (app.user?.full_name?.toLowerCase?.().includes(searchTerm.toLowerCase()) ?? false) ||
      (app.job?.title?.toLowerCase?.().includes(searchTerm.toLowerCase()) ?? false) ||
      (app.job?.company?.toLowerCase?.().includes(searchTerm.toLowerCase()) ?? false) ||
      (getJobTitle(app.jobId)?.toLowerCase?.().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getJobTitle = (jobId: string) => {
    const job = jobs?.find(j => j.id === jobId);
    return job ? `${job.title} at ${job.company}` : 'Unknown Job';
  };

  const openApplicationDetail = (application: any) => {
    setSelectedApplication(application);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Applications</CardTitle>
          <CardDescription>
            Review and manage job applications from candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by candidate name, job title, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="referred">Referred</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-medium">Candidate</th>
                  <th className="p-4 font-medium">Job Position</th>
                  <th className="p-4 font-medium">Applied Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Match Score</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{app.user?.full_name || 'Unknown User'}</div>
                          <div className="text-sm text-muted-foreground">{app.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{app.job?.title || getJobTitle(app.jobId)}</div>
                      <div className="text-sm text-muted-foreground">{app.job?.company}</div>
                    </td>
                    <td className="p-4">
                      {new Date(app.createdAt || app.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="p-4">
                      {app.matchScore || app.match_score ? (
                        <div className="flex items-center gap-1">
                          <div className="w-16 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${app.matchScore ?? app.match_score}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{app.matchScore ?? app.match_score}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openApplicationDetail(app)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Select
                          value={app.status}
                          onValueChange={(value) => handleStatusUpdate(app.id, value as Application['status'])}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="referred">Referred</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(app.id, 'hired')}
                          disabled={isUpdating}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleStatusUpdate(app.id, 'rejected')}
                          disabled={isUpdating}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredApplications.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                No applications found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Application Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Candidate Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Candidate Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">
                          {selectedApplication.user?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-muted-foreground">{selectedApplication.user?.email}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{selectedApplication.user?.email}</span>
                      </div>
                      {selectedApplication.user?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedApplication.user.phone}</span>
                        </div>
                      )}
                      {selectedApplication.user?.university && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedApplication.user.university}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="outline">
                        Level {selectedApplication.user?.level || 1}
                      </Badge>
                      <Badge variant="outline">
                        {selectedApplication.user?.points || 0} points
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Job Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="font-semibold text-lg">
                        {selectedApplication.job?.title}
                      </div>
                      <div className="text-muted-foreground">{selectedApplication.job?.company}</div>
                    </div>

                    <div className="space-y-2">
                      {selectedApplication.job?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{selectedApplication.job.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Applied {new Date(selectedApplication.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="outline">{selectedApplication.job?.job_type}</Badge>
                      {selectedApplication.job?.salary_range && (
                        <Badge variant="outline">{selectedApplication.job.salary_range}</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Application Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Status:</span>
                    {getStatusBadge(selectedApplication.status)}
                  </div>

                  {selectedApplication.match_score && (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Match Score:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${selectedApplication.match_score}%` }}
                          />
                        </div>
                        <span className="font-medium">{selectedApplication.match_score}%</span>
                      </div>
                    </div>
                  )}

                  {selectedApplication.cover_letter && (
                    <div>
                      <Label className="font-medium">Cover Letter:</Label>
                      <div className="mt-2 p-4 bg-muted rounded-lg">
                        <p className="whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills and Experience */}
              {selectedApplication.user?.skills && selectedApplication.user.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Candidate Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.user.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate(selectedApplication.id, 'hired')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Candidate
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Candidate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsTable;
