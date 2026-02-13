import { SYSTEM_RULES } from "./systemRules";
import { CONTENT_RULES } from "./contentRules";
import { SECTION_RULES } from "./sectionRules";

export function buildResumePrompt(data: any, role: string = "general") {
  return `
${SYSTEM_RULES}

TARGET ROLE: ${role}

${CONTENT_RULES}

${SECTION_RULES}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 YOUR TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Optimize the following resume data for a ${role} role.
Keep all existing fields.
Improve bullet points for impact.
Remove weak content.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 USER RESUME DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(data, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT (MUST BE VALID JSON)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Return the optimized resume as a single valid JSON object with these exact fields:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string (full URL or empty)",
  "github": "string (full URL or empty)",
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
      "tech": "string (comma-separated)",
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
      "points": ["string"]
    }
  ]
}

CRITICAL: Return ONLY the JSON object. No markdown, no code blocks, no explanations.
`;
}