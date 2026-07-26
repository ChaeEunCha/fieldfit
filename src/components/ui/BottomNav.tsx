"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface BottomNavItem {
  href: string;
  label: string;
  icon: ReactNode;
}

interface BottomNavProps {
  items: BottomNavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around border-t border-border bg-surface pt-3.5 pb-5">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5",
              active ? "text-brand" : "text-placeholder",
            )}
          >
            <span className="text-[17px] leading-none">{item.icon}</span>
            <span
              className={cn("text-[10px]", active ? "font-bold" : "font-normal")}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
