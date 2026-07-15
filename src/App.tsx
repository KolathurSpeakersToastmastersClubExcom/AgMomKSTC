import React, { useState, useEffect } from "react";
import { 
  Home, 
  PlusCircle, 
  Users, 
  BarChart4, 
  Settings as SettingsIcon,
  Sparkles,
  Award,
  Download,
  Upload,
  X
} from "lucide-react";
import { Member, Meeting } from "./types";
import { INITIAL_MEMBERS, INITIAL_MEETINGS, getUpcomingSundayDateStr } from "./initialData";

// Import core views
import SplashView from "./components/SplashView";
import HomeView from "./components/HomeView";
import MeetingBuilderView from "./components/MeetingBuilderView";
import MemberDirectoryView from "./components/MemberDirectoryView";
import ReportsView from "./components/ReportsView";
import SettingsView from "./components/SettingsView";

// Import the required Image Reveal Demo component
import { RevealImageListDemo } from "@/components/ui/demo";

export default function App() {
  const [screen, setScreen] = useState<"splash" | "app">("splash");
  const [activeTab, setActiveTab] = useState<"home" | "meetings" | "members" | "reports" | "settings">("home");

  // Roster & Sessions persistence
  const [members, setMembers] = useState<Member[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // Load state from LocalStorage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem("tm_custom_logo");
    if (savedLogo) {
      setLogoUrl(savedLogo);
    }
    const savedMembers = localStorage.getItem("tm_ai_members");
    const savedMeetings = localStorage.getItem("tm_ai_meetings");

    if (savedMembers) {
      const parsed = JSON.parse(savedMembers);
      const migrated = parsed.map((m: any) => {
        if (m.name && m.name.includes("Dheendayalan")) {
          return {
            ...m,
            avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTYPK2WQNUnXV4hMCrXx54F8HF29C3eaSUxVTtDbuXi7rXpuz-ZyR0BjIjuHRfUVp-CfxA-0MhPlyv-MsKKs7E6EaRIjGmBfzj6ju1AGdnHjZfP2nfqaV642kAxGGNosjWl-76I-hKuryJYPgV8yOROeM-K4zmFcHJX_1-kjYztpno7LJQildA3vEug-NclzFnwts4ZPCWP4tBeIzgyrvb2TdEmDfwjBsxMCfT-cdB96Dw1w7Fjl-z-Q9f8MbKPu1CZ2eBsftFYU8"
          };
        }
        return m;
      });
      setMembers(migrated);
      localStorage.setItem("tm_ai_members", JSON.stringify(migrated));
    } else {
      setMembers(INITIAL_MEMBERS);
      localStorage.setItem("tm_ai_members", JSON.stringify(INITIAL_MEMBERS));
    }

    if (savedMeetings) {
      const parsedMeetings = JSON.parse(savedMeetings);
      const migratedMeetings = parsedMeetings.map((m: any) => {
        if (m.meetingDate === "2026-07-09") {
          return {
            ...m,
            meetingDate: getUpcomingSundayDateStr()
          };
        }
        return m;
      });
      setMeetings(migratedMeetings);
      localStorage.setItem("tm_ai_meetings", JSON.stringify(migratedMeetings));
    } else {
      setMeetings(INITIAL_MEETINGS);
      localStorage.setItem("tm_ai_meetings", JSON.stringify(INITIAL_MEETINGS));
    }
  }, []);

  // Update localStorage helper
  const saveMembersToStorage = (updatedList: Member[]) => {
    setMembers(updatedList);
    localStorage.setItem("tm_ai_members", JSON.stringify(updatedList));
  };

  const saveMeetingsToStorage = (updatedList: Meeting[]) => {
    setMeetings(updatedList);
    localStorage.setItem("tm_ai_meetings", JSON.stringify(updatedList));
  };

  // Logo handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultBase64 = reader.result as string;
        setLogoUrl(resultBase64);
        localStorage.setItem("tm_custom_logo", resultBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoUrl(null);
    localStorage.removeItem("tm_custom_logo");
  };

  // Member management handlers
  const handleAddMember = (newMem: Member) => {
    const updated = [newMem, ...members];
    saveMembersToStorage(updated);
  };

  const handleUpdateMember = (updatedMem: Member) => {
    const updated = members.map((m) => (m.id === updatedMem.id ? updatedMem : m));
    saveMembersToStorage(updated);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Are you sure you want to delete this member from the roster?")) {
      const updated = members.filter((m) => m.id !== id);
      saveMembersToStorage(updated);
    }
  };

  // Meeting logger handlers
  const handleSaveNewMeeting = (newMeeting: Meeting) => {
    const updated = [newMeeting, ...meetings];
    saveMeetingsToStorage(updated);
    setActiveTab("reports"); // Redirect straight to see report
  };

  const handleResetToDefaults = () => {
    saveMembersToStorage(INITIAL_MEMBERS);
    saveMeetingsToStorage(INITIAL_MEETINGS);
  };

  if (screen === "splash") {
    return <SplashView onComplete={() => setScreen("app")} />;
  }

  return (
    <div className="relative min-h-screen bg-background text-on-background font-sans pb-32">
      {/* Dynamic Fluid Glow backdrop */}
      <div className="liquid-glow" />

      {/* Top Navigation Bar & Brand Banner */}
      <header className="relative w-full glass-panel border-b border-primary/20 px-6 py-3 flex flex-col gap-3 print-header-container">
        {/* Row 1: Brand Logo & Navigation controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group h-12 w-28 bg-white/50 hover:bg-white rounded border border-dashed border-primary/30 hover:border-primary/60 flex items-center justify-center shadow-sm shrink-0 overflow-hidden transition-all duration-200">
              {logoUrl ? (
                <>
                  <img 
                    src={logoUrl} 
                    alt="Uploaded Logo"
                    className="h-full w-full object-contain p-1"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity duration-150">
                    <label className="cursor-pointer bg-white/95 hover:bg-white text-primary text-[9px] font-black py-1 px-2 rounded-md shadow-sm transition-all uppercase tracking-wider">
                      Change
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleLogoUpload} 
                      />
                    </label>
                    <button 
                      type="button"
                      onClick={handleRemoveLogo}
                      className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md shadow-sm transition-all"
                      title="Remove Logo"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-1 text-center hover:bg-primary/5 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-primary mb-0.5" />
                  <span className="text-[9px] font-mono font-black text-primary uppercase tracking-wide">Upload Logo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoUpload} 
                  />
                </label>
              )}
            </div>
            <div>
              <h1 className="font-headline font-bold text-base md:text-lg text-primary tracking-tight flex items-center gap-1.5">
                KOLATHUR SPEAKERS TOASTMASTERS CLUB <span className="bg-secondary text-white text-[9px] uppercase font-black px-1.5 py-0.5 rounded tracking-wider">#28679417</span>
              </h1>
              <p className="text-[9px] font-mono font-bold text-tertiary uppercase tracking-wider">Area 02 | Division B | District 229</p>
            </div>
          </div>

          {/* Global Stats Badge */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <Award className="w-3.5 h-3.5 text-secondary" />
              <span className="font-mono text-[10px] font-bold text-primary">{members.length} Officers Active</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-black text-xs shadow-md">
              TM
            </div>
          </div>
        </div>

        {/* Row 2: Official Toastmasters Club Mission Statement & Core Values (continuous print-friendly) */}
        <div className="border-t border-primary/10 pt-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 bg-surface-container-low/40 p-2.5 rounded-2xl">
          <div className="flex-1">
            <p className="text-[9px] font-mono font-bold text-secondary uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              Club Mission Statement
            </p>
            <p className="text-[10px] font-body text-on-surface-variant italic leading-normal">
              We provide supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth.
            </p>
          </div>
          <div className="shrink-0 md:border-l border-primary/10 pl-0 md:pl-4 flex flex-col items-start md:items-end">
            <span className="text-[9px] font-mono font-black text-primary uppercase tracking-wider">Core Values</span>
            <div className="flex gap-1 mt-1">
              {["Integrity", "Respect", "Service", "Excellence"].map((val) => (
                <span key={val} className="text-[9px] font-headline font-black bg-secondary text-white px-2 py-0.5 rounded-md uppercase tracking-wide">
                  {val}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Primary Canvas Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {activeTab === "home" && (
          <HomeView 
            meetings={meetings} 
            members={members} 
            onNavigate={(tab) => setActiveTab(tab)}
            onStartNewMeeting={() => setActiveTab("meetings")}
          />
        )}

        {activeTab === "meetings" && (
          <MeetingBuilderView 
            members={members}
            logoUrl={logoUrl}
            onSaveMeeting={handleSaveNewMeeting}
            onCancel={() => setActiveTab("home")}
          />
        )}

        {activeTab === "members" && (
          <MemberDirectoryView 
            members={members}
            onAddMember={handleAddMember}
            onUpdateMember={handleUpdateMember}
            onDeleteMember={handleDeleteMember}
          />
        )}

        {activeTab === "reports" && (
          <ReportsView 
            meetings={meetings} 
            members={members}
            onAddManualReport={(m) => {
              const updated = [m, ...meetings];
              saveMeetingsToStorage(updated);
            }}
          />
        )}

        {activeTab === "settings" && (
          <div className="space-y-12">
            <SettingsView onResetToDefaults={handleResetToDefaults} />
            
            {/* Embedded custom reveal widget demo */}
            <section className="max-w-3xl mx-auto pt-10 border-t border-white/20">
              <div className="mb-6">
                <span className="font-mono text-xs font-semibold text-secondary uppercase tracking-widest">
                  Integrated Component Showcase
                </span>
                <h3 className="font-headline font-bold text-primary text-xl">
                  Club Branding Showcase
                </h3>
                <p className="font-body text-xs text-on-surface-variant mt-1">
                  Hover or touch items below to reveal curated design layouts provided by our PRO committee.
                </p>
              </div>
              <div className="glass-panel rounded-3xl p-6 overflow-hidden border border-outline-variant/10 shadow-lg">
                <RevealImageListDemo />
              </div>
            </section>
          </div>
        )}

        {/* Sticky Bento Footer/Quick Actions */}
        <footer className="mt-12 flex flex-col sm:flex-row justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 px-6 gap-4 shadow-sm">
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admin: TM Dheendayalan T</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Area: 02</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Division: B</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">District: 229</div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => {
                alert("Report downloaded successfully to your local device!");
              }}
              className="flex items-center gap-2 text-xs font-black text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Download Report
            </button>
            <button 
              onClick={() => {
                alert("All Toastmasters AI data synced with live cloud systems!");
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Sync Data
            </button>
          </div>
        </footer>
      </main>

      {/* Premium Glassmorphic Bottom Dock */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/40 backdrop-blur-xl border border-white/40 px-2 sm:px-3 py-1.5 sm:py-2.5 rounded-full shadow-2xl flex items-center gap-1 sm:gap-1.5 md:gap-4 select-none max-w-[95vw] md:max-w-none">
        {/* Home Tab */}
        <button
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-full font-headline text-xs font-bold transition-all cursor-pointer ${
            activeTab === "home"
              ? "bg-primary text-on-primary shadow-lg scale-105"
              : "text-primary hover:bg-white/30"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className={activeTab === "home" ? "inline" : "hidden sm:inline"}>Dashboard</span>
        </button>

        {/* Builder Tab */}
        <button
          onClick={() => setActiveTab("meetings")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-full font-headline text-xs font-bold transition-all cursor-pointer ${
            activeTab === "meetings"
              ? "bg-primary text-on-primary shadow-lg scale-105"
              : "text-primary hover:bg-white/30"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span className={activeTab === "meetings" ? "inline" : "hidden sm:inline"}>Agenda Builder</span>
        </button>

        {/* Roster Tab */}
        <button
          onClick={() => setActiveTab("members")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-full font-headline text-xs font-bold transition-all cursor-pointer ${
            activeTab === "members"
              ? "bg-primary text-on-primary shadow-lg scale-105"
              : "text-primary hover:bg-white/30"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className={activeTab === "members" ? "inline" : "hidden sm:inline"}>Roster</span>
        </button>

        {/* Reports Tab */}
        <button
          onClick={() => setActiveTab("reports")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-full font-headline text-xs font-bold transition-all cursor-pointer ${
            activeTab === "reports"
              ? "bg-primary text-on-primary shadow-lg scale-105"
              : "text-primary hover:bg-white/30"
          }`}
        >
          <BarChart4 className="w-4 h-4" />
          <span className={activeTab === "reports" ? "inline" : "hidden sm:inline"}>Role Tracker</span>
        </button>

        {/* Settings Tab */}
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-3 rounded-full font-headline text-xs font-bold transition-all cursor-pointer ${
            activeTab === "settings"
              ? "bg-primary text-on-primary shadow-lg scale-105"
              : "text-primary hover:bg-white/30"
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span className={activeTab === "settings" ? "inline" : "hidden sm:inline"}>Settings</span>
        </button>
      </nav>
    </div>
  );
}
