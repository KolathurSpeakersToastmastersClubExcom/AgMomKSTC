import React from "react";
import { 
  Award, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Smile, 
  BookOpen, 
  Quote, 
  Volume2, 
  Flag,
  Globe,
  Compass,
  Star
} from "lucide-react";
import { Speech } from "../types";
import "./Print.css";

interface MeetingPrintProps {
  logoUrl?: string | null;
  meetingNumber: string;
  meetingDate: string;
  sessionTheme: string;
  assignments: { [role: string]: string };
  speeches: Speech[];
  eduTitle?: string;
  eduDuration?: number;
  eduDescription?: string;
  eduPresenter?: string;
  wordName?: string;
  wordType?: string;
  wordMeaning?: string;
  wordExample?: string;
  idiomName?: string;
  idiomType?: string;
  idiomMeaning?: string;
  idiomExample?: string;
  selectedAsset: string; // "agenda" | "banner" | "theme" | "word" | "idiom" | "quote" | "speakerCert" | "participationCert" | "whatsapp" | "instagram" | "facebook" | "linkedin" | "email"
  customQuote?: string;
  customQuoteAuthor?: string;
}

export default function MeetingPrint({
  logoUrl,
  meetingNumber,
  meetingDate,
  sessionTheme,
  assignments,
  speeches,
  eduTitle,
  eduDuration = 15,
  eduDescription,
  eduPresenter,
  wordName = "Eloquence",
  wordType = "(N)",
  wordMeaning = "Fluent or persuasive speaking or writing",
  wordExample = "- A speaker of a grand, natural eloquence\n- Her eloquence was legendary",
  idiomName = "Smash Hit",
  idiomType = "(I)",
  idiomMeaning = "A very successful song, movie, show, etc.",
  idiomExample = "- The new play was a smash hit on Broadway\n- The album became a smash hit",
  selectedAsset,
  customQuote = "The only way to do great work is to love what you do.",
  customQuoteAuthor = "Steve Jobs"
}: MeetingPrintProps) {

  const formattedDate = () => {
    if (!meetingDate) return "Sunday, TBD";
    const d = new Date(meetingDate);
    if (isNaN(d.getTime())) return meetingDate;
    return d.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getQRUrl = (data: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;
  };

  const mapUrl = "https://maps.google.com/?q=13.140131,80.202820";
  const onlineMeetingUrl = "https://zoom.us/j/kstc-online-meeting"; // placeholder for online meeting QR

  // Helper to strip bullet dash from examples
  const formatExampleText = (text?: string) => {
    if (!text) return "";
    return text.split("\n").map(line => line.trim().startsWith("-") ? line.substring(1).trim() : line).join("\n");
  };

  // Render Asset Switcher
  switch (selectedAsset) {
    case "banner":
      return (
        <div className="agenda-preview-canvas flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white min-h-[500px] border-none text-center">
          <div className="flex justify-between items-center w-full border-b border-white/20 pb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-secondary">Kolathur Speakers Toastmasters Club</span>
            <span className="font-mono text-xs text-slate-300">Club 28679417</span>
          </div>
          <div className="space-y-4 my-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase print-heading">
              KOLATHUR SPEAKERS TOASTMASTERS CLUB
            </h1>
            <p className="text-lg text-slate-200 tracking-wider font-medium max-w-2xl mx-auto">
              "Where Leaders Are Made"
            </p>
            <div className="inline-block px-6 py-2 rounded-full bg-secondary/20 border border-secondary text-secondary font-bold text-sm tracking-wide uppercase mt-4">
              Session {meetingNumber || "#1143"}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6 text-sm text-slate-300">
            <div>
              <span className="block font-bold text-white">Date & Time</span>
              <span>{formattedDate()} | 10:30 AM</span>
            </div>
            <div>
              <span className="block font-bold text-white">Meeting Type</span>
              <span>In-Person &amp; Hybrid</span>
            </div>
            <div>
              <span className="block font-bold text-white">Theme of the Day</span>
              <span className="italic">"{sessionTheme || "Inspiring Growth"}"</span>
            </div>
          </div>
        </div>
      );

    case "theme":
      return (
        <div className="agenda-preview-canvas flex flex-col justify-between p-10 bg-slate-50 border-4 border-primary text-slate-800 min-h-[500px]">
          <div className="text-center border-b border-primary/20 pb-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Session Theme Card</span>
            <span className="text-xs text-slate-500">Kolathur Speakers Toastmasters Club • Session {meetingNumber}</span>
          </div>
          <div className="my-auto text-center space-y-4 px-6">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Today's Session Theme</span>
            <h1 className="text-5xl font-black text-primary uppercase italic tracking-tight print-heading">
              "{sessionTheme || "Inspiring Growth"}"
            </h1>
            <div className="h-1.5 w-24 bg-secondary mx-auto rounded-full my-6" />
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Embrace today's theme and weave its spirit into your speeches, table topics answers, and evaluations. Let's make every word count!
            </p>
          </div>
          <div className="flex justify-between text-xs text-slate-400 border-t border-slate-200 pt-4">
            <span>Date: {meetingDate}</span>
            <span className="font-bold uppercase tracking-wider text-primary">KSTC Club Roster</span>
          </div>
        </div>
      );

    case "word":
      return (
        <div className="agenda-preview-canvas flex flex-col justify-between p-10 bg-white border-4 border-secondary text-slate-800 min-h-[500px]">
          <div className="text-center border-b border-secondary/20 pb-4">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Word of the Day</span>
            <span className="text-xs text-slate-500">Enrich Your Vocabulary in Session {meetingNumber}</span>
          </div>
          <div className="my-auto space-y-4 px-6">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight print-heading inline-block">
                {wordName || "Eloquence"}
              </h1>
              {wordType && <span className="ml-3 text-sm font-bold text-secondary italic bg-secondary/10 px-2.5 py-0.5 rounded">{wordType}</span>}
            </div>
            
            <div className="space-y-2 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Definition &amp; Meaning</span>
              <p className="text-lg text-slate-800 font-medium border-l-4 border-secondary pl-4 py-1">
                {wordMeaning}
              </p>
            </div>

            {wordExample && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Usage Examples</span>
                <p className="text-sm text-slate-500 italic whitespace-pre-line bg-slate-50 p-4 rounded-lg leading-relaxed">
                  {formatExampleText(wordExample)}
                </p>
              </div>
            )}
          </div>
          <div className="text-center text-xs text-slate-400 border-t border-slate-200 pt-4 font-mono">
            Kolathur Speakers Toastmasters Club
          </div>
        </div>
      );

    case "idiom":
      return (
        <div className="agenda-preview-canvas flex flex-col justify-between p-10 bg-white border-4 border-secondary text-slate-800 min-h-[500px]">
          <div className="text-center border-b border-secondary/20 pb-4">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Idiom of the Day</span>
            <span className="text-xs text-slate-500">Express Yourself Colorfully in Session {meetingNumber}</span>
          </div>
          <div className="my-auto space-y-4 px-6">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight print-heading inline-block">
                "{idiomName || "Smash Hit"}"
              </h1>
              {idiomType && <span className="ml-3 text-sm font-bold text-secondary italic bg-secondary/10 px-2.5 py-0.5 rounded">{idiomType}</span>}
            </div>

            <div className="space-y-2 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Meaning</span>
              <p className="text-lg text-slate-800 font-medium border-l-4 border-secondary pl-4 py-1">
                {idiomMeaning}
              </p>
            </div>

            {idiomExample && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Examples</span>
                <p className="text-sm text-slate-500 italic whitespace-pre-line bg-slate-50 p-4 rounded-lg leading-relaxed">
                  {formatExampleText(idiomExample)}
                </p>
              </div>
            )}
          </div>
          <div className="text-center text-xs text-slate-400 border-t border-slate-200 pt-4 font-mono">
            Kolathur Speakers Toastmasters Club
          </div>
        </div>
      );

    case "quote":
      return (
        <div className="agenda-preview-canvas flex flex-col justify-between p-12 bg-gradient-to-tr from-slate-50 to-indigo-50 border-4 border-primary/50 text-slate-800 min-h-[500px]">
          <div className="text-center border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Inspiration of the Day</span>
            <span className="text-xs text-slate-500">Toastmasters Quote of the Day • Session {meetingNumber}</span>
          </div>
          <div className="my-auto text-center space-y-6 px-4">
            <Quote className="w-12 h-12 text-secondary/40 mx-auto" />
            <h2 className="text-2xl font-serif italic text-slate-800 leading-normal font-semibold max-w-2xl mx-auto">
              "{customQuote}"
            </h2>
            <div className="h-0.5 w-16 bg-primary/20 mx-auto" />
            <p className="text-sm font-bold text-primary uppercase tracking-wider">
              — {customQuoteAuthor}
            </p>
          </div>
          <div className="text-center text-xs text-slate-400 border-t border-slate-200 pt-4 font-mono">
            Kolathur Speakers Toastmasters Club
          </div>
        </div>
      );

    case "speakerCert":
      return (
        <div className="agenda-preview-canvas p-10 bg-stone-50 border-[12px] border-double border-[#D4AF37] text-stone-800 min-h-[580px] flex flex-col justify-between relative shadow-2xl">
          {/* Elegant gold corner accents */}
          <div className="absolute top-2 left-2 text-[#D4AF37] opacity-60"><Star className="w-5 h-5 fill-[#D4AF37]" /></div>
          <div className="absolute top-2 right-2 text-[#D4AF37] opacity-60"><Star className="w-5 h-5 fill-[#D4AF37]" /></div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37] opacity-60"><Star className="w-5 h-5 fill-[#D4AF37]" /></div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37] opacity-60"><Star className="w-5 h-5 fill-[#D4AF37]" /></div>
          
          <div className="text-center space-y-2 mt-4">
            <span className="text-[#D4AF37] font-serif font-semibold tracking-widest text-xs uppercase block">Toastmasters International</span>
            <h2 className="text-xl font-bold tracking-wider text-slate-800 uppercase font-headline">KOLATHUR SPEAKERS TOASTMASTERS CLUB</h2>
            <span className="text-[9px] text-stone-500 uppercase tracking-widest">Club No. 28679417 | Area 02 | Division B | District 229</span>
          </div>

          <div className="text-center space-y-6 my-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#D4AF37] font-serif italic py-2 border-y border-[#D4AF37]/20 max-w-md mx-auto print-heading">
              Certificate of Excellence
            </h1>
            <p className="text-xs text-stone-500 tracking-wider font-semibold uppercase">This is proudly presented to</p>
            <h2 className="text-3xl font-bold text-slate-900 border-b-2 border-[#D4AF37]/30 pb-1 max-w-lg mx-auto italic font-serif">
              {speeches[0]?.speakerName || "TM Simon Bright"}
            </h2>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              for delivering an outstanding presentation titled <strong className="text-slate-900 italic font-medium">"{speeches[0]?.projectTitle || "Navigating Uncharted Waters"}"</strong> under the Pathway <span className="font-semibold text-slate-800">{speeches[0]?.pathway || "Dynamic Leadership"}</span>.
            </p>
            <p className="text-[10px] text-stone-500 uppercase tracking-wider">
              Awarded at Session <strong className="text-[#D4AF37]">{meetingNumber}</strong> on <span className="font-medium">{meetingDate}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-16 pt-6 border-t border-[#D4AF37]/20 max-w-xl mx-auto w-full text-center text-xs mt-6">
            <div className="space-y-1">
              <div className="h-6 border-b border-stone-300 w-10/12 mx-auto" />
              <span className="font-bold text-stone-500 uppercase text-[8px] tracking-wider block">VP Education</span>
            </div>
            <div className="space-y-1">
              <div className="h-6 border-b border-stone-300 w-10/12 mx-auto" />
              <span className="font-bold text-stone-500 uppercase text-[8px] tracking-wider block">President</span>
            </div>
          </div>
        </div>
      );

    case "participationCert":
      return (
        <div className="agenda-preview-canvas p-10 bg-stone-50 border-[12px] border-double border-primary text-stone-800 min-h-[580px] flex flex-col justify-between relative shadow-2xl">
          <div className="text-center space-y-2 mt-4">
            <span className="text-primary font-serif font-semibold tracking-widest text-xs uppercase block">Toastmasters International</span>
            <h2 className="text-xl font-bold tracking-wider text-slate-800 uppercase font-headline">KOLATHUR SPEAKERS TOASTMASTERS CLUB</h2>
            <span className="text-[9px] text-stone-500 uppercase tracking-widest">Club No. 28679417 | Area 02 | Division B | District 229</span>
          </div>

          <div className="text-center space-y-6 my-auto">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary font-serif italic py-2 border-y border-primary/20 max-w-md mx-auto print-heading">
              Certificate of Appreciation
            </h1>
            <p className="text-xs text-stone-500 tracking-wider font-semibold uppercase">This is proudly presented to</p>
            <h2 className="text-3xl font-bold text-slate-900 border-b-2 border-primary/30 pb-1 max-w-lg mx-auto italic font-serif">
              {assignments["Toastmaster"] || "TM Ravishankar"}
            </h2>
            <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
              in recognition of your distinguished service as <strong className="text-primary font-medium">{assignments["Toastmaster"] ? "Toastmaster of the Day" : "Meeting Role Player"}</strong> during our club Session <span className="font-bold text-slate-800">{meetingNumber}</span>, showcasing outstanding leadership and contribution.
            </p>
            <p className="text-[10px] text-stone-500 uppercase tracking-wider">
              Presented with appreciation on <span className="font-medium">{meetingDate}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-16 pt-6 border-t border-primary/20 max-w-xl mx-auto w-full text-center text-xs mt-6">
            <div className="space-y-1">
              <div className="h-6 border-b border-stone-300 w-10/12 mx-auto" />
              <span className="font-bold text-stone-500 uppercase text-[8px] tracking-wider block">VP Education</span>
            </div>
            <div className="space-y-1">
              <div className="h-6 border-b border-stone-300 w-10/12 mx-auto" />
              <span className="font-bold text-stone-500 uppercase text-[8px] tracking-wider block">President</span>
            </div>
          </div>
        </div>
      );

    case "whatsapp":
      return (
        <div className="agenda-preview-canvas flex flex-col justify-between p-8 bg-gradient-to-b from-primary via-[#0B2135] to-black text-white min-h-[960px] max-w-[540px] border-none rounded-2xl relative overflow-hidden" style={{ width: "540px", height: "960px" }}>
          {/* Subtle geometric lines */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full filter blur-3xl -translate-y-12 translate-x-12" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/25 rounded-full filter blur-3xl translate-y-24 -translate-x-24" />

          {/* Header */}
          <div className="text-center space-y-1 z-10 border-b border-white/10 pb-4">
            <span className="text-secondary text-[10px] font-mono tracking-widest font-black uppercase">Toastmasters International</span>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase font-headline">KOLATHUR SPEAKERS TOASTMASTERS</h1>
            <p className="text-[9px] text-slate-400">Club No. 28679417 | District 229</p>
          </div>

          {/* Body Content */}
          <div className="my-auto space-y-6 z-10 text-center px-4">
            <div className="space-y-1.5">
              <div className="inline-block px-4 py-1.5 rounded-full bg-secondary text-slate-900 font-extrabold text-xs tracking-wider uppercase">
                Session {meetingNumber}
              </div>
              <h2 className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block pt-2">Theme of the Day</h2>
              <h3 className="text-3xl font-black text-secondary uppercase italic tracking-wide font-headline">
                "{sessionTheme || "Inspiring Growth"}"
              </h3>
            </div>

            {/* Date Details */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl inline-block w-full">
              <div className="grid grid-cols-2 gap-4 text-center divide-x divide-white/10 text-xs">
                <div className="space-y-1">
                  <span className="text-secondary font-bold block uppercase text-[10px] tracking-wide">Date</span>
                  <span className="font-bold text-white">{meetingDate}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-secondary font-bold block uppercase text-[10px] tracking-wide">Time</span>
                  <span className="font-bold text-white">10:30 AM - 12:30 PM</span>
                </div>
              </div>
            </div>

            {/* Role players */}
            <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/5 text-left text-xs max-w-sm mx-auto">
              <h4 className="font-bold text-secondary uppercase tracking-wider text-center text-[10px] border-b border-white/10 pb-1.5 mb-2">Key Session Facilitators</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Toastmaster of the Day:</span>
                  <span className="font-bold text-white">{assignments["Toastmaster"] || "TM Ravishankar"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">General Evaluator:</span>
                  <span className="font-bold text-white">{assignments["General Evaluator"] || "Unassigned"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Table Topics Master:</span>
                  <span className="font-bold text-white">{assignments["Table Topics Master"] || "TM Saranya"}</span>
                </div>
              </div>
            </div>

            {/* Linguistics */}
            <div className="grid grid-cols-2 gap-3 text-left text-2xs max-w-sm mx-auto">
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                <span className="font-bold text-secondary uppercase text-[8px] tracking-wider block border-b border-white/10 pb-0.5">Word of the Day</span>
                <strong className="text-white text-xs block">{wordName}</strong>
                <p className="text-slate-300 leading-tight line-clamp-2">{wordMeaning}</p>
              </div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 space-y-1">
                <span className="font-bold text-secondary uppercase text-[8px] tracking-wider block border-b border-white/10 pb-0.5">Idiom of the Day</span>
                <strong className="text-white text-xs block">"{idiomName}"</strong>
                <p className="text-slate-300 leading-tight line-clamp-2">{idiomMeaning}</p>
              </div>
            </div>
          </div>

          {/* Footer & Map Scan */}
          <div className="z-10 border-t border-white/10 pt-4 flex items-center justify-between px-2 text-2xs">
            <div className="text-left space-y-1 max-w-[70%]">
              <span className="font-bold text-secondary uppercase text-[8px] tracking-wider block">Meeting Venue</span>
              <p className="text-slate-300 leading-snug">Exemplary Solutions, 91/31, 2nd Floor, Surapet Main Road, Vinayagapuram, Chennai</p>
            </div>
            <div className="flex flex-col items-center shrink-0">
              <div className="w-14 h-14 bg-white p-0.5 rounded border border-white/25">
                <img src={getQRUrl(mapUrl)} alt="Maps QR" className="w-full h-full" referrerPolicy="no-referrer" />
              </div>
              <span className="text-[7px] text-slate-400 block mt-1 font-bold">Scan for Map</span>
            </div>
          </div>
        </div>
      );

    case "instagram":
      // Render Instagram Story format - identical to WhatsApp 1080x1920 but with different border or visual focus
      return (
        <div className="agenda-preview-canvas flex flex-col justify-between p-10 bg-gradient-to-br from-indigo-900 via-[#1E112A] to-stone-900 text-white min-h-[960px] max-w-[540px] border-none rounded-2xl relative overflow-hidden" style={{ width: "540px", height: "960px" }}>
          <div className="absolute top-12 left-12 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-12 right-12 w-72 h-72 bg-purple-500/10 rounded-full filter blur-3xl" />

          <div className="text-center space-y-1.5 z-10 border-b border-white/10 pb-4">
            <span className="text-secondary text-[10px] font-mono tracking-widest font-black uppercase">Session Showcase</span>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase font-headline">KOLATHUR SPEAKERS TOASTMASTERS</h1>
            <p className="text-[9px] text-slate-400">District 229 | Area 02</p>
          </div>

          <div className="my-auto space-y-8 z-10 text-center px-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest block">Join Us Online &amp; Offline</span>
              <h2 className="text-4xl font-extrabold text-white leading-tight font-headline">
                "{sessionTheme || "Inspiring Growth"}"
              </h2>
              <p className="text-sm text-slate-300 max-w-sm mx-auto italic font-serif">
                "{customQuote}"
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl max-w-sm mx-auto space-y-3">
              <div className="flex items-center gap-3 text-left">
                <Calendar className="w-4 h-4 text-secondary shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Sunday Date</span>
                  <span className="text-xs font-bold text-white">{formattedDate()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <Clock className="w-4 h-4 text-secondary shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Timing</span>
                  <span className="text-xs font-bold text-white">10:30 AM — 12:30 PM (IST)</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Venue Location</span>
                  <span className="text-xs font-bold text-white leading-snug">Exemplary Solutions, Surapet Main Road, Chennai</span>
                </div>
              </div>
            </div>
          </div>

          <div className="z-10 border-t border-white/10 pt-4 flex justify-between items-center px-4">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Guests are Welcome!</span>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white p-0.5 rounded">
                <img src={getQRUrl(mapUrl)} alt="Map QR" className="w-full h-full" referrerPolicy="no-referrer" />
              </div>
              <span className="text-[7px] text-slate-400 mt-1 uppercase tracking-wider">Scan for Location</span>
            </div>
          </div>
        </div>
      );

    case "facebook":
    case "linkedin":
      // Render standard landscape 1200x630 (or high resolution 3:2 post size)
      return (
        <div className="agenda-preview-canvas flex flex-col justify-between p-12 bg-gradient-to-br from-[#0B1528] to-[#1E293B] text-white min-h-[500px] border-none" style={{ width: "800px", height: "500px" }}>
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-mono text-2xs uppercase tracking-widest text-slate-300">Kolathur Speakers Toastmasters Club</span>
            </div>
            <span className="font-mono text-2xs text-secondary font-bold">Session {meetingNumber}</span>
          </div>

          <div className="grid grid-cols-5 gap-6 my-auto items-center">
            <div className="col-span-3 space-y-4 text-left">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">This Sunday's Meeting</span>
              <h1 className="text-3xl font-black text-white leading-tight uppercase font-headline">
                "{sessionTheme || "Inspiring Growth"}"
              </h1>
              <div className="h-1 w-12 bg-secondary rounded" />
              <p className="text-xs text-slate-300 max-w-sm italic">
                "{customQuote}"
              </p>
            </div>

            <div className="col-span-2 bg-white/5 border border-white/10 p-5 rounded-xl space-y-3.5 text-xs text-left">
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Date &amp; Time</span>
                <span className="font-bold text-white">{meetingDate} | 10:30 AM IST</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Key Role Players</span>
                <div className="space-y-1 mt-1 text-slate-200">
                  <div>Toastmaster: <strong>{assignments["Toastmaster"] || "TM Ravishankar"}</strong></div>
                  <div>General Evaluator: <strong>{assignments["General Evaluator"] || "Unassigned"}</strong></div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-2.5 mt-2.5">
                <span className="text-[9px] text-secondary font-bold uppercase">Guests Welcome (Free Entry)</span>
                <div className="w-10 h-10 bg-white p-0.5 rounded">
                  <img src={getQRUrl(mapUrl)} alt="QR" className="w-full h-full" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between text-3xs text-slate-400 border-t border-white/10 pt-4">
            <span>Website: d229.toastmasters.org</span>
            <span>Exemplary Solutions, Chennai, India</span>
          </div>
        </div>
      );

    case "email":
      return (
        <div className="agenda-preview-canvas p-8 bg-white border border-slate-200 text-slate-800 min-h-[500px] text-left space-y-6">
          <div className="space-y-2 border-b border-slate-200 pb-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block">Email Circular Template</span>
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100 font-mono">
              <div><strong>Subject:</strong> Join Session {meetingNumber} | Theme: "{sessionTheme}" this Sunday at Kolathur Speakers</div>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-slate-700 font-sans">
            <p>Dear Members and Esteemed Guests,</p>
            <p>
              We are delighted to invite you to our upcoming meeting of <strong>Kolathur Speakers Toastmasters Club</strong>. We have lined up an incredible session to fuel your communication and leadership journey.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2.5 my-4">
              <h3 className="font-bold text-primary text-xs uppercase tracking-wider">Session Breakdown</h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <strong>Session Theme:</strong> "{sessionTheme || "Inspiring Growth"}"
                </div>
                <div>
                  <strong>Session Number:</strong> Session {meetingNumber || "#1143"}
                </div>
                <div>
                  <strong>Date &amp; Time:</strong> {formattedDate()} at 10:30 AM IST
                </div>
                <div>
                  <strong>Meeting Venue:</strong> Exemplary Solutions, Vinayagapuram, Chennai
                </div>
              </div>
            </div>

            <p>
              Our Toastmaster of the Day <strong>{assignments["Toastmaster"] || "TM Ravishankar"}</strong>, along with General Evaluator <strong>{assignments["General Evaluator"] || "Unassigned"}</strong> and other enthusiastic role players, are ready to deliver a session packed with learning, impromptu speech practice, and valuable evaluations.
            </p>

            <p>
              Whether you want to overcome public speaking fear, polish your presentation skills, or network with a vibrant group, this is the place to be! Guests can attend absolutely free.
            </p>

            <div className="space-y-0.5 border-t border-slate-200 pt-4">
              <p className="font-bold text-slate-800">Warm Regards,</p>
              <p className="text-slate-500 text-xs">KSTC Executive Committee</p>
              <p className="text-primary font-bold text-xs font-mono">Kolathur Speakers Toastmasters Club</p>
            </div>
          </div>
        </div>
      );

    case "agenda":
    default:
      // The Core Production-Quality Printable A4 Agenda Sheet (2-Column Sidebar Layout)
      return (
        <div id="agenda-sheet" className="agenda-preview-canvas p-6 md:p-8 bg-white text-slate-900 border border-slate-300 rounded-xl shadow-sm max-w-[840px] mx-auto min-h-[1050px] flex flex-col justify-between">
          <div>
            {/* Upper Section containing Sidebar and Main Agenda */}
            <div className="flex gap-6 items-start print-columns-wrapper">
              
              {/* Side Bar (Width: 24% for optimized layout) */}
              <div className="w-[24%] shrink-0 border-r border-slate-200 pr-5 flex flex-col gap-5 text-[10px] print-sidebar">
                {/* Uploaded Logo (top) */}
                {logoUrl ? (
                  <div className="h-14 w-full flex items-center justify-center shrink-0 mb-1 border border-slate-100 p-2 rounded bg-slate-50/50 print-logo-container">
                    <img 
                      src={logoUrl} 
                      alt="Club Logo" 
                      className="h-full object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  </div>
                ) : (
                  <div className="h-14 w-full flex flex-col items-center justify-center shrink-0 mb-1 border border-dashed border-slate-200 p-1 rounded bg-slate-50/20 text-slate-400 print-logo-container">
                    <span className="text-[7.5px] font-bold uppercase tracking-wider">No Logo</span>
                  </div>
                )}

                {/* Club Mission Box */}
                <div className="space-y-1 bg-slate-50 p-2 rounded border border-slate-200/50">
                  <h5 className="font-bold text-primary text-[8.5px] uppercase tracking-wider border-b border-primary/20 pb-0.5 font-headline">
                    Club Mission
                  </h5>
                  <p className="text-slate-500 leading-normal italic text-[8.5px]">
                    "We provide supportive and positive learning experience in which members are empowered to develop communication and leadership skills, resulting in greater self-confidence."
                  </p>
                </div>

                {/* Core Values Box */}
                <div className="space-y-1 bg-slate-50 p-2 rounded border border-slate-200/50">
                  <h5 className="font-bold text-primary text-[8.5px] uppercase tracking-wider border-b border-primary/20 pb-0.5 font-headline">
                    Core Values
                  </h5>
                  <div className="text-slate-600 font-bold leading-normal text-[8.5px] flex flex-col gap-0.5">
                    <span>• Integrity</span>
                    <span>• Respect</span>
                    <span>• Service</span>
                    <span>• Excellence</span>
                  </div>
                </div>

                {/* Word of the Day structured display */}
                <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                  <h5 className="font-bold text-primary text-[8.5px] uppercase tracking-wider border-b border-primary/20 pb-0.5 flex justify-between items-center font-headline">
                    <span>Word of the Day</span>
                    {wordType && <span className="text-secondary font-bold normal-case text-[7.5px] bg-secondary/10 px-1 rounded">{wordType}</span>}
                  </h5>
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block">{wordName || "Eloquence"}</span>
                    {wordMeaning && (
                      <p className="text-slate-600 mt-0.5 leading-snug text-[8px]">
                        <strong className="text-slate-700">Meaning:</strong> {wordMeaning}
                      </p>
                    )}
                    {wordExample && (
                      <div className="text-slate-500 mt-1 leading-snug text-[8px]">
                        <strong className="text-slate-700 block">Examples:</strong>
                        <div className="whitespace-pre-line pl-0.5 text-[7.5px]">{wordExample}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Idiom of the Day structured display */}
                <div className="space-y-1.5 bg-slate-50/80 p-2.5 rounded-lg border border-slate-200">
                  <h5 className="font-bold text-primary text-[8.5px] uppercase tracking-wider border-b border-primary/20 pb-0.5 flex justify-between items-center font-headline">
                    <span>Idiom of the Day</span>
                    {idiomType && <span className="text-secondary font-bold normal-case text-[7.5px] bg-secondary/10 px-1 rounded">{idiomType}</span>}
                  </h5>
                  <div>
                    <span className="font-bold text-slate-800 text-[11px] block">{idiomName || "Smash Hit"}</span>
                    {idiomMeaning && (
                      <p className="text-slate-600 mt-0.5 leading-snug text-[8px]">
                        <strong className="text-slate-700">Meaning:</strong> {idiomMeaning}
                      </p>
                    )}
                    {idiomExample && (
                      <div className="text-slate-500 mt-1 leading-snug text-[8px]">
                        <strong className="text-slate-700 block">Examples:</strong>
                        <div className="whitespace-pre-line pl-0.5 text-[7.5px]">{idiomExample}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Club Officers list */}
                <div className="space-y-1 bg-slate-50 p-2 rounded border border-slate-200/50">
                  <h5 className="font-bold text-primary text-[8.5px] uppercase tracking-wider border-b border-primary/20 pb-0.5 font-headline">
                    Club Officers
                  </h5>
                  <div className="space-y-0.5 text-slate-600 text-[8px]">
                    <div className="flex justify-between">
                      <span className="font-medium">President:</span>
                      <span className="font-bold text-right print-name">TM Dheendayalan T</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">VP Education:</span>
                      <span className="font-bold text-right print-name">{assignments["Toastmaster"] || "TM Ravishankar"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">VP Membership:</span>
                      <span className="font-bold text-right print-name">{assignments["Table Topics Master"] || "TM Saranya"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">VP PR:</span>
                      <span className="font-bold text-right print-name">TM Simon Bright</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Secretary:</span>
                      <span className="font-bold text-right print-name">TM Praveen Kumar</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">SAA:</span>
                      <span className="font-bold text-right print-name">{assignments["Sergeant At Arms"] || "TM Heroji"}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code Map Scan (At sidebar bottom) */}
                <div className="pt-3 border-t border-slate-200 mt-1 flex flex-col items-center print-qr-container">
                  <div className="h-16 w-16 border border-gray-200 rounded p-0.5 bg-white flex items-center justify-center shadow-2xs print-qr-box">
                    <img 
                      src={getQRUrl(mapUrl)} 
                      alt="Venue Map QR Code" 
                      className="h-full w-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="font-bold text-primary block mt-1 uppercase text-[7px] tracking-wider text-center">Scan for Venue Map</span>
                  <span className="text-[6.5px] text-slate-500 text-center font-sans mt-0.5 leading-tight">Exemplary Solutions, Chennai</span>
                </div>
              </div>

              {/* Main Content Area (Width: 76% for balanced grid) */}
              <div className="w-[76%] flex-1 flex flex-col gap-4 print-main text-[10px]">
                {/* Club Header Block */}
                <div className="border-b-2 border-primary pb-2.5 print-header">
                  <h3 className="font-bold text-base uppercase tracking-wide text-primary text-center font-headline">
                    KOLATHUR SPEAKERS TOASTMASTERS CLUB
                  </h3>
                  <p className="text-[8px] uppercase tracking-widest text-slate-500 font-bold text-center mt-0.5 font-mono">
                    Club No. 28679417 | Area 02 | Division B | District 229
                  </p>
                  
                  <div className="bg-primary/5 border border-primary/10 py-1 px-3 rounded text-center mt-2 print-theme-box">
                    <span className="text-[8.5px] font-sans font-semibold text-slate-500">Theme of the Day:</span>
                    <h4 className="font-bold text-xs text-primary uppercase italic mt-0.5 font-headline">
                      "{sessionTheme || "Inspiring Growth"}"
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 text-center text-[9px] font-bold text-slate-700 mt-2 bg-slate-50/50 py-1 rounded print-info-grid">
                    <div className="border-r border-slate-200">Session {meetingNumber || "#1143"}</div>
                    <div className="border-r border-slate-200">{meetingDate}</div>
                    <div>10:30 AM - 12:30 PM</div>
                  </div>

                  <div className="text-center text-[8.5px] text-slate-500 mt-1.5 font-medium print-venue">
                    <strong>Venue:</strong> Exemplary Solutions 91/31, Second floor, Surapet main road, puthagaram, vinayagapuram, chennai-600099
                  </div>
                </div>

                {/* Timeline Schedule */}
                <div className="space-y-2.5 flex-1 print-timeline-section">
                  <h4 className="font-bold text-[10px] uppercase text-primary border-b border-gray-200 pb-0.5 font-headline">
                    Meeting Timeline &amp; Agenda
                  </h4>

                  <div className="space-y-1">
                    {/* SAA Introduction */}
                    <div className="flex justify-between items-start py-1 border-b border-slate-100 print-timeline-row">
                      <div className="flex gap-4">
                        <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">10:30 AM</span>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block print-row-title">Sergeant At Arms Calls Meeting to Order</span>
                          <p className="text-[8.5px] text-slate-500 leading-tight print-row-desc">Reads Mission &amp; Core Values, states guidelines for cell phones</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0 print-row-owner print-name">{assignments["Sergeant At Arms"] || "TM Heroji"}</span>
                    </div>

                    {/* President Remarks */}
                    <div className="flex justify-between items-start py-1 border-b border-slate-100 print-timeline-row">
                      <div className="flex gap-4">
                        <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">10:35 AM</span>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block print-row-title">President Delivers Welcome Address</span>
                          <p className="text-[8.5px] text-slate-500 leading-tight print-row-desc">Welcomes guests &amp; members, delivers presidential opening remarks</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0 print-row-owner print-name">TM Dheendayalan T</span>
                    </div>

                    {/* Toastmaster Control */}
                    <div className="flex justify-between items-start py-1 border-b border-slate-100 print-timeline-row">
                      <div className="flex gap-4">
                        <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">10:40 AM</span>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block print-row-title">Toastmaster of the Day Takes Control</span>
                          <p className="text-[8.5px] text-slate-500 leading-tight print-row-desc">Introduces structural segments and launches role-player explanations</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0 print-row-owner print-name">{assignments["Toastmaster"] || "TM Ravishankar"}</span>
                    </div>

                    {/* Role Holders Inner Grid */}
                    <div className="ml-18 p-2 bg-slate-50 rounded border border-slate-100 space-y-1 print-roster-box print-avoid-break">
                      <span className="block font-mono text-[7.5px] font-bold uppercase tracking-widest text-slate-400">Roster Role Players</span>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[8.5px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">General Evaluator:</span>
                          <strong className="text-slate-700 print-name">{assignments["General Evaluator"] || "Unassigned"}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Timer:</span>
                          <strong className="text-slate-700 print-name">{assignments["Timer"] || "Unassigned"}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Grammarian:</span>
                          <strong className="text-slate-700 print-name">{assignments["Grammarian"] || "Unassigned"}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Ah-Counter:</span>
                          <strong className="text-slate-700 print-name">{assignments["Ah-Counter"] || "Unassigned"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Prepared Speeches */}
                    <div className="py-1 border-b border-slate-100 print-speeches-row print-avoid-break">
                      <div className="flex gap-4">
                        <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">10:50 AM</span>
                        <div className="flex-1">
                          <span className="font-bold text-slate-800 block mb-1 print-row-title">Prepared Pathways Speeches Segment</span>
                          <div className="space-y-1.5 mt-1.5">
                            {speeches.map((sp, idx) => (
                              <div key={sp.id} className="p-2 bg-primary/[0.01] border border-slate-200 rounded space-y-1 text-[8.5px] print-speech-card">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-primary print-speech-title">Speech {idx + 1}: "{sp.projectTitle || "TBD"}"</span>
                                  <span className="font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[8px] print-speech-speaker">Speaker: {sp.speakerName || "Assign Speaker"}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1.5 text-slate-500 text-[7.5px] font-medium pt-0.5 border-t border-dashed border-slate-100 print-speech-meta">
                                  <span><strong>Pathway:</strong> {sp.pathway || "N/A"}</span>
                                  <span><strong>Project:</strong> {sp.level} {sp.project ? `- ${sp.project}` : ''}</span>
                                  <span><strong>Time limit:</strong> {sp.timeMinMax}</span>
                                </div>
                                <div className="text-slate-600 text-[8px] flex justify-between font-medium">
                                  <span><strong>Speech Evaluator:</strong> {sp.evaluatorName || "Assign Evaluator"}</span>
                                  {sp.mentorName && <span><strong>Mentor:</strong> {sp.mentorName}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table Topics (Impromptu Speeches) */}
                    <div className="flex justify-between items-start py-1 border-b border-slate-100 print-timeline-row print-avoid-break">
                      <div className="flex gap-4">
                        <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">11:25 AM</span>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block print-row-title">Table Topics Segment (Impromptu Speaking)</span>
                          <p className="text-[8.5px] text-slate-500 leading-tight print-row-desc">Master of Ceremonies invites guest and members to deliver 1-2 minute speeches</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0 print-row-owner print-name">{assignments["Table Topics Master"] || "TM Saranya"}</span>
                    </div>

                    {/* Educational Masterclass */}
                    {eduTitle && (
                      <div className="py-1 border-b border-slate-100 print-edu-row print-avoid-break">
                        <div className="flex gap-4">
                          <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">11:45 AM</span>
                          <div className="space-y-0.5 flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-slate-800 block print-edu-title">Educational Segment: "{eduTitle}"</span>
                              <span className="text-[7.5px] font-bold text-secondary bg-secondary/10 px-1 py-0.5 rounded shrink-0">{eduDuration} Mins</span>
                            </div>
                            <p className="text-[8.5px] text-slate-500 leading-normal italic print-edu-desc">{eduDescription}</p>
                            <span className="block text-[8px] text-slate-400">Presented by: <strong className="text-slate-600 font-medium print-name">{eduPresenter || "Club Mentor"}</strong></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Evaluations Segment */}
                    <div className="flex justify-between items-start py-1 border-b border-slate-100 print-timeline-row print-avoid-break">
                      <div className="flex gap-4">
                        <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">12:00 PM</span>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block print-row-title">General Evaluation &amp; Reports Segment</span>
                          <p className="text-[8.5px] text-slate-500 leading-tight print-row-desc">General Evaluator invites speeches evaluations, timer, grammarian, ah-counter reports</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0 print-row-owner print-name">{assignments["General Evaluator"] || "Unassigned"}</span>
                    </div>

                    {/* Closing & Awards */}
                    <div className="flex justify-between items-start py-1 border-b border-slate-100 print-timeline-row print-avoid-break">
                      <div className="flex gap-4">
                        <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">12:20 PM</span>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 block print-row-title">President Closing &amp; Awards Segment</span>
                          <p className="text-[8.5px] text-slate-500 leading-tight print-row-desc">Feedback session, guest reactions, winner awards declaration, final announcements</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-700 shrink-0 print-row-owner print-name">TM Dheendayalan T</span>
                    </div>

                    {/* Adjournment */}
                    <div className="flex justify-between items-start py-1 print-timeline-row print-no-border print-avoid-break">
                      <div className="flex gap-4">
                        <span className="font-bold text-secondary font-mono w-14 shrink-0 print-time">12:30 PM</span>
                        <span className="font-bold text-slate-800 block print-row-title">Meeting Adjourned (Networking session)</span>
                      </div>
                      <span className="text-slate-400 text-xs font-mono">End</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Pristine Signatures Block at bottom of sheet */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 mt-5 shrink-0 print-signatures-block print-avoid-break">
            <div className="text-left space-y-1">
              <div className="h-5 border-b border-dashed border-slate-300 w-11/12" />
              <span className="font-bold text-slate-500 block uppercase text-[7.5px] tracking-widest">VP Education Approval</span>
              <span className="text-[8px] text-slate-400 font-medium block">KSTC Club Roster (TM Ravishankar)</span>
            </div>
            <div className="text-right space-y-1 flex flex-col items-end">
              <div className="h-5 border-b border-dashed border-slate-300 w-11/12" />
              <span className="font-bold text-slate-500 block uppercase text-[7.5px] tracking-widest text-right">President Endorsement</span>
              <span className="text-[8px] text-slate-400 font-medium block text-right text-right">KSTC Executive Committee (TM Dheendayalan T)</span>
            </div>
          </div>

          <div className="text-center text-[8px] text-slate-400/80 font-bold tracking-wider uppercase mt-3 pt-2 border-t border-slate-100 shrink-0 print-supported-by">
            Supported by TM Dheenadayalan T
          </div>
        </div>
      );
  }
}
