import { cn } from "@/lib/utils";
import { Home, Users, Bell, User, Activity } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Contacts", icon: Users, path: "/contacts" },
  { label: "Nudges", icon: Bell, path: "/nudges" },
  { label: "Settings", icon: User, path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-[240px] min-h-screen border-r border-border bg-card">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border">
        <Activity size={20} className="text-primary" strokeWidth={2.5} />
        <span className="text-[18px] font-bold text-primary">Pulse</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-[14px] font-medium transition-colors",
                "hover:bg-secondary"
              )}
              activeClassName="bg-primary-light text-primary"
            >
              <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
