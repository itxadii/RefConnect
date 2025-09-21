-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  university TEXT,
  graduation_year INTEGER,
  skills TEXT[],
  experience_level TEXT CHECK (experience_level IN ('fresher', 'entry', 'mid', 'senior')),
  resume_url TEXT,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  skills_required TEXT[],
  location TEXT,
  job_type TEXT CHECK (job_type IN ('internship', 'full-time', 'part-time', 'contract')),
  salary_range TEXT,
  posted_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('applied', 'reviewed', 'referred', 'interview', 'hired', 'rejected')) DEFAULT 'applied',
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  cover_letter TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  points_reward INTEGER DEFAULT 0,
  requirement_type TEXT CHECK (requirement_type IN ('profile_complete', 'first_application', 'referral_accepted', 'job_secured', 'skill_milestone')),
  requirement_value INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create skill gaps table
CREATE TABLE public.skill_gaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  missing_skills TEXT[],
  recommended_resources JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can insert profiles during registration" ON public.profiles FOR INSERT WITH CHECK (true);

-- Create RLS policies for jobs
CREATE POLICY "Anyone can view active jobs" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Job creators can update their own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = posted_by);

-- Create RLS policies for applications
CREATE POLICY "Users can view their own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Job posters can view applications for their jobs" ON public.applications FOR SELECT USING (auth.uid() IN (SELECT posted_by FROM public.jobs WHERE id = job_id));
CREATE POLICY "Users can create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Job posters can update application status" ON public.applications FOR UPDATE USING (auth.uid() IN (SELECT posted_by FROM public.jobs WHERE id = job_id));

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);

-- Create RLS policies for user achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create user achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- Create RLS policies for skill gaps
CREATE POLICY "Users can view their own skill gaps" ON public.skill_gaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create skill gaps" ON public.skill_gaps FOR INSERT WITH CHECK (true);

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Create storage policies for resumes
CREATE POLICY "Users can upload their own resumes" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view their own resumes" ON storage.objects FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own resumes" ON storage.objects FOR UPDATE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own resumes" ON storage.objects FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Insert some default achievements
INSERT INTO public.achievements (name, description, icon, points_reward, requirement_type, requirement_value) VALUES
('Welcome Aboard', 'Complete your profile', '🎯', 50, 'profile_complete', 1),
('First Step', 'Submit your first job application', '🚀', 25, 'first_application', 1),
('Getting Noticed', 'Get your first referral', '⭐', 100, 'referral_accepted', 1),
('Success Story', 'Land your first job through the platform', '🏆', 500, 'job_secured', 1),
('Skill Builder', 'Add 5 skills to your profile', '📚', 75, 'skill_milestone', 5);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();