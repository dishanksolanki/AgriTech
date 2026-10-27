import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';
import { 
  User, CheckCircle2, AlertCircle, Save, 
  RotateCcw, ShieldCheck, Globe, MapPin, Phone, Mail 
} from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user, updateUser, switchDemoAccount, allDemoUsers } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [state, setState] = useState(user?.state || 'Gujarat');
  const [district, setDistrict] = useState(user?.district || 'Anand');
  const [prefLang, setPrefLang] = useState<'en' | 'hi'>(user?.preferredLanguage || 'en');
  const [savedNotice, setSavedNotice] = useState(false);
  const [resetNotice, setResetNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    updateUser({
      name,
      mobile,
      state,
      district,
      preferredLanguage: prefLang,
    });
    setLanguage(prefLang);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all agricultural demo data to initial defaults?')) {
      StorageService.resetToDefaults();
      setResetNotice(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200">
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
          Farmer Profile & Operational Preferences
        </h1>
        <p className="text-xs text-neutral-600 mt-1">
          Manage your personal details, regional taluka settings, and preferred interface dialect.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {resetNotice && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-xs text-blue-800 rounded-lg">
          Resetting database to initial baseline state...
        </div>
      )}

      {/* Main Profile Form */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
          <div className="w-16 h-16 rounded-full bg-[#14532D] text-white flex items-center justify-center font-bold text-2xl">
            {user?.name.charAt(0) || 'F'}
          </div>
          <div>
            <h2 className="text-base font-bold text-neutral-900">{user?.name}</h2>
            <p className="text-xs text-neutral-500">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Role: {user?.role === 'admin' ? 'System Administrator' : 'Verified Farmer'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Registered Email (Read Only)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full text-xs px-3 py-2 border border-neutral-200 bg-neutral-100 text-neutral-500 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Contact</label>
              <input
                type="text"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Preferred Language</label>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value as any)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              >
                <option value="en">English (English)</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              >
                <option value="Gujarat">Gujarat</option>
                <option value="Punjab">Punjab</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">District / Taluka</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Account Switching & Sandbox Reset */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-neutral-900">
          Evaluator & Sandbox Controls
        </h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Switch active account instantly to verify role-based permissions or reset data back to pristine state.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allDemoUsers.map((u) => (
            <button
              key={u.id}
              onClick={() => switchDemoAccount(u.id)}
              className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                user?.id === u.id
                  ? 'border-[#14532D] bg-emerald-50 text-[#14532D]'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-700'
              }`}
            >
              <div className="font-bold text-xs">{u.name}</div>
              <div className="text-[11px] text-neutral-500 capitalize">{u.role} · {u.district}</div>
              {user?.id === u.id && (
                <span className="text-[10px] font-bold text-emerald-800 block mt-1">● Active Session</span>
              )}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
          <span className="text-xs text-neutral-500">Need to restore original demo seed records?</span>
          <button
            onClick={handleResetData}
            className="px-3 py-1.5 border border-red-200 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-50 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Database to Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
