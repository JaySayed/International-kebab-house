# Deployment Guide - International Kabab House

This guide explains how to deploy the International Kabab House restaurant platform to various hosting providers.

## 🏗️ Build System Overview

The application uses a modern build system:
- **Frontend**: Vite + React + TypeScript
- **Backend**: Express.js + TypeScript compiled with esbuild
- **Database**: PostgreSQL with Drizzle ORM
- **Payment**: Stripe integration (optional)
- **Real-time**: WebSocket support for notifications

## 📋 Pre-deployment Checklist

### ✅ Required
- [x] Build process working (`npm run build` succeeds)
- [x] Health check endpoint (`/api/health`)
- [x] Environment variables template (`.env.example`)
- [x] Database compatibility (PostgreSQL)

### ⚙️ Environment Setup
1. **Database**: PostgreSQL database provisioned
2. **Environment Variables**: See `.env.example` for complete list
3. **Build**: Node.js >=18.0.0
4. **Optional**: Stripe keys for payment processing

## 🌍 Environment Variables

### Required
```bash
DATABASE_URL="postgresql://username:password@host:5432/database"
SESSION_SECRET="your-random-session-secret-at-least-32-characters"
```

### Optional (Payment Processing)
```bash
STRIPE_SECRET_KEY="sk_live_..." # For payment processing
STRIPE_PUBLISHABLE_KEY="pk_live_..." # For frontend payment forms
```

### Optional (Email & Monitoring)
```bash
SENDGRID_API_KEY="SG...." # For email notifications
FROM_EMAIL="noreply@yourdomain.com" # Sender email address
SENTRY_DSN="https://..." # Error monitoring
GOOGLE_ANALYTICS_ID="GA-..." # Analytics
```

## 🚀 Deployment Platforms

### 1. Railway (✅ Recommended)

**Why Railway?**
- Native WebSocket support
- Automatic PostgreSQL provisioning
- Zero-config deployments
- Built-in monitoring

**Setup:**
1. Connect GitHub repository to Railway
2. Add environment variables in dashboard
3. Auto-deploy on push

**Configuration:**
- Build Command: `npm run build` (automatic)
- Start Command: `npm start` (automatic)
- Port: Automatically configured

### 2. Render (✅ Full-Stack)

**Features:**
- Free tier available
- PostgreSQL addon
- Automatic SSL

**Setup:**
1. Connect GitHub repository
2. Create new Web Service
3. Configure:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment: Node.js

### 3. DigitalOcean App Platform (✅ Professional)

**Features:**
- Managed database options
- CDN integration
- Automatic scaling

**Setup:**
1. Connect GitHub repository
2. Configure app spec:
   - Build: `npm run build`
   - Run: `npm start`
3. Add managed PostgreSQL database

### 4. Heroku (✅ Classic)

**Files included:**
- `Procfile`: Web process definition
- `app.json`: One-click deploy configuration

**Setup:**
```bash
# Using Heroku CLI
heroku create your-app-name
heroku addons:create heroku-postgresql:mini
heroku config:set SESSION_SECRET="your-secret"
git push heroku main
```

**One-click deploy:** Use the `app.json` for Heroku Button deploys

### 5. Docker (✅ Container)

**Files included:**
- `Dockerfile`: Multi-stage build with security
- `docker-compose.yml`: Complete stack with PostgreSQL
- `init.sql`: Database initialization

**Local Development:**
```bash
docker-compose up -d
```

**Production Docker:**
```bash
docker build -t international-kabab-house .
docker run -p 5000:5000 --env-file .env international-kabab-house
```

### 6. Vercel (⚠️ Limited)

**Limitations:**
- Static frontend only
- API routes require serverless function adaptation
- No WebSocket support

**Included:** `vercel.json` for static deployment

### 7. Netlify (⚠️ Limited)

**Limitations:**
- Static frontend only
- Backend requires serverless functions

**Included:**
- `netlify.toml`: Configuration with security headers
- `netlify/functions/server.ts`: Serverless wrapper

## 🔧 Build Process

```bash
# Install dependencies
npm install

# Build application
npm run build
# Creates:
# - dist/public/ (frontend build)
# - dist/index.js (server build)

# Start production server
npm start
```

## 🏥 Health Check & Monitoring

**Health Check Endpoint:** `/api/health`

**Response Example:**
```json
{
  "status": "healthy",
  "timestamp": "2025-09-20T05:54:08.214Z",
  "uptime": 14.511,
  "environment": "production",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "stripe": "configured",
    "notifications": "operational"
  }
}
```

**Uses:**
- Load balancer health checks
- Monitoring systems
- Docker health checks
- Uptime monitoring

## 🗄️ Database Setup

**Supported:** PostgreSQL (required)

### For Docker:
PostgreSQL included in `docker-compose.yml` with automatic initialization.

### For Cloud Platforms:
1. Provision PostgreSQL database
2. Set `DATABASE_URL` environment variable
3. Tables created automatically on first run
4. Optional: Run `npm run db:push` for manual schema sync

## 🌐 Domain & SSL

### DNS Configuration
1. Point domain to hosting provider
2. Configure CNAME or A records as required

### SSL Certificate
- **Automatic:** Railway, Render, Vercel, Netlify
- **Manual:** Self-hosted deployments

### Environment Updates
Update any hardcoded URLs in environment variables.

## ✅ Production Checklist

### Critical
- [x] Build succeeds without errors
- [x] Health check returns 200 status
- [x] Environment variables configured
- [x] Database connectivity tested
- [x] Application starts successfully

### Optional
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Stripe live keys configured (if using payments)
- [ ] Email service configured (SendGrid)
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics configured (Google Analytics)
- [ ] Backup strategy implemented

## 🐛 Troubleshooting

### Build Issues
```bash
# Check Node.js version
node --version  # Should be >=18.0.0

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Manual build
npm run build
```

### Runtime Issues
```bash
# Check environment variables
echo $DATABASE_URL
echo $SESSION_SECRET

# Test health endpoint
curl http://localhost:5000/api/health

# Check logs
docker logs container-name  # Docker
heroku logs --tail         # Heroku
```

### Common Problems

**Build fails:**
- Node.js version <18.0.0
- Missing dependencies
- Asset files missing

**Server won't start:**
- Missing `DATABASE_URL`
- Missing `SESSION_SECRET`
- Database connection failed

**Payment issues:**
- Missing Stripe keys (gracefully degraded)
- Wrong environment keys (test vs live)

## 🔍 Platform Compatibility Matrix

| Platform | WebSockets | Database | Payments | Real-time | Status |
|----------|------------|----------|----------|-----------|--------|
| Railway | ✅ | ✅ | ✅ | ✅ | ✅ Recommended |
| Render | ✅ | ✅ | ✅ | ✅ | ✅ Full Support |
| DigitalOcean | ✅ | ✅ | ✅ | ✅ | ✅ Professional |
| Heroku | ✅ | ✅ | ✅ | ✅ | ✅ Classic |
| Docker | ✅ | ✅ | ✅ | ✅ | ✅ Self-hosted |
| VPS/Cloud | ✅ | ✅ | ✅ | ✅ | ✅ Full Control |
| Vercel | ❌ | ⚠️ | ⚠️ | ❌ | ⚠️ Static only |
| Netlify | ❌ | ⚠️ | ⚠️ | ❌ | ⚠️ Static only |

## 📞 Support

For deployment issues:
1. Check this documentation
2. Review error logs
3. Test health endpoint
4. Verify environment variables
5. Check platform-specific documentation

**Quick Test:**
```bash
# Test locally first
npm install
npm run build
DATABASE_URL="postgresql://test:test@localhost:5432/test" \
SESSION_SECRET="test-secret-32-chars-minimum" \
npm start
```

## 🎯 Quick Deploy Commands

### Railway
```bash
railway login
railway new
railway add
railway up
```

### Heroku
```bash
heroku create your-app
heroku addons:create heroku-postgresql:mini
git push heroku main
```

### Docker
```bash
docker-compose up -d
```

The restaurant website is now production-ready and can be deployed to any compatible hosting platform! 🍽️