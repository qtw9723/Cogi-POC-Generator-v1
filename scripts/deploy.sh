#!/bin/bash

# Cogi POC Generator - Vercel Deployment Script
# This script helps deploy the application to Vercel

set -e

echo "🚀 Cogi POC Generator - Vercel Deployment"
echo "========================================"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ required (you have $(node -v))"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Verify build works
echo "🔨 Verifying build..."
npm run build || {
    echo "❌ Build failed. Fix errors above and try again."
    exit 1
}

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null 2>&1; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

echo ""
echo "📋 Deployment Configuration:"
echo "  • Build Command: npm run build"
echo "  • Output Directory: dist"
echo "  • Framework: Vite"
echo ""
echo "⚠️  Make sure you have set these environment variables in Vercel dashboard:"
echo "  • VITE_SUPABASE_URL"
echo "  • VITE_SUPABASE_ANON_KEY"
echo "  • VITE_SUPABASE_SERVICE_ROLE_KEY"
echo "  • VITE_GEMINI_API_KEY"
echo ""

read -p "Ready to deploy to Vercel? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Visit your Vercel project dashboard"
echo "  2. Verify environment variables are set correctly"
echo "  3. Check deployment logs if needed"
echo "  4. Test the application at your deployed URL"
echo ""
echo "🧪 Run deployment tests with:"
echo "  npm run test:deployment"
