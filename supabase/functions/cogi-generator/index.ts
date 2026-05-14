import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const setNestedValue = (obj: any, path: string, value: any) => {
  const keys = path.split(".")
  let current = obj
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {}
    }
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { reference_id, responses } = await req.json()
    if (!reference_id || !responses) {
      throw new Error("reference_id and responses required")
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: reference, error: refError } = await supabase
      .from("cogi_references")
      .select("*")
      .eq("id", reference_id)
      .single()

    if (refError || !reference) throw new Error("Reference not found")

    let generatedJson = JSON.parse(JSON.stringify(reference.json_data))

    if (
      reference.generation_template &&
      reference.generation_template.mappings
    ) {
      const mappings = reference.generation_template.mappings

      for (const [questionId, jsonPath] of Object.entries(mappings)) {
        const value = responses[questionId]
        if (value !== undefined && jsonPath) {
          setNestedValue(generatedJson, jsonPath as string, value)
        }
      }
    }

    const { data, error } = await supabase
      .from("cogi_results")
      .insert([
        {
          reference_id,
          generated_json: generatedJson,
          user_responses: responses,
        },
      ])
      .select()

    if (error) throw error

    return new Response(JSON.stringify(data[0]), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201,
    })
  } catch (error) {
    console.error("Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
