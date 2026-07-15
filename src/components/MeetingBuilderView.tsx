import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  Info, 
  UserCheck, 
  HelpCircle,
  Clock,
  Printer,
  Save
} from "lucide-react";
import { Meeting, Member, Speech, RolePerformance } from "../types";
import MeetingPrint from "./MeetingPrint";
import PrintToolbar from "./PrintToolbar";

interface MeetingBuilderViewProps {
  members: Member[];
  logoUrl?: string | null;
  onSaveMeeting: (meeting: Meeting) => void;
  onCancel: () => void;
}

const parseWord = (str: string) => {
  if (!str) return { name: "Dazzling", type: "(V)", meaning: "Extremely bright, impressive or skillful. to impress somebody very much", example: "- He had been dazzled by her beauty\n- He shielded his eyes against the dazzling declining sun" };
  const parts = str.split(" | ");
  if (parts.length < 3) {
    const dashParts = str.split(" - ");
    if (dashParts.length >= 2) {
      return { name: dashParts[0].trim(), type: "", meaning: dashParts.slice(1).join(" - ").trim(), example: "" };
    }
    return { name: str, type: "", meaning: "", example: "" };
  }
  const namePart = parts[0];
  const match = namePart.match(/^(.*?)\s*(\(.*?\))?$/);
  const name = match ? match[1].trim() : namePart;
  const type = match && match[2] ? match[2].trim() : "";
  return { name, type, meaning: parts[1], example: parts[2] };
};

const parseIdiom = (str: string) => {
  if (!str) return { name: "Smash Hit", type: "(I)", meaning: "A big success; something that is overwhelmingly successful, popular, or well-received by the public", example: "- The studio's new superhero movie was a smash hit at the box office\n- Their debut album became a smash hit and topped the global charts for weeks" };
  const parts = str.split(" | ");
  if (parts.length < 3) {
    const dashParts = str.split(" - ");
    if (dashParts.length >= 2) {
      return { name: dashParts[0].trim(), type: "", meaning: dashParts.slice(1).join(" - ").trim(), example: "" };
    }
    return { name: str, type: "", meaning: "", example: "" };
  }
  const namePart = parts[0];
  const match = namePart.match(/^(.*?)\s*(\(.*?\))?$/);
  const name = match ? match[1].trim() : namePart;
  const type = match && match[2] ? match[2].trim() : "";
  return { name, type, meaning: parts[1], example: parts[2] };
};

export default function MeetingBuilderView({ members, logoUrl, onSaveMeeting, onCancel }: MeetingBuilderViewProps) {
  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string>("agenda");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  // Transient meeting builder state
  const [meetingNumber, setMeetingNumber] = useState("");
  const [meetingDate, setMeetingDate] = useState(() => {
    // Default to the next Sunday starting from today
    const current = new Date();
    const day = current.getDay();
    const diff = (7 - day) % 7;
    const nextSunday = new Date(current);
    nextSunday.setDate(current.getDate() + diff);
    const yyyy = nextSunday.getFullYear();
    const mm = String(nextSunday.getMonth() + 1).padStart(2, '0');
    const dd = String(nextSunday.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [sessionTheme, setSessionTheme] = useState("");
  
  // Custom Sunday Calendar active month state
  const [currentCalDate, setCurrentCalDate] = useState<Date>(() => {
    const current = new Date();
    const day = current.getDay();
    const diff = (7 - day) % 7;
    const nextSunday = new Date(current);
    nextSunday.setDate(current.getDate() + diff);
    return nextSunday;
  });

  // Advanced Linguistics Form Fields (from Manual Agenda screenshot)
  const [wordName, setWordName] = useState("Dazzling");
  const [wordType, setWordType] = useState("(V)");
  const [wordMeaning, setWordMeaning] = useState("Extremely bright, impressive or skillful. to impress somebody very much");
  const [wordExample, setWordExample] = useState("- He had been dazzled by her beauty\n- He shielded his eyes against the dazzling declining sun");

  const [idiomName, setIdiomName] = useState("Smash Hit");
  const [idiomType, setIdiomType] = useState("(I)");
  const [idiomMeaning, setIdiomMeaning] = useState("A big success; something that is overwhelmingly successful, popular, or well-received by the public");
  const [idiomExample, setIdiomExample] = useState("- The studio's new superhero movie was a smash hit at the box office\n- Their debut album became a smash hit and topped the global charts for weeks");

  // Officer assignments
  const [assignments, setAssignments] = useState<{ [role: string]: string }>({
    "Toastmaster": "",
    "General Evaluator": "",
    "Table Topics Master": "",
    "Grammarian": "",
    "Ah-Counter": "",
    "Timer": "",
    "Sergeant At Arms": ""
  });

  // Generate list of upcoming Sundays
  const getUpcomingSundaysList = (count = 5) => {
    const list: { dateStr: string; label: string; shortLabel: string }[] = [];
    const current = new Date();
    const day = current.getDay();
    const diff = (7 - day) % 7;
    const nextSunday = new Date(current);
    nextSunday.setDate(current.getDate() + diff);
    
    for (let i = 0; i < count; i++) {
      const d = new Date(nextSunday);
      d.setDate(nextSunday.getDate() + i * 7);
      
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      
      const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
      const shortLabel = d.toLocaleDateString("en-US", options);
      
      const fullOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
      const label = d.toLocaleDateString("en-US", fullOptions);
      
      list.push({ dateStr, label, shortLabel });
    }
    return list;
  };

  const formatFriendlyDate = (dateStr: string) => {
    if (!dateStr) return "None selected";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return d.toLocaleDateString('en-US', options);
  };

  // Prepared speeches
  const [speeches, setSpeeches] = useState<Speech[]>([
    {
      id: "sp-1",
      speakerName: "TM Simon Bright",
      projectTitle: "Navigating Uncharted Waters",
      pathway: "L2: Dynamic Leadership",
      timeMinMax: "5:00 - 7:00",
      evaluatorName: "TM Rajesh Kumar"
    }
  ]);

  // Educational session
  const [eduTitle, setEduTitle] = useState("");
  const [eduPresenter, setEduPresenter] = useState("");
  const [eduDuration, setEduDuration] = useState(15);
  const [eduDescription, setEduDescription] = useState("");
  const [aiEnhanced, setAiEnhanced] = useState(false);

  // Use server-side Gemini AI to enrich the linguistics based on the selected meeting theme
  const handleAIEnrichTheme = async () => {
    if (!sessionTheme) {
      alert("Please enter a Session Theme first to let Gemini design around it!");
      return;
    }
    setLoadingAI(true);
    try {
      const response = await fetch("/api/ai/theme-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: sessionTheme })
      });
      const data = await response.json();
      if (data.wordOfDay) {
        const parts = data.wordOfDay.split(" - ");
        if (parts.length >= 2) {
          setWordName(parts[0].trim());
          setWordType("(V)");
          setWordMeaning(parts.slice(1).join(" - ").trim());
        } else {
          setWordName(data.wordOfDay.trim());
          setWordType("(V)");
          setWordMeaning("");
        }
        setWordExample("");
      }
      if (data.idiom) {
        const parts = data.idiom.split(" - ");
        if (parts.length >= 2) {
          setIdiomName(parts[0].trim());
          setIdiomType("(I)");
          setIdiomMeaning(parts.slice(1).join(" - ").trim());
        } else {
          setIdiomName(data.idiom.trim());
          setIdiomType("(I)");
          setIdiomMeaning("");
        }
        setIdiomExample("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  // Use server-side Gemini AI to generate an abstract for the educational session
  const handleAIEduAbstract = async () => {
    if (!eduTitle) {
      alert("Please enter an Educational Session Title first!");
      return;
    }
    setLoadingAI(true);
    try {
      const response = await fetch("/api/ai/educational-abstract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: eduTitle })
      });
      const data = await response.json();
      if (data.description) {
        setEduDescription(data.description);
        setAiEnhanced(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  // Add speech card helper
  const addSpeech = () => {
    const newId = `sp-${Date.now()}`;
    setSpeeches([
      ...speeches,
      {
        id: newId,
        speakerName: "",
        projectTitle: "",
        pathway: "",
        level: "",
        project: "",
        timeMinMax: "5:00 - 7:00",
        evaluatorName: "",
        mentorName: ""
      }
    ]);
  };

  // Delete speech card helper
  const deleteSpeech = (id: string) => {
    setSpeeches(speeches.filter((s) => s.id !== id));
  };

  // Update specific speech card fields
  const updateSpeech = (id: string, field: keyof Speech, value: string) => {
    setSpeeches(
      speeches.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Complete & compile the full Meeting structure
  const handleSave = () => {
    const rolePerformances: RolePerformance[] = Object.entries(assignments).map(
      ([roleName, memberName]) => ({
        roleName,
        memberName: String(memberName || "Unassigned")
      })
    );

    const compiledMeeting: Meeting = {
      id: `mt-${Date.now()}`,
      meetingNumber: meetingNumber || `#${Math.floor(1000 + Math.random() * 9000)}`,
      meetingDate: meetingDate || new Date().toISOString().split("T")[0],
      sessionTheme: sessionTheme || "Inspiring Leaders",
      wordOfDay: `${wordName}${wordType ? ' ' + wordType : ''} | ${wordMeaning} | ${wordExample}`,
      idiom: `${idiomName}${idiomType ? ' ' + idiomType : ''} | ${idiomMeaning} | ${idiomExample}`,
      quote: `${wordName}${wordType ? ' ' + wordType : ''} & ${idiomName}${idiomType ? ' ' + idiomType : ''}`,
      roles: rolePerformances,
      speeches: speeches.filter(s => s.speakerName), // Save only assigned speeches
      educationalTitle: eduTitle || "Educational Talk",
      educationalPresenterName: eduPresenter || "Club Mentor",
      educationalDuration: eduDuration || 15,
      educationalDescription: eduDescription || "A valuable learning moment for the club.",
      aiEnhanced
    };

    onSaveMeeting(compiledMeeting);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Step Progress Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-secondary font-semibold">
            Step {step} of 5
          </span>
          <h2 className="font-headline text-3xl font-bold text-primary">
            {step === 1 && "Initialize Meeting"}
            {step === 2 && "Officer Assignments"}
            {step === 3 && "Prepared Speeches"}
            {step === 4 && "Educational Session"}
            {step === 5 && "Preview Agenda"}
          </h2>
          <p className="text-on-surface-variant text-sm font-body">
            {step === 1 && "Define the core theme and linguistics for the session."}
            {step === 2 && "Select members to fulfill the standard weekly meeting roles."}
            {step === 3 && "Manage prepared pathways speeches and evaluations."}
            {step === 4 && "Define the focus of your meeting's learning segment."}
            {step === 5 && "Review, print, or save the final generated agenda."}
          </p>
        </div>

        {/* Multi-step stepper indicators */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => step > s && setStep(s)}
                className={`w-8 h-8 rounded-full flex items-center justify-center font-headline text-xs font-semibold border transition-all ${
                  step === s 
                    ? "bg-primary text-on-primary border-primary scale-110 shadow-lg ring-2 ring-primary/20" 
                    : step > s 
                      ? "bg-primary-container text-on-primary-container border-primary-container" 
                      : "bg-surface-container text-outline border-outline-variant/30"
                }`}
              >
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </button>
              {s < 5 && (
                <div className={`h-0.5 w-4 md:w-6 ${step > s ? "bg-primary-container" : "bg-outline-variant/30"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Meeting Info & Theme */}
      {step === 1 && (
        <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Meeting Number</label>
                <input 
                  type="text" 
                  value={meetingNumber} 
                  onChange={(e) => setMeetingNumber(e.target.value)}
                  className="input-glass w-full px-4 py-3 rounded-xl font-sans text-sm text-on-surface" 
                  placeholder="e.g., #1245" 
                />
              </div>

              {/* Custom Sunday-Only Interactive Calendar */}
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block font-headline text-xs font-semibold text-primary">
                    Sunday-Only Club Calendar
                  </label>
                  <span className="text-2xs font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded-full">
                    Sundays Only
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-headline text-xs font-bold text-slate-800 capitalize">
                    {currentCalDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <div className="flex gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => {
                        const prev = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() - 1, 1);
                        setCurrentCalDate(prev);
                      }}
                      className="p-1 px-2 rounded-lg hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold"
                    >
                      &larr; Prev
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        const next = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() + 1, 1);
                        setCurrentCalDate(next);
                      }}
                      className="p-1 px-2 rounded-lg hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold"
                    >
                      Next &rarr;
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center font-bold text-3xs text-slate-400 mb-1">
                  <div className="text-secondary">Sun</div>
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                </div>

                <div className="grid grid-cols-7 gap-1 p-1 bg-slate-50/50 rounded-xl border border-slate-100/80">
                  {(() => {
                    const year = currentCalDate.getFullYear();
                    const month = currentCalDate.getMonth();
                    const totalDays = new Date(year, month + 1, 0).getDate();
                    const firstDayIndex = new Date(year, month, 1).getDay();

                    const cells = [];
                    // Padding cells
                    for (let i = 0; i < firstDayIndex; i++) {
                      cells.push({ dayNum: null, isSunday: false, dateStr: "" });
                    }
                    // Days of month
                    for (let d = 1; d <= totalDays; d++) {
                      const dateObj = new Date(year, month, d);
                      const isSunday = dateObj.getDay() === 0;
                      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                      cells.push({ dayNum: d, isSunday, dateStr });
                    }

                    return cells.map((cell, idx) => {
                      if (cell.dayNum === null) {
                        return <div key={`pad-${idx}`} className="h-8" />;
                      }

                      const isSelected = meetingDate === cell.dateStr;

                      if (cell.isSunday) {
                        return (
                          <button
                            key={`day-${cell.dayNum}`}
                            type="button"
                            onClick={() => setMeetingDate(cell.dateStr)}
                            className={`h-8 w-8 mx-auto rounded-full font-sans text-xs font-bold transition-all flex items-center justify-center ${
                              isSelected 
                                ? "bg-secondary text-white shadow scale-110" 
                                : "text-secondary hover:bg-secondary/10 hover:text-secondary-container"
                            }`}
                          >
                            {cell.dayNum}
                          </button>
                        );
                      }

                      return (
                        <div 
                          key={`day-${cell.dayNum}`}
                          className="h-8 w-8 mx-auto flex items-center justify-center font-sans text-xs text-slate-300 opacity-40 select-none cursor-not-allowed font-normal"
                        >
                          {cell.dayNum}
                        </div>
                      );
                    });
                  })()}
                </div>

                {/* Quick Select Sundays List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="block font-sans text-3xs font-bold text-slate-400 uppercase tracking-widest">
                    Quick Select Sunday
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {getUpcomingSundaysList(5).map((item) => {
                      const isSelected = meetingDate === item.dateStr;
                      return (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => {
                            setMeetingDate(item.dateStr);
                            setCurrentCalDate(new Date(item.dateStr));
                          }}
                          className={`px-3 py-1.5 rounded-full text-3xs font-bold transition-all ${
                            isSelected
                              ? "bg-secondary text-white shadow-sm"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {item.shortLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-secondary/5 border border-secondary/10 p-3 rounded-xl text-center">
                  <span className="block font-sans text-3xs font-bold text-slate-400 uppercase tracking-wider">
                    Selected Meeting Date
                  </span>
                  <span className="font-headline text-sm font-bold text-secondary">
                    {formatFriendlyDate(meetingDate)}
                  </span>
                  <span className="block text-3xs text-slate-500 font-sans mt-0.5 font-medium">
                    Sunday timings: 10:30 AM to 12:30 PM
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Session Theme</label>
                <input 
                  type="text" 
                  value={sessionTheme} 
                  onChange={(e) => setSessionTheme(e.target.value)}
                  className="input-glass w-full px-4 py-3 rounded-xl font-sans text-sm text-on-surface" 
                  placeholder="e.g., The Future of Communication" 
                />
              </div>
            </div>

            {/* Linguistics Group */}
            <div className="space-y-6 bg-primary/[0.02] p-6 rounded-2xl border border-primary/5 relative self-start">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-primary font-sans text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  <span>Language Enrichment</span>
                </div>
                <button
                  type="button"
                  onClick={handleAIEnrichTheme}
                  disabled={loadingAI}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-primary hover:bg-primary/10 text-xs font-headline font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${loadingAI ? 'animate-spin' : ''}`} />
                  AI Auto-Fill
                </button>
              </div>

              {/* Word of the Day structured fields */}
              <div className="space-y-3 p-4 bg-white/40 border border-slate-100 rounded-xl">
                <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  Word of the Day
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block font-sans text-3xs text-slate-500 font-bold mb-1">Word</label>
                    <input 
                      type="text" 
                      value={wordName} 
                      onChange={(e) => setWordName(e.target.value)}
                      className="input-glass w-full px-3 py-1.5 rounded-lg font-sans text-xs text-on-surface" 
                      placeholder="e.g., Dazzling" 
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-3xs text-slate-500 font-bold mb-1">Part of Speech</label>
                    <input 
                      type="text" 
                      value={wordType} 
                      onChange={(e) => setWordType(e.target.value)}
                      className="input-glass w-full px-3 py-1.5 rounded-lg font-sans text-xs text-on-surface text-center" 
                      placeholder="e.g., (V)" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-3xs text-slate-500 font-bold mb-1">Meaning</label>
                  <input 
                    type="text" 
                    value={wordMeaning} 
                    onChange={(e) => setWordMeaning(e.target.value)}
                    className="input-glass w-full px-3 py-1.5 rounded-lg font-sans text-xs text-on-surface" 
                    placeholder="e.g., Extremely bright, impressive..." 
                  />
                </div>
                <div>
                  <label className="block font-sans text-3xs text-slate-500 font-bold mb-1">Example Sentences</label>
                  <textarea 
                    value={wordExample} 
                    onChange={(e) => setWordExample(e.target.value)}
                    className="input-glass w-full px-3 py-1.5 rounded-lg font-sans text-xs text-on-surface resize-none" 
                    placeholder="e.g., - He was dazzled by her beauty." 
                    rows={2}
                  />
                </div>
              </div>

              {/* Idiom of the Day structured fields */}
              <div className="space-y-3 p-4 bg-white/40 border border-slate-100 rounded-xl">
                <div className="text-2xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-1">
                  Idiom of the Day
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block font-sans text-3xs text-slate-500 font-bold mb-1">Idiom</label>
                    <input 
                      type="text" 
                      value={idiomName} 
                      onChange={(e) => setIdiomName(e.target.value)}
                      className="input-glass w-full px-3 py-1.5 rounded-lg font-sans text-xs text-on-surface" 
                      placeholder="e.g., Smash Hit" 
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-3xs text-slate-500 font-bold mb-1">Part/Code</label>
                    <input 
                      type="text" 
                      value={idiomType} 
                      onChange={(e) => setIdiomType(e.target.value)}
                      className="input-glass w-full px-3 py-1.5 rounded-lg font-sans text-xs text-on-surface text-center" 
                      placeholder="e.g., (I)" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-3xs text-slate-500 font-bold mb-1">Meaning</label>
                  <input 
                    type="text" 
                    value={idiomMeaning} 
                    onChange={(e) => setIdiomMeaning(e.target.value)}
                    className="input-glass w-full px-3 py-1.5 rounded-lg font-sans text-xs text-on-surface" 
                    placeholder="e.g., A big success..." 
                  />
                </div>
                <div>
                  <label className="block font-sans text-3xs text-slate-500 font-bold mb-1">Example Sentences</label>
                  <textarea 
                    value={idiomExample} 
                    onChange={(e) => setIdiomExample(e.target.value)}
                    className="input-glass w-full px-3 py-1.5 rounded-lg font-sans text-xs text-on-surface resize-none" 
                    placeholder="e.g., - The book was a smash hit." 
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary-fixed-dim/30 text-on-secondary-fixed-variant">
            <Info className="w-5 h-5 shrink-0" />
            <p className="font-body text-xs md:text-sm italic">
              Pro-tip: Enforcing Sunday meetings ensures consistency for member attendance. This Sunday Calendar simplifies tracking schedules.
            </p>
          </div>
        </div>
      )}

      {/* STEP 2: Officer Assignments */}
      {step === 2 && (
        <div className="glass-panel rounded-3xl p-6 md:p-10 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(assignments).map((role) => (
              <div key={role} className="glass-card rounded-xl p-5 flex flex-col gap-4 border border-outline-variant/20 hover:border-primary/20 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-headline font-bold text-primary text-base">{role}</h4>
                    <span className="font-sans text-xs text-on-surface-variant/70">
                      {role === "Toastmaster" && "Master of Ceremonies"}
                      {role === "General Evaluator" && "Meeting Quality Lead"}
                      {role === "Table Topics Master" && "Impromptu Facilitator"}
                      {role === "Grammarian" && "Language Monitor"}
                      {role === "Ah-Counter" && "Filler Word Tracker"}
                      {role === "Timer" && "Time Management Coordinator"}
                      {role === "Sergeant At Arms" && "Logistics & Atmosphere Guard"}
                    </span>
                  </div>
                  {role === "Toastmaster" && (
                    <span className="p-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-2xs font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-secondary" />
                      AI Recommended
                    </span>
                  )}
                </div>

                <div className="relative">
                  <select
                    value={assignments[role]}
                    onChange={(e) => setAssignments({ ...assignments, [role]: e.target.value })}
                    className="w-full bg-white/60 border border-outline-variant rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-sans text-sm text-primary font-medium"
                  >
                    <option value="">Select an assigned officer...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Prepared Speeches */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {speeches.map((speech, index) => (
              <div key={speech.id} className="glass-card rounded-2xl p-6 relative overflow-hidden border border-outline-variant/20">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-container" />
                
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-headline text-lg font-bold text-primary">Speech {index + 1}</h3>
                  <button 
                    onClick={() => deleteSpeech(speech.id)}
                    className="text-error hover:bg-error-container/20 p-2 rounded-full transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block font-sans text-2xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 ml-1">Speaker Name</label>
                      <select
                        value={speech.speakerName}
                        onChange={(e) => updateSpeech(speech.id, "speakerName", e.target.value)}
                        className="w-full bg-white/60 border border-outline-variant rounded-lg px-3 py-2.5 font-sans text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      >
                        <option value="">Select speaker...</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.name}>{m.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-sans text-2xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 ml-1">Speech Title</label>
                      <input 
                        type="text" 
                        value={speech.projectTitle}
                        onChange={(e) => updateSpeech(speech.id, "projectTitle", e.target.value)}
                        className="w-full bg-white/60 border border-outline-variant rounded-lg px-3 py-2 font-sans text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="e.g. Discovering My Voice"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-2xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 ml-1">Pathway</label>
                      <input 
                        type="text" 
                        value={speech.pathway}
                        onChange={(e) => updateSpeech(speech.id, "pathway", e.target.value)}
                        className="w-full bg-white/60 border border-outline-variant rounded-lg px-3 py-2 font-sans text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="e.g. Presentation Mastery"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-2xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 ml-1">Level</label>
                        <select
                          value={speech.level || ""}
                          onChange={(e) => updateSpeech(speech.id, "level", e.target.value)}
                          className="w-full bg-white/60 border border-outline-variant rounded-lg px-3 py-2.5 font-sans text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        >
                          <option value="">Select...</option>
                          <option value="Level 1">Level 1</option>
                          <option value="Level 2">Level 2</option>
                          <option value="Level 3">Level 3</option>
                          <option value="Level 4">Level 4</option>
                          <option value="Level 5">Level 5</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-sans text-2xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 ml-1">Project</label>
                        <input 
                          type="text" 
                          value={speech.project || ""}
                          onChange={(e) => updateSpeech(speech.id, "project", e.target.value)}
                          className="w-full bg-white/60 border border-outline-variant rounded-lg px-3 py-2 font-sans text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="e.g. Ice Breaker"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-2xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 ml-1">Mentor Name</label>
                      <input 
                        type="text" 
                        value={speech.mentorName || ""}
                        onChange={(e) => updateSpeech(speech.id, "mentorName", e.target.value)}
                        className="w-full bg-white/60 border border-outline-variant rounded-lg px-3 py-2 font-sans text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        placeholder="e.g. TM Ravishankar"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block font-sans text-2xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 ml-1">Timing Bounds</label>
                        <input 
                          type="text" 
                          value={speech.timeMinMax}
                          onChange={(e) => updateSpeech(speech.id, "timeMinMax", e.target.value)}
                          className="w-full bg-white/60 border border-outline-variant rounded-lg px-3 py-2 font-sans text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                          placeholder="e.g. 5:00 - 7:00"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/40">
                  <label className="block font-sans text-2xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 ml-1">Evaluator</label>
                  <select
                    value={speech.evaluatorName}
                    onChange={(e) => updateSpeech(speech.id, "evaluatorName", e.target.value)}
                    className="w-full bg-white/60 border border-outline-variant rounded-lg px-3 py-2.5 font-sans text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:outline-none"
                  >
                    <option value="">Select evaluator...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}

            {/* Add Speech Placeholder */}
            <button 
              onClick={addSpeech}
              className="group glass-card rounded-2xl border-2 border-dashed border-primary/20 p-8 flex flex-col items-center justify-center min-h-[260px] hover:border-primary/40 hover:bg-white/50 transition-all cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-primary-container/10 group-hover:bg-primary text-primary group-hover:text-on-primary flex items-center justify-center transition-all mb-4 shadow-inner">
                <Plus className="w-6 h-6" />
              </div>
              <h4 className="font-headline text-lg font-bold text-primary">Add Speech</h4>
              <p className="font-body text-xs text-on-surface-variant max-w-[200px] text-center mt-1">
                Increase the meeting duration by adding more prepared speakers.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Educational Session */}
      {step === 4 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fade-in">
          <div className="md:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-secondary font-semibold">Special Focus</span>
              <h3 className="font-headline text-2xl md:text-3.5xl font-bold text-primary leading-tight">Educational Highlight</h3>
              <p className="font-body text-sm md:text-base text-on-surface-variant">
                Every agenda features a masterclass. Define this weekly session to elevate the learning curve of your attendees.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-3 border border-white/30">
              <HelpCircle className="w-12 h-12 text-primary-container" />
              <h4 className="font-headline font-bold text-primary">Need Inspiration?</h4>
              <p className="font-body text-xs text-on-surface-variant max-w-[200px]">
                Simply type a Topic/Title and use the Gemini summary trigger to generate a custom abstract.
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="glass-panel p-6 md:p-8 rounded-3xl space-y-6">
              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Session Title</label>
                <input 
                  type="text" 
                  value={eduTitle} 
                  onChange={(e) => setEduTitle(e.target.value)}
                  className="input-glass w-full px-4 py-3 rounded-xl font-sans text-sm text-on-surface" 
                  placeholder="e.g., Mastering Body Language" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Presenter</label>
                  <select
                    value={eduPresenter}
                    onChange={(e) => setEduPresenter(e.target.value)}
                    className="w-full bg-white/60 border border-outline-variant rounded-xl px-4 py-3 font-sans text-sm font-medium"
                  >
                    <option value="">Select presenter...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Duration (min)</label>
                  <input 
                    type="number" 
                    value={eduDuration} 
                    onChange={(e) => setEduDuration(Number(e.target.value))}
                    className="input-glass w-full px-4 py-3 rounded-xl font-sans text-sm text-on-surface" 
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Brief Description</label>
                <textarea 
                  value={eduDescription} 
                  onChange={(e) => setEduDescription(e.target.value)}
                  className="input-glass w-full p-4 rounded-xl font-sans text-sm text-on-surface resize-none" 
                  placeholder="Summarize the learning outcomes..."
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary-container/5 border border-primary-container/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-inner">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h5 className="font-headline text-xs font-bold text-primary">AI-Generated Summary</h5>
                    <p className="text-3xs text-on-surface-variant">Generates refined abstracts with Gemini</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAIEduAbstract}
                  disabled={loadingAI}
                  className="flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-white text-xs font-headline font-semibold hover:bg-primary-container transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ask Gemini
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Preview Printable Agenda & Promotional Assets */}
      {step === 5 && (
        <div className={`space-y-6 animate-fade-in ${isFullScreen ? 'fixed inset-0 z-40 overflow-y-auto bg-[#0B1528] p-6 md:p-10' : ''}`}>
          <div className="flex items-center justify-between no-print">
            <div>
              <h2 className="font-headline text-lg font-bold text-white">Preview &amp; Share Assets</h2>
              <p className="text-xs text-on-surface-variant mt-1">Pruned print engine: perfect A4 single-page, digital flyers, certificates, and slide deck assets.</p>
            </div>
            {isFullScreen && (
              <button
                onClick={() => setIsFullScreen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
              >
                Exit Full Screen
              </button>
            )}
          </div>

          <PrintToolbar
            meetingNumber={meetingNumber}
            meetingDate={meetingDate}
            sessionTheme={sessionTheme}
            assignments={assignments}
            speeches={speeches}
            wordName={wordName}
            wordMeaning={wordMeaning}
            idiomName={idiomName}
            idiomMeaning={idiomMeaning}
            onPrint={() => window.print()}
            selectedAsset={selectedAsset}
            setSelectedAsset={setSelectedAsset}
            isFullScreen={isFullScreen}
            onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
          />

          {/* Interactive Screen Preview Container */}
          <div className="flex justify-center items-center py-6 bg-slate-900/40 rounded-3xl border border-white/5 shadow-inner overflow-x-auto min-h-[500px]">
            <div className="scale-75 sm:scale-90 md:scale-100 origin-center transition-all">
              <MeetingPrint
                logoUrl={logoUrl}
                meetingNumber={meetingNumber}
                meetingDate={meetingDate}
                sessionTheme={sessionTheme}
                assignments={assignments}
                speeches={speeches}
                eduTitle={eduTitle}
                eduDuration={eduDuration}
                eduDescription={eduDescription}
                eduPresenter={eduPresenter}
                wordName={wordName}
                wordType={wordType}
                wordMeaning={wordMeaning}
                wordExample={wordExample}
                idiomName={idiomName}
                idiomType={idiomType}
                idiomMeaning={idiomMeaning}
                idiomExample={idiomExample}
                selectedAsset={selectedAsset}
              />
            </div>
          </div>

          {/* High-fidelity Portal element - directly rendered under body, hidden on screen, printed with perfect A4 style */}
          {createPortal(
            <div id="agenda-print-wrapper" className="hidden">
              <MeetingPrint
                logoUrl={logoUrl}
                meetingNumber={meetingNumber}
                meetingDate={meetingDate}
                sessionTheme={sessionTheme}
                assignments={assignments}
                speeches={speeches}
                eduTitle={eduTitle}
                eduDuration={eduDuration}
                eduDescription={eduDescription}
                eduPresenter={eduPresenter}
                wordName={wordName}
                wordType={wordType}
                wordMeaning={wordMeaning}
                wordExample={wordExample}
                idiomName={idiomName}
                idiomType={idiomType}
                idiomMeaning={idiomMeaning}
                idiomExample={idiomExample}
                selectedAsset={selectedAsset}
              />
            </div>,
            document.body
          )}
        </div>
      )}

      {/* Persistent Bottom Actions Bar */}
      <div className="flex items-center justify-between border-t border-white/20 pt-6">
        <button
          onClick={() => {
            if (step === 1) onCancel();
            else setStep(step - 1);
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-headline text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          {step === 1 ? "Cancel Builder" : "Back"}
        </button>

        {step < 5 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 px-8 py-3.5 bg-primary-container text-white font-headline text-sm font-semibold rounded-full shadow-lg hover:bg-primary active:scale-95 transition-all cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-3 border border-outline-variant bg-white text-primary font-headline text-xs font-semibold rounded-full shadow hover:bg-surface-container-low transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Agenda</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3.5 bg-secondary text-white font-headline text-xs font-bold rounded-full shadow-lg hover:opacity-90 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Log Meeting</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
