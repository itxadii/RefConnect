import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand, BatchGetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

const APPLICATIONS_TABLE = process.env.APPLICATIONS_TABLE || 'talkandgrow-portal-applications';
const PROFILES_TABLE = process.env.PROFILES_TABLE || 'talkandgrow-portal-profiles';
const JOBS_TABLE = process.env.JOBS_TABLE || 'talkandgrow-portal-jobs';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    // For now, we'll skip authentication to test basic functionality
    // Later, uncomment the lines below when Cognito is set up
    // const userId = event.requestContext.authorizer?.claims?.sub;
    // if (!userId) {
    //   return {
    //     statusCode: 401,
    //     headers,
    //     body: JSON.stringify({ error: 'Unauthorized' }),
    //   };
    // }
    
    // Temporary user ID for testing
    const userId = 'test-user-id';

    switch (event.httpMethod) {
      case 'GET':
        return await getApplications(event, userId, headers);
      case 'POST':
        return await createApplication(event, userId, headers);
      case 'PUT':
        return await updateApplication(event, userId, headers);
      case 'DELETE':
        return await deleteApplication(event, userId, headers);
      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

async function getApplications(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters || {};
  const queryParams = event.queryStringParameters || {};

  if (id) {
    // Get application by ID
    const result = await dynamoDB.send(new GetCommand({
      TableName: APPLICATIONS_TABLE,
      Key: { id },
    }));

    if (result.Item) {
      // Get related data
      const applicationWithDetails = await getApplicationWithDetails([result.Item as any]);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(applicationWithDetails[0]),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Application not found' }),
    };
  } else if (queryParams.userId) {
    // Get applications by user ID
    const result = await dynamoDB.send(new QueryCommand({
      TableName: APPLICATIONS_TABLE,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': queryParams.userId,
      },
    }));

    const applicationsWithDetails = await getApplicationWithDetails(result.Items as any[]);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(applicationsWithDetails),
    };
  } else if (queryParams.jobId) {
    // Get applications by job ID
    const result = await dynamoDB.send(new QueryCommand({
      TableName: APPLICATIONS_TABLE,
      IndexName: 'jobId-index',
      KeyConditionExpression: 'jobId = :jobId',
      ExpressionAttributeValues: {
        ':jobId': queryParams.jobId,
      },
    }));

    const applicationsWithDetails = await getApplicationWithDetails(result.Items as any[]);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(applicationsWithDetails),
    };
  } else {
    // Get all applications (admin only)
    const result = await dynamoDB.send(new ScanCommand({
      TableName: APPLICATIONS_TABLE,
    }));

    const applicationsWithDetails = await getApplicationWithDetails(result.Items as any[]);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(applicationsWithDetails),
    };
  }
}

async function createApplication(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const applicationData = JSON.parse(event.body || '{}');
  const now = new Date().toISOString();

  // Check if user already applied for this job
  const existingApplication = await dynamoDB.send(new QueryCommand({
    TableName: APPLICATIONS_TABLE,
    IndexName: 'userId-jobId-index',
    KeyConditionExpression: 'userId = :userId AND jobId = :jobId',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':jobId': applicationData.jobId,
    },
  }));

  if (existingApplication.Items && existingApplication.Items.length > 0) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'You have already applied for this job' }),
    };
  }

  const application = {
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    ...applicationData,
    status: 'applied',
    createdAt: now,
    updatedAt: now,
  };

  await dynamoDB.send(new PutCommand({
    TableName: APPLICATIONS_TABLE,
    Item: application,
  }));

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(application),
  };
}

async function updateApplication(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters || {};
  const updates = JSON.parse(event.body || '{}');
  const now = new Date().toISOString();

  // Get existing application
  const existingApplication = await dynamoDB.send(new GetCommand({
    TableName: APPLICATIONS_TABLE,
    Key: { id },
  }));

  if (!existingApplication.Item) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Application not found' }),
    };
  }

  // Check if user owns the application or is admin
  const isOwner = existingApplication.Item.userId === userId;
  const isAdmin = await checkIfUserIsAdmin(userId);

  if (!isOwner && !isAdmin) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  const updateExpressions = ['updatedAt = :updatedAt'];
  const expressionAttributeValues: any = { ':updatedAt': now };

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'createdAt' && key !== 'userId' && key !== 'jobId' && value !== undefined) {
      updateExpressions.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  const result = await dynamoDB.send(new UpdateCommand({
    TableName: APPLICATIONS_TABLE,
    Key: { id },
    UpdateExpression: `SET ${updateExpressions.join(', ')}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  }));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(result.Attributes),
  };
}

async function deleteApplication(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters || {};

  // Get existing application
  const existingApplication = await dynamoDB.send(new GetCommand({
    TableName: APPLICATIONS_TABLE,
    Key: { id },
  }));

  if (!existingApplication.Item) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Application not found' }),
    };
  }

  // Check if user owns the application or is admin
  const isOwner = existingApplication.Item.userId === userId;
  const isAdmin = await checkIfUserIsAdmin(userId);

  if (!isOwner && !isAdmin) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  await dynamoDB.send(new DeleteCommand({
    TableName: APPLICATIONS_TABLE,
    Key: { id },
  }));

  return {
    statusCode: 204,
    headers,
    body: '',
  };
}

async function getApplicationWithDetails(applications: any[]) {
  const userIds = [...new Set(applications.map(app => app.userId))];
  const jobIds = [...new Set(applications.map(app => app.jobId))];

  // Batch get profiles
  const profilesResult = await dynamoDB.send(new BatchGetCommand({
    RequestItems: {
      [PROFILES_TABLE]: {
        Keys: userIds.map(userId => ({ id: userId })),
      },
    },
  }));

  // Batch get jobs
  const jobsResult = await dynamoDB.send(new BatchGetCommand({
    RequestItems: {
      [JOBS_TABLE]: {
        Keys: jobIds.map(jobId => ({ id: jobId })),
      },
    },
  }));

  const profiles = profilesResult.Responses?.[PROFILES_TABLE] || [];
  const jobs = jobsResult.Responses?.[JOBS_TABLE] || [];

  return applications.map(application => ({
    ...application,
    user: profiles.find((profile: any) => profile.userId === application.userId),
    job: jobs.find((job: any) => job.id === application.jobId),
  }));
}

async function checkIfUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const result = await dynamoDB.send(new QueryCommand({
      TableName: PROFILES_TABLE,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    const profile = result.Items?.[0];
    return profile?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

