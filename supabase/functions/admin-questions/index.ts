import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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
        .from("questions")
        .select("*")
        .order("order_index", { ascending: true })

      if (error) {
        console.error("[admin-questions] GET error:", error)
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

      if (!body.text) {
        return new Response(JSON.stringify({ error: "text is required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        })
      }

      const { data, error } = await supabase
        .from("questions")
        .insert([body])
        .select()

      if (error) {
        console.error("[admin-questions] POST error:", error)
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

    if (req.method === "PATCH") {
      if (!id) {
        return new Response(JSON.stringify({ error: "id query parameter is required" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        })
      }

      const body = await req.json()
      const { data, error } = await supabase
        .from("questions")
        .update(body)
        .eq("id", id)
        .select()

      if (error) {
        console.error("[admin-questions] PATCH error:", error)
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        })
      }

      if (!data || data.length === 0) {
        return new Response(JSON.stringify({ error: "Question not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        })
      }

      return new Response(JSON.stringify(data[0]), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
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
        .from("questions")
        .delete()
        .eq("id", id)

      if (error) {
        console.error("[admin-questions] DELETE error:", error)
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
    console.error("[admin-questions] Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
