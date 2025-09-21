#!/bin/bash

echo "🚀 Talk and Grow Portal - Serverless Deployment"
echo "================================================"

# Check if AWS CLI is configured
echo "📋 Checking AWS CLI configuration..."
aws sts get-caller-identity > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi
echo "✅ AWS CLI configured"

# Check if serverless is installed
echo "📋 Checking Serverless Framework..."
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework not installed. Installing..."
    npm install -g serverless
fi
echo "✅ Serverless Framework ready"

# Deploy infrastructure first (without authentication)
echo "🏗️  Deploying infrastructure (DynamoDB tables and S3 bucket)..."
serverless deploy --config serverless-simple.yml --stage dev

if [ $? -eq 0 ]; then
    echo "✅ Infrastructure deployed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Set up AWS Cognito User Pool (see SETUP_COGNITO.md)"
    echo "2. Create .env file with your Cognito details"
    echo "3. Deploy with authentication: serverless deploy --stage dev"
    echo ""
    echo "🔗 API Gateway URL will be shown in the output above"
    echo "📊 You can test the API endpoints without authentication for now"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
