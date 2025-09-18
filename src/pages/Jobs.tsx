import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Star,
  Filter,
  Mic,
  Heart,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const jobListings = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $150k",
      posted: "2 days ago",
      skills: ["React", "TypeScript", "Tailwind"],
      matchScore: 95,
      referrers: 3,
      favorite: false,
      description: "Join our dynamic team building next-generation web applications.",
    },
    {
      id: 2,
      title: "Product Manager Intern",
      company: "Innovation Labs",
      location: "Remote",
      type: "Internship",
      salary: "$25/hour",
      posted: "1 day ago",
      skills: ["Product Strategy", "Analytics", "Figma"],
      matchScore: 87,
      referrers: 2,
      favorite: true,
      description: "Lead product initiatives and work with cross-functional teams.",
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "AI Solutions",
      location: "New York, NY",
      type: "Full-time",
      salary: "$140k - $180k",
      posted: "5 days ago",
      skills: ["Python", "Machine Learning", "SQL"],
      matchScore: 92,
      referrers: 5,
      favorite: false,
      description: "Build ML models and extract insights from large datasets.",
    },
    {
      id: 4,
      title: "UX Designer",
      company: "Creative Studios",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$100k - $130k",
      posted: "3 days ago",
      skills: ["Figma", "User Research", "Prototyping"],
      matchScore: 78,
      referrers: 1,
      favorite: false,
      description: "Design intuitive user experiences for mobile and web applications.",
    },
    {
      id: 5,
      title: "Backend Engineer Intern",
      company: "CloudTech",
      location: "Seattle, WA",
      type: "Internship",
      salary: "$30/hour",
      posted: "1 week ago",
      skills: ["Node.js", "AWS", "MongoDB"],
      matchScore: 85,
      referrers: 2,
      favorite: true,
      description: "Work on scalable backend systems and cloud infrastructure.",
    },
    {
      id: 6,
      title: "Marketing Specialist",
      company: "GrowthCo",
      location: "Chicago, IL",
      type: "Full-time",
      salary: "$70k - $90k",
      posted: "4 days ago",
      skills: ["Digital Marketing", "SEO", "Analytics"],
      matchScore: 71,
      referrers: 3,
      favorite: false,
      description: "Drive customer acquisition and brand awareness campaigns.",
    },
  ];

  const allSkills = Array.from(new Set(jobListings.flatMap(job => job.skills)));

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSkills = selectedSkills.length === 0 || 
                         selectedSkills.some(skill => job.skills.includes(skill));
    
    return matchesSearch && matchesSkills;
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
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
                <Button variant="outline" size="lg" className="h-12 px-6">
                  <Mic className="w-5 h-5 mr-2" />
                  Voice Search
                </Button>
                <Button variant="outline" size="lg" className="h-12 px-6">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Skill Tags */}
              <div className="flex flex-wrap gap-2">
                {allSkills.map(skill => (
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
                  {filteredJobs.length} Opportunities Found
                </h2>
                <div className="text-sm text-muted-foreground">
                  Sorted by match score
                </div>
              </div>

              <div className="space-y-6">
                {filteredJobs.map((job, index) => (
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
                            <Badge 
                              className={`${getMatchColor(job.matchScore)} font-semibold`}
                            >
                              {job.matchScore}% match
                            </Badge>
                          </div>
                          <CardDescription className="text-lg font-medium text-foreground">
                            {job.company}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={job.favorite ? "text-red-500" : "text-muted-foreground"}
                          >
                            <Heart className={`w-5 h-5 ${job.favorite ? "fill-current" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.salary}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.referrers} referrer{job.referrers !== 1 ? 's' : ''} available
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {job.posted}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <Button className="btn-primary flex-1">
                          Apply for Referral
                        </Button>
                        <Button variant="outline" className="flex-1">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredJobs.length === 0 && (
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
        </section>
      </main>
    </div>
  );
};

export default Jobs;