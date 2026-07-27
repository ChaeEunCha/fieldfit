import { ReactNode } from "react";
import { BottomNav } from "@/components/ui";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-8">{children}</div>
      <div className="sticky bottom-0">
        <BottomNav
          items={[
            { href: "/home", label: "홈", icon: "🏠" },
            { href: "/diagnosis", label: "진단", icon: "📊" },
            { href: "/calendar", label: "캘린더", icon: "📅" },
            { href: "/chat", label: "챗봇", icon: "💬" },
          ]}
        />
      </div>
    </div>
  );
}
