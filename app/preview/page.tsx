"use client";

import { useEffect, useState } from "react";


export default function PreviewPage() {

  const [latex, setLatex] = useState("");

  useEffect(() => {
    const saved =
      localStorage.getItem("generated_resume");

    if (saved) {
      setLatex(saved);
    }
  }, []);
  console.log(localStorage.getItem("generated_resume"));


  return (
    <div className="h-screen flex">

      {/* LEFT: Preview */}
      <div className="w-1/2 p-4 border-r overflow-auto">

        <h2 className="font-bold mb-2">
          Preview (LaTeX Output)
        </h2>

        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {latex}
        </pre>

      </div>

      {/* RIGHT: Editor */}
      <div className="w-1/2 p-4">

        <h2 className="font-bold mb-2">
          Edit LaTeX
        </h2>

        <textarea
          className="w-full h-full border p-3 font-mono text-sm"
          value={latex}
          onChange={(e) =>
            setLatex(e.target.value)
          }
        />

      </div>

    </div>
  );
}
