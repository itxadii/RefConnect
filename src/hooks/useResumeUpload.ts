import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useAmplifyStorage } from '@/hooks/useAmplifyStorage';
import { remove } from 'aws-amplify/storage';

export const useResumeUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { uploadResume: uploadToStorage } = useAmplifyStorage();

  const uploadResume = async (file: File): Promise<string | null> => {
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
      const DEMO_MODE = ((import.meta as any)?.env?.VITE_DEMO_MODE !== 'false');
      if (DEMO_MODE) {
        // Prototype: convert file to data URL and return
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        toast({ title: 'Resume ready (demo)', description: 'Stored locally for prototype.' });
        return dataUrl;
      }

      // Upload file using Amplify Storage (non-demo)
      const resumeUrl = await uploadToStorage(file, user.username);

      if (!resumeUrl) {
        throw new Error('Failed to upload resume');
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

  const deleteResume = async (filePath: string): Promise<void> => {
    if (!user) return;

    try {
      await remove({ key: filePath });

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