export function latexTemplate(data: any) {
  return `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.6in}
\\addtolength{\\textheight}{1.2in}

\\urlstyle{same}
\\raggedright
\\setlength{\\tabcolsep}{0in}

%========== SECTION SPACING ==========

\\titleformat{\\section}
{\\vspace{-6pt}\\scshape\\raggedright\\large}
{}{0em}{}[\\titlerule \\vspace{-6pt}]

\\pdfgentounicode=1

%========== CUSTOM COMMANDS ==========

\\newcommand{\\resumeItem}[1]{
  \\item \\small{#1}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in,label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}

\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in, topsep=2pt, itemsep=2pt]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-6pt}}

%----- Experience / Education Heading -----

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
  \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} & #2 \\\\
    \\textit{\\small#3} & \\textit{\\small#4}
  \\end{tabular*}\\vspace{-7pt}
}

%----- Project Heading (single row) -----

\\newcommand{\\resumeProjectHeading}[3]{
  \\vspace{-2pt}\\item
  \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} $|$ \\emph{#2} & #3 \\\\
  \\end{tabular*}\\vspace{-7pt}
}

\\begin{document}

%==================== HEADER ====================

\\begin{center}
{\\Huge \\textbf{${data.name || ""}}} \\\\ \\vspace{4pt}

\\small
${[
  data.phone || "",
  data.email ? `\\href{mailto:${data.email}}{${data.email}}` : "",
  data.linkedin ? `\\href{${data.linkedin}}{${data.linkedin.replace("https://", "")}}` : "",
  data.github ? `\\href{${data.github}}{${data.github.replace("https://", "")}}` : ""
].filter(Boolean).join(" $|$ ")}
\\end{center}

%==================== EDUCATION ====================

${data.education?.length ? `
\\section{Education}
\\resumeSubHeadingListStart
${data.education.map((e: any) => `
\\resumeSubheading
{${e.school || ""}}
{${e.dates || ""}}
{${e.degree || ""}}
{${e.location || ""}}
`).join("")}
\\resumeSubHeadingListEnd
` : ""}

%==================== EXPERIENCE ====================

${data.experience?.length ? `
\\section{Experience}
\\resumeSubHeadingListStart
${data.experience.map((job: any) => `
\\resumeSubheading
{${job.company || ""}}
{${job.dates || ""}}
{${job.title || ""}}
{${job.location || ""}}

\\resumeItemListStart
${job.points?.map((p: string) => `\\resumeItem{${p}}`).join("") || ""}
\\resumeItemListEnd
`).join("")}
\\resumeSubHeadingListEnd
` : ""}

%==================== PROJECTS ====================

${data.projects?.length ? `
\\section{Projects}
\\resumeSubHeadingListStart
${data.projects.map((proj: any) => `
\\resumeProjectHeading
{${proj.name || ""}}
{${proj.tech || ""}}
{${proj.dates || ""}}

\\resumeItemListStart
${proj.points?.map((p: string) => `\\resumeItem{${p}}`).join("") || ""}
\\resumeItemListEnd
`).join("")}
\\resumeSubHeadingListEnd
` : ""}

%==================== SKILLS ====================

\\section{Technical Skills}
\\resumeSubHeadingListStart
\\resumeItem{\\textbf{Languages:} ${data.skills?.languages || ""}}
\\resumeItem{\\textbf{Frameworks:} ${data.skills?.frameworks || ""}}
\\resumeItem{\\textbf{Developer Tools:} ${data.skills?.tools || ""}}
\\resumeItem{\\textbf{Libraries:} ${data.skills?.libraries || ""}}
\\resumeSubHeadingListEnd

%==================== LEADERSHIP ====================

${data.leadership?.length ? `
\\section{Leadership}
\\resumeSubHeadingListStart
${data.leadership.map((lead: any) => `
\\resumeSubheading
{${lead.organization || ""}}
{${lead.dates || ""}}
{${lead.title || ""}}
{}

\\resumeItemListStart
${lead.points?.map((p: string) => `\\resumeItem{${p}}`).join("") || ""}
\\resumeItemListEnd
`).join("")}
\\resumeSubHeadingListEnd
` : ""}

\\end{document}`;
}
