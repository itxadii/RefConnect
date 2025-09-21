import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const client = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '',
  },
});

export const dynamoDB = DynamoDBDocumentClient.from(client);

// Table names
export const TABLES = {
  PROFILES: 'talkandgrow-portal-profiles',
  JOBS: 'talkandgrow-portal-jobs',
  APPLICATIONS: 'talkandgrow-portal-applications',
  ACHIEVEMENTS: 'talkandgrow-portal-achievements',
  USER_ACHIEVEMENTS: 'talkandgrow-portal-user-achievements',
  SKILL_GAPS: 'talkandgrow-portal-skill-gaps',
} as const;

// Types for DynamoDB items
export interface Profile {
  id: string;
  userId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  university?: string;
  graduationYear?: number;
  skills?: string[];
  experienceLevel?: 'fresher' | 'entry' | 'mid' | 'senior';
  resumeUrl?: string;
  points?: number;
  level?: number;
  role?: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description?: string;
  requirements?: string[];
  skillsRequired?: string[];
  location?: string;
  jobType: 'internship' | 'full-time' | 'part-time' | 'contract';
  salaryRange?: string;
  postedBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'applied' | 'reviewed' | 'referred' | 'interview' | 'hired' | 'rejected';
  matchScore?: number;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  pointsReward: number;
  requirementType: 'profile_complete' | 'first_application' | 'referral_accepted' | 'job_secured' | 'skill_milestone';
  requirementValue: number;
  createdAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: string;
}

export interface SkillGap {
  id: string;
  userId: string;
  jobId: string;
  missingSkills?: string[];
  recommendedResources?: any;
  createdAt: string;
}

