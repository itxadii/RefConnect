import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.JOBS_TABLE || 'talkandgrow-portal-jobs';

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
        return await getJobs(event, userId, headers);
      case 'POST':
        return await createJob(event, userId, headers);
      case 'PUT':
        return await updateJob(event, userId, headers);
      case 'DELETE':
        return await deleteJob(event, userId, headers);
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

async function getJobs(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters || {};
  const queryParams = event.queryStringParameters || {};

  if (id) {
    // Get job by ID
    const result = await dynamoDB.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item),
    };
  } else if (queryParams.postedBy) {
    // Get jobs by posted by
    const result = await dynamoDB.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'postedBy-index',
      KeyConditionExpression: 'postedBy = :postedBy',
      ExpressionAttributeValues: {
        ':postedBy': queryParams.postedBy,
      },
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items),
    };
  } else {
    // Get all jobs
    const result = await dynamoDB.send(new ScanCommand({
      TableName: TABLE_NAME,
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items),
    };
  }
}

async function createJob(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const jobData = JSON.parse(event.body || '{}');
  const now = new Date().toISOString();

  const job = {
    id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    postedBy: userId,
    ...jobData,
    createdAt: now,
    updatedAt: now,
  };

  await dynamoDB.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: job,
  }));

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(job),
  };
}

async function updateJob(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters || {};
  const updates = JSON.parse(event.body || '{}');
  const now = new Date().toISOString();

  // Verify the job belongs to the user
  const existingJob = await dynamoDB.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  }));

  if (!existingJob.Item || existingJob.Item.postedBy !== userId) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  const updateExpressions = ['updatedAt = :updatedAt'];
  const expressionAttributeValues: any = { ':updatedAt': now };

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'createdAt' && key !== 'postedBy' && value !== undefined) {
      updateExpressions.push(`${key} = :${key}`);
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  const result = await dynamoDB.send(new UpdateCommand({
    TableName: TABLE_NAME,
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

async function deleteJob(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters || {};

  // Verify the job belongs to the user
  const existingJob = await dynamoDB.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { id },
  }));

  if (!existingJob.Item || existingJob.Item.postedBy !== userId) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ error: 'Forbidden' }),
    };
  }

  await dynamoDB.send(new DeleteCommand({
    TableName: TABLE_NAME,
    Key: { id },
  }));

  return {
    statusCode: 204,
    headers,
    body: '',
  };
}

