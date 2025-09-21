import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const client = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamoDB = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.PROFILES_TABLE || 'talkandgrow-portal-profiles';

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
        return await getProfile(event, userId, headers);
      case 'POST':
        return await createProfile(event, userId, headers);
      case 'PUT':
        return await updateProfile(event, userId, headers);
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

async function getProfile(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters || {};

  if (id) {
    // Get profile by ID
    const result = await dynamoDB.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item),
    };
  } else {
    // Get profile by user ID
    const result = await dynamoDB.send(new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'userId-index',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items?.[0] || null),
    };
  }
}

async function createProfile(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const profileData = JSON.parse(event.body || '{}');
  const now = new Date().toISOString();

  const profile = {
    id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    ...profileData,
    createdAt: now,
    updatedAt: now,
  };

  await dynamoDB.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: profile,
  }));

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify(profile),
  };
}

async function updateProfile(event: APIGatewayProxyEvent, userId: string, headers: any): Promise<APIGatewayProxyResult> {
  const { id } = event.pathParameters || {};
  const updates = JSON.parse(event.body || '{}');
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

