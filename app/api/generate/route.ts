import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildResumePrompt } from "@/lib/prompts/buildPrompt";
import { latexTemplate } from "@/lib/latexTemplate";

export const runtime = "nodejs";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Escapes special LaTeX characters to prevent compilation errors
 */
function escapeLatex(text: string): string {
  if (!text) return "";
  return String(text)
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\$/g, "\\$")
    .replace(/\&/g, "\\&")
    .replace(/\#/g, "\\#")
    .replace(/\_/g, "\\_")
    .replace(/\^/g, "\\^{}")
    .replace(/\~/g, "\\textasciitilde{}")
    .replace(/\%/g, "\\%")
    .replace(/\|/g, "\\textbar{}")
    .replace(/\</g, "\\textless{}")
    .replace(/\>/g, "\\textgreater{}")
    .replace(/\"/g, "''");
}

/**
 * Recursively escapes all strings in an object for LaTeX safety
 */
function escapeObjectForLatex(obj: any): any {
  if (typeof obj === "string") {
    return escapeLatex(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => escapeObjectForLatex(item));
  }
  if (obj !== null && typeof obj === "object") {
    const escaped: any = {};
    for (const key in obj) {
      escaped[key] = escapeObjectForLatex(obj[key]);
    }
    return escaped;
  }
  return obj;
}

/**
 * Hard safety shape — prevents ALL undefined crashes
 */
function withSafeDefaults(data: any) {
  return {
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    linkedin: data?.linkedin || "",
    github: data?.github || "",
    education: Array.isArray(data?.education) ? data.education : [],
    experience: Array.isArray(data?.experience) ? data.experience : [],
    projects: Array.isArray(data?.projects) ? data.projects : [],
    leadership: Array.isArray(data?.leadership) ? data.leadership : [],
    skills: {
      languages: data?.skills?.languages || "",
      frameworks: data?.skills?.frameworks || "",
      tools: data?.skills?.tools || "",
      libraries: data?.skills?.libraries || "",
    },
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.resume) {
      return NextResponse.json(
        { error: "No resume data provided" },
        { status: 400 }
      );
    }

    const targetRole = body?.role || "general";
    const prompt = buildResumePrompt(body.resume, targetRole);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a resume content optimizer.
CRITICAL:
1. Return ONLY valid JSON - no markdown, explanations, or code blocks
2. JSON must match this exact structure
3. Never return LaTeX
4. Include all fields, even if empty

JSON STRUCTURE:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string (URL or empty)",
  "github": "string (URL or empty)",
  "education": [
    {
      "school": "string",
      "location": "string",
      "degree": "string",
      "dates": "string"
    }
  ],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "dates": "string",
      "points": ["string", "string", ...]
    }
  ],
  "projects": [
    {
      "name": "string",
      "tech": "string",
      "dates": "string",
      "points": ["string", ...]
    }
  ],
  "skills": {
    "languages": "string (comma-separated)",
    "frameworks": "string (comma-separated)",
    "tools": "string (comma-separated)",
    "libraries": "string (comma-separated)"
  },
  "leadership": [
    {
      "title": "string",
      "organization": "string",
      "dates": "string",
      "points": ["string", ...]
    }
  ]
}

Rules:
- Keep all content concise for ONE page
- Bullet points must be short and ATS optimized
- Maximum 3 bullets per experience entry
- Maximum 2 bullets per project entry
- Never add or remove fields`,
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 4096, // ✅ CRITICAL: Forces full completion
      },
    });

    let text = result.response.text();

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from Gemini" },
        { status: 500 }
      );
    }

    // Remove markdown code blocks
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("❌ JSON PARSE ERROR:", err);
      console.error("❌ RAW RESPONSE (first 500 chars):", text.substring(0, 500));
      return NextResponse.json(
        {
          error: "Gemini returned invalid JSON",
          raw: text.substring(0, 200),
        },
        { status: 500 }
      );
    }

    // Apply safe defaults to ensure structure
    let safeData = withSafeDefaults(parsed);

    // ✅ CRITICAL: Escape all strings for LaTeX safety
    safeData = escapeObjectForLatex(safeData);

    // Generate LaTeX with escaped data
    const finalLatex = latexTemplate(safeData);

    return NextResponse.json({ resume: finalLatex });
  } catch (error: any) {
    console.error("❌ GEMINI ROUTE ERROR:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to generate resume",
      },
      { status: 500 }
    );
  }
}