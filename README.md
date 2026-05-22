<div align="center">
  <img src="logo.png" alt="reddit-clone-next12-amplify-youtube-task3" width="480"/>

  [![Next.js](https://img.shields.io/badge/Next.js_12-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-FF9900?style=flat&logo=awsamplify&logoColor=white)](https://aws.amazon.com/amplify/)
  [![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat&logo=graphql&logoColor=white)](https://graphql.org/)
  [![MUI](https://img.shields.io/badge/MUI_v5-007FFF?style=flat&logo=mui&logoColor=white)](https://mui.com/)

  **🤖 A full-stack Reddit clone — posts, votes, image uploads, and auth — built on Next.js 12 and AWS Amplify ⬆️**

</div>

---

> Built following the tutorial by [Jarrod Watts](https://www.youtube.com/watch?v=cLKLqpxPSws).

## ✨ Features

- 📝 **Create posts** with title, body, and optional image upload (AWS S3 via react-dropzone)
- ⬆️ **Vote on posts** — upvote and downvote
- 🔐 **User authentication** via AWS Cognito
- 📡 **GraphQL API** backed by AWS AppSync (real-time capable)
- 🗂️ **Feed view** — browse all posts sorted by votes

## 🚀 Quick Start

### Prerequisites

- AWS account
- Amplify CLI: `npm install -g @aws-amplify/cli`

### Setup

```bash
# Install dependencies
npm install

# Initialize Amplify project (follow the prompts)
amplify init

# Deploy backend (AppSync + Cognito + S3)
amplify push

# Run the app
npm run dev
```

## 🏗️ Backend (AWS Amplify)

| Service | Purpose |
|---|---|
| AWS AppSync | GraphQL API |
| AWS Cognito | User authentication |
| AWS S3 | Image storage |

The GraphQL schema lives in `amplify/backend/api/`.

## 🛠️ Tech Stack

- **Next.js 12**
- **AWS Amplify v4** — AppSync + Cognito + S3
- **MUI v5** — component library
- **react-hook-form** — form handling
- **react-dropzone** — drag-and-drop image upload
- **uuid** — unique post IDs
