'use client'

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "antd";
import { MdCreditCard, MdPerson, MdSecurity } from "react-icons/md";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { href: "/settings/profile", label: "Profile", icon: <MdPerson className="text-xl" /> },
  { href: "/settings/billing", label: "Billing & Tokens", icon: <MdCreditCard className="text-xl" /> },
  { href: "/settings/security", label: "Security", icon: <MdSecurity className="text-xl" /> },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Main Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#101522]/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                AdAnalyze<span className="text-primary">.ai</span>
              </span>
            </div>

            <Avatar />
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <nav className="space-y-1 sticky top-[96.5px]">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cx(
                      "group flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition",
                      !isActive &&
                      "text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50",
                      isActive &&
                      "bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300"
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9 space-y-6 mt-6 lg:mt-0">{children}</main>
        </div>
      </div>
    </div>
  );
}