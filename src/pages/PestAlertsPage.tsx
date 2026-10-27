import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';
import { AgriculturalAlert, AlertSeverity } from '../types';
import { 
  AlertTriangle, ShieldAlert, CheckCircle2, Plus, 
  Search, Filter, X, ShieldCheck, UserCheck, AlertCircle 
} from 'lucide-react';

export const PestAlertsPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [alerts, setAlerts] = useState<AgriculturalAlert[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [cropFilter, setCropFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Farmer report form
  const [title, setTitle] = useState('');
  const [crop, setCrop] = useState('Cotton');
  const [state, setState] = useState(user?.state || 'Gujarat');
  const [district, setDistrict] = useState(user?.district || 'Anand');
  const [severity, setSeverity] = useState<AlertSeverity>('Medium');
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [preventiveMeasures, setPreventiveMeasures] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = () => {
    setAlerts(StorageService.getAlerts());
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !symptoms.trim() || !description.trim()) {
      setError('Please fill out the alert title, observed symptoms, and field details.');
      return;
    }

    StorageService.addAlert({
      title,
      crop,
      state,
      district,
      severity,
      symptoms,
      description,
      preventiveMeasures: preventiveMeasures || 'Regular field scouting recommended until verified by local extension scientist.',
      isVerified: user.role === 'admin',
      reportedBy: user.name,
      reportedByRole: user.role,
      reportedDate: new Date().toISOString().split('T')[0],
    });

    setIsReportModalOpen(false);
    loadAlerts();
    setTitle('');
    setSymptoms('');
    setDescription('');
    setPreventiveMeasures('');
    setError(null);
  };

  const handleVerify = (id: string, current: boolean) => {
    if (user?.role !== 'admin') return;
    StorageService.verifyAlert(id, !current);
    loadAlerts();
  };

  // Filtering
  const filteredAlerts = alerts.filter((a) => {
    const matchesSeverity = severityFilter === 'All' || a.severity === severityFilter;
    const matchesCrop = cropFilter === 'All' || a.crop.toLowerCase().includes(cropFilter.toLowerCase());
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesCrop && matchesSearch;
  });

  const getSeverityBadge = (sev: AlertSeverity) => {
    switch (sev) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {t.nav.pests}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Regional agricultural university advisories and crowdsourced farmer pest observations.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsReportModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Report Suspected Pest Threat</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, pest name, or symptoms..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Severity tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg text-xs font-medium">
            {['All', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  severityFilter === sev ? 'bg-white text-neutral-900 shadow-xs font-bold' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Crop filter */}
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="text-xs px-3 py-1.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
          >
            <option value="All">All Crops</option>
            <option value="Cotton">Cotton</option>
            <option value="Wheat">Wheat</option>
            <option value="Rice">Rice / Paddy</option>
            <option value="Mustard">Mustard</option>
            <option value="Maize">Maize</option>
          </select>
        </div>
      </div>

      {/* Alerts Grid */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center text-xs text-neutral-400">
          No pest or disease advisories found matching your current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs hover:border-neutral-300 transition-all space-y-4"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded border ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity} Severity
                  </span>
                  <h3 className="text-base font-bold text-neutral-900">{alert.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  {alert.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ICAR / University Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Peer Farmer Report (Unverified)</span>
                    </span>
                  )}

                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleVerify(alert.id, alert.isVerified)}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded border border-neutral-300 hover:bg-neutral-100 cursor-pointer"
                    >
                      {alert.isVerified ? 'Mark Unverified' : 'Verify as Admin'}
                    </button>
                  )}
                </div>
              </div>

              {/* Scope & Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                <span>Crop: <strong className="text-neutral-800">{alert.crop}</strong></span>
                <span>·</span>
                <span>Affected Zone: <strong className="text-neutral-800">{alert.district}, {alert.state}</strong></span>
                <span>·</span>
                <span>Reported on: <strong className="text-neutral-800">{alert.reportedDate}</strong></span>
                <span>·</span>
                <span>By: {alert.reportedBy}</span>
              </div>

              {/* Symptoms & Preventive Measures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1">
                  <span className="font-bold text-neutral-900 block">Observed Symptoms:</span>
                  <p className="text-neutral-600 leading-relaxed text-[11px]">{alert.symptoms}</p>
                </div>

                <div className="p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-1">
                  <span className="font-bold text-[#14532D] block">Recommended Preventive Measures:</span>
                  <p className="text-neutral-700 leading-relaxed text-[11px]">{alert.preventiveMeasures}</p>
                </div>
              </div>

              {alert.description && (
                <p className="text-xs text-neutral-600 leading-relaxed pt-1">
                  {alert.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                Report Suspected Agricultural Threat
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Alert Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sucking pest / aphid clustering on mustard buds"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Crop Affected</label>
                  <input
                    type="text"
                    required
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="e.g. Cotton"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    <option value="Low">Low (Isolated patches)</option>
                    <option value="Medium">Medium (Expanding threshold)</option>
                    <option value="High">High (Immediate intervention required)</option>
                    <option value="Informational">Informational</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">District / Tehsil</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Observed Foliage / Fruit Symptoms *</label>
                <textarea
                  rows={2}
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe leaf spots, curling, frass, discoloration, or wilt..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Field Description / Outbreak Scope *</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="How many acres or neighbor farms are showing similar issues?"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Suggested Preventive Action (Optional)</label>
                <textarea
                  rows={2}
                  value={preventiveMeasures}
                  onChange={(e) => setPreventiveMeasures(e.target.value)}
                  placeholder="e.g. Neem spray, pheromone traps, spacing..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-md hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-md hover:bg-[#0f3e22] cursor-pointer"
                >
                  Publish Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
