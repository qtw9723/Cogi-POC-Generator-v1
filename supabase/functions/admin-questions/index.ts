import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-admin-token",
}

const verifyToken = (authHeader: string | null): boolean => {
  if (!authHeader) return false
  try {
    // Authorization: Bearer <token> 형식에서 토큰 추출
    const token = authHeader.replace("Bearer ", "")
    const decoded = JSON.parse(atob(token))
    return decoded.role === "master"
  } catch {
    return false
  }
}

const verifyAdminToken = (headers: Headers): boolean => {
  // x-admin-token 헤더: base64 encoded {"role":"master"}
  const adminToken = headers.get("x-admin-token")
  console.log("[verifyAdminToken] adminToken present:", !!adminToken)
  if (!adminToken) return false

  try {
    const decoded = JSON.parse(atob(adminToken))
    console.log("[verifyAdminToken] decoded:", JSON.stringify(decoded))
    const isValid = decoded.role === "master"
    console.log("[verifyAdminToken] role check passed:", isValid)
    return isValid
  } catch (e) {
    console.error("[verifyAdminToken] decode error:", e)
    return false
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Debug: 모든 헤더 로깅
    console.log("[admin-questions] Request method:", req.method)
    console.log("[admin-questions] All headers:")
    for (const [key, value] of req.headers) {
      if (key === "authorization") {
        console.log(`  ${key}: ${value.substring(0, 20)}...`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    const url = new URL(req.url)
    const id = url.searchParams.get("id")
    const adminToken = url.searchParams.get("token") || req.headers.get("x-admin-token")

    if (req.method === "GET") {
      // GET은 인증 불필요 (public read) - anonKey 사용
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
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

    // POST/PATCH/DELETE는 인증 필요 (token query param 또는 x-admin-token 헤더)
    console.log("[admin-questions] Checking admin token for", req.method)
    console.log("[admin-questions] adminToken:", adminToken)

    if (!adminToken) {
      console.log("[admin-questions] No admin token provided")
      return new Response(JSON.stringify({ error: "Unauthorized - no token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      })
    }

    // Validate token format
    try {
      const decoded = JSON.parse(atob(adminToken))
      if (decoded.role !== "master") {
        console.log("[admin-questions] Invalid role:", decoded.role)
        return new Response(JSON.stringify({ error: "Unauthorized - invalid role" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        })
      }
    } catch (e) {
      console.log("[admin-questions] Failed to validate token:", e)
      return new Response(JSON.stringify({ error: "Unauthorized - invalid token" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      })
    }

    console.log("[admin-questions] Token validation passed")

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
