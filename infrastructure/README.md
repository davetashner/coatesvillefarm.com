# Coatesville Farm Infrastructure (CDK)

This directory contains AWS CDK code for deploying the contact form backend.

## What Gets Deployed

- **Lambda Function**: Processes contact form submissions, sends emails via SES
- **API Gateway**: HTTPS endpoint that triggers the Lambda (`POST /contact`)
- **IAM Permissions**: Allows Lambda to send emails via SES

## Prerequisites

### 1. Install Node.js
Node.js 18+ is required. Check with:
```bash
node --version
```

### 2. Install AWS CLI
```bash
# macOS
brew install awscli

# Verify installation
aws --version
```

### 3. Configure AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID, Secret Access Key, and region (us-east-1)
```

### 4. Install CDK CLI (Optional)
The CDK CLI can be run via npx, but global installation is convenient:
```bash
npm install -g aws-cdk

# Verify installation
cdk --version
```

## First-Time Setup

### 1. Bootstrap CDK
CDK needs to create some resources in your AWS account before first deployment:
```bash
cd infrastructure
npm install
npx cdk bootstrap
```
This creates an S3 bucket and IAM roles that CDK uses for deployments.

### 2. Set Up Google reCAPTCHA

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Sign in with a Google account
3. Fill in the form:
   - **Label**: Coatesville Farm Contact Form
   - **reCAPTCHA type**: Score based (v3)
   - **Domains**: `coatesvillefarm.com` (add `localhost` for local testing)
4. Accept the terms and click **Submit**
5. Copy the **Site Key** and **Secret Key**
   - Site Key goes in frontend `.env` as `VITE_RECAPTCHA_SITE_KEY`
   - Secret Key is passed to CDK deploy (see below)

### 3. Verify Email in SES

Before SES can send emails, you must verify the sender email address:

1. Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
2. Make sure you're in **us-east-1** region
3. Click **Verified identities** in the left sidebar
4. Click **Create identity**
5. Select **Email address**
6. Enter `davetashner@gmail.com` (or your test email)
7. Click **Create identity**
8. Check your email and click the verification link

**Note**: New SES accounts are in "sandbox mode" and can only send to verified emails.
To send to any email (production), [request production access](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html).

## Deployment

### Build the Lambda First
```bash
cd ../lambda
npm install
npm run build
cd ../infrastructure
```

### Deploy with Test Email
```bash
npx cdk deploy --context recaptchaSecretKey=YOUR_SECRET_KEY
```

### Deploy with Custom Email
```bash
npx cdk deploy \
  --context recipientEmail=your@email.com \
  --context recaptchaSecretKey=YOUR_SECRET_KEY
```

### Deploy for Production
```bash
npx cdk deploy \
  --context recipientEmail=coatesvillefarm@gmail.com \
  --context recaptchaSecretKey=YOUR_SECRET_KEY
```

After deployment, CDK outputs the API endpoint URL. Copy this for the frontend.

## Configuration Options

| Context Key | Default | Description |
|-------------|---------|-------------|
| `recipientEmail` | `davetashner@gmail.com` | Email to receive submissions |
| `recaptchaSecretKey` | (none) | Google reCAPTCHA v3 secret key |
| `recaptchaScoreThreshold` | `0.5` | Min score to accept (0.0-1.0) |
| `allowedOrigin` | `https://coatesvillefarm.com` | CORS allowed origin |

Pass options via `--context key=value` or set defaults in `cdk.json`.

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run deploy` | Build Lambda and deploy stack |
| `npm run deploy:test` | Deploy with test email (davetashner@gmail.com) |
| `npx cdk diff` | Show pending changes vs deployed |
| `npx cdk synth` | Generate CloudFormation template |
| `npx cdk destroy` | Delete all deployed resources |
| `npx cdk ls` | List all stacks |

## Updating the Lambda Code

After changing `lambda/src/index.ts`:
```bash
cd ../lambda
npm run build
cd ../infrastructure
npx cdk deploy --context recaptchaSecretKey=YOUR_SECRET_KEY
```

## Viewing Logs

Lambda logs go to CloudWatch:
```bash
# View recent logs
aws logs tail /aws/lambda/coatesville-contact-form --follow

# Or use the AWS Console:
# CloudWatch > Log groups > /aws/lambda/coatesville-contact-form
```

## Troubleshooting

### "CDK not bootstrapped"
Run `npx cdk bootstrap` in your AWS account/region.

### "Email address is not verified"
Verify the sender email in SES console. See "Verify Email in SES" above.

### "Access Denied" on deploy
Check your AWS credentials: `aws sts get-caller-identity`

### CORS errors in browser
- Ensure `allowedOrigin` matches your frontend domain exactly
- Check that the frontend is using HTTPS (not HTTP)

### reCAPTCHA "invalid-input-secret"
- Verify the secret key is correct
- Ensure you're using the v3 key (not v2)

### Lambda timeout
- Check CloudWatch logs for slow operations
- Increase timeout in `contact-form-stack.ts` if needed

## Architecture Overview

```
[Browser]
    |
    | POST /contact (JSON body)
    v
[API Gateway]
    |
    | Lambda Proxy Integration
    v
[Lambda Function]
    |
    |-- Verify reCAPTCHA token --> [Google API]
    |-- Send notification email --> [SES]
    |-- Send confirmation email --> [SES]
    |
    v
[Response to Browser]
```

## Cost Estimate

For a low-traffic farm website:
- **Lambda**: Free tier covers 1M requests/month
- **API Gateway**: Free tier covers 1M calls/month
- **SES**: $0.10 per 1,000 emails
- **CloudWatch Logs**: Minimal (few cents/month)

**Estimated monthly cost**: $0-$1 for typical usage.

## Security Considerations

- **CORS**: API only accepts requests from coatesvillefarm.com
- **SES Policy**: Lambda can only send from the configured email
- **reCAPTCHA**: Blocks automated bot submissions
- **Honeypot**: Additional bot protection in form
- **Rate Limiting**: 5 submissions per IP per hour (in Lambda code)
- **Input Validation**: All fields validated, HTML escaped

## CDK Concepts Glossary

- **Stack**: A deployable unit = one CloudFormation stack
- **Construct**: A building block (can be single resource or multiple)
- **L1 Constructs**: Direct CloudFormation (CfnXxx classes)
- **L2 Constructs**: Abstractions with defaults (what we use)
- **Context**: Runtime configuration from cdk.json or --context
- **Synth**: Generate CloudFormation from CDK code
- **Bootstrap**: One-time setup of CDK resources in AWS account
