export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">

      <h1 className="text-4xl font-bold mb-4" style={{ color: "black" }}>
        AI Resume Builder
      </h1>

      <p className="text-gray-600 mb-8">
        Create professional ATS-friendly resumes in minutes
      </p>

      <div className="space-x-4">
        <a
          href="/builder"
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Build Resume
        </a>

        <a 
          href="/login"
          className="border px-6 py-3 rounded text-black"
        >
          Login
        </a>
      </div>

    </main>
  );
}
