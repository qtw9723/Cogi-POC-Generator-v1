# Getting Started - Cogi POC Generator v1

This guide walks you through setup, local development, and deployment.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Development Workflow](#development-workflow)
5. [Deployment](#deployment)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

**Cogi POC Generator** is a web application that helps users generate Cogi Dialog JSON files based on customizable questionnaires and reference templates.

### Key Features
- User-friendly questionnaire form with multiple input types
- AI-powered template learning from reference JSON files
- Admin dashboard for managing questions and references
- Instant JSON generation using learned templates
- Result tracking and download capability

### Architecture
- **Frontend**: React 19 + Vite (deployed to Vercel)
- **Backend**: Supabase Edge Functions (TypeScript/Deno)
- **Database**: PostgreSQL via Supabase
- **AI**: Google Gemini API for template learning

## 📦 Prerequisites

### Required
- Node.js 18+ (check with `node --version`)
- npm 10+ (check with `npm --version`)
- Git
- A Supabase account with a project already created
- A Google Gemini API key
- A Vercel account (for deployment)

### Verify Prerequisites
```bash
# Check versions
node --version  # Should be v18.x or higher
npm --version   # Should be 10.x or higher
git --version   # Should be 2.x or higher

# Check directory
pwd  # Should be /Users/sangjun/IdeaProjects/Cogi-POC-Generator-v1
```

## 🚀 Local Development Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Deploy Database Schema
```bash
# If you have Supabase CLI installed
npx supabase db push

# Otherwise, manually run the migration in Supabase dashboard:
# supabase/migrations/20260514000000_cogi_generator_schema.sql
```

### Step 4: Deploy Edge Functions
```bash
# If you have Supabase CLI installed
npx supabase functions deploy

# Otherwise, manually create Edge Functions in Supabase dashboard
# using the files in supabase/functions/
```

### Step 5: Verify Build
```bash
./scripts/verify-build.sh
```

Expected output: ✅ All checks passing

## 💻 Development Workflow

### Start Development Server
```bash
npm run dev
```

This starts a local development server at `http://localhost:5173` with:
- Hot module reloading (HMR)
- Vite's fast build system
- React Fast Refresh

### Access the Application
- **Home**: http://localhost:5173/
- **Results**: http://localhost:5173/results
- **Admin Login**: http://localhost:5173/admin
  - Username: `master`
  - Password: `master`

### Common Development Tasks

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Clean build artifacts
rm -rf dist/
```

### Project Structure During Development

```
src/
├── components/        # React components (edit these for UI changes)
├── hooks/            # Custom React hooks (edit for data logic)
├── lib/              # Utilities (Supabase client, constants)
├── App.jsx           # Main app component with routing
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## 📤 Deployment

### Automated Deployment Script

The easiest way to deploy:

```bash
./scripts/deploy.sh
```

This script will:
1. Verify prerequisites
2. Check your build works
3. Install/verify Vercel CLI
4. Prompt for authentication
5. Deploy to production
6. Provide your deployment URL

### Manual Deployment via Vercel Dashboard

1. **Create Vercel Project**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "Cogi-POC-Generator-v1"

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Project Settings → Environment Variables
   - Add all 4 variables from your `.env` file
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your URL will be displayed (e.g., https://cogi-poc-generator-v1.vercel.app)

### Post-Deployment

After successful deployment:

1. **Verify Deployment**
   ```bash
   ./scripts/test-deployment.sh https://your-vercel-project.vercel.app
   ```

2. **Check Production URL**
   - Open your Vercel deployment URL
   - Test filling out the questionnaire
   - Verify admin login works

3. **Monitor Edge Functions**
   - Open Supabase dashboard
   - Go to Functions section
   - Check logs for any errors
   - Verify API responses are correct

## 🧪 Testing

### Local Testing

Before deployment, test locally:

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Run tests
./scripts/verify-build.sh
```

### Pre-Deployment Testing

```bash
# Build and verify
npm run build

# Check build output
ls -lh dist/
```

### Post-Deployment Testing

```bash
# After deploying to Vercel
./scripts/test-deployment.sh https://your-deployment-url.vercel.app
```

### Manual Testing Checklist

- [ ] Home page loads and renders correctly
- [ ] Responsive design works on mobile
- [ ] Questionnaire form displays questions
- [ ] Form submission generates JSON
- [ ] Results page shows generated JSONs
- [ ] Can view/download individual results
- [ ] Admin login accepts master/master
- [ ] Can create new question
- [ ] Can upload reference JSON
- [ ] Can trigger learning (Gemini API call)
- [ ] Can delete questions/references
- [ ] No console errors
- [ ] No 404 errors in network tab

## 🐛 Troubleshooting

### Build Fails

**Problem**: `npm run build` fails with errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Calls Return 401/403

**Problem**: Admin API calls return unauthorized errors

**Solution**:
- Verify Supabase Edge Functions are deployed
- Check that service role key is correct in `.env`
- Verify token is being sent in request headers
- Check Edge Function logs in Supabase dashboard

### Gemini API Errors

**Problem**: Learning fails with API errors

**Solution**:
- Verify `VITE_GEMINI_API_KEY` is valid
- Check Gemini API quota in Google Cloud Console
- Verify request format in `learn-rules` Edge Function
- Check Supabase Edge Function logs

### CORS Errors

**Problem**: Browser shows CORS errors

**Solution**:
- Verify Supabase CORS settings
- Check that domain is whitelisted
- Verify Edge Functions are returning correct headers
- Try clearing browser cache

### Vercel Deployment Fails

**Problem**: Build fails on Vercel

**Solution**:
- Check Vercel build logs
- Verify environment variables are set
- Test build locally first: `npm run build`
- Check Node.js version matches (18+)

### Stuck or Need Help

1. **Check logs**
   ```bash
   # Supabase logs (in dashboard)
   # Vercel logs (in dashboard)
   # Browser console (F12)
   ```

2. **Verify configuration**
   ```bash
   # Check environment variables
   cat .env

   # Check Edge Functions deployed
   npx supabase functions list

   # Check database schema
   npx supabase db pull
   ```

3. **Review documentation**
   - See [README.md](./README.md) for full feature list
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment details
   - See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for testing checklist

## 📝 Key Files Reference

| File | Purpose |
|------|---------|
| `package.json` | Project metadata and dependencies |
| `vite.config.js` | Vite build configuration |
| `vercel.json` | Vercel deployment configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `.env.example` | Environment variables template |
| `supabase/migrations/` | Database schema |
| `supabase/functions/` | Backend Edge Functions |
| `src/components/` | React UI components |
| `src/hooks/` | Data fetching and state logic |
| `src/lib/` | Utilities and constants |

## 🚀 Quick Start Commands

```bash
# One-time setup
npm install
cp .env.example .env
# (edit .env with your credentials)

# Local development
npm run dev

# Before deployment
npm run build
./scripts/verify-build.sh

# Deploy to Vercel
./scripts/deploy.sh

# Test deployment
./scripts/test-deployment.sh https://your-url.vercel.app
```

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review the detailed documentation files:
   - [README.md](./README.md) - Full feature documentation
   - [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
   - [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Testing checklist
3. Check Supabase and Vercel dashboard logs
4. Review browser console (F12) for frontend errors

---

**Status**: ✅ Ready for deployment

**Latest Commit**: See `git log` for recent changes

**Next Steps**: Follow the [Deployment](#deployment) section to deploy to Vercel
