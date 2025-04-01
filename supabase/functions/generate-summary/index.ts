// supabase/functions/generate-summary/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.1.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const MAX_INPUT_LENGTH = 10000; // Limit input size to prevent memory issues
const genAI = new GoogleGenerativeAI(Deno.env.get("GEMINI_API_KEY") || "");

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare context with size limit
    const context = messages
      .filter((msg: any) => msg.content && msg.user?.name)
      .slice(0, 50) // Limit to last 50 messages
      .map((msg: any) => `${msg.user.name}: ${msg.content.substring(0, 500)}`) // Limit message length
      .join('\n')
      .substring(0, MAX_INPUT_LENGTH); // Enforce total length limit

    if (!context) {
      return new Response(
        JSON.stringify({ error: "No valid messages to summarize" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // More focused prompt
    const prompt = `Please provide a concise summary (3-5 bullet points) of this conversation, focusing on:
- Key decisions made
- Action items with owners (if mentioned)
- Next steps
- Any unresolved questions

Conversation:
${context}

Summary:`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return new Response(
      JSON.stringify({ summary }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("AI Summary Generation Error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to generate summary",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});