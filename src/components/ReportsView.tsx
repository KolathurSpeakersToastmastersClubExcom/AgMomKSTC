import React, { useState } from "react";
import { 
  Calendar, 
  FileText, 
  Search, 
  Award, 
  ListTodo, 
  Download, 
  CheckCircle2, 
  PlusCircle,
  HelpCircle,
  X,
  Sparkles,
  Copy,
  Printer,
  Check,
  Users
} from "lucide-react";
import { Meeting, Member, RolePerformance } from "../types";

interface ReportsViewProps {
  meetings: Meeting[];
  members: Member[];
  onAddManualReport: (meeting: Meeting) => void;
}

export default function ReportsView({ meetings, members, onAddManualReport }: ReportsViewProps) {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.id || "");
  const [isAddReportOpen, setIsAddReportOpen] = useState(false);

  // Minutes of Meeting (MoM) states
  const [momOpen, setMomOpen] = useState(false);
  const [momMeeting, setMomMeeting] = useState<Meeting | null>(null);
  const [momAttendance, setMomAttendance] = useState<string[]>([]);
  const [momBusinessNotes, setMomBusinessNotes] = useState("");
  const [momTableTopicsNotes, setMomTableTopicsNotes] = useState("");
  const [momBestSpeaker, setMomBestSpeaker] = useState("");
  const [momBestEvaluator, setMomBestEvaluator] = useState("");
  const [momBestTableTopics, setMomBestTableTopics] = useState("");
  const [momNextMeeting, setMomNextMeeting] = useState("");
  const [momCopied, setMomCopied] = useState(false);

  // Form states for manual report logging
  const [reportNo, setReportNo] = useState("");
  const [reportDate, setReportDate] = useState("");
  const [reportTheme, setReportTheme] = useState("");
  const [rolesLogged, setRolesLogged] = useState<{ [role: string]: string }>({
    "Toastmaster": "",
    "General Evaluator": "",
    "Table Topics Master": "",
    "Grammarian": "",
    "Ah-Counter": "",
    "Timer": "",
    "Sergeant At Arms": ""
  });

  const selectedMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  // Calculate global summary matrix: role counts per member
  const getRolePerformanceLedger = () => {
    const ledger: { [memberName: string]: { [roleName: string]: number } } = {};
    
    // Initialize ledger for all club roster members
    members.forEach((member) => {
      ledger[member.name] = {
        "Toastmaster": 0,
        "General Evaluator": 0,
        "Table Topics Master": 0,
        "Grammarian": 0,
        "Ah-Counter": 0,
        "Timer": 0,
        "Sergeant At Arms": 0,
        "Prepared Speaker": 0,
        "Evaluator": 0
      };
    });

    meetings.forEach((meeting) => {
      // Traditional assigned roles
      meeting.roles.forEach((perf) => {
        if (ledger[perf.memberName]) {
          if (ledger[perf.memberName][perf.roleName] !== undefined) {
            ledger[perf.memberName][perf.roleName]++;
          }
        }
      });

      // Prepared Speakers
      meeting.speeches.forEach((speech) => {
        if (ledger[speech.speakerName]) {
          ledger[speech.speakerName]["Prepared Speaker"]++;
        }
        if (ledger[speech.evaluatorName]) {
          ledger[speech.evaluatorName]["Evaluator"]++;
        }
      });
    });

    return ledger;
  };

  const ledger = getRolePerformanceLedger();

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDate) return;

    const compiledRoles: RolePerformance[] = Object.entries(rolesLogged).map(([roleName, memberName]) => ({
      roleName,
      memberName: String(memberName || "Unassigned")
    }));

    const newHistoricalMeeting: Meeting = {
      id: `mt-${Date.now()}`,
      meetingNumber: reportNo || `#${Math.floor(1000 + Math.random() * 9000)}`,
      meetingDate: reportDate,
      sessionTheme: reportTheme || "Ad-Hoc Session",
      wordOfDay: "Eloquence",
      idiom: "Break the ice",
      quote: "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
      roles: compiledRoles,
      speeches: [],
      educationalTitle: "",
      educationalPresenterName: "",
      educationalDuration: 0,
      educationalDescription: "",
      aiEnhanced: false
    };

    onAddManualReport(newHistoricalMeeting);
    setSelectedMeetingId(newHistoricalMeeting.id);
    setIsAddReportOpen(false);
  };

  // Open Minutes of Meeting Tweak Console
  const handleOpenMoM = (meeting: Meeting) => {
    setMomMeeting(meeting);
    
    // Autopopulate attendance from assigned roles & speeches
    const attendees = new Set<string>();
    meeting.roles.forEach((r) => {
      if (r.memberName && r.memberName !== "Unassigned") {
        attendees.add(r.memberName);
      }
    });
    meeting.speeches.forEach((s) => {
      if (s.speakerName) attendees.add(s.speakerName);
      if (s.evaluatorName) attendees.add(s.evaluatorName);
    });
    if (meeting.educationalPresenterName) {
      attendees.add(meeting.educationalPresenterName);
    }

    setMomAttendance(Array.from(attendees));
    setMomBusinessNotes(
      "The Sergeant At Arms called the meeting to order and read the official mission statement. The President welcomed all guests and members. Business section included progress on club educational goals and Contest announcements. Guest introductions was successfully carried out."
    );
    setMomTableTopicsNotes(
      "The Table Topics Master conducted a vibrant impromptu speaking session on today's theme. Members and guests participated with high energy, demonstrating remarkable spontaneous thinking and speaking skills."
    );
    
    setMomBestSpeaker(meeting.speeches[0]?.speakerName || "");
    setMomBestEvaluator(meeting.speeches[0]?.evaluatorName || "");
    
    // Guess Table Topics Best Speaker (choose a speaker or default to a member)
    const ttm = meeting.roles.find(r => r.roleName === "Table Topics Master")?.memberName;
    const candidates = members.filter(m => m.name !== ttm).map(m => m.name);
    setMomBestTableTopics(candidates[0] || "");

    // Guess next week date
    try {
      const d = new Date(meeting.meetingDate);
      d.setDate(d.getDate() + 7);
      setMomNextMeeting(d.toISOString().split("T")[0]);
    } catch {
      setMomNextMeeting("");
    }

    setMomCopied(false);
    setMomOpen(true);
  };

  // Compile digital markdown/plain text for WhatsApp or Email
  const compileDigitalMoM = () => {
    if (!momMeeting) return "";
    return `📌 TOASTMASTERS CLUB - MINUTES OF MEETING (MoM)
==============================================
Meeting Number: ${momMeeting.meetingNumber}
Meeting Date: ${momMeeting.meetingDate}
Theme: "${momMeeting.sessionTheme}"
==============================================

🌟 WORD OF THE DAY:
${momMeeting.wordOfDay || "Fortitude"}

🎭 IDIOM OF THE DAY:
${momMeeting.idiom || "Bite the bullet"}

💬 QUOTE OF THE DAY:
${momMeeting.quote || "N/A"}

👥 OFFICERS & MEMBERS ATTENDANCE:
${momAttendance.length > 0 ? momAttendance.map(name => `• ${name}`).join("\n") : "• None logged"}

📋 MEETING SEGMENTS SUMMARY:

1. Business Segment & Updates:
   ${momBusinessNotes}

2. Table Topics (Impromptu) Session:
   ${momTableTopicsNotes}

3. Prepared Speeches:
${
  momMeeting.speeches.length > 0
    ? momMeeting.speeches.map((s, i) => `   - Speech ${i + 1}: "${s.projectTitle}" by ${s.speakerName} (Evaluated by ${s.evaluatorName})`).join("\n")
    : "   No prepared speeches scheduled for this session."
}

4. Educational Masterclass Segment:
   "${momMeeting.educationalTitle || "Educational Talk"}" presented by ${momMeeting.educationalPresenterName || "Club Mentor"} (${momMeeting.educationalDuration || 15} mins)

🏆 CONGRATULATIONS TO TOADAY'S AWARD WINNERS:
🥇 Best Prepared Speaker: ${momBestSpeaker || "TBD"}
🥇 Best Evaluator: ${momBestEvaluator || "TBD"}
🥇 Best Table Topics Speaker: ${momBestTableTopics || "TBD"}

📅 NEXT MEETING DATE:
Our next session will take place on ${momNextMeeting || "TBD"}.

----------------------------------------------
"We provide supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence and personal growth."
----------------------------------------------`;
  };

  const handleCopyDigitalMoM = () => {
    const text = compileDigitalMoM();
    navigator.clipboard.writeText(text);
    setMomCopied(true);
    setTimeout(() => setMomCopied(false), 2000);
  };

  const getInitials = (name: string) => {
    let clean = name.replace(/^TM\s+/i, "").trim(); // remove TM prefix
    const parts = clean.split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "TM";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts[parts.length - 1][0] || "")).toUpperCase();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Upper Reports Panel Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-3xl font-bold text-primary">Role Performance Ledger</h2>
          <p className="font-body text-sm text-slate-500">
            Analyze historical weekly role counts and view minutes or generate separate reports.
          </p>
        </div>
        <button 
          onClick={() => setIsAddReportOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-primary border border-slate-200 font-headline text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-primary" />
          <span>Log Historical Meeting</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Weekly Reports Selection & Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-[24px] space-y-4">
            <h3 className="font-headline font-bold text-primary text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              Weekly Sessions list
            </h3>
            <p className="font-body text-xs text-slate-500">
              Select a specific week to review its separate officer role performance report.
            </p>

            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {meetings.map((mt) => (
                <button
                  key={mt.id}
                  onClick={() => setSelectedMeetingId(mt.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    selectedMeetingId === mt.id || (meetings[0] && !selectedMeetingId && meetings[0].id === mt.id)
                      ? "bg-primary-container/10 border-primary-container text-primary shadow-sm"
                      : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
                      Meeting {mt.meetingNumber}
                    </span>
                    <h4 className="font-headline font-bold text-sm leading-snug line-clamp-1">{mt.sessionTheme}</h4>
                    <p className="font-sans text-xs text-slate-500">{mt.meetingDate}</p>
                  </div>
                  <FileText className="w-4 h-4 shrink-0 opacity-70 text-primary" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column: Detailed Separate Report */}
        <div className="lg:col-span-8 space-y-6">
          {selectedMeeting ? (
            <div className="glass-panel-heavy rounded-3xl p-6 md:p-8 space-y-6 shadow-md animate-fade-in bg-white border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                <div>
                  <span className="font-mono text-xs font-bold text-secondary uppercase tracking-widest">
                    Separate Meeting Report
                  </span>
                  <h3 className="font-headline font-bold text-primary text-2xl md:text-3xl">
                    Meeting {selectedMeeting.meetingNumber}
                  </h3>
                  <p className="font-sans text-sm text-slate-500 mt-1">
                    Theme: <span className="font-semibold text-primary">"{selectedMeeting.sessionTheme}"</span> | Date: {selectedMeeting.meetingDate}
                  </p>
                </div>
                
                <div className="flex gap-2.5">
                  {/* Minutes of Meeting Option (Option 2) */}
                  <button
                    onClick={() => handleOpenMoM(selectedMeeting)}
                    className="px-4 py-2 bg-secondary text-white font-headline text-xs font-bold rounded-xl hover:opacity-90 shadow flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Generate MoM</span>
                  </button>

                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 font-headline text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    Print
                  </button>
                </div>
              </div>

              {/* Linguistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-primary uppercase">Word of the Day</span>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-medium">{selectedMeeting.wordOfDay || "Eloquence"}</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-primary uppercase">Idiom of the Day</span>
                  <p className="mt-1.5 text-slate-600 leading-relaxed font-medium">{selectedMeeting.idiom || "Break the ice"}</p>
                </div>
              </div>

              {/* Roles Assignments Ledger Grid */}
              <div>
                <h4 className="font-headline font-bold text-primary text-base mb-4 border-l-4 border-secondary pl-3">
                  Officer Role Assignments
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedMeeting.roles.map((perf, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-sm">
                      <div className="space-y-0.5">
                        <span className="font-headline text-sm font-semibold text-primary">{perf.roleName}</span>
                        <p className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">Session Facilitator</p>
                      </div>
                      <span className="font-sans text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                        {perf.memberName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speeches section if any */}
              {selectedMeeting.speeches && selectedMeeting.speeches.length > 0 && (
                <div>
                  <h4 className="font-headline font-bold text-primary text-base mb-4 border-l-4 border-secondary pl-3">
                    Prepared Speakers Ledger
                  </h4>
                  <div className="space-y-3">
                    {selectedMeeting.speeches.map((sp) => (
                      <div key={sp.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                        <div>
                          <h5 className="font-headline text-sm font-bold text-primary">"{sp.projectTitle}"</h5>
                          <p className="font-sans text-xs text-slate-500 mt-0.5">
                            Speaker: <span className="font-semibold text-secondary">{sp.speakerName}</span>
                          </p>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500 font-medium">
                            <span><strong>Pathway:</strong> {sp.pathway || "N/A"}</span>
                            {sp.level && <span><strong>Level:</strong> {sp.level}</span>}
                            {sp.project && <span><strong>Project:</strong> {sp.project}</span>}
                            {sp.mentorName && <span><strong>Mentor:</strong> {sp.mentorName}</span>}
                          </div>
                        </div>
                        <div className="text-right md:border-l border-slate-100 pl-0 md:pl-6 shrink-0 space-y-0.5">
                          <span className="block font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">Evaluator</span>
                          <span className="text-xs font-bold text-primary bg-slate-100 px-3 py-1 rounded-full border border-slate-200">{sp.evaluatorName}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supporting Credits Block */}
              <div className="text-center text-[9px] text-slate-400/80 font-bold tracking-wider uppercase mt-6 pt-4 border-t border-slate-100 shrink-0">
                Supported by TM Dheenadayalan T
              </div>
            </div>
          ) : (
            <div className="glass-panel-heavy rounded-3xl p-16 text-center text-slate-400 space-y-4 border border-dashed border-slate-200 bg-white">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-headline text-lg font-bold">No sessions logged yet</h4>
              <p className="font-body text-xs max-w-sm mx-auto">
                Create a session using the Agenda Builder or Log a Historical Meeting on the left panel to generate separate reports.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Compiled Role Counts Grid with clean initials icons (no unrequested photos) */}
      <section className="pt-8 border-t border-slate-200">
        <h3 className="font-headline text-xl font-bold text-primary mb-6">
          Club Role Ledger (Cumulative Counts)
        </h3>
        <div className="glass-panel rounded-3xl p-6 overflow-x-auto border border-slate-200 shadow-sm bg-white">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-primary font-headline text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-3">
                <th className="py-4 px-4 font-bold">Member Name</th>
                <th className="py-4 px-2 font-bold text-center">Toastmaster</th>
                <th className="py-4 px-2 font-bold text-center">Gen. Eval</th>
                <th className="py-4 px-2 font-bold text-center">Topics Master</th>
                <th className="py-4 px-2 font-bold text-center">Grammarian</th>
                <th className="py-4 px-2 font-bold text-center">Ah-Counter</th>
                <th className="py-4 px-2 font-bold text-center">Timer</th>
                <th className="py-4 px-2 font-bold text-center">Sergeant</th>
                <th className="py-4 px-2 font-bold text-center">Speaker</th>
                <th className="py-4 px-4 font-bold text-center">Evaluator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {members.map((member) => {
                const counts = ledger[member.name] || {
                  "Toastmaster": 0,
                  "General Evaluator": 0,
                  "Table Topics Master": 0,
                  "Grammarian": 0,
                  "Ah-Counter": 0,
                  "Timer": 0,
                  "Sergeant At Arms": 0,
                  "Prepared Speaker": 0,
                  "Evaluator": 0
                };
                return (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-4 font-bold text-primary flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-headline font-black text-white bg-gradient-to-br from-primary to-secondary shadow-sm uppercase shrink-0">
                        {getInitials(member.name)}
                      </div>
                      <span>{member.name}</span>
                    </td>
                    <td className="py-4 px-2 text-center font-mono font-bold text-primary">{counts["Toastmaster"]}</td>
                    <td className="py-4 px-2 text-center font-mono">{counts["General Evaluator"]}</td>
                    <td className="py-4 px-2 text-center font-mono text-secondary">{counts["Table Topics Master"]}</td>
                    <td className="py-4 px-2 text-center font-mono">{counts["Grammarian"]}</td>
                    <td className="py-4 px-2 text-center font-mono">{counts["Ah-Counter"]}</td>
                    <td className="py-4 px-2 text-center font-mono">{counts["Timer"]}</td>
                    <td className="py-4 px-2 text-center font-mono">{counts["Sergeant At Arms"]}</td>
                    <td className="py-4 px-2 text-center font-mono text-tertiary font-extrabold">{counts["Prepared Speaker"]}</td>
                    <td className="py-4 px-4 text-center font-mono text-primary font-extrabold">{counts["Evaluator"]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Manual historical report Modal */}
      {isAddReportOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button 
              onClick={() => setIsAddReportOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-headline text-xl font-bold text-primary mb-6">
              Log Historical Meeting
            </h3>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-semibold text-primary mb-1.5">Meeting No.</label>
                  <input 
                    type="text" 
                    value={reportNo}
                    onChange={(e) => setReportNo(e.target.value)}
                    required
                    className="input-glass w-full px-4 py-2.5 rounded-xl font-sans text-sm text-slate-800" 
                    placeholder="e.g., #1140" 
                  />
                </div>
                <div>
                  <label className="block font-headline text-xs font-semibold text-primary mb-1.5">Meeting Date</label>
                  <input 
                    type="date" 
                    value={reportDate}
                    onChange={(e) => setReportDate(e.target.value)}
                    required
                    className="input-glass w-full px-4 py-2.5 rounded-xl font-sans text-sm text-slate-800" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-1.5">Session Theme</label>
                <input 
                  type="text" 
                  value={reportTheme}
                  onChange={(e) => setReportTheme(e.target.value)}
                  className="input-glass w-full px-4 py-2.5 rounded-xl font-sans text-sm text-slate-800" 
                  placeholder="e.g., Breaking Boundaries" 
                />
              </div>

              {/* Roles Logging dropdowns */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="font-headline text-xs font-bold text-secondary uppercase tracking-widest">
                  Assigned Weekly Roles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(rolesLogged).map((role) => (
                    <div key={role}>
                      <label className="block font-sans text-[10px] font-bold text-slate-500 mb-1">{role}</label>
                      <select
                        value={rolesLogged[role]}
                        onChange={(e) => setRolesLogged({ ...rolesLogged, [role]: e.target.value })}
                        required
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-sans text-xs font-medium text-slate-800"
                      >
                        <option value="">Select...</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsAddReportOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-headline font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-headline font-bold hover:opacity-90 shadow transition-colors cursor-pointer"
                >
                  Add Report Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Option 2: Minutes of Meeting (MoM) Generator Modal */}
      {momOpen && momMeeting && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-3xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-secondary uppercase tracking-wider">Option 2 Console</span>
                <h3 className="font-headline text-lg md:text-xl font-bold text-primary flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
                  Minutes of Meeting (MoM) Generator
                </h3>
                <p className="text-xs text-slate-400">Tweak elements below before sharing digitally or printing.</p>
              </div>
              <button 
                onClick={() => setMomOpen(false)}
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editable Content Fields */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1 text-slate-700">
              {/* Info summary */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Session No.</span>
                  <span className="font-bold text-primary">Meeting {momMeeting.meetingNumber}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Session Date</span>
                  <span className="font-bold text-slate-800">{momMeeting.meetingDate}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Theme</span>
                  <span className="font-bold text-slate-800 truncate block">"{momMeeting.sessionTheme}"</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">District</span>
                  <span className="font-bold text-slate-800">82 - Division E</span>
                </div>
              </div>

              {/* Attendance Checklist */}
              <div>
                <label className="block font-headline text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-secondary" />
                  Officers & Members Attendance (Click to toggle)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  {members.map((m) => {
                    const isChecked = momAttendance.includes(m.name);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setMomAttendance(momAttendance.filter(name => name !== m.name));
                          } else {
                            setMomAttendance([...momAttendance, m.name]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                          isChecked
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate">{m.name}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tweakable Segment notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-bold text-primary mb-1.5">1. Business Segment Notes</label>
                  <textarea
                    rows={4}
                    value={momBusinessNotes}
                    onChange={(e) => setMomBusinessNotes(e.target.value)}
                    className="w-full text-xs font-sans p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>
                <div>
                  <label className="block font-headline text-xs font-bold text-primary mb-1.5">2. Table Topics Segment Notes</label>
                  <textarea
                    rows={4}
                    value={momTableTopicsNotes}
                    onChange={(e) => setMomTableTopicsNotes(e.target.value)}
                    className="w-full text-xs font-sans p-3 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>
              </div>

              {/* Awards Selector */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="font-headline text-xs font-bold text-secondary uppercase tracking-widest mb-3">
                  Today's Award Winners (Tweak Winners)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] font-bold text-slate-500 mb-1">🥇 Best Prepared Speaker</label>
                    <select
                      value={momBestSpeaker}
                      onChange={(e) => setMomBestSpeaker(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-sans text-xs text-slate-800"
                    >
                      <option value="">Select winner...</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] font-bold text-slate-500 mb-1">🥇 Best Evaluator</label>
                    <select
                      value={momBestEvaluator}
                      onChange={(e) => setMomBestEvaluator(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-sans text-xs text-slate-800"
                    >
                      <option value="">Select winner...</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-sans text-[10px] font-bold text-slate-500 mb-1">🥇 Best Table Topics Speaker</label>
                    <select
                      value={momBestTableTopics}
                      onChange={(e) => setMomBestTableTopics(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-sans text-xs text-slate-800"
                    >
                      <option value="">Select winner...</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Next Meeting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-headline text-xs font-bold text-primary mb-1">Next Meeting Date Plan</label>
                  <input
                    type="date"
                    value={momNextMeeting}
                    onChange={(e) => setMomNextMeeting(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-sans text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Supporting Credits Block */}
              <div className="text-center text-[9px] text-slate-400/80 font-bold tracking-wider uppercase mt-6 pt-4 border-t border-slate-100 shrink-0">
                Supported by TM Dheenadayalan T
              </div>
            </div>

            {/* Action Buttons: Instantly Share digitally or print out form */}
            <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={handleCopyDigitalMoM}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-headline text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
              >
                {momCopied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Copied instantly! Ready to share</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-300" />
                    <span>Copy MoM for Digital Share (WhatsApp)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-white font-headline text-xs font-bold rounded-xl shadow hover:opacity-90 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print MoM Document</span>
              </button>

              <button
                type="button"
                onClick={() => setMomOpen(false)}
                className="px-5 py-3 border border-slate-200 rounded-xl text-xs font-headline font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-slate-700"
              >
                Close Console
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
