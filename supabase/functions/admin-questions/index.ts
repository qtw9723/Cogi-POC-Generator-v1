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
  // x-admin-token 헤더 사용 (Supabase JWT 검증 우회)
  const adminToken = headers.get("x-admin-token")
  console.log("[verifyAdminToken] adminToken:", adminToken)
  if (!adminToken) {
    console.log("[verifyAdminToken] No admin token found")
    return false
  }
  try {
    const decoded = JSON.parse(atob(adminToken))
    console.log("[verifyAdminToken] Decoded token:", decoded)
    const isValid = decoded.role === "master"
    console.log("[verifyAdminToken] Is valid:", isValid)
    return isValid
  } catch (e) {
    console.log("[verifyAdminToken] Failed to decode:", e.message)
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
        .from("questions")
        .select("*")
        .order("order_index", { ascending: true })
      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      })
    }

    // POST/PATCH/DELETE는 인증 필요 (x-admin-token 헤더 사용)
    console.log("[admin-questions] Verifying admin token for", req.method)
    if (!verifyAdminToken(req.headers)) {
      console.log("[admin-questions] Admin token verification failed")
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      })
    }
    console.log("[admin-questions] Admin token verified successfully")

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
