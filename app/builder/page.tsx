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
};

/* ================= DEFAULTS ================= */

const emptyEducation: Education = {
  school: "",
  degree: "",
  year: "",
};

const emptyExperience: Experience = {
  company: "",
  role: "",
  start: "",
  end: "",
  description: "",
};

const defaultResume: Resume = {
  name: "",
  email: "",
  summary: "",
  education: [emptyEducation],
  experience: [emptyExperience],
  skills: "",
};

/* ================= MAIN ================= */

export default function Builder() {
  console.log("BUILDER COMPONENT LOADED");

  const { user } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  const [resume, setResume] = useState<Resume>(defaultResume);

  const [saving, setSaving] = useState(false);
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
        setResume(data.resume_data);
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
            value={resume.summary}
            onChange={(v) => updateField("summary", v)}
          />

        </Section>

        {/* EDUCATION */}

        <Section title="Education">

          {resume.education.map((edu, i) => (

            <div key={i} className="space-y-2">

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

            </div>
          ))}

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
                value={exp.description}
                onChange={(v) => {
                  const arr = [...resume.experience];
                  arr[i].description = v;
                  updateField("experience", arr);
                }}
              />

            </div>
          ))}

        </Section>

        {/* SKILLS */}

        <Section title="Skills">

          <Input
            placeholder="React, Python, SQL..."
            value={resume.skills}
            onChange={(v) => updateField("skills", v)}
          />

        </Section>

        {/* SAVE */}

        <div className="text-center">

          <button
            onClick={saveResume}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {saving ? "Saving..." : "Save"}
          </button>

        </div>

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
    <div className="bg-white p-6 rounded shadow space-y-4">

      <h2 className="text-xl font-semibold">
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
      className="w-full border p-2 rounded"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Textarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <textarea
      className="w-full border p-2 rounded"
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
