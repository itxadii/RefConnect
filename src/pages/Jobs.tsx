import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useJobs } from '@/hooks/useJobs';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import VoiceSearch from '@/components/VoiceSearch';
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Filter,
  Heart,
  ExternalLink,
  Briefcase,
  Building
} from "lucide-react";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const { jobs, loading, fetchJobs } = useJobs();
  const { submitApplication } = useApplications();
  const { profile } = useProfile();
  
  const skills = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'SQL', 'Angular', 'Vue.js'];

  useEffect(() => {
    const filters = {
      search: searchQuery,
      skills: selectedSkills,
      jobType: selectedType === 'all' ? undefined : selectedType
    };
    fetchJobs(filters);
  }, [searchQuery, selectedType, selectedSkills, fetchJobs]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleVoiceSearch = (transcript: string) => {
    setSearchQuery(transcript);
  };

  const handleApply = async (jobId: string) => {
    if (!profile?.resume_url) {
      alert('Please upload your resume first to apply for jobs.');
      return;
    }
    
    await submitApplication(jobId);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Search Header */}
        <section className="bg-gradient-subtle py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                Find Your Perfect Opportunity
              </h1>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search jobs by title, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
                <VoiceSearch 
                  onTranscript={handleVoiceSearch}
                  placeholder="Try saying 'React developer jobs in San Francisco'"
                />
                <Button variant="outline" size="lg" className="h-12 px-6">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedSkills.includes(skill) 
                        ? "bg-primary text-white hover:bg-primary/90" 
                        : "hover:bg-accent"
                    }`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Job Listings */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold">
                  {loading ? 'Loading...' : `${jobs.length} Opportunities Found`}
                </h2>
                <div className="text-sm text-muted-foreground">
                  Sorted by relevance
                </div>
              </div>

              <div className="space-y-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : jobs.length > 0 ? (
                  jobs.map((job, index) => (
                    <Card 
                      key={job.id} 
                      className="card-hover animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl hover:text-primary transition-colors cursor-pointer">
                                {job.title}
                              </CardTitle>
                            </div>
                            <CardDescription className="text-lg font-medium text-foreground flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              {job.company}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Heart className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {job.description && (
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {job.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                          )}
                          {job.job_type && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.job_type}
                            </div>
                          )}
                          {job.salary_range && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary_range}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Posted {new Date(job.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        {job.skills_required && job.skills_required.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills_required.map(skill => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}

                        {job.requirements && job.requirements.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2 text-sm">Requirements:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {job.requirements.slice(0, 3).map((req, reqIndex) => (
                                <li key={reqIndex} className="flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex gap-3">
                          <Button 
                            className="btn-primary flex-1"
                            onClick={() => handleApply(job.id)}
                          >
                            Apply for Referral
                          </Button>
                          <Button variant="outline" className="flex-1">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or skills filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Jobs;