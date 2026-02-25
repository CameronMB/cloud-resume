# Cloud Resume Auto Deploy (GitHub Actions → S3)

This repo auto-deploys `frontend/` to S3 on every push to `main`.

## 1) GitHub repo settings

Add these in **Settings → Secrets and variables → Actions**.

### Secrets
- `AWS_ROLE_TO_ASSUME` = IAM role ARN used by GitHub OIDC

### Variables
- `AWS_REGION` (example: `us-east-1`)
- `S3_BUCKET` (bucket name only)
- `CLOUDFRONT_DISTRIBUTION_ID` (optional; leave empty if not using CloudFront)

## 2) Create IAM role for GitHub OIDC

### Trust policy (replace ACCOUNT_ID and repo name if needed)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:CameronMB/cloud-resume:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### Permissions policy (replace BUCKET_NAME and distribution ARN if used)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::BUCKET_NAME"
    },
    {
      "Sid": "ReadWriteObjects",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::BUCKET_NAME/*"
    },
    {
      "Sid": "CloudFrontInvalidateOptional",
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    }
  ]
}
```

If you do not use CloudFront invalidations, remove the final statement.

## 3) Deployment behavior

Workflow file: `.github/workflows/deploy.yml`

On push to `main`:
1. Assume AWS role via OIDC
2. Sync all files from `frontend/` to S3 (deletes removed files)
3. Set long cache headers for static assets
4. Upload `index.html` with no-cache headers
5. Optionally invalidate CloudFront

## 4) Manual deploy

You can run manually from the GitHub Actions tab via **workflow_dispatch**.
