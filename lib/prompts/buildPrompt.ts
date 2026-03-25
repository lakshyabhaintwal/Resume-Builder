import { SYSTEM_RULES } from "./systemRules";
import { CONTENT_RULES } from "./contentRules";
import { SECTION_RULES } from "./sectionRules";

export function buildResumePrompt(
  data: any,
  role: string = "general",
  jobDescription: string = ""
) {
  return `
${SYSTEM_RULES}

TARGET ROLE: ${role}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 JOB DESCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${jobDescription || "Not provided"}

${CONTENT_RULES}

${SECTION_RULES}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 JOB MATCHING RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Extract important keywords from the job description
• Align resume content with job requirements
• Prioritize relevant skills, projects, and experience
• Use similar terminology as the job description
• Ensure ATS keyword matching
• If job description is empty, fall back to general optimization

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
Optimize the following resume specifically for the provided JOB DESCRIPTION.

If a job description is provided:
• Tailor the resume to match it closely
• Emphasize relevant experience and skills
• De-emphasize unrelated content BUT still keep and reframe it to align as much as possible with the job description

If no job description is provided:
• Perform general resume optimization

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

CRITICAL ADAPTATION RULES:
• NEVER remove entire sections even if not directly relevant
• If experience does not directly match the job, REFRAME it to highlight transferable skills
• Emphasize relevant aspects of projects instead of removing them
• Always produce a COMPLETE, strong one-page resume
• Do NOT leave sections empty
`;
}