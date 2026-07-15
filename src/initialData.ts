import { Member, Meeting } from "./types";

export const getUpcomingSundayDateStr = () => {
  const current = new Date();
  const day = current.getDay();
  const diff = (7 - day) % 7;
  const nextSunday = new Date(current);
  nextSunday.setDate(current.getDate() + diff);
  const yyyy = nextSunday.getFullYear();
  const mm = String(nextSunday.getMonth() + 1).padStart(2, '0');
  const dd = String(nextSunday.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "m-1",
    name: "TM Dheendayalan T",
    role: "President",
    title: "DTM",
    email: "dheendayalan.t@toastmasters.org",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTYPK2WQNUnXV4hMCrXx54F8HF29C3eaSUxVTtDbuXi7rXpuz-ZyR0BjIjuHRfUVp-CfxA-0MhPlyv-MsKKs7E6EaRIjGmBfzj6ju1AGdnHjZfP2nfqaV642kAxGGNosjWl-76I-hKuryJYPgV8yOROeM-K4zmFcHJX_1-kjYztpno7LJQildA3vEug-NclzFnwts4ZPCWP4tBeIzgyrvb2TdEmDfwjBsxMCfT-cdB96Dw1w7Fjl-z-Q9f8MbKPu1CZ2eBsftFYU8"
  },
  {
    id: "m-2",
    name: "TM Saranya",
    role: "VP Membership",
    title: "PM5",
    email: "saranya@toastmasters.org",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "m-3",
    name: "TM Heroji",
    role: "Sergeant At Arms",
    title: "LD3",
    email: "heroji@toastmasters.org",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "m-4",
    name: "TM Ravishankar",
    role: "VP Education",
    title: "DTM",
    email: "ravishankar@toastmasters.org",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "m-5",
    name: "TM Simon Bright",
    role: "PRO",
    title: "MS2",
    email: "simon.bright@toastmasters.org",
    avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "m-6",
    name: "TM Sirisha Murari",
    role: "Treasurer",
    title: "IP5",
    email: "sirisha.murari@toastmasters.org",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "m-7",
    name: "TM Praveen Kumar",
    role: "Secretary",
    title: "VC2",
    email: "praveen.kumar@toastmasters.org",
    avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "m-8",
    name: "TM Rajesh Kumar",
    role: "Past Immediate President",
    title: "DTM",
    email: "rajesh.kumar@toastmasters.org",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=60"
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "mt-1",
    meetingNumber: "1142",
    meetingDate: getUpcomingSundayDateStr(),
    sessionTheme: "Resilience in Action",
    wordOfDay: "Fortitude - strength of mind that enables a person to encounter adversity with courage.",
    idiom: "Bite the bullet - face a difficult situation with courage.",
    quote: "Courage is resistance to fear, mastery of fear - not absence of fear. - Mark Twain",
    roles: [
      { roleName: "Toastmaster", memberName: "TM Ravishankar" },
      { roleName: "General Evaluator", memberName: "TM Dheendayalan T" },
      { roleName: "Table Topics Master", memberName: "TM Saranya" },
      { roleName: "Grammarian", memberName: "TM Simon Bright" },
      { roleName: "Ah-Counter", memberName: "TM Sirisha Murari" },
      { roleName: "Timer", memberName: "TM Praveen Kumar" },
      { roleName: "Sergeant At Arms", memberName: "TM Heroji" }
    ],
    speeches: [
      {
        id: "sp-1",
        speakerName: "TM Simon Bright",
        projectTitle: "Unveiling Our New Brand Identity",
        pathway: "L2: Strategic Relationships",
        timeMinMax: "5:00 - 7:00",
        evaluatorName: "TM Rajesh Kumar"
      }
    ],
    educationalTitle: "Mastering the Art of Evaluation",
    educationalPresenterName: "TM Dheendayalan T",
    educationalDuration: 15,
    educationalDescription: "A comprehensive review of providing motivating, positive, and constructive feedback during meetings.",
    aiEnhanced: true
  }
];
