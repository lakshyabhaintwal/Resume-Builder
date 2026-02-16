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
🎯 OPTIMIZATION GOALS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Convert all descriptions into strong achievement-based bullet points
• Start bullets with powerful action verbs
• Add measurable impact where possible
• Keep content concise for a ONE PAGE resume
• Prioritize content relevant to the TARGET ROLE
• Use ATS-friendly keywords for the TARGET ROLE

PROJECT RULES:
• Use the tech stack intelligently in the project header line
• Focus on WHAT was built, HOW it was built, and the IMPACT
• Maximum 2 bullet points per project

EXPERIENCE RULES:
• Focus on achievements, not responsibilities
• Quantify impact wherever possible
• Maximum 3 bullet points per role

EDUCATION RULES:
• Keep concise
• Do NOT add bullets

SKILLS RULES:
• Keep only relevant and strong skills
• Group correctly into:
  Languages | Frameworks | Tools | Libraries

LEADERSHIP RULES:
• Highlight ownership, initiative, and impact

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 YOUR TASK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Optimize the following resume for a ${role} role.

You MUST:
• Keep the same JSON structure
• Improve content quality
• Remove weak or irrelevant content
• Keep ALL sections even if empty

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 USER RESUME DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${JSON.stringify(data, null, 2)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📤 OUTPUT FORMAT (STRICT JSON)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "linkedin": "string",
  "github": "string",

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
      "points": ["string"]
    }
  ],

  "projects": [
    {
      "name": "string",
      "tech": "string",
      "dates": "string",
      "points": ["string"]
    }
  ],

  "skills": {
    "languages": "string",
    "frameworks": "string",
    "tools": "string",
    "libraries": "string"
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

CRITICAL:
Return ONLY the JSON object.
No markdown.
No explanations.
No code blocks.
`;
}
