import { useState } from "react";
import type { User } from "./types";
import type { NavView } from "./components/layout/Sidebar";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./views/Dashboard";
import { MyLeaves } from "./views/MyLeaves";
import { ApplyLeave } from "./views/ApplyLeave";
import { TeamRequests } from "./views/TeamRequests";
import { LeaveCalendar } from "./views/LeaveCalendar";
import { USERS } from "./data/mockData";

export default function App() {
  const [user, setUser] = useState<User>(USERS[0]); // Sarah Mitchell (Manager) by default
  const [view, setView] = useState<NavView>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleRoleSwitch(newUser: User) {
    setUser(newUser);
    setView("dashboard");
  }

  function navigate(v: NavView) {
    setView(v);
    setMobileMenuOpen(false);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <Sidebar
        view={view}
        setView={navigate}
        user={user}
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          view={view}
          user={user}
          onMenuClick={() => setMobileMenuOpen(true)}
          onRoleSwitch={handleRoleSwitch}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
            {view === "dashboard" && (
              <Dashboard
                user={user}
                onNavigate={(v) => navigate(v as NavView)}
              />
            )}
            {view === "my-leaves" && <MyLeaves user={user} />}
            {view === "apply" && (
              <ApplyLeave
                user={user}
                onSuccess={() => navigate("my-leaves")}
              />
            )}
            {view === "team" && user.role === "Manager" && <TeamRequests />}
            {view === "team" && user.role === "Employee" && (
              <div className="py-16 text-center text-slate-400 text-sm">
                You do not have permission to view team requests.
              </div>
            )}
            {view === "calendar" && <LeaveCalendar />}
          </div>
        </main>
      </div>
    </div>
  );
}
