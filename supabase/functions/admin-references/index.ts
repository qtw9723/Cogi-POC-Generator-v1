import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-admin-token",
}

const verifyAdminToken = (headers: Headers): boolean => {
  const adminToken = headers.get("x-admin-token")
  if (!adminToken) return false
  try {
    const decoded = JSON.parse(atob(adminToken))
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
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (req.method === "GET") {
      // GET은 인증 불필요 (public read) - anonKey 사용
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      const { data, error } = await supabase
        .from("cogi_references")
        .select("*")
        .order("created_at", { ascending: false })
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    // POST/DELETE는 인증 필요 (x-admin-token 헤더 사용)
    if (!verifyAdminToken(req.headers)) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === "POST") {
      const body = await req.json()
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
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 201,
      })
    }

    if (req.method === "DELETE" && id) {
      const { error } = await supabase
        .from("cogi_references")
        .delete()
        .eq("id", id)
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
