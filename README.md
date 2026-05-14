# Cogi POC Generator v1

Generate Cogi Dialog JSON files by answering customizable questions. Supports admin management of questions and reference templates with AI-powered learning.

## Features

- **User Generation**: Answer questions to generate Cogi Dialog JSON files
- **Reference Templates**: Upload JSON reference files for structure learning
- **AI-Powered Learning**: Gemini API analyzes reference structure and creates reusable templates
- **Admin Management**: Add/edit/delete questions and manage reference files
- **Result Tracking**: View, download, and delete generated JSON files
- **Responsive UI**: Works on desktop and mobile with Tailwind CSS

## Tech Stack

- **Frontend**: React 19, Vite, React Router v7, Tailwind CSS 4
- **Backend**: Supabase Edge Functions (Deno/TypeScript)
- **Database**: PostgreSQL (via Supabase)
- **Deployment**: Vercel (frontend), Supabase (backend)
- **AI**: Google Gemini API

## Project Structure

```
src/
├── components/          # React components
│   ├── QuestionnaireForm.jsx    # User question form
│   ├── ResultList.jsx            # List of generated JSONs
│   ├── ResultDetail.jsx           # View/download single JSON
│   ├── AdminLogin.jsx             # Admin authentication
│   ├── QuestionManager.jsx        # Admin: manage questions
│   └── ReferenceManager.jsx       # Admin: manage references
├── hooks/              # Custom React hooks
│   ├── useAuth.js              # Authentication
│   ├── useApi.js               # API wrapper
│   ├── useQuestions.js         # Questions CRUD
│   ├── useReferences.js        # References management
│   └── useResults.js           # Results management
├── lib/
│   ├── supabase.js       # Supabase client
│   └── constants.js      # Constants and enums
├── App.jsx              # Root component with routing
├── main.jsx             # Entry point
└── index.css            # Global styles

supabase/
├── functions/           # Edge Functions (TypeScript/Deno)
│   ├── questions/           # GET questions endpoint
│   ├── admin/              # Admin CRUD endpoints
│   │   ├── questions.ts     # Manage questions
│   │   ├── references.ts    # Manage references
│   │   └── learn-rules.ts   # Gemini learning
│   ├── cogi-generator/      # Generate JSON endpoint
│   └── results/             # Results CRUD
└── migrations/          # Database schema
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
# Edit .env with your Supabase and Gemini API keys
```

Required variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `VITE_GEMINI_API_KEY` - Google Gemini API key

### 3. Database Setup
```bash
# Deploy migrations to Supabase
npx supabase db push
```

### 4. Deploy Edge Functions
```bash
# Deploy to Supabase
npx supabase functions deploy
```

## Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Admin Access

Default credentials:
- **Username**: `master`
- **Password**: `master`

Access admin panel at `/admin` after login.

### Admin Features

1. **Questions Management** (`/admin/questions`)
   - Add/edit/delete questions
   - Set input type: text, textarea, select
   - Mark as required/optional
   - Reorder questions

2. **References Management** (`/admin/references`)
   - Upload JSON reference files
   - Trigger AI learning to analyze structure
   - View learning status
   - Download or delete references

## API Endpoints

All endpoints are Supabase Edge Functions:

### Public
- `GET /functions/v1/questions` - List all questions
- `GET /functions/v1/results` - List all results
- `GET /functions/v1/results/{id}` - Get specific result
- `POST /functions/v1/cogi-generator` - Generate new JSON

### Admin (require token)
- `POST /functions/v1/admin/questions` - Create question
- `PATCH /functions/v1/admin/questions/{id}` - Update question
- `DELETE /functions/v1/admin/questions/{id}` - Delete question
- `POST /functions/v1/admin/references` - Upload reference
- `GET /functions/v1/admin/references` - List references
- `DELETE /functions/v1/admin/references/{id}` - Delete reference
- `POST /functions/v1/admin/learn-rules` - Learn from reference
- `DELETE /functions/v1/results/{id}` - Delete result

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

Quick deploy:
```bash
# Using Vercel CLI
npm install -g vercel
vercel --prod
```

## Routes

- `/` - Home/questionnaire form
- `/results` - List all generated JSONs
- `/results/:id` - View/download specific JSON
- `/admin` - Admin login
- `/admin/questions` - Manage questions
- `/admin/references` - Manage references

## How It Works

1. **User Flow**:
   - User selects a reference template
   - System displays customized questions
   - User fills out the questionnaire
   - System generates Cogi Dialog JSON using learned template
   - JSON is saved and user can download/view it

2. **AI Learning Flow**:
   - Admin uploads reference JSON
   - Gemini API analyzes JSON structure
   - System extracts path mappings and rules
   - Template is saved for reuse
   - Future generations use template (no API calls)

## Database Schema

### questions
- `id` - UUID primary key
- `text` - Question text
- `input_type` - 'text', 'textarea', or 'select'
- `is_required` - Boolean
- `options` - JSON array for select options
- `order_index` - Display order

### cogi_references
- `id` - UUID primary key
- `name` - Reference name
- `json_data` - Original JSON structure
- `generation_template` - Learned template from Gemini
- `template_status` - 'pending' or 'completed'
- `created_at` - Timestamp

### cogi_results
- `id` - UUID primary key
- `reference_id` - FK to cogi_references
- `generated_json` - Generated Cogi Dialog JSON
- `user_responses` - JSON of user answers
- `created_at` - Timestamp

## Notes

- Authentication is localStorage-based for simplicity (suitable for POC)
- Gemini learning is called once per reference upload (optimized cost)
- All routes are SPA-based with client-side routing
- CORS is handled by Supabase
- RLS policies protect data access in PostgreSQL

## License

ISC
