import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, Trash2, Eye } from 'lucide-react';
import { useResumeUpload } from '@/hooks/useResumeUpload';
import { useProfile } from '@/hooks/useProfile';

const ResumeUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadResume, uploading } = useResumeUpload();
  const { profile, updateProfile } = useProfile();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    const resumeUrl = await uploadResume(file);
    if (resumeUrl && profile) {
      updateProfile({ resume_url: resumeUrl });
    }
  };

  const handleDelete = async () => {
    if (!profile?.resume_url) return;
    
    const confirmed = window.confirm('Are you sure you want to delete your resume?');
    if (confirmed) {
      // Extract file path from URL
      const url = new URL(profile.resume_url);
      const filePath = url.pathname.split('/').pop();
      
      if (filePath) {
        updateProfile({ resume_url: null });
      }
    }
  };

  const handleView = () => {
    if (profile?.resume_url) {
      window.open(profile.resume_url, '_blank');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <File className="h-5 w-5" />
          Resume Management
        </CardTitle>
        <CardDescription>
          Upload your resume to apply for jobs. Supported formats: PDF, DOC, DOCX (Max 5MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {profile?.resume_url ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Resume uploaded</p>
                  <p className="text-sm text-muted-foreground">
                    Ready for job applications
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleView}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
            
            <Button
              variant="secondary"
              onClick={handleFileSelect}
              disabled={uploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload New Resume
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={handleFileSelect}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Upload your resume</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click to select a file or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOC, or DOCX files up to 5MB
              </p>
            </div>
            
            <Button
              onClick={handleFileSelect}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;