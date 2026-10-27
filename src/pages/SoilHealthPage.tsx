import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';
import { SoilReport, Farm, SoilType } from '../types';
import { ASSET_IMAGES } from '../assets/images';
import { 
  FlaskConical, Plus, AlertCircle, CheckCircle2, 
  HelpCircle, Info, X, ChevronRight, Mountain 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const SoilHealthPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [reports, setReports] = useState<SoilReport[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedReport, setSelectedReport] = useState<SoilReport | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [farmId, setFarmId] = useState('');
  const [ph, setPh] = useState<number>(6.8);
  const [nitrogen, setNitrogen] = useState<number>(310);
  const [phosphorus, setPhosphorus] = useState<number>(22);
  const [potassium, setPotassium] = useState<number>(210);
  const [moisture, setMoisture] = useState<number>(34);
  const [organicCarbon, setOrganicCarbon] = useState<number>(0.65);
  const [cropCultivated, setCropCultivated] = useState('Sharbati Wheat');
  const [soilType, setSoilType] = useState<SoilType>('Sandy Loam');
  const [testedDate, setTestedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    if (!user) return;
    const userFarms = StorageService.getFarms(user.role === 'admin' ? undefined : user.id);
    const userReports = StorageService.getSoilReports(user.role === 'admin' ? undefined : user.id);
    setFarms(userFarms);
    setReports(userReports);
    if (userReports.length > 0 && !selectedReport) {
      setSelectedReport(userReports[0]);
    }
    if (userFarms.length > 0 && !farmId) {
      setFarmId(userFarms[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !farmId) {
      setError('Please choose an associated farm.');
      return;
    }

    const newReport = StorageService.addSoilReport({
      userId: user.id,
      farmId,
      testedDate,
      ph: Number(ph),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      moisturePercent: Number(moisture),
      organicCarbonPercent: Number(organicCarbon),
      cropCultivated,
      soilType,
      notes,
    });

    setIsModalOpen(false);
    loadData();
    setSelectedReport(newReport);
  };

  // Evaluation helpers
  const getPhStatus = (val: number) => {
    if (val < 6.0) return { label: 'Acidic (Low)', color: 'text-amber-700 bg-amber-50', tip: 'Consider agricultural lime application to bring soil toward neutral 6.5-7.0.' };
    if (val > 7.5) return { label: 'Alkaline (High)', color: 'text-amber-700 bg-amber-50', tip: 'Consider gypsum incorporation or organic compost to buffer alkaline salts.' };
    return { label: 'Optimal / Neutral', color: 'text-emerald-800 bg-emerald-50', tip: 'Nutrient availability is at peak biological efficiency.' };
  };

  const getNitrogenStatus = (n: number) => {
    if (n < 280) return { label: 'Low (< 280 kg/ha)', status: 'Low', tip: 'Incorporate leguminous green manure or apply split doses of neem-coated urea.' };
    if (n > 560) return { label: 'High (> 560 kg/ha)', status: 'High', tip: 'Avoid additional synthetic nitrogen to prevent excessive vegetative lodging and disease vulnerability.' };
    return { label: 'Medium (Optimal)', status: 'Medium', tip: 'Maintain current organic biomass cycling.' };
  };

  const getPhosphorusStatus = (p: number) => {
    if (p < 10) return { label: 'Low (< 10 kg/ha)', status: 'Low', tip: 'Inoculate seed with PSB (Phosphate Solubilizing Bacteria) and apply single superphosphate (SSP).' };
    if (p > 25) return { label: 'High (> 25 kg/ha)', status: 'High', tip: 'Phosphorus reserve is abundant. Reduce basal DAP application.' };
    return { label: 'Medium (Adequate)', status: 'Medium', tip: 'Satisfactory root development support.' };
  };

  const getPotassiumStatus = (k: number) => {
    if (k < 120) return { label: 'Low (< 120 kg/ha)', status: 'Low', tip: 'Apply Muriate of Potash (MOP) to enhance pest resistance and grain weight.' };
    if (k > 280) return { label: 'High (> 280 kg/ha)', status: 'High', tip: 'Potash reserves are sufficient; focus on micro-nutrients.' };
    return { label: 'Medium (Optimal)', status: 'Medium', tip: 'Balanced for grain filling and stalk strength.' };
  };

  const currentReport = selectedReport || reports[0];

  const chartData = currentReport ? [
    { name: 'Nitrogen (N)', value: currentReport.nitrogen, benchmark: 350, unit: 'kg/ha' },
    { name: 'Potassium (K)', value: currentReport.potassium, benchmark: 200, unit: 'kg/ha' },
    { name: 'Phosphorus (P)', value: currentReport.phosphorus * 10, benchmark: 180, unit: 'kg/ha (x10)' },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {t.nav.soil}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Input authorized Soil Health Card laboratory data to assess N-P-K balances, acidity, and organic carbon.
          </p>
        </div>

        <button
          onClick={() => {
            setError(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Enter Soil Test Results</span>
        </button>
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">Important Agricultural Advisory & Scientific Boundary:</p>
          <p className="text-neutral-700 leading-relaxed text-[11px]">
            This digital platform <strong>does not physically analyze soil samples through software</strong>. All interpretations and benchmarks are educational deductions calculated strictly from laboratory values entered by the farmer. Do not purchase or broadcast chemical fertilizers solely based on general calculations; consult your local Krishi Vigyan Kendra (KVK) or certified agronomist for customized soil amendments.
          </p>
        </div>
      </div>

      {/* Main Content: Previous Reports Sidebar + Current Analysis View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports History List (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-neutral-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Saved Soil Test Reports ({reports.length})
            </h3>
          </div>

          {reports.length === 0 ? (
            <div className="text-xs text-neutral-400 py-8 text-center">
              No soil reports entered yet. Click &quot;Enter Soil Test Results&quot; above.
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((rep) => {
                const farm = farms.find(f => f.id === rep.farmId);
                const isSelected = currentReport?.id === rep.id;
                return (
                  <button
                    key={rep.id}
                    onClick={() => setSelectedReport(rep)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#14532D] bg-emerald-50/70 shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-xs text-neutral-900">{farm?.name || 'Farm Plot'}</div>
                      <span className="text-[10px] text-neutral-500">{rep.testedDate}</span>
                    </div>
                    <div className="text-[11px] text-neutral-600 mt-1">
                      Crop: {rep.cropCultivated} · pH {rep.ph}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      N: {rep.nitrogen} · P: {rep.phosphorus} · K: {rep.potassium} kg/ha
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Report Detailed Breakdown (8 cols) */}
        {currentReport ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Top Analysis Card */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                <div>
                  <span className="text-xs text-neutral-500 font-medium">Laboratory Card Analysis</span>
                  <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-[#14532D]" />
                    <span>Tested for: {currentReport.cropCultivated} ({currentReport.soilType})</span>
                  </h3>
                </div>
                <div className="text-xs text-neutral-500 sm:text-right">
                  <div>Date Tested: <strong className="text-neutral-800">{currentReport.testedDate}</strong></div>
                  <div>Report ID: <span className="font-mono text-neutral-700">{currentReport.id}</span></div>
                </div>
              </div>

              {/* Parameter Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* pH */}
                <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">Soil pH Reaction</span>
                  <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                    {currentReport.ph}
                  </span>
                  <div className="mt-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${getPhStatus(currentReport.ph).color}`}>
                      {getPhStatus(currentReport.ph).label}
                    </span>
                  </div>
                </div>

                {/* Nitrogen */}
                <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">Available Nitrogen (N)</span>
                  <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                    {currentReport.nitrogen} <span className="text-xs font-normal text-neutral-500">kg/ha</span>
                  </span>
                  <div className="mt-1">
                    <span className="text-[10px] text-neutral-600 font-medium">
                      Status: <strong>{getNitrogenStatus(currentReport.nitrogen).status}</strong>
                    </span>
                  </div>
                </div>

                {/* Phosphorus */}
                <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">Available Phosphorus (P)</span>
                  <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                    {currentReport.phosphorus} <span className="text-xs font-normal text-neutral-500">kg/ha</span>
                  </span>
                  <div className="mt-1">
                    <span className="text-[10px] text-neutral-600 font-medium">
                      Status: <strong>{getPhosphorusStatus(currentReport.phosphorus).status}</strong>
                    </span>
                  </div>
                </div>

                {/* Potassium */}
                <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">Available Potassium (K)</span>
                  <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                    {currentReport.potassium} <span className="text-xs font-normal text-neutral-500">kg/ha</span>
                  </span>
                  <div className="mt-1">
                    <span className="text-[10px] text-neutral-600 font-medium">
                      Status: <strong>{getPotassiumStatus(currentReport.potassium).status}</strong>
                    </span>
                  </div>
                </div>

                {/* Organic Carbon */}
                <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">Organic Carbon (OC)</span>
                  <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                    {currentReport.organicCarbonPercent}%
                  </span>
                  <div className="mt-1">
                    <span className="text-[10px] text-neutral-600 font-medium">
                      {currentReport.organicCarbonPercent >= 0.75 ? 'Rich Organic Soil' : 'Moderate Biomass'}
                    </span>
                  </div>
                </div>

                {/* Soil Moisture */}
                <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                  <span className="text-xs text-neutral-500 block">Tested Moisture</span>
                  <span className="text-2xl font-bold text-[#14532D] tabular-nums">
                    {currentReport.moisturePercent}%
                  </span>
                  <div className="mt-1">
                    <span className="text-[10px] text-neutral-600 font-medium">
                      Root Zone Capacity
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart Comparison */}
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-2">
                  Macro-Nutrient Index vs Medium Benchmark
                </h4>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#14532D" radius={[4, 4, 0, 0]} name="Your Soil (kg/ha)" />
                      <Bar dataKey="benchmark" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Ideal Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Educational Management Suggestions */}
              <div className="pt-4 border-t border-neutral-100 space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Educational Soil Management Suggestions
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="font-bold text-neutral-900 block mb-1">pH & Soil Reaction:</span>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      {getPhStatus(currentReport.ph).tip}
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="font-bold text-neutral-900 block mb-1">Nitrogen (N) Strategy:</span>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      {getNitrogenStatus(currentReport.nitrogen).tip}
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="font-bold text-neutral-900 block mb-1">Phosphorus (P) Strategy:</span>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      {getPhosphorusStatus(currentReport.phosphorus).tip}
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                    <span className="font-bold text-neutral-900 block mb-1">Potassium (K) Strategy:</span>
                    <p className="text-neutral-600 text-[11px] leading-relaxed">
                      {getPotassiumStatus(currentReport.potassium).tip}
                    </p>
                  </div>
                </div>

                {currentReport.notes && (
                  <div className="p-3 bg-[#F8F7F0] rounded-lg border border-neutral-200 text-xs text-neutral-700">
                    <strong>Laboratory Notes:</strong> {currentReport.notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white p-12 rounded-xl border border-neutral-200 text-center text-xs text-neutral-400">
            Select a soil report from the left or log a new soil card.
          </div>
        )}
      </div>

      {/* Enter Soil Test Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                Log Soil Health Card Test Values
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Associated Farm *</label>
                  <select
                    value={farmId}
                    onChange={(e) => setFarmId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    {farms.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Crop Cultivated</label>
                  <input
                    type="text"
                    required
                    value={cropCultivated}
                    onChange={(e) => setCropCultivated(e.target.value)}
                    placeholder="e.g. Wheat / Cotton / Paddy"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Soil Type</label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Alluvial">Alluvial</option>
                    <option value="Black (Regur)">Black (Regur)</option>
                    <option value="Red & Yellow">Red & Yellow</option>
                    <option value="Laterite">Laterite</option>
                    <option value="Clay">Clay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Tested Date</label>
                  <input
                    type="date"
                    required
                    value={testedDate}
                    onChange={(e) => setTestedDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Soil pH (0-14)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="3.0"
                    max="10.0"
                    required
                    value={ph}
                    onChange={(e) => setPh(parseFloat(e.target.value) || 7.0)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Moisture (%)</label>
                  <input
                    type="number"
                    step="1"
                    min="5"
                    max="100"
                    required
                    value={moisture}
                    onChange={(e) => setMoisture(parseFloat(e.target.value) || 30)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Organic C (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="5.0"
                    required
                    value={organicCarbon}
                    onChange={(e) => setOrganicCarbon(parseFloat(e.target.value) || 0.6)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Nitrogen (kg/ha)</label>
                  <input
                    type="number"
                    min="50"
                    max="900"
                    required
                    value={nitrogen}
                    onChange={(e) => setNitrogen(parseFloat(e.target.value) || 250)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Phosphorus (kg/ha)</label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    required
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(parseFloat(e.target.value) || 15)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Potassium (kg/ha)</label>
                  <input
                    type="number"
                    min="20"
                    max="700"
                    required
                    value={potassium}
                    onChange={(e) => setPotassium(parseFloat(e.target.value) || 180)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Laboratory / Soil Analyst Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Tested at KVK Anand testing van, recommended zinc sulfate..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-md hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-md hover:bg-[#0f3e22] cursor-pointer"
                >
                  Save Soil Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
