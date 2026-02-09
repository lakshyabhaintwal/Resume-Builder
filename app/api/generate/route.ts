import { NextResponse } from "next/server";

const WORKER_URL =
  "https://resume-ai.idealsteve001.workers.dev";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.resume) {
      throw new Error("No resume data");
    }

    const prompt = `
Generate a professional one-page resume in LaTeX.

Requirements:
- Use article document class
- Use \\section for headings
- Clean formatting
- ATS friendly
- Include all user data
- No explanation
- Only valid LaTeX

User Information:
${JSON.stringify(body.resume, null, 2)}

Start with \\documentclass.
`;



    // Send to Cloudflare Worker
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(
        data.error || "Worker returned error"
      );
    }

    return NextResponse.json({
      resume: data.text,
    });

  } catch (err: any) {

    console.error("GENERATE ERROR:", err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
