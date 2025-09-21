import { useState } from 'react';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { useToast } from '@/hooks/use-toast';

export const useAmplifyStorage = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadResume = async (file: File, userId: string): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    try {
      const fileExtension = file.name.split('.').pop();
      const fileName = `resumes/${userId}/resume-${Date.now()}.${fileExtension}`;

      const result = await uploadData({
        key: fileName,
        data: file,
        options: {
          contentType: file.type,
        },
      }).result;

      // Get the public URL for the uploaded file
      const urlResult = await getUrl({
        key: fileName,
        options: {
          expiresIn: 86400, // 24 hours
        },
      });

      toast({
        title: "Resume uploaded!",
        description: "Your resume has been uploaded successfully.",
      });

      return urlResult.url.toString();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || 'An error occurred while uploading your resume.',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteResume = async (fileKey: string): Promise<boolean> => {
    try {
      await remove({ key: fileKey });
      toast({
        title: "Resume deleted",
        description: "Your resume has been deleted successfully.",
      });
      return true;
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error.message || 'An error occurred while deleting your resume.',
      });
      return false;
    }
  };

  const getFileUrl = async (fileKey: string): Promise<string | null> => {
    try {
      const result = await getUrl({
        key: fileKey,
        options: {
          expiresIn: 3600, // 1 hour
        },
      });
      return result.url.toString();
    } catch (error: any) {
      console.error('Get URL error:', error);
      return null;
    }
  };

  return {
    uploadResume,
    deleteResume,
    getFileUrl,
    uploading,
  };
};
