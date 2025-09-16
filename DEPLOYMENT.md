# 🚀 Deployment Guide - International Kabab House

This guide provides step-by-step instructions for deploying the International Kabab House website on various platforms.

![Website Screenshot](https://github.com/user-attachments/assets/06a50568-573d-43b2-a92e-8be00a3fb3da)

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] **Database**: PostgreSQL database set up (Neon, Supabase, or self-hosted)
- [ ] **Stripe Account**: For payment processing
- [ ] **SendGrid Account**: For email notifications
- [ ] **Environment Variables**: All required variables configured
- [ ] **Domain Name**: (Optional) Custom domain for production

## 🔧 Required Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Session
SESSION_SECRET=your_long_random_session_secret_here

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# SendGrid (get from https://app.sendgrid.com/settings/api_keys)
SENDGRID_API_KEY=SG.your_sendgrid_api_key
FROM_EMAIL=your_restaurant_email@example.com
```

## 🐳 Docker Deployment (Recommended)

### Local Docker Deployment

1. **Clone and set up environment**:
```bash
git clone https://github.com/JaySayed/International-kebab-house.git
cd International-kebab-house
cp .env.example .env
# Edit .env with your values
```

2. **Build and run with Docker Compose**:
```bash
docker-compose up -d
```

3. **Access your application**:
- Website: http://localhost:5000
- Health check: http://localhost:5000/api/health

### Production Docker Deployment

1. **Build the production image**:
```bash
docker build -t kebab-house:latest .
```

2. **Run with environment variables**:
```bash
docker run -d \
  --name kebab-house \
  -p 5000:5000 \
  --env-file .env \
  --restart unless-stopped \
  kebab-house:latest
```

## ☁️ Cloud Platform Deployments

### 1. Heroku

```bash
# Install Heroku CLI and login
heroku create your-kebab-house-app

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL="your_database_url"
heroku config:set STRIPE_SECRET_KEY="your_stripe_key"
heroku config:set STRIPE_PUBLISHABLE_KEY="your_stripe_public_key"
heroku config:set SENDGRID_API_KEY="your_sendgrid_key"
heroku config:set SESSION_SECRET="your_session_secret"
heroku config:set FROM_EMAIL="your_email@domain.com"

# Deploy
git push heroku main
```

### 2. Railway

1. **Connect GitHub repository** to Railway
2. **Set environment variables** in Railway dashboard
3. **Deploy automatically** - Railway will detect the `railway.toml` file
4. **Custom domain** (optional): Add your domain in Railway settings

**One-click deploy**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### 3. Vercel

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Set environment variables** in Vercel dashboard
4. The `vercel.json` configuration will handle routing

### 4. Netlify

1. **Connect GitHub repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `server/public`
3. **Set environment variables** in Netlify dashboard
4. The `netlify.toml` configuration will handle routing

### 5. DigitalOcean App Platform

1. **Create new app** from GitHub repository
2. **Configure build settings**:
   - Build command: `npm run build`
   - Run command: `npm start`
3. **Set environment variables** in the dashboard
4. **Add domain** (optional)

### 6. AWS (ECS/Fargate)

```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com

docker build -t kebab-house .
docker tag kebab-house:latest your-account.dkr.ecr.us-east-1.amazonaws.com/kebab-house:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/kebab-house:latest
```

Then create an ECS service using the pushed image.

### 7. Google Cloud Run

```bash
# Build and deploy
gcloud builds submit --tag gcr.io/your-project/kebab-house
gcloud run deploy --image gcr.io/your-project/kebab-house --platform managed
```

## 🗄️ Database Setup

### Option 1: Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string
4. Set `DATABASE_URL` environment variable

### Option 2: Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string
5. Set `DATABASE_URL` environment variable

### Option 3: Self-hosted PostgreSQL

```bash
# Docker PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_DB=kebab_house \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  postgres:15-alpine
```

## 💳 Payment Setup (Stripe)

1. **Create Stripe account** at [stripe.com](https://stripe.com)
2. **Get API keys**:
   - Go to Developers > API keys
   - Copy Secret key (starts with `sk_`)
   - Copy Publishable key (starts with `pk_`)
3. **Set up webhooks** (optional for advanced features):
   - Go to Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`

## 📧 Email Setup (SendGrid)

1. **Create SendGrid account** at [sendgrid.com](https://sendgrid.com)
2. **Create API key**:
   - Go to Settings > API Keys
   - Create new API key with Mail Send permissions
3. **Verify sender identity**:
   - Go to Settings > Sender Authentication
   - Verify your email domain or single email

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use strong, unique `SESSION_SECRET`
- [ ] Use production Stripe keys (not test keys)
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Use environment variables for all secrets
- [ ] Set up monitoring and alerts
- [ ] Regular security updates

### SSL/HTTPS Setup

Most cloud platforms provide automatic HTTPS. For custom servers:

```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot
sudo certbot --nginx -d yourdomain.com
```

## 📊 Monitoring & Maintenance

### Health Checks

The application includes a health check endpoint:
- `GET /api/health` - Returns server status and uptime

### Logging

Application logs are available through:
- Docker: `docker logs kebab-house`
- Heroku: `heroku logs --tail`
- Other platforms: Check platform-specific logging

### Monitoring Services

Consider integrating with:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, Bugsnag
- **Performance**: New Relic, DataDog

## 🚀 One-Click Deployment Options

### Deploy to Heroku
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## 🆘 Troubleshooting

### Common Issues

1. **Build failures**
   - Check if all dependencies are installed
   - Verify Node.js version (requires 18+)
   - Check for missing environment variables

2. **Database connection errors**
   - Verify `DATABASE_URL` format
   - Check database server status
   - Ensure database accepts connections

3. **Payment processing issues**
   - Verify Stripe keys are correct
   - Check if Stripe is in test/live mode
   - Verify webhook endpoints

4. **Email delivery problems**
   - Check SendGrid API key permissions
   - Verify sender email authentication
   - Check spam folders

### Getting Help

- **Documentation**: Check the main README.md
- **Issues**: Create GitHub issue
- **Email**: internationalkababhouse@gmail.com
- **Phone**: (470) 990-6345

## 📈 Performance Optimization

### Production Optimizations

- **Enable gzip compression**
- **Use CDN for static assets**
- **Optimize images**
- **Enable database connection pooling**
- **Set up caching headers**
- **Monitor and optimize bundle size**

### Scaling Considerations

- **Horizontal scaling**: Add more server instances
- **Database scaling**: Read replicas, connection pooling
- **CDN**: Use CloudFlare or AWS CloudFront
- **Load balancing**: Use platform load balancers

---

## 🎉 Success!

Your International Kabab House website should now be successfully deployed and accessible to customers worldwide!

Remember to:
- Test all functionality after deployment
- Set up monitoring and alerting
- Keep dependencies updated
- Regular backups of your database
- Monitor performance and costs

For any deployment issues, refer to the troubleshooting section or contact support.