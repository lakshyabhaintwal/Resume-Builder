"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import configureMonacoLatex from "monaco-latex";

function handleEditorWillMount(monaco: any) {
  monaco.languages.register({ id: "latex" });

  monaco.languages.setMonarchTokensProvider(
    "latex",
    configureMonacoLatex
  );
}


export default function GeneratedPage() {
  const [latex, setLatex] = useState("");
  const [compiledLatex, setCompiledLatex] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("generated_resume");
    if (saved) {
      setLatex(saved);
      setCompiledLatex(saved);
    }
  }, []);

  // Recompile button
  const handleRecompile = () => {
    setCompiledLatex(latex);
  };

  return (
    <div className="h-screen flex flex-col bg-[#0f172a] text-white">

      {/* 🔝 TOP BAR */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-[#111827]">
        <h1 className="font-semibold text-lg">Resume LaTeX Editor</h1>

        <button
          onClick={handleRecompile}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-md font-medium transition"
        >
          Recompile
        </button>
      </div>

      {/* 🧱 MAIN */}
      <div className="flex flex-1 overflow-hidden">

        {/* 📝 LEFT — EDITOR */}
        <div className="w-1/2 h-full flex flex-col border-r border-gray-700">

          <div className="px-4 py-2 bg-[#1f2937] border-b border-gray-700 font-semibold">
            Edit LaTeX
          </div>

          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="latex"
              theme="vs-dark"
              beforeMount={handleEditorWillMount}
              value={latex}
              onChange={(value) => setLatex(value || "")}
              options={{
                fontSize: 14,
                fontFamily: "Fira Code, monospace",
                minimap: { enabled: false },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                padding: { top: 12 },
              }}
            />
          </div>
        </div>

        {/* 📄 RIGHT — PREVIEW */}
        <div className="w-1/2 h-full flex flex-col bg-gray-300">

          <div className="px-4 py-2 bg-gray-200 text-black font-semibold border-b border-gray-400">
            Resume Preview
          </div>

          <div className="flex-1 flex justify-center items-start p-6 overflow-auto">

            {compiledLatex ? (
              <iframe
                title="PDF Preview"
                className="w-[210mm] h-[297mm] bg-white shadow-2xl"
                src={`https://latexonline.cc/compile?text=${encodeURIComponent(
                  compiledLatex
                )}`}
              />
            ) : (
              <p className="text-gray-600">Nothing to preview</p>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
