import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadResume = async (file: File) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to upload a resume.",
      });
      return null;
    }

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/resume-${Date.now()}.${fileExt}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      const resumeUrl = urlData.publicUrl;

      // Update profile with resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: resumeUrl })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Success",
        description: "Resume uploaded successfully!",
      });

      return resumeUrl;
    } catch (error: any) {
      console.error('Error uploading resume:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to upload resume. Please try again.",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteResume = async (filePath: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.storage
        .from('resumes')
        .remove([filePath]);

      if (error) throw error;

      // Remove resume URL from profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: null })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Resume deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting resume:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resume.",
      });
    }
  };

  return {
    uploadResume,
    deleteResume,
    uploading,
  };
};