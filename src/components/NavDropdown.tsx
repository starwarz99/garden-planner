"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface NavDropdownProps {
  userName?: string | null;
  userImage?: string | null;
  isAdmin?: boolean;
  gardensFull?: boolean;
  signOutAction: () => Promise<void>;
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function NavDropdown({ userName, userImage, isAdmin, gardensFull, signOutAction }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all
          ${open
            ? "border-primary text-primary bg-primary/5"
            : "border-sage/40 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5"
          }`}
        aria-label="Account menu"
        title={userName ?? "Account"}
      >
        {userImage ? (
          <img src={userImage} alt={userName ?? "Profile"} className="w-full h-full rounded-full object-cover" />
        ) : (
          <UserIcon />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-sage/20 shadow-lg py-1 z-50">
          {userName && (
            <>
              <div className="px-4 py-2.5 border-b border-gray-100">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-semibold text-gray-800 truncate">{userName}</p>
              </div>
            </>
          )}
          <div className="py-1">
            {gardensFull ? (
              <div className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                title="No more gardens available on your current plan">
                <span>＋</span> New Garden <span className="ml-auto text-[10px] bg-gray-100 rounded px-1">limit reached</span>
              </div>
            ) : (
              <Link href="/wizard" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors">
                <span>＋</span> New Garden
              </Link>
            )}
            <Link href="/account" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
              <span>⚙️</span> My Account
            </Link>
            <Link href="/pricing" onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
              <span>✨</span> Subscription
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors">
                <span>🔧</span> Admin
              </Link>
            )}
          </div>
          <div className="border-t border-gray-100 py-1">
            <form action={signOutAction}>
              <button type="submit"
                className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors text-left">
                <span>↩</span> Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
