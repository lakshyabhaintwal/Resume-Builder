import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function Page(){
    return(
        <main className="min-h-screen bg-white lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.55fr)]">
            <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
                <div className="w-full max-w-[440px]">
                    <div className="mb-10 flex flex-col items-center text-center">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-semibold text-blue-600 shadow-sm">
                            R
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                            Welcome back!
                        </h1>
                        <p className="mt-3 text-base text-slate-600">
                            Don&apos;t have an account yet?{" "}
                            <Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-700">
                                Sign up now
                            </Link>
                        </p>
                    </div>

                    <SignIn
                        path="/sign-in"
                        routing="path"
                        signUpUrl="/sign-up"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "w-full bg-transparent shadow-none border-0 p-0",
                                header: "hidden",
                                footer: "hidden",
                                form: "gap-5",
                                formFieldLabel: "text-sm font-medium text-slate-700",
                                formFieldInput:
                                    "h-16 rounded-3xl border border-slate-300 bg-white px-5 text-base text-slate-900 shadow-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
                                formFieldInputShowPasswordButton:
                                    "text-slate-400 hover:text-slate-600",
                                formFieldAction:
                                    "text-sm font-medium text-blue-600 hover:text-blue-700",
                                formButtonPrimary:
                                    "mt-2 h-14 rounded-full bg-blue-600 text-base font-semibold shadow-none hover:bg-blue-700",
                                dividerLine: "bg-slate-200",
                                dividerText: "px-4 text-sm font-semibold tracking-[0.24em] text-slate-400",
                                socialButtonsBlockButton:
                                    "h-14 rounded-full border border-slate-300 bg-white text-base font-semibold text-slate-700 shadow-none hover:bg-slate-50",
                                socialButtonsBlockButtonText: "font-semibold text-slate-700",
                                formResendCodeLink: "text-sm font-medium text-blue-600 hover:text-blue-700",
                                identityPreviewText: "text-sm text-slate-600",
                                identityPreviewEditButton:
                                    "text-sm font-medium text-blue-600 hover:text-blue-700",
                            },
                            layout: {
                                socialButtonsPlacement: "bottom",
                                socialButtonsVariant: "blockButton",
                                showOptionalFields: false,
                            },
                            variables: {
                                colorPrimary: "#2563eb",
                                colorText: "#0f172a",
                                colorTextSecondary: "#475569",
                                colorInputText: "#0f172a",
                                colorInputBackground: "#ffffff",
                                colorNeutral: "#cbd5e1",
                                borderRadius: "1.5rem",
                            },
                        }}
                    />
                </div>
            </section>

            <aside className="relative hidden min-h-screen overflow-hidden bg-[#0f265c] lg:block">
                <div
                    className="absolute inset-0 opacity-95"
                    style={{
                        backgroundColor: "#132b61",
                        backgroundImage: `
                            radial-gradient(circle at 0 0, transparent 63%, #3d67ff 64%, #3d67ff 100%),
                            linear-gradient(#132b61, #132b61)
                        `,
                        backgroundSize: "180px 180px, 180px 180px",
                        backgroundPosition: "0 0, 0 0",
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
            </aside>
        </main>
    );
}
