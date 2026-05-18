import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (req.method === "GET") {
      // GET은 인증 불필요 (public read)
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .order("order_index", { ascending: true })
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    // POST/PATCH/DELETE는 인증 필요
    const token = req.headers.get("authorization")
    if (!verifyToken(token)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      })
    }

    if (req.method === "POST") {
      const body = await req.json()
      const { data, error } = await supabase
        .from("questions")
        .insert([body])
        .select()
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      })
    }

    if (req.method === "PATCH" && id) {
      const body = await req.json()
      const { data, error } = await supabase
        .from("questions")
        .update(body)
        .eq("id", id)
        .select()
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    if (req.method === "DELETE" && id) {
      const { error } = await supabase.from("questions").delete().eq("id", id)
      if (error) throw error
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
    console.error("Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    })
  }
})
