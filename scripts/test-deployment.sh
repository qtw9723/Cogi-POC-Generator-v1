#!/bin/bash

# Cogi POC Generator - Deployment Testing Script
# This script tests the deployed application endpoints

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_URL="${1:-.}"
if [ "$DEPLOYMENT_URL" = "." ]; then
    echo "❌ Please provide deployment URL as argument"
    echo "Usage: ./scripts/test-deployment.sh https://your-vercel-project.vercel.app"
    exit 1
fi

# Remove trailing slash
DEPLOYMENT_URL="${DEPLOYMENT_URL%/}"

echo "🧪 Testing Deployment: $DEPLOYMENT_URL"
echo "======================================"
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4

    echo -n "Testing $description... "

    if [ "$method" = "GET" ]; then
        status=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL$endpoint")
    else
        status=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$DEPLOYMENT_URL$endpoint")
    fi

    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ OK ($status)${NC}"
        return 0
    else
        echo -e "${RED}✗ FAILED (got $status, expected $expected_status)${NC}"
        return 1
    fi
}

# Test homepage
echo "📄 Frontend Routes:"
test_endpoint "GET" "/" "200" "Home page" || true
test_endpoint "GET" "/results" "200" "Results page" || true
test_endpoint "GET" "/admin" "200" "Admin login page" || true
echo ""

# Test API endpoints
echo "🔌 API Endpoints:"
test_endpoint "GET" "/api/questions" "200" "GET questions" || true
test_endpoint "GET" "/api/results" "200" "GET results" || true
echo ""

# Test that Node env variables are NOT exposed
echo "🔒 Security Checks:"
response=$(curl -s "$DEPLOYMENT_URL/index.html" || echo "")
if echo "$response" | grep -q "VITE_SUPABASE_URL\|VITE_GEMINI_API_KEY"; then
    echo -e "${RED}✗ FAILED: API keys may be exposed in HTML${NC}"
else
    echo -e "${GREEN}✓ OK: No API keys in HTML${NC}"
fi
echo ""

# Test CORS headers (should be allowed from Vercel)
echo "🔐 CORS Headers:"
cors_origin=$(curl -s -i "$DEPLOYMENT_URL/api/questions" | grep -i "access-control-allow-origin" || echo "Not set")
echo "  Access-Control-Allow-Origin: $cors_origin"
echo ""

# Summary
echo "✅ Deployment testing complete!"
echo ""
echo "📝 Manual testing checklist:"
echo "  [ ] Open $DEPLOYMENT_URL in browser"
echo "  [ ] Verify page loads and is styled correctly"
echo "  [ ] Check browser console for errors"
echo "  [ ] Test filling out questionnaire form"
echo "  [ ] Test admin login (master/master)"
echo "  [ ] Check that questions load from API"
echo ""
