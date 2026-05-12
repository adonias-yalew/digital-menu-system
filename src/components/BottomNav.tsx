import { NavLink, useLocation } from "react-router-dom";
import {  Hamburger, CreditCard, MessageSquare, Info } from "lucide-react";

import { useLanguage } from "@/hooks/use-language";

const tabs = [
  {
    to: "/",
    key: "nav.menu",
    icon: Hamburger,
  },

  {
    to: "/payment",
    key: "nav.payment",
    icon: CreditCard,
  },

  {
    to: "/feedback",
    key: "nav.feedback",
    icon: MessageSquare,
  },

  {
    to: "/about",
    key: "nav.about",
    icon: Info,
  },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  const { t } = useLanguage();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-lg px-3 pb-3">
        <div className="flex items-center justify-between rounded-3xl border border-border/60 bg-white/95 px-2 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] backdrop-blur-xl">
          {tabs.map(({ to, key, icon: Icon }) => {
            const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);

            return (
              <NavLink
                key={to}
                to={to}
                className={`relative flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl py-2 transition-all duration-200 ${
                  isActive ? "bg-secondary" : "hover:bg-secondary/60"
                }`}
              >
                {/* ACTIVE INDICATOR */}
                {isActive && <span className="absolute top-1 h-1 w-1 rounded-full bg-primary" />}

                {/* ICON */}
                <div
                  className={`grid h-9 w-9 place-items-center rounded-xl transition-all ${
                    isActive ? "bg-primary text-white shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <Icon
                    className={`transition-all ${isActive ? "h-5 w-5" : "h-4.5 w-4.5"}`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                </div>

                {/* LABEL */}
                <span
                  className={`text-[11px] font-medium transition-all ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {t(key)}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
