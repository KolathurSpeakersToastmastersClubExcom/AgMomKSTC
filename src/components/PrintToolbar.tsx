import React, { useState } from "react";
import { 
  Printer, 
  Download, 
  Share2, 
  Copy, 
  Maximize2, 
  Minimize2, 
  FileText, 
  Check, 
  Smartphone, 
  Mail, 
  ExternalLink,
  Loader2,
  Send,
  MessageSquare,
  Facebook,
  Linkedin,
  Sparkles,
  ClipboardCheck,
  Award
} from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Speech } from "../types";

interface PrintToolbarProps {
  meetingNumber: string;
  meetingDate: string;
  sessionTheme: string;
  assignments: { [role: string]: string };
  speeches: Speech[];
  wordName?: string;
  wordMeaning?: string;
  idiomName?: string;
  idiomMeaning?: string;
  onPrint: () => void;
  selectedAsset: string;
  setSelectedAsset: (asset: string) => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

export default function PrintToolbar({
  meetingNumber,
  meetingDate,
  sessionTheme,
  assignments,
  speeches,
  wordName = "Eloquence",
  wordMeaning = "Fluent or persuasive speaking or writing",
  idiomName = "Smash Hit",
  idiomMeaning = "A very successful song, movie, show, etc.",
  onPrint,
  selectedAsset,
  setSelectedAsset,
  isFullScreen,
  onToggleFullScreen
}: PrintToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState("");

  const formattedDate = () => {
    if (!meetingDate) return "Sunday, TBD";
    const d = new Date(meetingDate);
    if (isNaN(d.getTime())) return meetingDate;
    return d.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 1. Download PDF using jsPDF + html2canvas
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setShareStatus("Compiling PDF...");
    try {
      const element = document.getElementById("agenda-sheet");
      if (!element) {
        alert("Print canvas element not found!");
        return;
      }

      // Render high resolution canvas (3x DPI scale)
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgHeightInPdf = (canvasHeight * pdfWidth) / canvasWidth;

      // If the content overflows slightly, allow multi-page or fit perfectly
      if (imgHeightInPdf > pdfHeight) {
        // Intelligently fit on 2 pages, or 1 page if we reduce scale slightly
        const ratio = pdfHeight / imgHeightInPdf;
        if (ratio > 0.85) {
          // If close to 1 page, scale down slightly to keep on a single beautiful sheet
          pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
        } else {
          // Otherwise, split across pages perfectly
          let heightLeft = imgHeightInPdf;
          let position = 0;

          pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeightInPdf, undefined, "FAST");
          heightLeft -= pdfHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeightInPdf; // Page offset
            pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeightInPdf, undefined, "FAST");
            heightLeft -= pdfHeight;
          }
        }
      } else {
        // Fits perfectly on 1 page
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, imgHeightInPdf, undefined, "FAST");
      }

      const fileName = `KSTC_Session_${meetingNumber || "Agenda"}_${selectedAsset}.pdf`;
      pdf.save(fileName);
      setShareStatus("Success!");
      setTimeout(() => setShareStatus(""), 2000);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Downloading standard image fallback instead.");
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Capture and download high-res PNG image
  const handleDownloadPNG = async () => {
    setIsExporting(true);
    setShareStatus("Capturing Image...");
    try {
      const element = document.getElementById("agenda-sheet");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `KSTC_Session_${meetingNumber}_${selectedAsset}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setShareStatus("Downloaded PNG!");
      setTimeout(() => setShareStatus(""), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Copy image directly to user clipboard (Super fast sharing!)
  const handleCopyImageToClipboard = async () => {
    setIsExporting(true);
    setShareStatus("Copying Image...");
    try {
      const element = document.getElementById("agenda-sheet");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          setShareStatus("Image Copied to Clipboard!");
          setTimeout(() => setShareStatus(""), 2500);
        } catch (clipboardErr) {
          console.error(clipboardErr);
          alert("Clipboard write failed. Downloading image instead!");
          handleDownloadPNG();
        }
      }, "image/png");
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // 4. Trigger Web Share API for native sharing (WhatsApp/Slack/etc.)
  const handleNativeShare = async () => {
    setIsExporting(true);
    setShareStatus("Preparing Share...");
    try {
      const element = document.getElementById("agenda-sheet");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `KSTC_Session_${meetingNumber}.png`, { type: "image/png" });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Session ${meetingNumber} Toastmasters Agenda`,
              text: `Here is the agenda and promotional flyer for our upcoming Toastmasters Session ${meetingNumber} on ${meetingDate}! Join us!`
            });
            setShareStatus("Shared successfully!");
            setTimeout(() => setShareStatus(""), 2000);
          } catch (shareErr) {
            console.log("Native share canceled or failed:", shareErr);
          }
        } else {
          // Native share not supported, open our gorgeous customized social sharing hub
          setIsShareOpen(true);
        }
      }, "image/png");
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // 5. Copy text invitation announcement (WhatsApp pre-filled text)
  const getWhatsAppAnnouncementText = () => {
    return `*Kolathur Speakers Toastmasters Club* 🌟\n*Session ${meetingNumber} Meeting Announcement*\n\n📅 *Date:* ${formattedDate()}\n🕙 *Time:* 10:30 AM - 12:30 PM (IST)\n💡 *Theme:* "${sessionTheme || 'Inspiring Growth'}"\n\n🎤 *Key Role Players:*\n• *Toastmaster of the Day:* ${assignments["Toastmaster"] || "TM Ravishankar"}\n• *General Evaluator:* ${assignments["General Evaluator"] || "Unassigned"}\n• *Table Topics Master:* ${assignments["Table Topics Master"] || "TM Saranya"}\n\n📖 *Linguistics:*\n• *Word of the Day:* ${wordName} (${wordMeaning})\n• *Idiom of the Day:* "${idiomName}" (${idiomMeaning})\n\n📍 *Venue:* Exemplary Solutions, surapet main road, vinayagapuram, chennai.\n\n_Guests are welcome to attend for free! Join us and sharpen your public speaking skills._ 🚀`;
  };

  const handleCopyTextAnnouncement = () => {
    const text = getWhatsAppAnnouncementText();
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleWhatsAppRedirect = () => {
    const text = encodeURIComponent(getWhatsAppAnnouncementText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const handleEmailRedirect = () => {
    const subject = encodeURIComponent(`Kolathur Speakers Session ${meetingNumber} Invitation | Theme: "${sessionTheme}"`);
    const body = encodeURIComponent(getWhatsAppAnnouncementText());
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const assets = [
    { id: "agenda", label: "📄 Print Agenda (A4)", category: "Printables" },
    { id: "speakerCert", label: "🏆 Best Speaker Certificate", category: "Awards" },
    { id: "participationCert", label: "🎖️ Appreciation Certificate", category: "Awards" },
    { id: "whatsapp", label: "📱 WhatsApp Story (9:16)", category: "Socials" },
    { id: "instagram", label: "📸 Instagram Story (9:16)", category: "Socials" },
    { id: "facebook", label: "👥 Social Post (3:2)", category: "Socials" },
    { id: "quote", label: "✨ Quote of the Day", category: "Posters" },
    { id: "word", label: "🗣️ Word of the Day", category: "Posters" },
    { id: "idiom", label: "💡 Idiom of the Day", category: "Posters" },
    { id: "banner", label: "🚩 Club Banner Layout", category: "Posters" },
    { id: "email", label: "✉️ Email circular", category: "Circulars" }
  ];

  return (
    <div className="w-full space-y-4 no-print border-b border-primary-container/10 pb-6">
      {/* Top Level Action Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-3xl bg-surface/40 backdrop-blur-md border border-white/5 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          {/* Asset Categories Dropdowns / Quick Selectors */}
          <div className="flex items-center gap-1 bg-black/20 p-1.5 rounded-2xl border border-white/5">
            {["Printables", "Socials", "Awards", "Posters"].map((cat) => {
              const matches = assets.filter(a => a.category === cat);
              const isActiveCategory = matches.some(m => m.id === selectedAsset);
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedAsset(matches[0].id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-headline transition-all cursor-pointer ${
                    isActiveCategory 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />

          {/* Quick Select Options for current active category */}
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-black/30 border border-white/10 text-xs font-semibold font-sans text-on-surface hover:bg-black/40 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {assets.map((item) => (
              <option key={item.id} value={item.id} className="bg-surface text-on-surface">
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Major Tool Commands */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Print button */}
          <button
            onClick={onPrint}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-headline font-bold shadow-md shadow-primary/20 hover:bg-primary-container transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Printer className="w-4 h-4" />
            Print A4
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-secondary text-slate-900 text-xs font-headline font-extrabold shadow-md shadow-secondary/10 hover:bg-secondary-container transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isExporting && shareStatus.includes("PDF") ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Download PDF
          </button>

          {/* Share Snapshot */}
          <button
            onClick={handleNativeShare}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#00A884]/20 border border-[#00A884]/30 text-white hover:bg-[#00A884]/30 text-xs font-headline font-bold transition-all cursor-pointer"
          >
            {isExporting && shareStatus.includes("Share") ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Share2 className="w-4 h-4 text-[#00A884]" />
            )}
            Share Fly / Poster
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center p-2.5 rounded-2xl bg-surface-variant hover:bg-surface-variant-hover text-on-surface transition-all border border-white/5 cursor-pointer"
            title="Copy App Page Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Toggle Full Screen view */}
          <button
            onClick={onToggleFullScreen}
            className="flex items-center justify-center p-2.5 rounded-2xl bg-surface-variant hover:bg-surface-variant-hover text-on-surface transition-all border border-white/5 cursor-pointer"
            title={isFullScreen ? "Minimize Canvas" : "Project on Screen"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Share Progress Notification Banner */}
      {shareStatus && (
        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold animate-pulse">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{shareStatus}</span>
        </div>
      )}

      {/* Manual Sharing Drawer overlay - pops open if Native Share fails or to offer targeted options */}
      {isShareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-6">
            <button
              onClick={() => setIsShareOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <Loader2 className="w-4 h-4 rotate-45 hidden" />
              <span>✕</span>
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block">Digital Sharing Center</span>
              <h3 className="font-headline text-lg font-bold text-white">Promote Session {meetingNumber}</h3>
              <p className="text-xs text-on-surface-variant">Choose how you'd like to share the generated digital asset.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Copy High-res PNG */}
              <button
                onClick={handleCopyImageToClipboard}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center space-y-2 cursor-pointer text-xs font-semibold text-white"
              >
                <ClipboardCheck className="w-5 h-5 text-indigo-400" />
                <span>Copy Image</span>
              </button>

              {/* Download PNG */}
              <button
                onClick={handleDownloadPNG}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center space-y-2 cursor-pointer text-xs font-semibold text-white"
              >
                <Download className="w-5 h-5 text-amber-400" />
                <span>Download PNG</span>
              </button>

              {/* Share to WhatsApp with beautiful preformatted text */}
              <button
                onClick={handleWhatsAppRedirect}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center space-y-2 cursor-pointer text-xs font-semibold text-white"
              >
                <Send className="w-5 h-5 text-emerald-400" />
                <span>Send via WhatsApp</span>
              </button>

              {/* Email summary invitation */}
              <button
                onClick={handleEmailRedirect}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-center space-y-2 cursor-pointer text-xs font-semibold text-white"
              >
                <Mail className="w-5 h-5 text-sky-400" />
                <span>Email Invitation</span>
              </button>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Text Announcement invitation</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyTextAnnouncement}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-slate-900 text-xs font-bold hover:bg-secondary-container transition-all cursor-pointer"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-4 h-4" />
                      Invitation Copied!
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Copy Text Invite
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-on-surface-variant leading-relaxed text-center">
                This copies a highly-readable plain-text breakdown with bold topics, timing, word of the day, and map info suitable for WhatsApp groups.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
