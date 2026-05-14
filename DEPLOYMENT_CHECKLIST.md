# Deployment Checklist

## Pre-Deployment Verification (Task 18) ✓

- [x] Build succeeds locally (`npm run build`)
- [x] Git repository is clean
- [x] .gitignore is configured
- [x] Environment variables documented
- [x] README.md created
- [x] DEPLOYMENT.md created
- [x] vercel.json configured correctly
- [x] All source files committed

## Task 19: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

- [ ] Go to https://vercel.com
- [ ] Sign in or create account
- [ ] Click "New Project"
- [ ] Import your GitHub repository
- [ ] Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install` (automatic)
- [ ] Add environment variables in "Environment Variables" section:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `VITE_GEMINI_API_KEY`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Verify deployment successful (green checkmark)
- [ ] Note your Vercel project URL (e.g., https://cogi-poc-generator-v1.vercel.app)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to set up project
```

- [ ] CLI installed and authenticated
- [ ] Project deployed with `vercel --prod`
- [ ] Environment variables set in Vercel dashboard
- [ ] Deployment successful

## Task 20: Test Edge Functions and Integration

### Frontend Tests

- [ ] Visit production URL (Vercel domain)
- [ ] Verify home page loads
- [ ] Check responsive design (mobile/tablet/desktop)
- [ ] Test navigation between routes

### User Flow Test

- [ ] Access home page (`/`)
- [ ] Verify questions load from API
- [ ] Fill out questionnaire form
- [ ] Submit form to generate JSON
- [ ] Verify JSON is generated and displayed
- [ ] Download generated JSON
- [ ] Navigate to results list
- [ ] Verify generated results appear

### Admin Flow Test

- [ ] Navigate to `/admin`
- [ ] Login with credentials (master/master)
- [ ] Access `/admin/questions`
  - [ ] Create new question
  - [ ] Edit existing question
  - [ ] Delete question
  - [ ] Verify changes appear in user form
- [ ] Access `/admin/references`
  - [ ] Upload a test JSON file
  - [ ] Click "Learn" button
  - [ ] Verify template_status changes to "completed"
  - [ ] Download reference
  - [ ] Delete reference

### API Integration Test

Test in browser DevTools Console or with curl:

```bash
# Get questions (should return array)
curl https://your-project.vercel.app/api/questions

# Generate JSON (requires reference_id and responses)
curl -X POST https://your-project.vercel.app/api/cogi-generator \
  -H "Content-Type: application/json" \
  -d '{"reference_id": "...", "responses": {...}}'

# Get results
curl https://your-project.vercel.app/api/results
```

### Performance Check

- [ ] Check Lighthouse score (target: 90+)
- [ ] Verify Core Web Vitals
- [ ] Check bundle size (gzip size should be under 100KB)
- [ ] Verify edge function cold start time

### Error Handling Test

- [ ] Submit form without selecting reference (should show error)
- [ ] Submit form with missing required fields (should show error)
- [ ] Try accessing admin without login (should redirect)
- [ ] Try accessing admin with wrong credentials (should show error)
- [ ] Test network error handling (disable network, try to load data)

### Edge Function Logs

- [ ] Open Supabase dashboard
- [ ] Navigate to Functions → [function-name]
- [ ] Check logs for any errors
- [ ] Verify Gemini API calls in learn-rules logs
- [ ] Check cogi-generator logs for JSON generation

### Domain & HTTPS

- [ ] Verify site is accessible via HTTPS
- [ ] Check for mixed content warnings
- [ ] Test on mobile network (slow connection)
- [ ] Test with VPN enabled

## Post-Deployment

- [ ] Document production URL
- [ ] Set up monitoring/analytics (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up CI/CD for automatic deployments (automatic with GitHub)
- [ ] Configure Vercel notifications (optional)

## Rollback Plan

If deployment fails:

1. Check Vercel logs for build errors
2. Verify environment variables are set correctly
3. Check Supabase Edge Functions are deployed
4. Verify database migrations are applied
5. If needed, revert last commit: `git revert HEAD`
6. Push and redeploy

## Success Criteria

✓ All routes load correctly
✓ Questions API returns data
✓ JSON generation works
✓ Admin CRUD operations work
✓ Gemini learning completes
✓ No console errors
✓ Mobile responsive
✓ Response times < 2s
