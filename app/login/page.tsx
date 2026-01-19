"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({
      email,
    });

    alert("Check your email for login link");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Login
      </h1>

      <input
        className="border p-2 mr-2"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2"
      >
        Login
      </button>
    </div>
  );
}
