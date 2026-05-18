import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("cogi_references")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("[admin-references] GET error:", error)
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        })
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    if (req.method === "POST") {
      const body = await req.json()

      if (!body.name || !body.json_data) {
        return new Response(
          JSON.stringify({ error: "name and json_data are required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        )
      }

      const { data, error } = await supabase
        .from("cogi_references")
        .insert([
          {
            name: body.name,
            json_data: body.json_data,
            template_status: "pending",
          },
        ])
        .select()

      if (error) {
        console.error("[admin-references] POST error:", error)
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        })
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      })
    }

    if (req.method === "DELETE") {
      if (!id) {
        return new Response(JSON.stringify({ error: "id query parameter is required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        })
      }

      const { error } = await supabase
        .from("cogi_references")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("[admin-references] DELETE error:", error)
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        })
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 405,
    })
  } catch (error) {
    console.error("[admin-references] Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
