"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

const emptyExperience = {
  company: "",
  role: "",
  start: "",
  end: "",
  description: "",
};

export default function Builder() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Basic Info
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [summary, setSummary] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");

  // Experience (Multiple)
  const [experience, setExperience] = useState([emptyExperience]);

  const [saving, setSaving] = useState(false);

  /* ===========================
     AUTH PROTECTION
  =========================== */
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  /* ===========================
     LOAD DATA
  =========================== */
  useEffect(() => {
    if (user) {
      loadResume();
    }
  }, [user]);

  const loadResume = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.log("Load error:", error.message);
      return;
    }

    if (data) {
      setName(data.name || "");
      setEmail(data.email || "");
      setSummary(data.summary || "");
      setEducation(data.education || "");
      setSkills(data.skills || "");

      if (data.experience) {
        setExperience(JSON.parse(data.experience));
      }
    }
  };

  /* ===========================
     SAVE DATA
  =========================== */
  const saveResume = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase.from("resumes").upsert({
      user_id: user.id,
      name,
      email,
      summary,
      education,
      skills,
      experience: JSON.stringify(experience),
    });

    setSaving(false);

    if (error) {
      alert("Save failed: " + error.message);
    } else {
      alert("Resume saved!");
    }
  };

  /* ===========================
     LOGOUT
  =========================== */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  /* ===========================
     STATES
  =========================== */
  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  if (!user) {
    return null;
  }

  /* ===========================
     UI
  =========================== */
 return (

  <div className="min-h-screen bg-gray-100 p-10">

    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* ================= FORM ================= */}
      <div className="bg-white p-6 rounded shadow space-y-4">

        <h1 className="text-2xl font-bold">
          Resume Builder
        </h1>

        {/* BASIC INFO */}

        <input
          className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <textarea
          className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Professional Summary"
          rows={3}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />

        <input
          className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Education"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />

        {/* EXPERIENCE */}

        <h3 className="font-semibold text-lg pt-4">
          Experience
        </h3>

        {experience.map((exp, index) => (
          <div
            key={index}
            className="border border-gray-300 p-4 rounded space-y-2"
          >

            <input
              className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Company"
              value={exp.company}
              onChange={(e) => {
                const arr = [...experience];
                arr[index].company = e.target.value;
                setExperience(arr);
              }}
            />

            <input
              className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Role"
              value={exp.role}
              onChange={(e) => {
                const arr = [...experience];
                arr[index].role = e.target.value;
                setExperience(arr);
              }}
            />

            <div className="flex gap-2">

              <input
                className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Start Year"
                value={exp.start}
                onChange={(e) => {
                  const arr = [...experience];
                  arr[index].start = e.target.value;
                  setExperience(arr);
                }}
              />

              <input
                className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="End Year"
                value={exp.end}
                onChange={(e) => {
                  const arr = [...experience];
                  arr[index].end = e.target.value;
                  setExperience(arr);
                }}
              />

            </div>

            <textarea
              className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Work Description"
              rows={3}
              value={exp.description}
              onChange={(e) => {
                const arr = [...experience];
                arr[index].description = e.target.value;
                setExperience(arr);
              }}
            />

          </div>
        ))}

        {/* ADD EXPERIENCE */}

        <button
          onClick={() =>
            setExperience([...experience, emptyExperience])
          }
          className="text-blue-600 text-sm underline"
        >
          + Add Experience
        </button>

        {/* SKILLS */}

        <input
          className="w-full p-2 border border-gray-400 rounded-md bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        {/* BUTTONS */}

        <div className="flex gap-4 pt-4">

          <button
            onClick={saveResume}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>

        </div>

      </div>

      {/* ================= PREVIEW ================= */}
      <div className="bg-white p-6 rounded shadow text-black space-y-4">

        <h2 className="text-xl font-bold text-center">
          Resume Preview
        </h2>

        <div className="text-center">
          <p className="text-lg font-bold">{name}</p>
          <p>{email}</p>
        </div>

        <hr />

        <p>
          <strong>Summary:</strong><br />
          {summary}
        </p>

        <p>
          <strong>Education:</strong><br />
          {education}
        </p>

        <div>
          <strong>Experience:</strong>

          {experience.map((exp, i) => (
            <div key={i} className="mt-2">

              <p className="font-semibold">
                {exp.role} @ {exp.company}
              </p>

              <p className="text-xs text-gray-600">
                {exp.start} - {exp.end}
              </p>

              <p>{exp.description}</p>

            </div>
          ))}
        </div>

        <p>
          <strong>Skills:</strong><br />
          {skills}
        </p>

      </div>

    </div>

  </div>
);
}