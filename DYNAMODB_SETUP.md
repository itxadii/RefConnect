# DynamoDB Serverless Setup Guide

This guide will help you set up your Talk and Grow Portal with AWS DynamoDB as the backend database, replacing Supabase completely.

## Overview

The migration includes:
- **DynamoDB Tables**: Serverless NoSQL database for all data
- **AWS Cognito**: User authentication and authorization
- **Lambda Functions**: Serverless API endpoints
- **API Gateway**: RESTful API management
- **S3**: File storage for resumes

## Prerequisites

1. AWS Account with appropriate permissions
2. AWS CLI configured
3. Node.js and npm installed
4. Serverless Framework (optional but recommended)

## Step 1: Create DynamoDB Tables

### Profiles Table
```bash
aws dynamodb create-table \
  --table-name talkandgrow-portal-profiles \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### Jobs Table
```bash
aws dynamodb create-table \
  --table-name talkandgrow-portal-jobs \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=postedBy,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=postedBy-index,KeySchema=[{AttributeName=postedBy,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### Applications Table
```bash
aws dynamodb create-table \
  --table-name talkandgrow-portal-applications \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=jobId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    IndexName=jobId-index,KeySchema=[{AttributeName=jobId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    IndexName=userId-jobId-index,KeySchema=[{AttributeName=userId,KeyType=HASH},{AttributeName=jobId,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### Achievements Table
```bash
aws dynamodb create-table \
  --table-name talkandgrow-portal-achievements \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### User Achievements Table
```bash
aws dynamodb create-table \
  --table-name talkandgrow-portal-user-achievements \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=achievementId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    IndexName=achievementId-index,KeySchema=[{AttributeName=achievementId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

### Skill Gaps Table
```bash
aws dynamodb create-table \
  --table-name talkandgrow-portal-skill-gaps \
  --attribute-definitions \
    AttributeName=id,AttributeType=S \
    AttributeName=userId,AttributeType=S \
    AttributeName=jobId,AttributeType=S \
  --key-schema \
    AttributeName=id,KeyType=HASH \
  --global-secondary-indexes \
    IndexName=userId-index,KeySchema=[{AttributeName=userId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
    IndexName=jobId-index,KeySchema=[{AttributeName=jobId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5} \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
```

## Step 2: Set Up AWS Cognito

### Create User Pool
```bash
aws cognito-idp create-user-pool \
  --pool-name talkandgrow-portal-users \
  --policies PasswordPolicy='{MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}' \
  --auto-verified-attributes email \
  --username-attributes email \
  --schema Name=email,AttributeDataType=String,Required=true,Mutable=true \
  --schema Name=name,AttributeDataType=String,Required=true,Mutable=true
```

### Create User Pool Client
```bash
aws cognito-idp create-user-pool-client \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-name talkandgrow-portal-client \
  --explicit-auth-flows ADMIN_NO_SRP_AUTH USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH \
  --generate-secret
```

### Create Identity Pool
```bash
aws cognito-identity create-identity-pool \
  --identity-pool-name talkandgrow-portal-identity \
  --allow-unauthenticated-identities \
  --cognito-identity-providers ProviderName=cognito-idp.us-east-1.amazonaws.com/YOUR_USER_POOL_ID,ClientId=YOUR_CLIENT_ID
```

## Step 3: Deploy Lambda Functions

### Install Serverless Framework
```bash
npm install -g serverless
npm install serverless-offline
```

### Create serverless.yml
```yaml
service: talkandgrow-portal-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    PROFILES_TABLE: talkandgrow-portal-profiles
    JOBS_TABLE: talkandgrow-portal-jobs
    APPLICATIONS_TABLE: talkandgrow-portal-applications
    ACHIEVEMENTS_TABLE: talkandgrow-portal-achievements
    USER_ACHIEVEMENTS_TABLE: talkandgrow-portal-user-achievements
    SKILL_GAPS_TABLE: talkandgrow-portal-skill-gaps
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
        - dynamodb:BatchGetItem
      Resource:
        - "arn:aws:dynamodb:us-east-1:*:table/talkandgrow-portal-*"

functions:
  profiles:
    handler: lambda/functions/profiles/handler.handler
    events:
      - http:
          path: profiles
          method: ANY
          cors: true
          authorizer:
            name: CognitoAuthorizer
            type: COGNITO_USER_POOLS
            arn: arn:aws:cognito-idp:us-east-1:ACCOUNT_ID:userpool/USER_POOL_ID

  jobs:
    handler: lambda/functions/jobs/handler.handler
    events:
      - http:
          path: jobs
          method: ANY
          cors: true
          authorizer:
            name: CognitoAuthorizer
            type: COGNITO_USER_POOLS
            arn: arn:aws:cognito-idp:us-east-1:ACCOUNT_ID:userpool/USER_POOL_ID

  applications:
    handler: lambda/functions/applications/handler.handler
    events:
      - http:
          path: applications
          method: ANY
          cors: true
          authorizer:
            name: CognitoAuthorizer
            type: COGNITO_USER_POOLS
            arn: arn:aws:cognito-idp:us-east-1:ACCOUNT_ID:userpool/USER_POOL_ID

plugins:
  - serverless-offline
```

### Deploy Functions
```bash
serverless deploy
```

## Step 4: Set Up S3 for File Storage

### Create S3 Bucket
```bash
aws s3 mb s3://talkandgrow-portal-resumes
```

### Create Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCognitoUsers",
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::talkandgrow-portal-resumes",
        "arn:aws:s3:::talkandgrow-portal-resumes/*"
      ]
    }
  ]
}
```

## Step 5: Configure Environment Variables

Create a `.env` file in your project root:

```env
# AWS Configuration
REACT_APP_AWS_REGION=us-east-1
REACT_APP_USER_POOL_ID=us-east-1_XXXXXXXXX
REACT_APP_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# API Configuration
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/prod

# AWS Credentials (for development only)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Step 6: Update Amplify Configuration

Update `src/aws-exports.js` with your actual values:

```javascript
const awsmobile = {
  "aws_project_region": "us-east-1",
  "aws_cognito_identity_pool_id": "us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "aws_cognito_region": "us-east-1",
  "aws_user_pools_id": "us-east-1_XXXXXXXXX",
  "aws_user_pools_web_client_id": "xxxxxxxxxxxxxxxxxxxxxxxxxx",
  "oauth": {},
  "aws_cognito_username_attributes": ["EMAIL"],
  "aws_cognito_social_providers": [],
  "aws_cognito_signup_attributes": ["EMAIL", "NAME"],
  "aws_cognito_mfa_configuration": "OFF",
  "aws_cognito_mfa_types": ["SMS"],
  "aws_cognito_password_protection_settings": {
    "passwordPolicyMinLength": 8,
    "passwordPolicyCharacters": []
  },
  "aws_cognito_verification_mechanisms": ["EMAIL"],
  "aws_user_files_s3_bucket": "talkandgrow-portal-resumes",
  "aws_user_files_s3_bucket_region": "us-east-1"
};
```

## Step 7: Install Dependencies

```bash
npm install
npm install aws-amplify
npm install @aws-sdk/client-dynamodb
npm install @aws-sdk/lib-dynamodb
npm install @aws-sdk/client-cognito-identity-provider
```

## Step 8: Data Migration (if migrating from Supabase)

### Export Data from Supabase
```sql
-- Export profiles
COPY (SELECT * FROM profiles) TO '/tmp/profiles.csv' WITH CSV HEADER;

-- Export jobs
COPY (SELECT * FROM jobs) TO '/tmp/jobs.csv' WITH CSV HEADER;

-- Export applications
COPY (SELECT * FROM applications) TO '/tmp/applications.csv' WITH CSV HEADER;
```

### Import to DynamoDB
Create a migration script:

```javascript
// migrate-data.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const fs = require('fs');
const csv = require('csv-parser');

const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDB = DynamoDBDocumentClient.from(client);

async function migrateTable(tableName, csvFile) {
  const items = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFile)
      .pipe(csv())
      .on('data', (row) => {
        // Convert CSV row to DynamoDB item format
        const item = {
          id: row.id,
          ...row,
          // Convert arrays if needed
          skills: row.skills ? JSON.parse(row.skills) : [],
          requirements: row.requirements ? JSON.parse(row.requirements) : [],
          skillsRequired: row.skills_required ? JSON.parse(row.skills_required) : [],
        };
        items.push(item);
      })
      .on('end', async () => {
        try {
          for (const item of items) {
            await dynamoDB.send(new PutCommand({
              TableName: tableName,
              Item: item,
            }));
          }
          console.log(`Migrated ${items.length} items to ${tableName}`);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
  });
}

// Run migrations
async function runMigrations() {
  try {
    await migrateTable('talkandgrow-portal-profiles', '/tmp/profiles.csv');
    await migrateTable('talkandgrow-portal-jobs', '/tmp/jobs.csv');
    await migrateTable('talkandgrow-portal-applications', '/tmp/applications.csv');
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

runMigrations();
```

## Step 9: Testing

### Test Authentication
```bash
# Test user registration
curl -X POST https://your-api-gateway-url.amazonaws.com/prod/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123","name":"Test User"}'

# Test user login
curl -X POST https://your-api-gateway-url.amazonaws.com/prod/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123"}'
```

### Test API Endpoints
```bash
# Test jobs endpoint
curl -X GET https://your-api-gateway-url.amazonaws.com/prod/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test applications endpoint
curl -X GET https://your-api-gateway-url.amazonaws.com/prod/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Step 10: Production Considerations

### Security
1. **Enable WAF**: Protect your API Gateway
2. **Use VPC**: For Lambda functions if needed
3. **Encrypt Data**: Enable encryption at rest for DynamoDB
4. **IAM Roles**: Use least privilege principle

### Performance
1. **Enable Caching**: API Gateway caching
2. **Optimize Queries**: Use proper indexes
3. **Auto Scaling**: Configure DynamoDB auto scaling
4. **CDN**: Use CloudFront for static assets

### Monitoring
1. **CloudWatch**: Set up monitoring and alerts
2. **X-Ray**: Enable distributed tracing
3. **Logs**: Centralized logging
4. **Metrics**: Custom metrics for business logic

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure API Gateway has CORS enabled
   - Check Lambda function CORS headers

2. **Authentication Failures**
   - Verify Cognito configuration
   - Check JWT token expiration
   - Ensure proper IAM permissions

3. **DynamoDB Errors**
   - Check table permissions
   - Verify attribute types match
   - Ensure indexes are created

4. **Lambda Timeouts**
   - Increase timeout in serverless.yml
   - Optimize database queries
   - Use connection pooling

### Debug Commands

```bash
# Check Lambda logs
serverless logs -f profiles

# Test locally
serverless offline

# Check DynamoDB items
aws dynamodb scan --table-name talkandgrow-portal-profiles --limit 5
```

## Cost Optimization

1. **DynamoDB**: Use on-demand billing for variable workloads
2. **Lambda**: Optimize memory allocation
3. **API Gateway**: Use caching to reduce calls
4. **S3**: Use appropriate storage classes

## Next Steps

1. Set up CI/CD pipeline
2. Implement monitoring and alerting
3. Add automated testing
4. Set up backup and disaster recovery
5. Performance optimization
6. Security hardening

Your serverless DynamoDB setup is now ready! The application will use AWS services for all backend functionality while maintaining the same user experience.
