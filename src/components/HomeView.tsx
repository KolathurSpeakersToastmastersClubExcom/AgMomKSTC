import React, { useState } from "react";
import { 
  PlusCircle, 
  Users, 
  Sparkles, 
  FileText, 
  Archive, 
  BarChart4, 
  Settings, 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Lightbulb,
  Bell,
  RefreshCw
} from "lucide-react";
import { Meeting, Member } from "../types";

interface HomeViewProps {
  meetings: Meeting[];
  members: Member[];
  onNavigate: (screen: "home" | "meetings" | "members" | "reports" | "settings") => void;
  onStartNewMeeting: () => void;
}

export default function HomeView({ meetings, members, onNavigate, onStartNewMeeting }: HomeViewProps) {
  const [insights, setInsights] = useState({
    toneAnalysis: "Last meeting's Table Topics were 20% more engaging than the previous average. Members favored open-ended questions.",
    attendancePrediction: "Expecting high turnout (85%+) for Thursday. Suggest adding an extra evaluator slot."
  });
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Time based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning, Toastmaster";
    if (hour >= 12 && hour < 17) return "Good afternoon, Toastmaster";
    return "Good evening, Toastmaster";
  };

  // Fetch actual server-side AI insights based on the real club database
  const refreshInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetings, members })
      });
      const data = await res.json();
      if (data.toneAnalysis && data.attendancePrediction) {
        setInsights({
          toneAnalysis: data.toneAnalysis,
          attendancePrediction: data.attendancePrediction
        });
      }
    } catch (e) {
      console.error("Error refreshing AI insights", e);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Find next meeting details
  const nextMeeting = meetings[meetings.length - 1] || {
    sessionTheme: "Mastering the Art of Impromptu",
    meetingDate: "Thursday, Oct 24",
    meetingNumber: "1143"
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Section */}
      <section className="mb-4">
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-primary tracking-tight mb-2">
          {getGreeting()}
        </h1>
        <p className="text-on-surface-variant text-base md:text-lg max-w-2xl font-body leading-relaxed">
          Ready to elevate your club's communication excellence? Your AI assistant has prepared today's agenda drafts and member reports.
        </p>
      </section>

      {/* Upcoming Meeting Hero Highlight */}
      <section className="relative overflow-hidden">
        <div className="glass-card rounded-[32px] p-8 md:p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center relative overflow-hidden border border-white/40 shadow-xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="z-10 mb-6 lg:mb-0 space-y-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-sans text-xs font-semibold tracking-wider">
              <Calendar className="w-3.5 h-3.5 mr-2" />
              UPCOMING MEETING
            </div>
            <h2 className="font-headline text-2xl md:text-3.5xl font-bold text-primary leading-tight">
              {nextMeeting.sessionTheme}
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-on-surface-variant font-sans text-sm md:text-base font-medium">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <span>{nextMeeting.meetingDate}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-primary" />
                <span>10:30 AM - 12:30 PM (IST)</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary shrink-0" />
                <span className="line-clamp-1" title="Exemplary Solutions 91/31, Second floor, Surapet main road, puthagaram, vinayagapuram, chennai-600099">Exemplary Solutions 91/31, Second floor, Surapet main road, puthagaram, vinayagapuram, chennai-600099</span>
              </div>
            </div>
          </div>

          <div className="z-10 flex gap-4 w-full lg:w-auto shrink-0">
            <button 
              onClick={onStartNewMeeting}
              className="flex-1 lg:flex-none bg-primary text-on-primary font-headline text-sm font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
            >
              Open Meeting Stage
            </button>
            <button 
              onClick={() => onNavigate("meetings")}
              className="flex-1 lg:flex-none glass-panel bg-white/20 px-6 py-4 rounded-full font-headline text-sm font-semibold text-primary hover:bg-white/40 active:scale-95 transition-all cursor-pointer"
            >
              Edit Agenda
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions Bento Grid */}
      <section>
        <h3 className="font-headline text-xl md:text-2xl font-bold text-primary mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* New Meeting */}
          <div 
            onClick={onStartNewMeeting}
            className="glass-card group rounded-3xl p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 cursor-pointer hover:border-primary/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-inner">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline text-lg font-bold text-primary">New Meeting</p>
              <p className="text-xs text-on-surface-variant font-body mt-1">Start a fresh session</p>
            </div>
          </div>

          {/* Members */}
          <div 
            onClick={() => onNavigate("members")}
            className="glass-card group rounded-3xl p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 cursor-pointer hover:border-primary/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-all duration-300 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline text-lg font-bold text-primary">Members</p>
              <p className="text-xs text-on-surface-variant font-body mt-1">Manage club roster</p>
            </div>
          </div>

          {/* Generate Agenda */}
          <div 
            onClick={() => {
              onNavigate("meetings");
              onStartNewMeeting();
            }}
            className="glass-card group rounded-3xl p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 cursor-pointer hover:border-primary/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-tertiary-fixed/40 flex items-center justify-center text-tertiary-container group-hover:bg-tertiary-container group-hover:text-white transition-all duration-300 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline text-lg font-bold text-primary">Generate Agenda</p>
              <p className="text-xs text-on-surface-variant font-body mt-1">AI-powered planning</p>
            </div>
          </div>

          {/* Meeting Minutes */}
          <div 
            onClick={() => onNavigate("reports")}
            className="glass-card group rounded-3xl p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 cursor-pointer hover:border-primary/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-on-primary-container/10 flex items-center justify-center text-on-primary-container group-hover:bg-on-primary-container group-hover:text-white transition-all duration-300 shadow-inner">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline text-lg font-bold text-primary">Meeting Reports</p>
              <p className="text-xs text-on-surface-variant font-body mt-1">Weekly performance</p>
            </div>
          </div>

          {/* Previous Meetings */}
          <div 
            onClick={() => onNavigate("reports")}
            className="glass-card group rounded-3xl p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 cursor-pointer hover:border-primary/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-surface-variant flex items-center justify-center text-on-surface-variant group-hover:bg-on-surface-variant group-hover:text-white transition-all duration-300 shadow-inner">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline text-lg font-bold text-primary">Archive</p>
              <p className="text-xs text-on-surface-variant font-body mt-1">Past sessions history</p>
            </div>
          </div>

          {/* Reports */}
          <div 
            onClick={() => onNavigate("reports")}
            className="glass-card group rounded-3xl p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 cursor-pointer hover:border-primary/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-outline-variant/20 flex items-center justify-center text-outline group-hover:bg-outline group-hover:text-white transition-all duration-300 shadow-inner">
              <BarChart4 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-headline text-lg font-bold text-primary">Role Tracker</p>
              <p className="text-xs text-on-surface-variant font-body mt-1">Attendance metrics</p>
            </div>
          </div>

          {/* Settings */}
          <div 
            onClick={() => onNavigate("settings")}
            className="glass-card group rounded-3xl p-6 flex flex-col justify-between aspect-square md:aspect-auto md:h-48 cursor-pointer col-span-2 hover:border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                <Settings className="w-6 h-6" />
              </div>
              <span className="text-2xs font-mono font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full">v2.4.0</span>
            </div>
            <div>
              <p className="font-headline text-lg font-bold text-primary">Club Settings</p>
              <p className="text-xs text-on-surface-variant font-body mt-1">Preferences &amp; AI Configurations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Member Progress & AI Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Member Performance Pathway Progress */}
        <div className="lg:col-span-2 glass-card rounded-[32px] p-8 border border-white/30 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-headline text-xl font-bold text-primary">Member Pathway Progress</h3>
            <button 
              onClick={() => onNavigate("members")}
              className="text-primary font-headline text-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Progress Item 1 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container border border-white">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC67rpDcLHFE3CGPG-zGWaO00uakDIHhbX3XRE2D1wf5PHrbS-D4vC4CDLdYLuArxYZQA1aJ0nxnZaVP5SGsFcaJPSoii_KKVgTUZTmMiQCunsYDZpW-gZU7ux4SZ0LV54091AQkMYUkVr3YJiYO3lFAhNpzl2OirdBYHjTSWmI8DZ5nVG__Hltu_1l4_FJcS5cKf5N2bUrr8XOyLTSnqpSMSuoTEfN--FbOljAHFt5wj-cZn0EiF--t9TPZAbhnL6tM3BRXdQUrik" 
                  alt="Sarah Jenkins"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-headline font-semibold text-primary">TM Saranya</span>
                  <span className="font-mono text-xs text-on-surface-variant">Level 3 Complete (PM5)</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container w-[75%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Progress Item 2 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white border border-primary/20 p-0.5">
                <img 
                  className="w-full h-full object-contain" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTYPK2WQNUnXV4hMCrXx54F8HF29C3eaSUxVTtDbuXi7rXpuz-ZyR0BjIjuHRfUVp-CfxA-0MhPlyv-MsKKs7E6EaRIjGmBfzj6ju1AGdnHjZfP2nfqaV642kAxGGNosjWl-76I-hKuryJYPgV8yOROeM-K4zmFcHJX_1-kjYztpno7LJQildA3vEug-NclzFnwts4ZPCWP4tBeIzgyrvb2TdEmDfwjBsxMCfT-cdB96Dw1w7Fjl-z-Q9f8MbKPu1CZ2eBsftFYU8" 
                  alt="TM Dheendayalan T"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-headline font-semibold text-primary">TM Dheendayalan T</span>
                  <span className="font-mono text-xs text-on-surface-variant">Level 5 Active (DTM)</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[90%] rounded-full" />
                </div>
              </div>
            </div>

            {/* Progress Item 3 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-surface-container border border-white">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAobNZejNQQFrntK4YeW4s6qGOmch4Qjqw9h926Y-hh7-2DaI4rhMIMOZXedbMIJDhpONxo3zG9TV8k4lMYfcnpII-CugOHQARMe6KiliPP6kifpoTscR8BjXAc-Yxzv6OyVMNeSRS1lS7XOrM_n2j67vOSDF9nFdooKcwnNIEuITjxuN90tvfURiN0PVKT5cZpznn_D5CaRP_eI3NtfR8-O0MYdQNyyvyyKcUKZCqhgmqY3ko3gYmfObiwvAzjNwVQHuRqXNAs2mc" 
                  alt="Marcus Thompson"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="font-headline font-semibold text-primary">TM Simon Bright</span>
                  <span className="font-mono text-xs text-on-surface-variant">Level 2 In Progress (MS2)</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary-container w-[50%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="bg-primary-container text-white rounded-[24px] p-6 flex flex-col justify-between border border-indigo-700/50 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-indigo-300 animate-pulse" />
                <h3 className="font-headline text-lg font-bold text-white">AI Insights</h3>
              </div>
              <button 
                onClick={refreshInsights}
                disabled={loadingInsights}
                className="p-1 rounded-full hover:bg-indigo-800/50 text-indigo-200 transition-all disabled:opacity-50 cursor-pointer"
                title="Generate custom real-time Insights"
              >
                <RefreshCw className={`w-4 h-4 ${loadingInsights ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/30">
                <p className="font-mono text-2xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">
                  Tone Analysis
                </p>
                <p className="text-sm font-body text-slate-100 leading-relaxed">
                  {insights.toneAnalysis}
                </p>
              </div>

              <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-800/30">
                <p className="font-mono text-2xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">
                  Attendance Prediction
                </p>
                <p className="text-sm font-body text-slate-100 leading-relaxed">
                  {insights.attendancePrediction}
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("reports")}
            className="mt-6 w-full py-3.5 rounded-xl bg-indigo-800/60 border border-indigo-700/50 font-headline text-xs font-bold text-white hover:bg-indigo-800 transition-colors shadow-sm cursor-pointer uppercase tracking-wider"
          >
            Full Analytics Report
          </button>
        </div>
      </div>
    </div>
  );
}
