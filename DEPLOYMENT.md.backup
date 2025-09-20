# Deployment Guide

This guide explains how to deploy the International Kabab House restaurant platform to various hosting providers.

## Pre-deployment Checklist

1. **Environment Variables**: Set up all required environment variables
2. **Database**: Provision a PostgreSQL database
3. **Payment Processing**: Configure Stripe with live keys for production
4. **Domain**: Set up your custom domain (optional)

## Deployment Options

**Note:** This application uses Express.js with WebSockets and sessions. It requires platforms that support long-running Node.js servers, not serverless functions.

### 1. Railway (Recommended)

**Steps:**
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically

**Why Railway?** Native support for WebSockets, sessions, and long-running processes.

### 2. Render (Full-Stack)

**Configuration:**
- Build Command: `npm run build`
- Start Command: `npm start`
- Port: Railway automatically sets PORT environment variable

**Steps:**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure build and start commands
4. Add environment variables

**Configuration:**
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: Node.js

### 3. DigitalOcean App Platform

**Steps:**
1. Connect your GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

**Configuration:**
- Build Command: `npm run build`
- Run Command: `npm start`
- Environment Variables: Add all required variables

### 4. Heroku

**Steps:**
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Add PostgreSQL addon: `heroku addons:create heroku-postgresql`
4. Set environment variables: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

### 5. Docker Deployment

**Local Docker:**
```bash
docker build -t restaurant-app .
docker run -p 5000:5000 --env-file .env restaurant-app
```

**Docker Compose:**
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/restaurant
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=restaurant
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Environment Variables Setup

### Required Variables:
```env
DATABASE_URL=postgresql://username:password@host:5432/database
STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_stripe_publishable_key
SESSION_SECRET=your_secure_random_session_secret
```

### Optional Variables:
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
CORS_ORIGIN=https://yourdomain.com
PORT=5000
```

## Database Setup

1. **Create PostgreSQL Database**
2. **Set DATABASE_URL** environment variable
3. **Run Database Migration**: `npm run db:push`

## Domain Configuration

1. **Custom Domain**: Configure your hosting provider to use your domain
2. **SSL Certificate**: Most providers offer free SSL certificates
3. **CORS Configuration**: Update CORS settings for your domain

## Production Checklist

- [ ] All environment variables set with production values
- [ ] Database is accessible and migrated
- [ ] Stripe keys are set to live mode
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Error monitoring setup
- [ ] Backup strategy in place

## Troubleshooting

**Build Issues:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check TypeScript compilation errors

**Runtime Issues:**
- Verify environment variables are set correctly
- Check database connectivity
- Verify Stripe webhook endpoints

**Performance:**
- Enable gzip compression
- Configure CDN for static assets
- Monitor database performance

## Platform Compatibility

**✅ Compatible (Long-running server support):**
- Railway
- Render  
- DigitalOcean App Platform
- Heroku
- Docker/Kubernetes
- AWS Elastic Beanstalk
- Self-hosted VPS

**❌ Not Compatible (Serverless only):**
- Vercel (functions don't support WebSockets/sessions)
- Netlify (functions don't support WebSockets/sessions)
- AWS Lambda (requires major architecture changes)