export interface Member {
  id: string;
  name: string;
  role: string;      // e.g. "President", "VP Education", "VP Membership", "PRO", "Treasurer", "Secretary", "SAA", "Past Immediate President", or "Member"
  title: string;     // e.g., "DTM", "PM5", "MS3", "LD2", etc.
  email: string;
  avatarUrl?: string;
}

export interface Speech {
  id: string;
  speakerName: string;
  projectTitle: string; // Speech Title
  pathway: string;
  level?: string;
  project?: string;
  timeMinMax: string;  // e.g., "5:00 - 7:00"
  evaluatorName: string;
  mentorName?: string;
}

export interface RolePerformance {
  roleName: string;  // e.g. "Toastmaster", "General Evaluator", "Table Topics Master", "Grammarian", "Ah-Counter", "Timer", "Sergeant At Arms"
  memberName: string;
}

export interface Meeting {
  id: string;
  meetingNumber: string;
  meetingDate: string;
  sessionTheme: string;
  wordOfDay: string;
  idiom: string;
  quote: string;
  roles: RolePerformance[];
  speeches: Speech[];
  educationalTitle: string;
  educationalPresenterName: string;
  educationalDuration: number;
  educationalDescription: string;
  aiEnhanced: boolean;
}

export interface WeeklyReport {
  id: string;
  meetingDate: string;
  meetingNumber: string;
  theme: string;
  assignments: { [role: string]: string }; // Map roleName to memberName
}
