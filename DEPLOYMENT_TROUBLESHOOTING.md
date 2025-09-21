# Serverless Deployment Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Issue 1: "Cannot resolve environment variable" Error

**Error Message:**
```
Cannot resolve '${env:USER_POOL_ID}' variable at 'custom.cognito.userPoolId'
```

**Solution:**
This happens because Cognito environment variables are not set. Use the simplified deployment first:

```bash
# Deploy without authentication first
serverless deploy --config serverless-simple.yml --stage dev
```

### Issue 2: AWS CLI Not Configured

**Error Message:**
```
The config profile (default) could not be found
```

**Solution:**
```bash
# Configure AWS CLI
aws configure
# Enter your Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)

# Test configuration
aws sts get-caller-identity
```

### Issue 3: Serverless Framework Not Installed

**Error Message:**
```
'serverless' is not recognized as an internal or external command
```

**Solution:**
```bash
# Install Serverless Framework globally
npm install -g serverless

# Verify installation
serverless --version
```

### Issue 4: Permission Denied

**Error Message:**
```
Access Denied: User is not authorized to perform: dynamodb:CreateTable
```

**Solution:**
Your AWS user needs these permissions:
- `dynamodb:*`
- `lambda:*`
- `apigateway:*`
- `iam:*`
- `s3:*`

### Issue 5: Region Mismatch

**Error Message:**
```
The security token included in the request is invalid
```

**Solution:**
```bash
# Check your AWS region
aws configure get region

# Set correct region
aws configure set region us-east-1
```

## 🚀 Step-by-Step Deployment Process

### Step 1: Verify Prerequisites

```bash
# Check AWS CLI
aws --version
aws sts get-caller-identity

# Check Serverless Framework
serverless --version

# Check Node.js
node --version
npm --version
```

### Step 2: Deploy Infrastructure First

```bash
# Deploy DynamoDB tables and S3 bucket (without authentication)
serverless deploy --config serverless-simple.yml --stage dev
```

**Expected Output:**
```
Service Information
service: talkandgrow-portal-api
stage: dev
region: us-east-1
stack: talkandgrow-portal-api-dev
resources: 8
api keys:
  None
endpoints:
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/jobs
  GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/jobs
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/profiles
  GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/profiles
  POST - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/applications
  GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/applications
functions:
  profiles: talkandgrow-portal-api-dev-profiles
  jobs: talkandgrow-portal-api-dev-jobs
  applications: talkandgrow-portal-api-dev-applications
```

### Step 3: Test Basic API Endpoints

```bash
# Test jobs endpoint
curl -X GET https://your-api-gateway-url.amazonaws.com/dev/jobs

# Test profiles endpoint
curl -X GET https://your-api-gateway-url.amazonaws.com/dev/profiles

# Test applications endpoint
curl -X GET https://your-api-gateway-url.amazonaws.com/dev/applications
```

### Step 4: Set Up Cognito (Optional for now)

```bash
# Create User Pool
aws cognito-idp create-user-pool \
  --pool-name talkandgrow-portal-users \
  --policies PasswordPolicy='{MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}' \
  --auto-verified-attributes email \
  --username-attributes email \
  --schema Name=email,AttributeDataType=String,Required=true,Mutable=true \
  --schema Name=name,AttributeDataType=String,Required=true,Mutable=true

# Create User Pool Client
aws cognito-idp create-user-pool-client \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-name talkandgrow-portal-client \
  --explicit-auth-flows ADMIN_NO_SRP_AUTH USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH \
  --generate-secret false
```

### Step 5: Create Environment File

```bash
# Create .env file
echo "USER_POOL_ID=us-east-1_XXXXXXXXX" > .env
echo "USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx" >> .env
echo "IDENTITY_POOL_ID=us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" >> .env
```

### Step 6: Deploy with Authentication

```bash
# Deploy with Cognito authentication
serverless deploy --stage dev
```

## 🔧 Alternative Deployment Methods

### Method 1: Manual AWS Console Deployment

1. **Create DynamoDB Tables:**
   - Go to AWS DynamoDB Console
   - Create tables manually using the schema from `serverless-simple.yml`

2. **Create S3 Bucket:**
   - Go to AWS S3 Console
   - Create bucket: `talkandgrow-portal-resumes-dev`

3. **Create Lambda Functions:**
   - Go to AWS Lambda Console
   - Create functions manually
   - Upload the code from `lambda/functions/`

### Method 2: AWS CDK Deployment

```bash
# Install AWS CDK
npm install -g aws-cdk

# Initialize CDK project
cdk init app --language typescript

# Deploy with CDK
cdk deploy
```

### Method 3: Terraform Deployment

```bash
# Install Terraform
# Download from https://terraform.io/downloads

# Create Terraform configuration
# Deploy infrastructure
terraform init
terraform plan
terraform apply
```

## 🐛 Debugging Commands

### Check Deployment Status

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name talkandgrow-portal-api-dev

# Check Lambda functions
aws lambda list-functions --query 'Functions[?contains(FunctionName, `talkandgrow-portal`)]'

# Check DynamoDB tables
aws dynamodb list-tables --query 'TableNames[?contains(@, `talkandgrow-portal`)]'
```

### View Logs

```bash
# View Lambda logs
serverless logs -f profiles --stage dev
serverless logs -f jobs --stage dev
serverless logs -f applications --stage dev

# View CloudWatch logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/talkandgrow-portal"
```

### Test API Endpoints

```bash
# Test with curl
curl -X POST https://your-api-url.amazonaws.com/dev/jobs \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Job","company":"Test Company","jobType":"full-time"}'

# Test with Postman
# Import the API Gateway URL and test endpoints
```

## 📋 Verification Checklist

### ✅ Infrastructure
- [ ] DynamoDB tables created
- [ ] S3 bucket created
- [ ] Lambda functions deployed
- [ ] API Gateway endpoints working

### ✅ API Endpoints
- [ ] GET /jobs returns empty array
- [ ] POST /jobs creates job
- [ ] GET /profiles returns empty array
- [ ] POST /profiles creates profile
- [ ] GET /applications returns empty array
- [ ] POST /applications creates application

### ✅ Frontend Integration
- [ ] Update API URL in frontend
- [ ] Test job posting from admin panel
- [ ] Test application submission
- [ ] Test profile management

## 🆘 Getting Help

### Common Resources

1. **AWS Documentation:**
   - [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
   - [Lambda Developer Guide](https://docs.aws.amazon.com/lambda/)
   - [API Gateway Developer Guide](https://docs.aws.amazon.com/apigateway/)

2. **Serverless Framework:**
   - [Serverless Framework Docs](https://www.serverless.com/framework/docs/)
   - [Serverless AWS Provider](https://www.serverless.com/framework/docs/providers/aws/)

3. **Community Support:**
   - [Serverless Forum](https://forum.serverless.com/)
   - [AWS Developer Forums](https://forums.aws.amazon.com/)

### Contact Information

If you're still having issues:
1. Check the AWS CloudWatch logs for detailed error messages
2. Verify your AWS permissions and region settings
3. Ensure all dependencies are installed correctly
4. Try deploying to a different AWS region

## 🎯 Success Indicators

You'll know the deployment is successful when:

1. **Serverless deploy** completes without errors
2. **API Gateway URLs** are displayed in the output
3. **DynamoDB tables** are visible in the AWS Console
4. **Lambda functions** are running and accessible
5. **Frontend** can connect to the API endpoints

Your serverless DynamoDB backend is now ready! 🚀
