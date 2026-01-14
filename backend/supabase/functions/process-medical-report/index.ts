// File: HealthSync/backend/supabase/functions/process-medical-report/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai"

// Define Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// --- Type Definitions ---
interface RequestBody {
  imageBase64?: string;
  mimeType?: string;
  reportText?: string;
  patient_id: string;
  uploader_id: string;
  file_url?: string;
  file_hash?: string;
  file_path?: string;
}

interface AIResponse {
  title?: string;
  event_type?: 'REPORT' | 'PRESCRIPTION';
  event_date?: string;
  severity?: 'HIGH' | 'MEDIUM' | 'LOW';
  simple_explanation_en?: string;
  simple_explanation_bn?: string;
  detailed_analysis_en?: string;
  detailed_analysis_bn?: string;
  disease_insight_en?: string;
  disease_insight_bn?: string;
  extracted_text?: string;
  key_findings?: string[];
  medicine_safety_check?: string;
}

// --- Helpers ---

const createUtils = () => {
  return {
    errorResponse: (message: string, status = 400) => {
      return new Response(JSON.stringify({ error: message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      });
    },
    successResponse: (data: unknown) => {
      return new Response(JSON.stringify({ success: true, data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
  };
}

const generatePrompt = () => `
    Role: You are an Expert Medical AI Assistant with strong OCR, clinical reasoning, and bilingual explanation skills.

    Primary Objective:
    Accurately read, understand, and analyze medical documents (reports or prescriptions) from image or text input, with zero hallucination.

    Step-by-step Tasks:

    1. OCR & TEXT EXTRACTION:
       - Extract every single visible word, number, symbol, heading, footer, stamp, handwriting (if readable).
       - Preserve original spelling, line breaks, units, and formatting as closely as possible.
       - Do NOT guess missing or unclear text. If unreadable, write "[illegible]".

    2. DOCUMENT CLASSIFICATION:
       - Identify the document type strictly as:
         - "REPORT" (lab tests, investigations, imaging, pathology, etc.)
         - "PRESCRIPTION" (medicines, dosage, doctor advice)
       - If mixed, choose the dominant type.

    3. MEDICAL ANALYSIS (Three Levels):
       a) Simple, Easy-to-understand explanation:
          - Written for a normal non-medical person.
          - Explain clearly: What this document is about, Important results, Situation status (GOOD/OKAY/NEEDS ATTENTION), Next steps.
       
       b) Detailed, Professional analysis:
          - Use correct medical terminology.
          - Explain abnormal values with ranges and meanings.
          - Highlight red flags.
          - Use structured Markdown.
       
       c) Disease / Condition Insight (ONLY if evidence suggests one):
          - Identify most likely condition or state "No specific disease can be confidently identified".
          - Format: Disease name, Local name (Bangla), Causes, Symptoms, Acute/Chronic status.

    4. BILINGUAL OUTPUT:
       - Provide ALL explanations in both English and Bengali (Bangla).

    5. SAFETY & VALIDATION RULES:
       - Do NOT invent diseases, values, or medicines.
       - Clear disclaimer about doctor consultation.
       - For prescriptions: Check drug interactions/safety.
       - For reports: Medicine safety check "N/A".

    6. SEVERITY GRADING:
       - HIGH: Critical/Life-threatening.
       - MEDIUM: Abnormal/Needs follow-up.
       - LOW: Normal/Minor.

    Final Output:
    Return ONLY valid JSON.
    Structure:
    {
      "title": "Short title",
      "event_type": "REPORT or PRESCRIPTION",
      "event_date": "YYYY-MM-DD",
      "severity": "HIGH / MEDIUM / LOW",
      "simple_explanation_en": "...",
      "simple_explanation_bn": "...",
      "detailed_analysis_en": "...",
      "detailed_analysis_bn": "...",
      "disease_insight_en": "...",
      "disease_insight_bn": "...",
      "extracted_text": "...",
      "key_findings": ["..."],
      "medicine_safety_check": "..."
    }
`;

// --- Main Handler ---

serve(async (req: Request) => {
  const { errorResponse, successResponse } = createUtils();

  // CORS Handle
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // 1. Input Parsing
    const body: RequestBody = await req.json();
    const { imageBase64, mimeType, reportText, patient_id, uploader_id, file_url, file_hash, file_path } = body;

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!apiKey || !supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables");
      return errorResponse('Internal Server Error: Missing config', 500);
    }

    // 2. Initialize Clients
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 3. DUPLICATE CHECK
    if (file_hash) {
      const { data: duplicates } = await supabase
        .from('medical_events')
        .select('id')
        .eq('patient_id', patient_id)
        .eq('file_hash', file_hash);

      if (duplicates && duplicates.length > 0) {
        if (file_path) {
          await supabase.storage.from('reports').remove([file_path]);
        }
        return errorResponse("Duplicate File: This report has already been uploaded.", 409);
      }
    }

    // 4. AI Processing
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use a widely available model, fallback logic if needed can be added
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = generatePrompt();
    let generatedContent = "";

    try {
      if (imageBase64) {
        const result = await model.generateContent([
          prompt,
          { inlineData: { data: imageBase64, mimeType: mimeType || "image/jpeg" } },
        ]);
        generatedContent = await result.response.text(); // await text()
      } else if (reportText) {
        const result = await model.generateContent([prompt, `DOCUMENT CONTENT: ${reportText}`]);
        generatedContent = await result.response.text();
      } else {
        return errorResponse("No input provided (image or text)", 400);
      }
    } catch (aiError: any) {
      console.error("AI Generation Error:", aiError);
      return errorResponse(`AI Processing Failed: ${aiError.message}`, 502);
    }

    // 5. Parse JSON
    const cleanedText = generatedContent.replace(/```json/g, '').replace(/```/g, '').trim();
    let aiData: AIResponse;
    try {
      aiData = JSON.parse(cleanedText);
    } catch (e) {
      console.error("JSON Parse Error. Raw text:", cleanedText);
      return errorResponse("Failed to parse AI response", 500);
    }

    // 6. Data Prep
    const newTitle = aiData.title || 'Medical Document';
    const rawDate = aiData.event_date;
    const newDate = (rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate))
      ? rawDate
      : new Date().toISOString().split('T')[0];

    // 7. Database Insert
    const { error: insertError } = await supabase
      .from('medical_events')
      .insert({
        patient_id: patient_id,
        uploader_id: uploader_id,
        title: newTitle,
        event_type: aiData.event_type ?? 'REPORT',
        event_date: newDate,
        severity: aiData.severity ?? 'LOW',
        summary: aiData.simple_explanation_en || "No summary available", // Legacy fallback
        extracted_text: aiData.extracted_text || "",
        key_findings: aiData.key_findings || [],
        attachment_urls: file_url ? [file_url] : [],
        file_hash: file_hash,
        ai_details: aiData // Store full JSON
      });

    if (insertError) {
      console.error("DB Insert Error:", insertError);
      return errorResponse("Failed to save record to database", 500);
    }

    return successResponse(aiData);

  } catch (error: any) {
    console.error("Unhandled Error:", error);
    return errorResponse(error.message || "Unknown Internal Error", 500);
  }
});