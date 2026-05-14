#!/bin/bash

# Cogi POC Generator - Build Verification Script
# Verifies that the application builds correctly and has proper structure

set -e

echo "✅ Build Verification Script"
echo "============================"
echo ""

# Check Node.js
echo "📌 Checking Node.js..."
node -v
npm -v
echo ""

# Check dependencies
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi
echo "✓ Dependencies installed"
echo ""

# Clean build
echo "🔨 Running clean build..."
rm -rf dist/
npm run build
echo "✓ Build successful"
echo ""

# Check build output
echo "📁 Checking build output..."
if [ ! -d "dist" ]; then
    echo "❌ Build directory not created"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ index.html not found in dist/"
    exit 1
fi

# Check file sizes
echo "📊 Build output size:"
du -sh dist/
echo ""

# Check for required files
echo "🔍 Checking required files..."
required_files=(
    "dist/index.html"
    "src/main.jsx"
    "src/App.jsx"
    "package.json"
    "vite.config.js"
    "vercel.json"
    "DEPLOYMENT.md"
    "README.md"
)

missing=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ❌ $file (missing)"
        missing=$((missing + 1))
    fi
done
echo ""

if [ $missing -gt 0 ]; then
    echo "❌ $missing required files are missing"
    exit 1
fi

# Check for environment file
echo "⚙️  Checking environment setup..."
if [ -f ".env.example" ]; then
    echo "  ✓ .env.example exists"
    if [ ! -f ".env" ]; then
        echo "  ⚠️  .env not found (expected for local dev)"
    fi
else
    echo "  ❌ .env.example not found"
    exit 1
fi
echo ""

# Check Git status
echo "📝 Checking git status..."
if [ -d ".git" ]; then
    commits=$(git log --oneline | wc -l)
    echo "  ✓ Git repository with $commits commits"

    if [ -n "$(git status --porcelain)" ]; then
        echo "  ⚠️  Uncommitted changes detected"
    else
        echo "  ✓ Working tree clean"
    fi
else
    echo "  ⚠️  Not a git repository"
fi
echo ""

# Summary
echo "✅ Verification complete!"
echo ""
echo "Ready to deploy with:"
echo "  • Production build size: $(du -sh dist/ | cut -f1)"
echo "  • All required files present"
echo "  • Git history preserved"
echo ""
echo "Next steps:"
echo "  1. Set environment variables (.env)"
echo "  2. Run: npm run dev (to test locally)"
echo "  3. Run: ./scripts/deploy.sh (to deploy to Vercel)"
echo ""
