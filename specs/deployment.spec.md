# Deployment Specification

## Overview

This document outlines the deployment strategy for the Zonos Commerce project, including infrastructure, environments, CI/CD pipeline, and operational considerations. The deployment strategy is optimized for Vercel, following Next.js Commerce's recommended approach.

## Repository Strategy for Merchants

Merchants should deploy from their own forked repository rather than directly from the main Zonos Commerce repository. This approach provides several benefits:

1. **Customization**: Maintain custom code changes specific to your business needs
2. **Update Control**: Selectively pull updates from the upstream repository when ready
3. **Versioning**: Control which version of the core platform you're using
4. **CI/CD Independence**: Maintain your own CI/CD pipeline configuration

### Managing Deployments with a Forked Repository

1. **Initial Setup**:
   - Fork the Zonos Commerce repository
   - Set up your Vercel project to deploy from your fork
   - Configure your environment variables

2. **Updating Your Deployment**:
   - Pull upstream changes to your fork
   - Test in a staging environment
   - Deploy to production when ready

3. **Custom Changes**:
   - Make custom changes in feature branches
   - Merge to your main branch after testing
   - Deploy your customized version

This strategy allows you to benefit from the latest updates while maintaining full control over your deployed application.

## Deployment Environments

### Development Environment

- **Purpose**: Local development and testing by individual developers
- **URL**: N/A (local)
- **Infrastructure**: Local machines
- **Deployment Method**: Manual (pnpm run dev)
- **Access Control**: Developers only

### Staging Environment

- **Purpose**: Integration testing, QA, and pre-production validation
- **URL**: https://staging.zonos-commerce.com
- **Infrastructure**: Vercel (matching production)
- **Deployment Method**: Automated via CI/CD pipeline
- **Access Control**: Internal team and stakeholders
- **Data**: Anonymized production data or test data

### Production Environment

- **Purpose**: Live customer-facing application
- **URL**: https://zonos-commerce.com
- **Infrastructure**: Vercel with Edge Network
- **Deployment Method**: Automated via CI/CD pipeline with approval gates
- **Access Control**: Public access with authentication where required
- **Data**: Production data

## Infrastructure Architecture

### GitHub Integration

The project will use GitHub as the primary source control platform with the following benefits:

1. **Branch Protection**: Enforced rules to protect the main branch
2. **Pull Request Reviews**: Required reviews before merging code
3. **Status Checks**: Required CI/CD checks to pass before merging
4. **Webhooks**: Integration with deployment platforms
5. **Release Management**: GitHub Releases for versioning
6. **Issue Tracking**: Project management through GitHub Issues
7. **Actions**: Automated workflows with GitHub Actions

### Multi-Platform Deployment Strategy

The application is designed to be deployed on both Vercel and Cloudflare with the following configuration:

1. **Production Deployment**:
   - Auto-deploys against the main branch
   - Both Cloudflare and Vercel connected to GitHub repository
   - Triggered automatically when changes are merged to main
   - Production environment variables pre-configured

2. **Preview Deployments**:
   - Automatic preview deploys for feature branches and pull requests
   - Unique URLs generated for each preview deployment
   - Temporary environment for testing and review
   - Both Cloudflare Pages and Vercel offer this functionality

3. **Platform Selection**:
   - The `DEPLOYMENT_PLATFORM` environment variable determines optimizations
   - Set to `vercel` or `cloudflare` based on chosen deployment platform
   - Application automatically adjusts API endpoints and optimizations

### Hosting Platform - Vercel

Following Next.js Commerce's approach, the application will be deployed on Vercel with the following capabilities:

- **Serverless Functions**: For API routes and server-side operations
- **Edge Functions**: For global low-latency operations
- **Static Hosting**: For static assets and client-side code
- **CDN Integration**: For global content delivery via Vercel Edge Network
- **Preview Deployments**: For reviewing changes before merging
- **Automatic HTTPS**: SSL/TLS certificate provisioning
- **Environment Variables**: Secure management of configuration
- **Analytics**: Built-in performance monitoring

### Deployment with Vercel Button

A one-click deployment option will be provided for quick setup:

```
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fzonos%2Fcommerce&env=ZONOS_API_KEY,NEXT_PUBLIC_ZONOS_ENVIRONMENT,ZONOS_REVALIDATION_SECRET,NEXT_PUBLIC_SITE_NAME,COMPANY_NAME)
```

## Deployment Configuration

### Vercel Configuration

```json
// vercel.json
{
  "version": 2,
  "buildCommand": "pnpm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_ZONOS_ENVIRONMENT": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Cloudflare Configuration

```toml
# wrangler.toml
name = "zonos-commerce"
compatibility_date = "2024-02-01"
compatibility_flags = ["nodejs_compat"]

[build]
command = "pnpm run build"
output_directory = ".next"

[site]
bucket = ".next"

[env.production]
environment_variables = [
  { name = "NEXT_PUBLIC_ZONOS_ENVIRONMENT", value = "production" },
  { name = "DEPLOYMENT_PLATFORM", value = "cloudflare" }
]

[routes]
pattern = "/*"
script = "index.js"

[[headers]]
pattern = "/(.*)"
headers = [
  { name = "X-Content-Type-Options", value = "nosniff" },
  { name = "X-Frame-Options", value = "DENY" },
  { name = "X-XSS-Protection", value = "1; mode=block" }
]
```

For GitHub integration with Cloudflare, a GitHub App will be used for automatic deployments:

1. **Repository Connection**: Connect GitHub repository to Cloudflare Pages
2. **Build Settings**: Configure build command and output directory
3. **Environment Variables**: Set up production and preview environment variables
4. **Branch Deployments**: Configure main branch for production and all other branches for preview

### Runtime Configuration

For pages that should run at the Edge:

```typescript
export const runtime = 'edge';
```

For pages with specific caching requirements:

```typescript
export const revalidate = 60; // Revalidate at most once every 60 seconds
```

## CI/CD Pipeline

### Continuous Integration

The CI pipeline will be triggered on each pull request and push to the main branch:

1. **Code Checkout**: Retrieve latest code from repository
2. **Dependencies Installation**: Install pnpm dependencies
3. **Linting**: Run ESLint to ensure code quality
4. **Type Checking**: Run TypeScript type checking
5. **Unit Tests**: Run unit and integration tests
6. **Build**: Build the application for deployment
7. **E2E Tests**: Run end-to-end tests

### Continuous Deployment

The CD pipeline will automate deployments to different environments:

1. **Preview Deployment**:
   - Triggered on pull requests
   - Deploy to a unique preview URL
   - Run automated tests
   - Share preview URL for review

2. **Staging Deployment**:
   - Triggered on successful CI pipeline from the main branch
   - Deploy to staging environment
   - Run post-deployment tests
   - Notify team of successful deployment

3. **Production Deployment**:
   - Triggered manually or on release tags
   - Requires approval from designated team members
   - Deploy to production environment
   - Run smoke tests
   - Monitor for any issues

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
  release:
    types: [published]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run lint
      - run: pnpm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - name: Upload coverage
        uses: actions/upload-artifact@v3
        with:
          name: coverage
          path: coverage/

  build:
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next/

  deploy-vercel-preview:
    if: github.event_name == 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: .next/
      - name: Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: ${{ secrets.VERCEL_SCOPE }}
          github-comment: true
          github-token: ${{ secrets.GITHUB_TOKEN }}

  deploy-cloudflare-preview:
    if: github.event_name == 'pull_request'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: .next/
      - name: Deploy to Cloudflare Pages (Preview)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: zonos-commerce
          directory: .next
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          wranglerVersion: '3'
  
  deploy-vercel-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: .next/
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          scope: ${{ secrets.VERCEL_SCOPE }}
          
  deploy-cloudflare-production:
    if: github.ref == 'refs/heads/main'
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: .next/
      - name: Deploy to Cloudflare Pages (Production)
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: zonos-commerce
          directory: .next
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          wranglerVersion: '3'
          branch: main
          production: true
```

## Environment Configuration

### Environment Variables

Following Next.js Commerce's approach, environment-specific configuration will be managed through environment variables:

```
# Zonos API
ZONOS_API_KEY=your_api_key
NEXT_PUBLIC_ZONOS_ENVIRONMENT=sandbox|production
ZONOS_REVALIDATION_SECRET=randomsecret123
ZONOS_WEBHOOK_SECRET=webhooksecret456

# Deployment Configuration
DEPLOYMENT_PLATFORM=vercel|cloudflare

# Site Information
COMPANY_NAME=Zonos Commerce
NEXT_PUBLIC_SITE_NAME=Zonos Commerce
NEXT_PUBLIC_APP_URL=https://zonos-commerce.com

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

### Secrets Management

Sensitive environment variables will be managed using Vercel's environment variable management:

1. **Development**: .env.local file (not committed to source control)
2. **Preview/Staging/Production**: Environment variables set in Vercel dashboard
3. **CI/CD**: GitHub Secrets for CI/CD pipeline

## Monitoring and Logging

### Application Monitoring

The application will be monitored using Vercel's built-in tools and integrations:

1. **Vercel Analytics**: For performance monitoring and user analytics
2. **Vercel Speed Insights**: For Core Web Vitals monitoring
3. **Error Tracking**: Sentry for real-time error tracking
4. **User Analytics**: Google Analytics or similar

### Infrastructure Monitoring

The infrastructure will be monitored using:

1. **Vercel Status**: For platform status and incidents
2. **Uptime Monitoring**: Health checks for API routes
3. **Logs**: Vercel Logs for serverless function logs

### Alert Configuration

Alerts will be configured for critical events:

1. **Build Failures**: Alert when builds fail
2. **Error Rate Threshold**: Alert when error rate exceeds normal levels
3. **Response Time**: Alert when response time exceeds thresholds
4. **Availability**: Alert on any downtime or availability issues

## Backup and Disaster Recovery

### Data Backup

Although this application is primarily stateless, any persistent data will be backed up:

1. **Configuration Backups**: Export of environment variables and configurations
2. **Code Repository**: GitHub with protected branches and backup mirrors

### Disaster Recovery Plan

The disaster recovery plan will include:

1. **Rollback Procedures**: Process for rolling back to previous versions using Vercel's deployment history
2. **Recovery Time Objective (RTO)**: Target time to restore service (minutes)
3. **Recovery Point Objective (RPO)**: Maximum acceptable data loss (near zero)

## Security Considerations

### SSL/TLS

All environments will use SSL/TLS encryption automatically configured by Vercel:

1. **Certificate Management**: Automated via Vercel
2. **Protocol Version**: TLS 1.2 and above only

### Security Headers

Security headers will be configured in vercel.json:

1. **Content Security Policy (CSP)**: Restrict resource loading
2. **HSTS**: Enforce HTTPS connections
3. **X-Content-Type-Options**: Prevent MIME type sniffing
4. **X-Frame-Options**: Prevent clickjacking

### API Security

API endpoints will be secured:

1. **Rate Limiting**: Implemented via Vercel Edge Config
2. **Authentication**: Secure API routes with proper authentication
3. **Input Validation**: Validate all input to prevent injection attacks

## Deployment Checklist

Before each production deployment, the following checklist will be reviewed:

1. **Pre-Deployment**:
   - All tests passing
   - Code review completed
   - Performance benchmarks acceptable
   - Security review completed

2. **Deployment**:
   - Verify environment variables
   - Deploy with Vercel
   - Verify DNS configuration

3. **Post-Deployment**:
   - Smoke tests
   - Performance validation
   - Error monitoring
   - User feedback

## Release Management

### Release Strategy

The application will follow a versioned release strategy:

1. **Semantic Versioning**: Follow semver for version numbering
2. **Release Notes**: Document changes and new features
3. **Feature Flags**: Use feature flags for controlled rollout

### Rollback Strategy

In case of issues, the rollback strategy will use Vercel's deployment history:

1. **Previous Version Deployment**: Roll back to the previous stable deployment via Vercel dashboard
2. **Instant Rollback**: Immediate reversal with zero downtime

## Performance Optimization

The deployment will include performance optimizations:

1. **Edge Network**: Leverage Vercel's global edge network for content delivery
2. **Asset Optimization**: Automatic image and static asset optimization
3. **Server-Side Rendering**: Optimize SSR performance
4. **Edge Caching**: Implement effective caching with ISR and Edge

## Integration with Zonos

### Zonos API Environment Configuration

The deployment will be configured to use the appropriate Zonos API environment:

1. **Development/Staging**: Connect to Zonos sandbox environment
2. **Production**: Connect to Zonos production environment

### Webhooks Configuration

For each environment, configure Zonos webhooks to point to the appropriate deployment URL:

1. **Staging**: `https://staging.zonos-commerce.com/api/webhooks/zonos`
2. **Production**: `https://zonos-commerce.com/api/webhooks/zonos`

## Training and Documentation

To support the deployment process:

1. **Runbooks**: Create runbooks for common operations
2. **Documentation**: Document deployment process and configurations
3. **Training**: Train team members on deployment procedures 