# AWS Amplify Setup Guide for Talk and Grow Portal

This guide will help you set up AWS Amplify for your React application, replacing or supplementing your current Supabase setup.

## Prerequisites

1. AWS Account with appropriate permissions
2. Node.js and npm installed
3. AWS CLI configured (optional but recommended)

## Installation Steps

### 1. Install AWS Amplify CLI

```bash
npm install -g @aws-amplify/cli
```

### 2. Configure Amplify CLI

```bash
amplify configure
```

Follow the prompts to:
- Sign in to your AWS account
- Create/select an IAM user with appropriate permissions
- Set up the default region (recommend `us-east-1`)

### 3. Install Amplify Dependencies

```bash
npm install aws-amplify
```

### 4. Initialize Amplify in Your Project

```bash
amplify init
```

When prompted:
- **Project name**: `talkandgrowportal`
- **Environment**: `dev`
- **Default editor**: Your preferred editor
- **App type**: `javascript`
- **Framework**: `react`
- **Source directory**: `src`
- **Distribution directory**: `dist`
- **Build command**: `npm run build`
- **Start command**: `npm run dev`

### 5. Add Authentication

```bash
amplify add auth
```

Select:
- **Default configuration**: Yes
- **Username**: Email
- **Additional attributes**: Name
- **MFA**: No

### 6. Add API (GraphQL)

```bash
amplify add api
```

Select:
- **API type**: GraphQL
- **Authorization**: Amazon Cognito User Pool
- **Additional auth types**: No
- **Conflict resolution**: Auto Merge
- **Schema template**: Single object with fields

### 7. Add Storage

```bash
amplify add storage
```

Select:
- **Content**: File (images, audio, video, etc.)
- **Bucket name**: `talkandgrowportalresumes`
- **Access**: Auth users only
- **Actions**: Create/Update, Read, Delete

### 8. Deploy to AWS

```bash
amplify push
```

This will:
- Create all AWS resources
- Generate the `aws-exports.js` file
- Deploy your backend

### 9. Update Your Application

#### Update main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './amplify-config.ts' // Add this import

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### Update App.tsx

```typescript
import { AmplifyAuthProvider } from './contexts/AmplifyAuthContext'
// ... other imports

function App() {
  return (
    <AmplifyAuthProvider>
      {/* Your existing app content */}
    </AmplifyAuthProvider>
  )
}
```

## Configuration Files Created

The setup creates these key files:

- `amplify.yml` - Build configuration for Amplify Hosting
- `src/aws-exports.js` - Auto-generated AWS configuration
- `src/amplify-config.ts` - Amplify initialization
- `src/contexts/AmplifyAuthContext.tsx` - Authentication context
- `src/hooks/useAmplifyStorage.ts` - Storage utilities
- `amplify/backend/` - Backend configuration files

## GraphQL Schema

The schema includes:

- **User**: User profiles with skills and experience
- **Job**: Job postings with requirements
- **Application**: Job applications with status tracking
- **Achievement**: Gamification achievements
- **UserAchievement**: User progress tracking
- **SkillGap**: Skills analysis for job matching

## Authentication Features

- Email/password authentication
- User profile management
- Secure file uploads for resumes
- Row-level security for data access

## Storage Features

- Resume upload to S3
- Secure file access with signed URLs
- Automatic file organization by user ID

## Deployment Options

### Option 1: Amplify Hosting (Recommended)

```bash
amplify add hosting
amplify publish
```

### Option 2: Custom Deployment

Build your app and deploy to any static hosting service:

```bash
npm run build
```

## Environment Variables

The `aws-exports.js` file contains all necessary configuration. For production, you may want to use environment-specific configurations.

## Migration from Supabase

If migrating from Supabase:

1. Keep both systems running during transition
2. Create data migration scripts
3. Update authentication flows gradually
4. Test thoroughly before switching

## Troubleshooting

### Common Issues

1. **CLI not found**: Ensure Amplify CLI is installed globally
2. **Permission errors**: Check AWS IAM permissions
3. **Build failures**: Verify Node.js version compatibility
4. **Authentication issues**: Check Cognito configuration

### Useful Commands

```bash
amplify status          # Check current status
amplify console         # Open AWS console
amplify pull            # Pull latest changes
amplify delete          # Remove all resources
```

## Next Steps

1. Test authentication flow
2. Implement file upload functionality
3. Set up GraphQL queries and mutations
4. Configure production environment
5. Set up monitoring and logging

## Support

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [GraphQL API Guide](https://docs.amplify.aws/react/build-a-backend/graphql-api/)
- [Authentication Guide](https://docs.amplify.aws/react/build-a-backend/auth/)
- [Storage Guide](https://docs.amplify.aws/react/build-a-backend/storage/)
