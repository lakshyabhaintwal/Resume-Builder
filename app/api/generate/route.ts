import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildResumePrompt } from "@/lib/prompts/buildPrompt";
import { latexTemplate } from "@/lib/latexTemplate";

export const runtime = "nodejs";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/* ================= UTIL ================= */

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

function escapeObjectForLatex(obj: any): any {
  if (typeof obj === "string") return escapeLatex(obj);
  if (Array.isArray(obj)) return obj.map(escapeObjectForLatex);
  if (obj && typeof obj === "object") {
    const res: any = {};
    for (const key in obj) res[key] = escapeObjectForLatex(obj[key]);
    return res;
  }
  return obj;
}

function withSafeDefaults(data: any) {
  return {
    name: data?.name || "",
    email: data?.email || "",
    phone: data?.phone || "",
    linkedin: data?.linkedin || "",
    github: data?.github || "",
    education: data?.education || [],
    experience: data?.experience || [],
    projects: data?.projects || [],
    leadership: data?.leadership || [],
    skills: {
      languages: data?.skills?.languages || "",
      frameworks: data?.skills?.frameworks || "",
      tools: data?.skills?.tools || "",
      libraries: data?.skills?.libraries || "",
    },
  };
}

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return "";
  if (start && end) return `${start} -- ${end}`;
  return start || end || "";
}

function normalizeResumeForAI(resume: any) {
  return {
    ...resume,
    education: (resume.education || []).map((e: any) => ({
      school: e.school,
      location: "",
      degree: e.degree,
      dates: formatDateRange(e.start, e.end),
    })),
    experience: (resume.experience || []).map((exp: any) => ({
      title: exp.role,
      company: exp.company,
      location: "",
      dates: formatDateRange(exp.start, exp.end),
      points: exp.description ? [exp.description] : [],
    })),
    projects: (resume.projects || []).map((proj: any) => ({
      name: proj.name,
      tech: proj.techStack,
      dates: formatDateRange(proj.start, proj.end),
      points: proj.description ? [proj.description] : [],
    })),
  };
}

/* ================= MAIN ================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.resume) {
      return NextResponse.json(
        { error: "No resume data provided" },
        { status: 400 }
      );
    }

    const mode = body?.mode || "general";
    const jobDescription = mode === "jd" ? body?.jobDescription || "" : "";
    const targetRole = mode === "role" ? body?.role || "general" : "general";

    console.log("🔥 JD:", jobDescription);

    const normalizedResume = normalizeResumeForAI(body.resume);

    const prompt = buildResumePrompt(
      normalizedResume,
      targetRole,
      jobDescription
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a STRICT JSON generator.

RULES:
- Output ONLY valid JSON
- NO explanation
- NO markdown
- JSON must start with { and end with }
- Never break JSON format`,
    });

    /* ================= GENERATE ================= */

    const generate = async () => {
      const res = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        },
      });

      return res.response.text();
    };

    let text = await generate();

    if (!text) {
      return NextResponse.json(
        { error: "Empty AI response" },
        { status: 500 }
      );
    }

    /* ================= CLEAN JSON ================= */

    const extractJSON = (raw: string) => {
      const first = raw.indexOf("{");
      const last = raw.lastIndexOf("}");
      if (first !== -1 && last !== -1) {
        return raw.substring(first, last + 1);
      }
      return raw;
    };

    text = extractJSON(text);

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.warn("⚠️ First parse failed, retrying...");

      const retryText = extractJSON(await generate());

      try {
        parsed = JSON.parse(retryText);
      } catch (err2) {
        console.error("❌ FINAL JSON FAILURE");
        console.error("RAW:", retryText.substring(0, 500));

        return NextResponse.json(
          { error: "AI returned invalid JSON" },
          { status: 500 }
        );
      }
    }

    /* ================= FINAL ================= */

    let safeData = withSafeDefaults(parsed);
    safeData = escapeObjectForLatex(safeData);

    const finalLatex = latexTemplate(safeData);

    return NextResponse.json({ resume: finalLatex });

  } catch (error: any) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate resume" },
      { status: 500 }
    );
  }
}
