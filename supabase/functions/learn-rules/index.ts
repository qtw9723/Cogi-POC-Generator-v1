import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

const verifyToken = (authHeader: string | null): boolean => {
  if (!authHeader) return false
  try {
    const token = authHeader.replace("Bearer ", "")
    const decoded = JSON.parse(atob(token))
    return decoded.role === "master"
  } catch {
    return false
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const token = req.headers.get("authorization")
    if (!verifyToken(token)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      })
    }

    const { reference_id } = await req.json()
    if (!reference_id) throw new Error("reference_id required")

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const geminiApiKey = Deno.env.get("VITE_GEMINI_API_KEY")!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: reference, error: refError } = await supabase
      .from("cogi_references")
      .select("*")
      .eq("id", reference_id)
      .single()

    if (refError || !reference) throw new Error("Reference not found")

    const prompt = `Analyze this JSON structure and create a template mapping for data generation:

${JSON.stringify(reference.json_data, null, 2)}

Return ONLY a JSON object with this structure:
{
  "mappings": {
    "field_path": "json.path.to.field"
  },
  "rules": {
    "field_path": "transformation_rule"
  },
  "instructions": "generation_instructions"
}`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    )

    const geminiData = await geminiResponse.json()
    const responseText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""

    let template = {
      mappings: {},
      rules: {},
      instructions: "Generated from reference",
    }

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        template = JSON.parse(jsonMatch[0])
      }
    } catch {
      console.error("Failed to parse Gemini response")
    }

    const { data, error } = await supabase
      .from("cogi_references")
      .update({
        generation_template: template,
        template_status: "completed",
      })
      .eq("id", reference_id)
      .select()

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
