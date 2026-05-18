import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (req.method === "GET") {
      if (id) {
        const { data, error } = await supabase
          .from("cogi_results")
          .select("*")
          .eq("id", id)
          .single()

        if (error) {
          console.error("[results] GET single error:", error)
          if (error.code === "PGRST116") {
            return new Response(JSON.stringify({ error: "Result not found" }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 404,
            })
          }
          return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          })
        }

        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        })
      } else {
        const { data, error } = await supabase
          .from("cogi_results")
          .select("*")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("[results] GET list error:", error)
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
    }

    if (req.method === "DELETE") {
      if (!id) {
        return new Response(JSON.stringify({ error: "id query parameter is required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        })
      }

      const { error } = await supabase
        .from("cogi_results")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("[results] DELETE error:", error)
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
    console.error("[results] Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
