"use client";

import Link from "next/link";
import {
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Wait for Clerk
  if (!isLoaded) return null;

  const isActive = (path: string) =>
    pathname === path;

  return (
    <header
      className="
        sticky
        top-0
        z-50
        w-full
        bg-white/95
        backdrop-blur-md
        border-b
        border-gray-200
        shadow-sm
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          h-16
          flex
          items-center
          justify-between
        "
      >

        {/* LOGO */}
        <Link
          href="/"
          className="
            text-2xl
            font-bold
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            bg-clip-text
            text-transparent
            tracking-tight
          "
        >
          AI Resume Builder
        </Link>

        {/* CENTER NAV */}
        <nav className="hidden md:flex items-center gap-8">

          <NavItem
            href="/builder"
            active={isActive("/builder")}
          >
            Builder
          </NavItem>

          <NavItem
            href="/jobs"
            active={isActive("/jobs")}
          >
            Jobs
          </NavItem>

          <NavItem
            href="/tools"
            active={isActive("/tools")}
          >
            Tools
          </NavItem>

        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* LOGGED OUT */}
          {!isSignedIn && (
            <>
              <Link
                href="/sign-in"
                className="
                  text-sm
                  font-medium
                  text-gray-700
                  hover:text-blue-600
                  transition
                "
              >
                Log in
              </Link>

              <Link
                href="/sign-up"
                className="
                  px-4 py-2
                  rounded-full
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  text-white
                  text-sm
                  font-semibold
                  shadow
                  hover:shadow-md
                  transition
                "
              >
                Get Started
              </Link>
            </>
          )}

          {/* LOGGED IN */}
          {isSignedIn && (
            <>
              {/* Greeting */}
              <div className="hidden sm:flex flex-col text-right leading-tight">

                <span className="text-xs text-gray-500">
                  Welcome
                </span>

                <span className="font-semibold text-gray-900">
                  {user?.firstName || "User"}
                </span>

              </div>

              {/* Dashboard Button */}
              <Link
                href="/builder"
                className="
                  px-4 py-2
                  rounded-full
                  text-sm
                  font-semibold
                  text-white
                  bg-blue-600
                  hover:bg-blue-700
                  shadow
                  transition
                "
              >
                Dashboard
              </Link>

              {/* Profile */}
              <UserButton afterSignOutUrl="/" />
            </>
          )}

        </div>

      </div>
    </header>
  );
}

/* ================= NAV ITEM ================= */

function NavItem({
  href,
  active,
  children,
}: any) {
  return (
    <Link
      href={href}
      className={`
        relative
        text-sm
        font-medium
        transition
        ${
          active
            ? "text-blue-600"
            : "text-gray-700 hover:text-blue-600"
        }
      `}
    >
      {children}

      {active && (
        <span
          className="
            absolute
            -bottom-2
            left-0
            w-full
            h-[2px]
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            rounded-full
          "
        />
      )}
    </Link>
  );
}
