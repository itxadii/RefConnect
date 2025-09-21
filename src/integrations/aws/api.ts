import { dynamoDB, TABLES } from './dynamodb';
import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand, 
  ScanCommand,
  BatchGetCommand
} from '@aws-sdk/lib-dynamodb';
import type { Profile, Job, Application, Achievement, UserAchievement, SkillGap } from './dynamodb';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://main.d3rxz7un017lf0.amplifyapp.com/';

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Profile API
export const profileAPI = {
  // Create or update profile
  async createOrUpdate(profile: Omit<Profile, 'createdAt' | 'updatedAt'>): Promise<Profile> {
    const now = new Date().toISOString();
    const profileData: Profile = {
      ...profile,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDB.send(new PutCommand({
      TableName: TABLES.PROFILES,
      Item: profileData,
    }));

    return profileData;
  },

  // Get profile by user ID
  async getByUserId(userId: string): Promise<Profile | null> {
    const result = await dynamoDB.send(new QueryCommand({
      TableName: TABLES.PROFILES,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    return result.Items?.[0] as Profile || null;
  },

  // Get profile by ID
  async getById(id: string): Promise<Profile | null> {
    const result = await dynamoDB.send(new GetCommand({
      TableName: TABLES.PROFILES,
      Key: { id },
    }));

    return result.Item as Profile || null;
  },

  // Update profile
  async update(id: string, updates: Partial<Profile>): Promise<Profile> {
    const now = new Date().toISOString();
    
    const result = await dynamoDB.send(new UpdateCommand({
      TableName: TABLES.PROFILES,
      Key: { id },
      UpdateExpression: 'SET updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':updatedAt': now,
      },
      ReturnValues: 'ALL_NEW',
    }));

    // Add the updates to the expression
    const updateExpressions = ['updatedAt = :updatedAt'];
    const expressionAttributeValues: any = { ':updatedAt': now };

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && value !== undefined) {
        updateExpressions.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    const finalResult = await dynamoDB.send(new UpdateCommand({
      TableName: TABLES.PROFILES,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return finalResult.Attributes as Profile;
  },
};

// Jobs API
export const jobsAPI = {
  // Create job
  async create(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    const id = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const jobData: Job = {
      ...job,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDB.send(new PutCommand({
      TableName: TABLES.JOBS,
      Item: jobData,
    }));

    return jobData;
  },

  // Get job by ID
  async getById(id: string): Promise<Job | null> {
    const result = await dynamoDB.send(new GetCommand({
      TableName: TABLES.JOBS,
      Key: { id },
    }));

    return result.Item as Job || null;
  },

  // Get all jobs
  async getAll(): Promise<Job[]> {
    const result = await dynamoDB.send(new ScanCommand({
      TableName: TABLES.JOBS,
    }));

    return result.Items as Job[] || [];
  },

  // Get jobs by posted by
  async getByPostedBy(postedBy: string): Promise<Job[]> {
    const result = await dynamoDB.send(new QueryCommand({
      TableName: TABLES.JOBS,
      IndexName: 'postedBy-index',
      KeyConditionExpression: 'postedBy = :postedBy',
      ExpressionAttributeValues: {
        ':postedBy': postedBy,
      },
    }));

    return result.Items as Job[] || [];
  },

  // Update job
  async update(id: string, updates: Partial<Job>): Promise<Job> {
    const now = new Date().toISOString();
    
    const updateExpressions = ['updatedAt = :updatedAt'];
    const expressionAttributeValues: any = { ':updatedAt': now };

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && value !== undefined) {
        updateExpressions.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    const result = await dynamoDB.send(new UpdateCommand({
      TableName: TABLES.JOBS,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes as Job;
  },

  // Delete job
  async delete(id: string): Promise<void> {
    await dynamoDB.send(new DeleteCommand({
      TableName: TABLES.JOBS,
      Key: { id },
    }));
  },
};

// Applications API
export const applicationsAPI = {
  // Create application
  async create(application: Omit<Application, 'id' | 'createdAt' | 'updatedAt'>): Promise<Application> {
    const id = `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const applicationData: Application = {
      ...application,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDB.send(new PutCommand({
      TableName: TABLES.APPLICATIONS,
      Item: applicationData,
    }));

    return applicationData;
  },

  // Get application by ID
  async getById(id: string): Promise<Application | null> {
    const result = await dynamoDB.send(new GetCommand({
      TableName: TABLES.APPLICATIONS,
      Key: { id },
    }));

    return result.Item as Application || null;
  },

  // Get all applications
  async getAll(): Promise<Application[]> {
    const result = await dynamoDB.send(new ScanCommand({
      TableName: TABLES.APPLICATIONS,
    }));

    return result.Items as Application[] || [];
  },

  // Get applications by user ID
  async getByUserId(userId: string): Promise<Application[]> {
    const result = await dynamoDB.send(new QueryCommand({
      TableName: TABLES.APPLICATIONS,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    return result.Items as Application[] || [];
  },

  // Get applications by job ID
  async getByJobId(jobId: string): Promise<Application[]> {
    const result = await dynamoDB.send(new QueryCommand({
      TableName: TABLES.APPLICATIONS,
      IndexName: 'jobId-index',
      KeyConditionExpression: 'jobId = :jobId',
      ExpressionAttributeValues: {
        ':jobId': jobId,
      },
    }));

    return result.Items as Application[] || [];
  },

  // Update application
  async update(id: string, updates: Partial<Application>): Promise<Application> {
    const now = new Date().toISOString();
    
    const updateExpressions = ['updatedAt = :updatedAt'];
    const expressionAttributeValues: any = { ':updatedAt': now };

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && value !== undefined) {
        updateExpressions.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    const result = await dynamoDB.send(new UpdateCommand({
      TableName: TABLES.APPLICATIONS,
      Key: { id },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes as Application;
  },

  // Delete application
  async delete(id: string): Promise<void> {
    await dynamoDB.send(new DeleteCommand({
      TableName: TABLES.APPLICATIONS,
      Key: { id },
    }));
  },
};

// Achievements API
export const achievementsAPI = {
  // Get all achievements
  async getAll(): Promise<Achievement[]> {
    const result = await dynamoDB.send(new ScanCommand({
      TableName: TABLES.ACHIEVEMENTS,
    }));
    return (result.Items as Achievement[]) || [];
  },

  // Get user achievements by user ID
  async getByUserId(userId: string): Promise<UserAchievement[]> {
    const result = await dynamoDB.send(new QueryCommand({
      TableName: TABLES.USER_ACHIEVEMENTS,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    return (result.Items as UserAchievement[]) || [];
  },
};

// Helper function to get applications with user and job data
export const getApplicationsWithDetails = async (applications: Application[]) => {
  const userIds = [...new Set(applications.map(app => app.userId))];
  const jobIds = [...new Set(applications.map(app => app.jobId))];

  // Batch get profiles
  const profilesResult = await dynamoDB.send(new BatchGetCommand({
    RequestItems: {
      [TABLES.PROFILES]: {
        Keys: userIds.map(userId => ({ id: userId })),
      },
    },
  }));

  // Batch get jobs
  const jobsResult = await dynamoDB.send(new BatchGetCommand({
    RequestItems: {
      [TABLES.JOBS]: {
        Keys: jobIds.map(jobId => ({ id: jobId })),
      },
    },
  }));

  const profiles = profilesResult.Responses?.[TABLES.PROFILES] as Profile[] || [];
  const jobs = jobsResult.Responses?.[TABLES.JOBS] as Job[] || [];

  return applications.map(application => ({
    ...application,
    user: profiles.find(profile => profile.userId === application.userId),
    job: jobs.find(job => job.id === application.jobId),
  }));
};

