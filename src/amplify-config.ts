import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

// Allow environment overrides (useful for local dev and CI)
const region = import.meta.env.VITE_AWS_REGION as string | undefined;
const userPoolId = import.meta.env.VITE_USER_POOL_ID as string | undefined;
const userPoolClientId = import.meta.env.VITE_USER_POOL_CLIENT_ID as string | undefined;
const identityPoolId = import.meta.env.VITE_IDENTITY_POOL_ID as string | undefined;

// Merge config safely; prefer env when provided
const mergedConfig: any = {
  ...awsExports,
};

if (region) {
  mergedConfig.aws_project_region = region;
  mergedConfig.aws_cognito_region = region;
  mergedConfig.aws_user_files_s3_bucket_region = mergedConfig.aws_user_files_s3_bucket_region || region;
}
if (userPoolId) {
  mergedConfig.aws_user_pools_id = userPoolId;
}
if (userPoolClientId) {
  mergedConfig.aws_user_pools_web_client_id = userPoolClientId;
}
if (identityPoolId) {
  mergedConfig.aws_cognito_identity_pool_id = identityPoolId;
}

Amplify.configure(mergedConfig);

export default Amplify;
