export const LATEX_TEMPLATE = `
\\documentclass[letterpaper,10pt]{article}

\\usepackage[left=0.6in,right=0.6in,top=0.5in,bottom=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\pagestyle{empty}

\\titleformat{\\section}{\\large\\bfseries}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{4pt}{4pt}

\\setlist[itemize]{noitemsep, topsep=0pt, leftmargin=*}

\\begin{document}

%====================
% HEADER
%====================
\\noindent
{\\LARGE \\textbf{{NAME}}}
\\hfill
\\href{mailto:{EMAIL}}{{EMAIL}}

%====================
\\section*{Education}
{EDUCATION}

%====================
\\section*{Experience}
{EXPERIENCE}

%====================
\\section*{Projects}
{PROJECTS}

%====================
\\section*{Technical Skills}
{SKILLS}

\\end{document}
`;
