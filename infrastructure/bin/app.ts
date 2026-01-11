#!/usr/bin/env node

/**
 * CDK App Entry Point
 *
 * This file bootstraps the CDK application and instantiates our stacks.
 * Run with: npx cdk deploy
 *
 * Configuration is passed via CDK context (cdk.json or --context flags):
 *   - recipientEmail: Email address to receive contact form submissions
 *   - recaptchaSecretKey: Google reCAPTCHA v3 secret key
 *   - recaptchaScoreThreshold: Minimum score to accept (0.0-1.0, default 0.5)
 *   - allowedOrigin: CORS allowed origin (default: https://coatesvillefarm.com)
 */

import * as cdk from 'aws-cdk-lib';
import { ContactFormStack } from '../lib/contact-form-stack';

// Create the CDK app
const app = new cdk.App();

// Instantiate the Contact Form stack
// The stack deploys to us-east-1 as required for SES and proximity to CloudFront
new ContactFormStack(app, 'CoatesvilleFarmContactForm', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  description: 'Coatesville Farm contact form backend - Lambda + API Gateway + SES',
});
