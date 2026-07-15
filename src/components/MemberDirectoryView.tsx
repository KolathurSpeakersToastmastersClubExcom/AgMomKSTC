import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Mail, 
  Award, 
  X,
  User,
  Check,
  Image,
  Eye,
  EyeOff
} from "lucide-react";
import { Member } from "../types";

interface MemberDirectoryViewProps {
  members: Member[];
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
}

export default function MemberDirectoryView({ members, onAddMember, onUpdateMember, onDeleteMember }: MemberDirectoryViewProps) {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  
  // Option to show or hide photos globally (defaults to false for initials-only as requested)
  const [showPhotos, setShowPhotos] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("Member");
  const [formTitle, setFormTitle] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhoto, setFormPhoto] = useState("");

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormName("");
    setFormRole("Member");
    setFormTitle("PM1");
    setFormEmail("");
    setFormPhoto("");
    setModalOpen(true);
  };

  const handleOpenEdit = (member: Member) => {
    setEditingMember(member);
    setFormName(member.name);
    setFormRole(member.role);
    setFormTitle(member.title);
    setFormEmail(member.email);
    setFormPhoto(member.avatarUrl || "");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const memberData: Member = {
      id: editingMember ? editingMember.id : `m-${Date.now()}`,
      name: formName,
      role: formRole,
      title: formTitle,
      email: formEmail,
      avatarUrl: formPhoto || undefined
    };

    if (editingMember) {
      onUpdateMember(memberData);
    } else {
      onAddMember(memberData);
    }
    setModalOpen(false);
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase()) ||
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name: string) => {
    let clean = name.replace(/^TM\s+/i, "").trim(); // remove TM prefix
    const parts = clean.split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "TM";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts[parts.length - 1][0] || "")).toUpperCase();
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass w-full pl-12 pr-4 py-2.5 rounded-2xl font-sans text-sm text-slate-800" 
            placeholder="Search roster by name, role, or credentials..." 
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Photo Mode Toggle */}
          <button
            onClick={() => setShowPhotos(!showPhotos)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-headline text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            {showPhotos ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-secondary" />
                <span>Show Initials Mode</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-tertiary" />
                <span>Show Avatar Photos</span>
              </>
            )}
          </button>

          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-headline text-xs font-bold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="glass-card rounded-[24px] p-6 flex flex-col justify-between border border-slate-200 shadow-sm group relative bg-white">
            
            {/* Quick Actions overlay on hover */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button 
                onClick={() => handleOpenEdit(member)}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-primary border border-slate-200 shadow-sm cursor-pointer"
                title="Edit Member"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button 
                onClick={() => onDeleteMember(member.id)}
                className="p-2 bg-red-50 hover:bg-red-100 rounded-full text-red-600 border border-red-200 shadow-sm cursor-pointer"
                title="Delete Member"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>

            <div>
              {/* Profile Image / Initials badge */}
              <div className="flex items-center gap-4 mb-5">
                {showPhotos && member.avatarUrl ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 bg-slate-100 shadow-inner flex-shrink-0">
                    <img 
                      src={member.avatarUrl} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center font-headline text-base font-black text-white bg-gradient-to-br from-primary via-primary-container to-secondary shadow-md flex-shrink-0 border-2 border-white uppercase">
                    {getInitials(member.name)}
                  </div>
                )}
                <div>
                  <h4 className="font-headline font-bold text-primary text-base line-clamp-1">{member.name}</h4>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Award className="w-3.5 h-3.5 text-secondary" />
                    <span className="font-mono text-[10px] font-bold text-secondary uppercase tracking-widest">{member.title}</span>
                  </div>
                </div>
              </div>

              {/* Roster Badge */}
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  member.role !== "Member" 
                    ? "bg-secondary-container text-on-secondary-container border border-secondary-container/20" 
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  {member.role}
                </span>
              </div>
            </div>

            {/* Email contact links */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <a href={`mailto:${member.email}`} className="flex items-center gap-2 hover:text-primary hover:underline font-body font-medium">
                <Mail className="w-4 h-4 text-primary" />
                <span className="line-clamp-1">{member.email}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Roster Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-[32px] max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mx-auto shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <h4 className="font-headline text-lg font-bold text-primary">No members found</h4>
          <p className="font-body text-xs text-slate-500 px-6">
            Try searching with a different name, pathway credentials, or register a new Toastmaster officer to the roster.
          </p>
        </div>
      )}

      {/* Add / Edit Member Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-headline text-xl font-bold text-primary mb-6">
              {editingMember ? "Edit Officer Profile" : "Register New Toastmaster"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="input-glass w-full px-4 py-2.5 rounded-xl font-sans text-sm text-slate-800" 
                  placeholder="e.g., TM Saranya" 
                />
              </div>

              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-1.5">Club Role / Office</label>
                <select 
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-sans text-sm text-slate-800 focus:outline-none focus:border-primary"
                >
                  <option value="President">President</option>
                  <option value="VP Membership">VP Membership</option>
                  <option value="VP Education">VP Education</option>
                  <option value="PRO">PRO</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Sergeant At Arms">Sergeant At Arms</option>
                  <option value="Past Immediate President">Past Immediate President</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-1.5">Pathways Level / Educational Title</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="input-glass w-full px-4 py-2.5 rounded-xl font-sans text-sm text-slate-800" 
                  placeholder="e.g., DTM, PM5, LD3" 
                />
              </div>

              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="input-glass w-full px-4 py-2.5 rounded-xl font-sans text-sm text-slate-800" 
                  placeholder="e.g., contact@toastmasters.org" 
                />
              </div>

              {/* Photo Upload Builder Option */}
              <div>
                <label className="block font-headline text-xs font-semibold text-primary mb-1.5">Profile Photo (Optional)</label>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  {formPhoto ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-slate-300 shadow-inner shrink-0">
                      <img src={formPhoto} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFormPhoto("")}
                        className="absolute inset-0 bg-black/70 text-white flex items-center justify-center text-[9px] font-bold opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300 text-slate-400 font-bold text-xs shrink-0">
                      Initials
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormPhoto(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[11px] file:font-bold file:bg-primary file:text-white hover:file:opacity-90 file:cursor-pointer cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400">PNG, JPG or SVG formats supported.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-headline font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-headline font-bold hover:opacity-90 shadow transition-colors cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
