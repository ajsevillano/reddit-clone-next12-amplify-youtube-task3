# Reddit Clone - Next.js 12 + AWS Amplify

> A Reddit-style forum built following the tutorial by [Jarrod Watts](https://www.youtube.com/watch?v=cLKLqpxPSws). Users can create posts with images, vote, and browse a feed. Built on Next.js 12 and AWS Amplify with a GraphQL API.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-FF9900?style=flat&logo=awsamplify&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=flat&logo=mui&logoColor=white)

## Features

- Create and browse posts
- Image uploads via AWS S3 (react-dropzone)
- GraphQL API backed by AWS AppSync
- User authentication via AWS Cognito
- Voting on posts

## Getting Started

### Prerequisites

- AWS account with Amplify CLI configured
- Node.js

### Setup

```bash
# Install dependencies
npm install

# Initialize Amplify backend
amplify init

# Deploy the backend
amplify push

# Run the app
npm run dev
```

## Tech Stack

- Next.js 12
- AWS Amplify (AppSync GraphQL + Cognito + S3)
- MUI v5
- react-hook-form
- react-dropzone
