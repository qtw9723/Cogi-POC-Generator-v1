const API_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`

export const API_ENDPOINTS = {
  QUESTIONS: `${API_BASE}/questions`,
  ADMIN_QUESTIONS: `${API_BASE}/admin-questions`,
  ADMIN_REFERENCES: `${API_BASE}/admin-references`,
  LEARN_RULES: `${API_BASE}/learn-rules`,
  COGI_GENERATOR: `${API_BASE}/cogi-generator`,
  RESULTS: `${API_BASE}/results`,
  RESULT_DETAIL: (id) => `${API_BASE}/results?id=${id}`
}

export const INPUT_TYPES = {
  TEXT: 'text',
  TEXTAREA: 'textarea',
  SELECT: 'select'
}
