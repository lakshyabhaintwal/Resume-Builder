"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function Builder() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Resume form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");

  // ✅ Redirect AFTER render
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Still loading auth
  if (loading) {
    return <p className="p-10">Loading...</p>;
  }

  // Waiting for redirect
  if (!user) {
    return null;
  }

  return (
    <div className="p-10 grid grid-cols-2 gap-10">

      {/* LEFT – FORM */}
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

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>

      </div>

      {/* RIGHT – PREVIEW */}
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
