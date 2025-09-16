# International Kabab House - Restaurant Website

A modern, full-stack restaurant website for International Kabab House featuring online ordering, menu management, and customer engagement features.

## 🚀 Features

- **Modern React Frontend**: Built with React, TypeScript, and Tailwind CSS
- **Express.js Backend**: RESTful API with TypeScript
- **Online Ordering**: Integrated Stripe payments and order management
- **Menu Management**: Dynamic menu with categories and pricing
- **Email Automation**: Order confirmations and marketing emails via SendGrid
- **Responsive Design**: Mobile-first design that works on all devices
- **PWA Support**: Progressive Web App capabilities
- **Database Integration**: PostgreSQL with Drizzle ORM

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Radix UI components
- React Query for data fetching
- Wouter for routing

### Backend
- Node.js with Express
- TypeScript
- Drizzle ORM with PostgreSQL
- Stripe for payments
- SendGrid for emails
- Session management

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- Stripe account (for payments)
- SendGrid account (for emails)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/JaySayed/International-kebab-house.git
cd International-kebab-house
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
- Database connection string
- Stripe API keys
- SendGrid API key
- Session secret

### 4. Set up the database
```bash
npm run db:push
```

### 5. Build the application
```bash
npm run build
```

### 6. Start the production server
```bash
npm start
```

The application will be available at `http://localhost:5000`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

2. **Build and start the containers**:
   ```bash
   docker-compose up -d
   ```

### Using Docker directly

1. **Build the image**:
   ```bash
   docker build -t kebab-house .
   ```

2. **Run the container**:
   ```bash
   docker run -p 5000:5000 \
     -e DATABASE_URL="your_database_url" \
     -e STRIPE_SECRET_KEY="your_stripe_key" \
     -e SENDGRID_API_KEY="your_sendgrid_key" \
     -e SESSION_SECRET="your_session_secret" \
     kebab-house
   ```

## ☁️ Cloud Deployment Options

### 1. Heroku
```bash
# Install Heroku CLI and login
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set DATABASE_URL=your_database_url
heroku config:set STRIPE_SECRET_KEY=your_stripe_key
# ... set other environment variables
git push heroku main
```

### 2. Railway
1. Connect your GitHub repository to Railway
2. Set environment variables in the Railway dashboard
3. Deploy automatically on push to main branch

### 3. DigitalOcean App Platform
1. Create a new app from your GitHub repository
2. Set environment variables in the dashboard
3. Deploy with automatic builds

### 4. AWS/Google Cloud/Azure
Use the Docker image with their container services:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances

## 🔧 Development

### Start development server
```bash
npm run dev
```

This starts both the frontend (Vite dev server) and backend with hot reloading.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Images and static assets
│   ├── index.html         # HTML template
│   └── public/            # Public assets
├── server/                # Backend Express application
│   ├── index.ts          # Main server file
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database configuration
│   └── vite.ts           # Vite integration
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose configuration
└── package.json          # Dependencies and scripts
```

## 🔐 Environment Variables

Required environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port (default: 5000) | No |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `SESSION_SECRET` | Session encryption secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `SENDGRID_API_KEY` | SendGrid API key | Yes |
| `FROM_EMAIL` | Sender email address | Yes |

## 🍽 Menu Management

The application uses a PostgreSQL database to manage menu items. You can:

1. Add menu items through the admin interface (if implemented)
2. Directly insert into the database
3. Use the API endpoints to manage menu items

## 💳 Payment Integration

The application uses Stripe for payment processing:

1. Customer enters payment information
2. Payment intent is created on the server
3. Payment is processed securely through Stripe
4. Order is confirmed and email notifications are sent

## 📧 Email Notifications

Automated emails are sent using SendGrid:

- Order confirmations
- Welcome emails for new customers
- Reservation confirmations
- Abandoned cart reminders

## 🔍 Monitoring and Health Checks

The application includes health check endpoints:

- `GET /api/health` - Basic health check
- Docker health checks are configured
- Application logs are available through standard output

## 🛡 Security Features

- Session-based authentication
- Environment variable protection
- CSRF protection
- Input validation with Zod
- SQL injection prevention with Drizzle ORM

## 📱 PWA Features

The application includes Progressive Web App features:

- Service worker for caching
- Web app manifest
- Offline functionality
- Add to home screen capability

## 🐛 Troubleshooting

### Common Issues

1. **Build failures**: Ensure all environment variables are set
2. **Database connection issues**: Verify DATABASE_URL is correct
3. **Payment issues**: Check Stripe keys and webhooks
4. **Email issues**: Verify SendGrid configuration

### Logs

View application logs:
```bash
# Development
npm run dev

# Production (Docker)
docker-compose logs -f app

# Production (direct)
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email internationalkababhouse@gmail.com or call (470) 990-6345.

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up Stripe webhooks
- [ ] Configure SendGrid templates
- [ ] Test payment flow
- [ ] Test email notifications
- [ ] Set up domain and SSL certificate
- [ ] Configure monitoring and alerting
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags