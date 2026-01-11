# Coatesville Farm Contact Form Lambda

AWS Lambda function that handles contact form submissions and sends emails via SES.

## Features

- Sends HTML notification email to farm
- Sends confirmation email to visitor
- Rate limiting (5 requests per IP per hour)
- Honeypot spam protection
- Input validation
- CORS support for coatesvillefarm.com

## Prerequisites

1. AWS CLI configured with appropriate credentials
2. AWS SAM CLI installed
3. Node.js 20.x

## Setup Instructions

### 1. Verify Email in SES

Before deploying, you need to verify the email address in SES:

```bash
# Verify the farm email address
aws ses verify-email-identity --email-address coatesvillefarm@gmail.com --region us-east-1
```

Check your email and click the verification link.

**Note:** If your SES account is in sandbox mode, you'll also need to verify any recipient emails. To send to unverified addresses, [request production access](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html).

### 2. Build the Lambda

```bash
cd lambda
npm install
npm run build
```

### 3. Deploy with SAM

```bash
# First time deployment (guided)
sam deploy --guided --region us-east-1

# Subsequent deployments
sam deploy --region us-east-1
```

During guided deployment, you'll be asked:
- Stack Name: `coatesville-contact-form`
- AWS Region: `us-east-1`
- Confirm changes before deploy: `Y`
- Allow SAM CLI IAM role creation: `Y`

### 4. Get the API Endpoint

After deployment, the API endpoint URL will be shown in the outputs:

```
Outputs:
ApiEndpoint: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/contact
```

### 5. Update Frontend

Update the frontend `Contact.tsx` to use this endpoint.

## API Reference

### POST /contact

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I'm interested in your crops."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Message sent successfully!"
}
```

**Error Responses:**

- `400` - Validation error (missing fields, invalid email)
- `429` - Rate limit exceeded
- `500` - Server error

## Testing Locally

```bash
# Install SAM CLI
brew install aws-sam-cli

# Start local API
sam local start-api

# Test endpoint
curl -X POST http://localhost:3000/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

## Cost Estimate

- Lambda: Free tier covers 1M requests/month
- API Gateway: Free tier covers 1M requests/month
- SES: $0.10 per 1,000 emails

For a farm website, this will likely cost < $1/month.
