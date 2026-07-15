import React, { useState } from "react";
import { Save, RefreshCw, Sliders, Shield, Zap, Sparkles } from "lucide-react";

interface SettingsViewProps {
  onResetToDefaults: () => void;
}

export default function SettingsView({ onResetToDefaults }: SettingsViewProps) {
  const [clubName, setClubName] = useState("KOLATHUR SPEAKERS TOASTMASTERS CLUB");
  const [clubNumber, setClubNumber] = useState("28679417");
  const [district, setDistrict] = useState("Area 02 | Division B | District 229");
  const [venue, setVenue] = useState("Exemplary Solutions 91/31, Second floor, Surapet main road, puthagaram, vinayagapuram, chennai-600099");

  const [enableThemeEnrichment, setEnableThemeEnrichment] = useState(true);
  const [enableToneInsights, setEnableToneInsights] = useState(true);
  const [enableAbstractGen, setEnableAbstractGen] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline text-3xl font-bold text-primary">Club Settings</h2>
          <p className="font-body text-sm text-on-surface-variant">
            Adjust club specifications, manage regional details, and configure integrated Gemini models.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Club Identity */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="font-headline font-bold text-primary text-lg flex items-center gap-2 border-b border-surface-container pb-3">
            <Sliders className="w-5 h-5 text-secondary" />
            Club Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Club Name</label>
              <input 
                type="text" 
                value={clubName} 
                onChange={(e) => setClubName(e.target.value)}
                required
                className="input-glass w-full px-4 py-3 rounded-xl font-sans text-sm text-on-surface" 
              />
            </div>
            <div>
              <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Club Registry ID</label>
              <input 
                type="text" 
                value={clubNumber} 
                onChange={(e) => setClubNumber(e.target.value)}
                required
                className="input-glass w-full px-4 py-3 rounded-xl font-sans text-sm text-on-surface" 
              />
            </div>
            <div>
              <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">District / Division</label>
              <input 
                type="text" 
                value={district} 
                onChange={(e) => setDistrict(e.target.value)}
                required
                className="input-glass w-full px-4 py-3 rounded-xl font-sans text-sm text-on-surface" 
              />
            </div>
            <div>
              <label className="block font-headline text-xs font-semibold text-primary mb-2 ml-1">Meeting Venue / Address</label>
              <input 
                type="text" 
                value={venue} 
                onChange={(e) => setVenue(e.target.value)}
                required
                className="input-glass w-full px-4 py-3 rounded-xl font-sans text-sm text-on-surface" 
              />
            </div>
          </div>
        </div>

        {/* Section 2: AI Configurations */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="font-headline font-bold text-primary text-lg flex items-center gap-2 border-b border-surface-container pb-3">
            <Zap className="w-5 h-5 text-secondary" />
            Gemini Cognitive Engine
          </h3>

          <div className="space-y-4">
            {/* Setting 1 */}
            <div className="flex items-center justify-between p-4 bg-white/40 border border-outline-variant/10 rounded-2xl">
              <div>
                <h4 className="font-headline text-sm font-bold text-primary">Auto-enrich Session Linguistics</h4>
                <p className="font-body text-xs text-on-surface-variant">Generate customized WOD/Quotes aligning to your chosen theme.</p>
              </div>
              <input 
                type="checkbox" 
                checked={enableThemeEnrichment}
                onChange={(e) => setEnableThemeEnrichment(e.target.checked)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>

            {/* Setting 2 */}
            <div className="flex items-center justify-between p-4 bg-white/40 border border-outline-variant/10 rounded-2xl">
              <div>
                <h4 className="font-headline text-sm font-bold text-primary">Tone &amp; Attendance Predictions</h4>
                <p className="font-body text-xs text-on-surface-variant">Employ Gemini analytical models to map meeting quality indicators.</p>
              </div>
              <input 
                type="checkbox" 
                checked={enableToneInsights}
                onChange={(e) => setEnableToneInsights(e.target.checked)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>

            {/* Setting 3 */}
            <div className="flex items-center justify-between p-4 bg-white/40 border border-outline-variant/10 rounded-2xl">
              <div>
                <h4 className="font-headline text-sm font-bold text-primary">AI Educational Abstract Writer</h4>
                <p className="font-body text-xs text-on-surface-variant">Enable automated masterclass summary drafting on Step 4.</p>
              </div>
              <input 
                type="checkbox" 
                checked={enableAbstractGen}
                onChange={(e) => setEnableAbstractGen(e.target.checked)}
                className="w-5 h-5 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Roster System Actions */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 border border-error-container/20">
          <h3 className="font-headline font-bold text-error text-lg flex items-center gap-2 border-b border-error-container/10 pb-3">
            <Shield className="w-5 h-5 text-error" />
            Roster &amp; Database Maintenance
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-error-container/5 border border-error/10 rounded-2xl gap-4">
            <div>
              <h4 className="font-headline text-sm font-bold text-error">Restore Club Officer Defaults</h4>
              <p className="font-body text-xs text-on-surface-variant max-w-md">
                Reset your entire database, purging custom entries and restoring the designated original 8-officer Toastmasters list.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to reset all data and restore original Toastmasters officer defaults? This cannot be undone.")) {
                  onResetToDefaults();
                  alert("Roster reset successfully!");
                }
              }}
              className="px-5 py-3 bg-error text-on-error rounded-full text-xs font-headline font-semibold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Database
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary font-headline text-sm font-bold rounded-full shadow-lg hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Preferences..." : "Save Preferences"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
