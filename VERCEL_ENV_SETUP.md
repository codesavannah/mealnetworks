# Vercel Environment Variables Setup

Go to your Vercel project settings → Environment Variables and add these:

## Required Variables

### Database
```
DATABASE_URL=postgresql://neondb_owner:npg_ZoaOvihX1U8H@ep-winter-term-ad1juutc-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### JWT Secret
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### SMTP Email (optional, for notifications)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-app-email@gmail.com
SMTP_PASS=your-app-password-or-app-specific-password
```

### Node Environment
```
NODE_ENV=production
```

## Steps:
1. Go to https://vercel.com/[your-username]/[project-name]/settings/environment-variables
2. Add each variable above
3. Select "Production", "Preview", and "Development" for each
4. Click "Save"
5. Redeploy: Go to Deployments → Click "..." on latest → "Redeploy"

## Important Notes:
- The DATABASE_URL must be exactly as shown (with ?sslmode=require)
- Change JWT_SECRET to a random secure string
- SMTP variables are optional but needed for email notifications

