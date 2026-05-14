# Vercel Deployment Guide

## Prerequisites

1. Vercel account (https://vercel.com)
2. Git repository configured (already done)
3. Supabase project set up with:
   - Edge Functions deployed
   - Database schema migrated
   - RLS policies configured

## Environment Variables Required

Copy `.env.example` and create `.env` with actual values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## Deployment Steps

1. **Connect Repository to Vercel**
   ```bash
   # Option A: Use Vercel CLI
   npm install -g vercel
   vercel
   
   # Option B: Use Vercel Dashboard
   # Visit vercel.com/new and connect your GitHub repository
   ```

2. **Set Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add the 4 environment variables listed above
   - Available in: Production, Preview, Development

3. **Deploy**
   - Automatic: Push to main branch
   - Manual: `vercel --prod` (with Vercel CLI)

## Build Configuration

- **Build Command**: `npm run build` (configured in vercel.json)
- **Output Directory**: `dist` (Vite output)
- **SPA Routing**: All requests rewrite to /index.html (configured in vercel.json)

## Post-Deployment

1. Update Supabase Edge Functions environment variables if needed
2. Update CORS settings in Supabase if domain changes
3. Test API endpoints from production URL
4. Monitor Edge Functions logs in Supabase dashboard

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check environment variable availability during build

### API Calls Fail
- Verify Edge Functions are deployed to Supabase
- Check CORS settings in Supabase project
- Verify environment variables in Vercel match actual keys

### Routing Issues
- vercel.json SPA rewrite is configured
- All routes fall back to /index.html automatically
