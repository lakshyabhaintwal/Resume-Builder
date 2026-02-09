"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";

import { createSupabaseClient } from "@/lib/supabase";

/* ================= TYPES ================= */

type Education = {
  school: string;
  degree: string;
  year: string;
  cgpa: string;
};

type Experience = {
  company: string;
  role: string;
  start: string;
  end: string;
  description: string;
};

type Resume = {
  name: string;
  email: string;
  summary: string;
  education: Education[];
  experience: Experience[];
  skills: string;
  extra:Extra[];
};

type Extra ={
  title:string,
  description:string;
}

/* ================= DEFAULTS ================= */

const emptyEducation: Education = {
  school: "",
  degree: "",
  year: "",
  cgpa: "",
};

const emptyExperience: Experience = {
  company: "",
  role: "",
  start: "",
  end: "",
  description: "",
};
const emptyExtra: Extra = {
  title: "",
  description: "",
};


const defaultResume: Resume = {
  name: "",
  email: "",
  summary: "",
  education: [emptyEducation],
  experience: [emptyExperience],
  skills: "",
  extra:[emptyExtra],
};
//button css
const buttonFormat = "mt-3 inline-block text-blue-600 font-medium cursor-pointer hover:text-indigo-600 hover:underline transition";

/* ================= MAIN ================= */

export default function Builder() {
  console.log("BUILDER COMPONENT LOADED");

  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [resume, setResume] = useState<Resume>(defaultResume);

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiResume, setAiResume] = useState("");

  const [loading, setLoading] = useState(true);

  /* ================= AUTH ================= */

  useEffect(() => {
    if (user === null) {
      router.push("/sign-in");
    }
  }, [user, router]);

  /* ================= LOAD ================= */

  useEffect(() => {
    if (user) {
      loadResume();
    }
  }, [user]);

  const getSupabase = async () => {
    const token = await getToken({ template: "supabase" });
    console.log("TOKEN:", token);

    if (!token) throw new Error("No token");

    return createSupabaseClient(token);
  };

  const loadResume = async () => {
    try {
      const supabase = await getSupabase();

      const { data, error } = await supabase
        .from("resumes")
        .select("resume_data")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (error) {
        console.error("Load error:", error);
      }

      if (data?.resume_data) {
        setResume({...defaultResume, ...data.resume_data ,extra: data.resume_data.extra || [emptyExtra]});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE ================= */

  const saveResume = async () => {
  if (!user) {
    alert("Not logged in");
    return;
  }

  setSaving(true);

  try {
    const supabase = await getSupabase();

    const { error } = await supabase
      .from("resumes")
      .upsert(
        {
          user_id: user.id, // Clerk ID
          resume_data: resume,
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      console.error("DB ERROR:", error);
      alert("Save failed: " + error.message);
    } else {
      alert("Saved successfully!");
    }

  } catch (err: any) {
    console.error("SAVE ERROR:", err);
    alert("Save failed: " + err.message);
  } finally {
    setSaving(false);
  }
};

  const generateResume = async () => {
  try {
    setGenerating(true);

    // Save first
    await saveResume();

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume,
      }),
    });

    const data = await res.json();

    console.log("AI RESPONSE:", data);

    if (!res.ok || data.error) {
      throw new Error(
        data.error || "AI generation failed"
      );
    }

    if (!data.resume) {
      throw new Error("Empty AI response");
    }

    // TEMP: show result
    localStorage.setItem("generated_resume", data.resume);
    //redirect
    router.push("/preview");

    if (!data.resume) {
    throw new Error("Empty AI response");
    }

  } catch (err: any) {

    console.error("GENERATE ERROR:", err);

    alert(
      err?.message ||
      "Something went wrong. Check console."
    );

  } finally {
    setGenerating(false);
  }
};


const addEducation = () => {
  updateField("education", [...resume.education,{ ...emptyEducation },]);
};

const addExperience = () => {
  updateField("experience", [...resume.experience,{ ...emptyExperience },]);
};

const addExtra = () => {
  updateField("extra", [...resume.extra,{ ...emptyExtra },]);
};



  /* ================= HELPERS ================= */

  const updateField = <K extends keyof Resume>(
    key: K,
    value: Resume[K]
  ) => {
    setResume({ ...resume, [key]: value });
  };

  /* ================= LOADING ================= */

  if (!user || loading) {
    return <p className="p-10">Loading...</p>;
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-4xl mx-auto space-y-8">

        <h1 className="text-4xl font-bold text-center">
          Resume Builder
        </h1>

        {/* PERSONAL */}

        <Section title="Personal Info">

          <Input
            placeholder="Name"
            value={resume.name}
            onChange={(v) => updateField("name", v)}
          />

          <Input
            placeholder="Email"
            value={resume.email}
            onChange={(v) => updateField("email", v)}
          />

        </Section>

        {/* SUMMARY */}

        <Section title="Summary">

          <Textarea
            placeholder="A brief summary about you"
            value={resume.summary}
            onChange={(v) => updateField("summary", v)}
          />

        </Section>

        {/* EDUCATION */}

        <Section title="Education">

          {resume.education.map((edu, i) => (

            <div key={i} className="space-y-3 p-4 border rounded-lg bg-gray-50">

              <Input
                placeholder="School"
                value={edu.school}
                onChange={(v) => {
                  const arr = [...resume.education];
                  arr[i].school = v;
                  updateField("education", arr);
                }}
              />

              <Input
                placeholder="Degree"
                value={edu.degree}
                onChange={(v) => {
                  const arr = [...resume.education];
                  arr[i].degree = v;
                  updateField("education", arr);
                }}
              />

              <Input
                placeholder="Year"
                value={edu.year}
                onChange={(v) => {
                  const arr = [...resume.education];
                  arr[i].year = v;
                  updateField("education", arr);
                }}
              />
              <Input
                placeholder="CGPA"
                value={edu.cgpa}
                onChange={(v) => {
                  const arr = [...resume.education];
                  arr[i].cgpa = v;
                  updateField("education", arr);
                }}
              />

            </div>
          ))}

          <button onClick={addEducation} className={buttonFormat}> + Add Education</button>

        </Section>

        {/* EXPERIENCE */}

        <Section title="Experience">

          {resume.experience.map((exp, i) => (

            <div key={i} className="space-y-2">

              <Input
                placeholder="Company"
                value={exp.company}
                onChange={(v) => {
                  const arr = [...resume.experience];
                  arr[i].company = v;
                  updateField("experience", arr);
                }}
              />

              <Input
                placeholder="Role"
                value={exp.role}
                onChange={(v) => {
                  const arr = [...resume.experience];
                  arr[i].role = v;
                  updateField("experience", arr);
                }}
              />

              <Textarea
                placeholder="Description"
                value={exp.description}
                onChange={(v) => {
                  const arr = [...resume.experience];
                  arr[i].description = v;
                  updateField("experience", arr);
                }}
              />

            </div>
          ))}
          <button onClick={addExperience} className={buttonFormat}> + Add Experience</button>

        </Section>

        {/* SKILLS */}

        <Section title="Skills">

          <Input
            placeholder="React, Python, SQL..."
            value={resume.skills}
            onChange={(v) => updateField("skills", v)}
          />

        </Section>

        {/* EXTRA CO CIRRICULAR*/}
        <Section title="Extra Curricular">
          {resume.extra.map((extra, i) => (
            <div
              key ={i}
              className = "bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200"
              >
                <Input
                  placeholder="Activity / Club / Achievement"
                  value={extra.title}
                  onChange={(v) => { 
                    const arr = [...resume.extra];
                    arr[i].title = v;
                    updateField("extra", arr);
                  }}
                />
                <Textarea
                  placeholder="Description"
                  value ={extra.description}
                  onChange={(v) => {
                    const arr = [...resume.extra];
                    arr[i].description = v;
                    updateField("extra", arr);
                  }}
                />
                </div>
          ))}
          <button onClick={addExtra} className={buttonFormat}> + Add Extra Curricular</button>
        </Section>

        {/* SAVE && generating */}

        <div className="text-center space-x-4">

          <button
            onClick={saveResume}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button 
            onClick={generateResume}
            disabled={generating}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
            {generating ? "Generating..." : "Generate with AI"}
          </button>

        </div>
        {/* AI RESUME PREVIEW */}
        {aiResume && 
        (<div className="mt-10 bg-white p-6 rounded-xl shadow border">
          <h2 className="text-2xl font-semibold mb-4">AI-Generated Resume</h2>
          <pre className="whitespace-pre-wrap text-gray-800">{aiResume}</pre>
        </div>)}

      </div>

    </div>
  );
}

/* ================= UI ================= */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200 text-gray-800">

      <h2 className="text-xl font-semibold text-gray-900">
        {title}
      </h2>

      {children}

    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      className="w-full border border-gray-300 p-2 rounded-lg
           text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-blue-500
           transition"
      value={value || ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      className="w-full border border-gray-300 p-2 rounded-lg
           text-gray-900 placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-blue-500
           transition"
      rows={4}
      value={value || ""}
      placeholder = {placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
