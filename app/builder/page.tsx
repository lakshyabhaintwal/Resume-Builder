"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function Builder() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Resume fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");

  const [saving, setSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load resume from DB
  useEffect(() => {
    if (user) {
      loadResume();
    }
  }, [user]);

  // Fetch resume
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
      setEducation(data.education || "");
      setSkills(data.skills || "");
    }
  };

  // Save resume
  const saveResume = async () => {
    if (!user) return;

    setSaving(true);

    const { error } = await supabase.from("resumes").upsert({
      user_id: user.id,
      name,
      email,
      education,
      skills,
    });

    setSaving(false);

    if (error) {
      alert("Save failed: " + error.message);
    } else {
      alert("Resume saved!");
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Loading state
  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  // Waiting for redirect
  if (!user) {
    return null;
  }

  return (
    <div className="p-10 grid grid-cols-2 gap-10">

      {/* FORM */}
      <div>

        <h1 className="text-2xl font-bold mb-6">
          Resume Builder
        </h1>

        <div className="space-y-4">

          <input
            className="border p-2 w-full"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 w-full"
            placeholder="Education"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />

          <input
            className="border p-2 w-full"
            placeholder="Skills (comma separated)"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

        </div>

        <div className="mt-6 space-x-4">

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

      {/* PREVIEW */}
      <div className="border p-6 rounded bg-white shadow text-black">

        <h2 className="text-xl font-bold mb-4">
          Live Preview
        </h2>

        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Education:</strong> {education}</p>
        <p><strong>Skills:</strong> {skills}</p>

      </div>

    </div>
  );
}
