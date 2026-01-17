import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

/**
 * ContactFormStack - CDK Stack for Coatesville Farm Contact Form Backend
 *
 * This stack creates:
 * 1. A Lambda function to process contact form submissions
 * 2. An API Gateway REST API to expose the Lambda
 * 3. IAM permissions for the Lambda to send emails via SES
 *
 * ## CDK Concepts for Beginners:
 *
 * - **Stack**: A deployable unit of AWS resources. One stack = one CloudFormation stack.
 * - **Construct**: A building block representing one or more AWS resources.
 *   - L1 (Cfn*): Direct CloudFormation mappings (lowest level)
 *   - L2: Higher-level abstractions with sensible defaults (what we use here)
 *   - L3: Patterns combining multiple L2 constructs
 * - **Props**: Configuration objects passed to constructs
 * - **Context**: Runtime configuration values (from cdk.json or --context flags)
 *
 * ## How to Deploy:
 *
 * ```bash
 * cd infrastructure
 * npm install
 * npx cdk bootstrap  # First time only - sets up CDK in your AWS account
 * npx cdk deploy --context recaptchaSecretKey=YOUR_SECRET
 * ```
 */
export class ContactFormStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // =========================================================================
    // CONFIGURATION
    // =========================================================================
    // Read configuration from CDK context (cdk.json or --context CLI flags)
    // This allows different values for testing vs production without code changes

    // Email address that sends contact form emails (must be verified in SES)
    // Uses the verified domain for better deliverability
    const senderEmail =
      this.node.tryGetContext('senderEmail') || 'contact@coatesvillefarm.com';

    // Email address that receives contact form submissions (your inbox)
    // Default: test email for initial deployment
    const recipientEmail =
      this.node.tryGetContext('recipientEmail') || 'davetashner@gmail.com';

    // Google reCAPTCHA v3 secret key (required for bot protection)
    // Get this from: https://www.google.com/recaptcha/admin
    // Pass via: --context recaptchaSecretKey=6Lxxxx or environment variable
    const recaptchaSecretKey =
      this.node.tryGetContext('recaptchaSecretKey') ||
      process.env.RECAPTCHA_SECRET_KEY ||
      '';

    // Minimum reCAPTCHA score to accept (0.0 = bot, 1.0 = human)
    // Google recommends starting at 0.5 and adjusting based on results
    const recaptchaScoreThreshold =
      this.node.tryGetContext('recaptchaScoreThreshold') || '0.5';

    // CORS allowed origins - domains that can call this API
    // Includes localhost for development testing
    const allowedOrigins = [
      'https://coatesvillefarm.com',
      'http://localhost:5173',
      'http://localhost:3000',
    ];

    // =========================================================================
    // LAMBDA FUNCTION
    // =========================================================================
    // The Lambda function handles contact form submissions:
    // 1. Validates the reCAPTCHA token with Google
    // 2. Checks the honeypot field (additional bot protection)
    // 3. Validates form fields
    // 4. Sends notification email to the farm
    // 5. Sends confirmation email to the visitor

    const contactFunction = new lambda.Function(this, 'ContactFormFunction', {
      // Unique name for the function in AWS
      functionName: 'coatesville-contact-form',

      // Node.js 20.x is the latest LTS version supported by Lambda
      runtime: lambda.Runtime.NODEJS_20_X,

      // The handler is the function that Lambda invokes
      // Format: <filename-without-extension>.<exported-function-name>
      handler: 'index.handler',

      // Path to the compiled Lambda code
      // We use path.join to construct an absolute path relative to this file
      // The Lambda code is in ../lambda/dist/ (compiled TypeScript)
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda/dist')),

      // Memory allocation affects both RAM and proportional CPU
      // 128 MB is sufficient for this simple function
      memorySize: 128,

      // Maximum execution time before Lambda kills the function
      // 10 seconds is plenty for API calls to SES and reCAPTCHA
      timeout: cdk.Duration.seconds(10),

      // Description shown in AWS Console
      description: 'Handles contact form submissions and sends emails via SES',

      // Environment variables available to the Lambda code via process.env
      environment: {
        // Email address to send FROM (must be verified in SES)
        SENDER_EMAIL: senderEmail,

        // Email address to send contact form submissions TO (your inbox)
        RECIPIENT_EMAIL: recipientEmail,

        // Google reCAPTCHA secret key for server-side verification
        RECAPTCHA_SECRET_KEY: recaptchaSecretKey,

        // Minimum score threshold (0.0-1.0) to accept submissions
        RECAPTCHA_SCORE_THRESHOLD: recaptchaScoreThreshold,

        // CORS allowed origins (comma-separated) for response headers
        ALLOWED_ORIGINS: allowedOrigins.join(','),
      },

      // CloudWatch Logs retention - 1 week is usually enough for debugging
      // Longer retention increases storage costs
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // =========================================================================
    // IAM PERMISSIONS FOR SES
    // =========================================================================
    // Grant the Lambda function permission to send emails via SES
    // We use a restrictive policy that only allows sending FROM the recipient email
    // This prevents the function from being misused to send spam from other addresses

    contactFunction.addToRolePolicy(
      new iam.PolicyStatement({
        // Effect.ALLOW grants the permission (vs DENY which blocks it)
        effect: iam.Effect.ALLOW,

        // The SES actions needed to send emails
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],

        // Resource: '*' means any SES resource, but the Condition below restricts it
        // In production, you could restrict to specific SES identities
        resources: ['*'],

        // Condition: Only allow sending FROM this specific email address
        // This is a security best practice to prevent misuse
        conditions: {
          StringEquals: {
            'ses:FromAddress': senderEmail,
          },
        },
      })
    );

    // =========================================================================
    // API GATEWAY REST API
    // =========================================================================
    // API Gateway provides an HTTPS endpoint that triggers the Lambda function
    // It handles request routing, CORS, throttling, and can add caching

    const api = new apigateway.RestApi(this, 'ContactFormApi', {
      // Name shown in AWS Console
      restApiName: 'coatesville-contact-api',

      // Description for documentation
      description: 'API for Coatesville Farm contact form submissions',

      // Deploy configuration - creates the "prod" stage automatically
      deployOptions: {
        // Stage name appears in the URL: /prod/contact
        stageName: 'prod',

        // Enable CloudWatch metrics for monitoring
        metricsEnabled: true,

        // Log full request/response (useful for debugging, disable in high-traffic prod)
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },

      // Endpoint type: REGIONAL is best for APIs called from a specific region
      // EDGE would use CloudFront (useful for global distribution)
      endpointTypes: [apigateway.EndpointType.REGIONAL],

      // CORS (Cross-Origin Resource Sharing) configuration
      // This allows the frontend to call this API from allowed origins
      // Without CORS, browsers block requests from different origins
      defaultCorsPreflightOptions: {
        // Which origins can call this API
        // Lambda validates and echoes back the correct origin dynamically
        allowOrigins: allowedOrigins,

        // Which HTTP methods are allowed
        allowMethods: ['POST', 'OPTIONS'],

        // Which headers can be sent with requests
        allowHeaders: ['Content-Type'],

        // How long browsers should cache the CORS preflight response
        maxAge: cdk.Duration.hours(1),
      },
    });

    // =========================================================================
    // API GATEWAY RESOURCE AND METHOD
    // =========================================================================
    // Create the /contact endpoint and connect it to the Lambda function

    // Add a resource (path segment) to the API
    // This creates the /contact path
    const contactResource = api.root.addResource('contact');

    // Add the POST method to /contact
    // This connects POST /contact to our Lambda function
    contactResource.addMethod(
      'POST',
      // LambdaIntegration connects API Gateway to Lambda
      // proxy: true means the entire request is passed to Lambda
      new apigateway.LambdaIntegration(contactFunction, {
        // Proxy integration passes the full request to Lambda
        // and returns the Lambda response directly to the client
        proxy: true,
      })
    );

    // =========================================================================
    // STACK OUTPUTS
    // =========================================================================
    // Outputs are values displayed after deployment and stored in CloudFormation
    // They're useful for getting the API URL to configure the frontend

    // Output the full API endpoint URL
    // This is what you'll set as VITE_CONTACT_API_URL in the frontend
    new cdk.CfnOutput(this, 'ApiEndpoint', {
      value: `${api.url}contact`,
      description:
        'API Gateway endpoint URL - use this as VITE_CONTACT_API_URL',
      exportName: 'CoatesvilleFarmContactApiEndpoint',
    });

    // Output the Lambda function ARN (Amazon Resource Name)
    // Useful for debugging and referencing the function
    new cdk.CfnOutput(this, 'LambdaFunctionArn', {
      value: contactFunction.functionArn,
      description: 'Lambda function ARN',
    });

    // Output the configured recipient email for verification
    new cdk.CfnOutput(this, 'RecipientEmail', {
      value: recipientEmail,
      description: 'Email address receiving contact form submissions',
    });
  }
}
