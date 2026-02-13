export function latexTemplate(data: any) {
  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
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
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}
\\titleformat{\\section}{\\vspace{-4pt}\\scshape\\raggedright\\large}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]
\\pdfgentounicode=1
\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeSubheading}[4]{\\vspace{-2pt}\\item\\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}\\textbf{#1} & #2 \\\\\\textit{\\small#3} & \\textit{\\small#4}\\end{tabular*}\\vspace{-7pt}}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in,label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}[noitemsep,topsep=0pt]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
\\begin{document}
\\begin{center}
\\textbf{\\Huge\\scshape ${data.name || ""}}\\\\\\vspace{1pt}
\\small ${data.email ? `\\href{mailto:${data.email}}{\\underline{${data.email}}}` : ""}
\\end{center}
${(data.education || []).length > 0 ? `\\section{Education}
\\resumeSubHeadingListStart
${(data.education || []).map((e: any) => `\\resumeSubheading{${e.school || ""}}{${e.location || ""}}{${e.degree || ""}}{${e.dates || ""}}`).join("\n")}
\\resumeSubHeadingListEnd
` : ""}
${(data.experience || []).length > 0 ? `\\section{Experience}
\\resumeSubHeadingListStart
${(data.experience || []).map((job: any) => {
  const points = (job.points || []).map((p: string) => `\\resumeItem{${p}}`).join("\n");
  return `\\resumeSubheading{${job.title || ""}}{${job.dates || ""}}{${job.company || ""}}{${job.location || ""}}
\\resumeItemListStart
${points}
\\resumeItemListEnd`;
}).join("\n")}
\\resumeSubHeadingListEnd
` : ""}
${(data.projects || []).length > 0 ? `\\section{Projects}
\\resumeSubHeadingListStart
${(data.projects || []).map((proj: any) => {
  const points = (proj.points || []).map((p: string) => `\\resumeItem{${p}}`).join("\n");
  return `\\resumeSubheading{${proj.name || ""}}{${proj.dates || ""}}{${proj.tech || ""}}{}
\\resumeItemListStart
${points}
\\resumeItemListEnd`;
}).join("\n")}
\\resumeSubHeadingListEnd
` : ""}
\\section{Technical Skills}
\\resumeSubHeadingListStart
\\resumeItem{\\textbf{Languages}: ${data.skills?.languages || ""}}
\\resumeItem{\\textbf{Frameworks}: ${data.skills?.frameworks || ""}}
\\resumeItem{\\textbf{Developer Tools}: ${data.skills?.tools || ""}}
\\resumeItem{\\textbf{Libraries}: ${data.skills?.libraries || ""}}
\\resumeSubHeadingListEnd
${(data.leadership || []).length > 0 ? `\\section{Leadership}
\\resumeSubHeadingListStart
${(data.leadership || []).map((lead: any) => {
  const points = (lead.points || []).map((p: string) => `\\resumeItem{${p}}`).join("\n");
  return `\\resumeSubheading{${lead.title || ""}}{${lead.dates || ""}}{${lead.organization || ""}}{}
\\resumeItemListStart
${points}
\\resumeItemListEnd`;
}).join("\n")}
\\resumeSubHeadingListEnd
` : ""}
\\end{document}`;
}