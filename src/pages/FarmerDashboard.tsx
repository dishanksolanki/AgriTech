import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';
import { fetchLiveWeather, INDIAN_AGRI_LOCATIONS } from '../services/weatherService';
import { Farm, Crop, FarmActivity, SoilReport, AgriculturalAlert, LiveWeatherData } from '../types';
import { ASSET_IMAGES } from '../assets/images';
import { 
  MapPin, Wheat, CloudSun, FlaskConical, AlertTriangle, Plus, 
  ArrowUpRight, Droplets, Wind, Calendar, CheckCircle2, ChevronRight, Activity 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface FarmerDashboardProps {
  onNavigate: (tab: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [activities, setActivities] = useState<FarmActivity[]>([]);
  const [soilReports, setSoilReports] = useState<SoilReport[]>([]);
  const [alerts, setAlerts] = useState<AgriculturalAlert[]>([]);
  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    if (!user) return;
    const userFarms = StorageService.getFarms(user.id);
    const userCrops = StorageService.getCrops(user.id);
    const userActs = StorageService.getActivities(user.id);
    const userSoil = StorageService.getSoilReports(user.id);
    const allAlerts = StorageService.getAlerts();

    setFarms(userFarms);
    setCrops(userCrops);
    setActivities(userActs);
    setSoilReports(userSoil);
    setAlerts(allAlerts);

    // Weather for farmer's region
    const matchedLoc = INDIAN_AGRI_LOCATIONS.find(
      l => l.state.toLowerCase() === user.state?.toLowerCase() || l.district.toLowerCase() === user.district?.toLowerCase()
    ) || INDIAN_AGRI_LOCATIONS[0];

    fetchLiveWeather(matchedLoc).then(w => {
      setWeather(w);
      setLoadingWeather(false);
    });
  }, [user]);

  const latestSoil = soilReports[0];

  // Weather chart data
  const chartData = weather?.forecast.map(f => ({
    name: f.dayName,
    temp: f.tempMax,
    rain: f.rainProbability,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <div className="text-xs text-neutral-500 font-medium">
            {t.dashboard.subtitle}, <strong className="text-neutral-900">{user?.name}</strong>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-0.5">
            {t.dashboard.title}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Monitoring {farms.length} registered plots across {user?.district || 'Anand'}, {user?.state || 'Gujarat'}.
          </p>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('farms')}
            className="px-3 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.dashboard.addFarm}</span>
          </button>

          <button
            onClick={() => onNavigate('crops')}
            className="px-3 py-2 bg-emerald-50 text-[#14532D] border border-emerald-200 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.dashboard.registerCrop}</span>
          </button>

          <button
            onClick={() => onNavigate('soil')}
            className="px-3 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {t.dashboard.testSoil}
          </button>

          <button
            onClick={() => onNavigate('weather')}
            className="px-3 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            {t.dashboard.checkWeather}
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Farms */}
        <div 
          onClick={() => onNavigate('farms')}
          className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span>{t.dashboard.totalFarms}</span>
            <MapPin className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {farms.length}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>Total: {farms.reduce((acc, f) => acc + f.area, 0).toFixed(1)} Acres</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-emerald-700 transition-colors" />
          </div>
        </div>

        {/* Active Crops */}
        <div 
          onClick={() => onNavigate('crops')}
          className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span>{t.dashboard.activeCrops}</span>
            <Wheat className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {crops.length}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>{crops.map(c => c.name.split(' ')[0]).join(', ') || 'No crops'}</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-amber-600 transition-colors" />
          </div>
        </div>

        {/* Soil Health Status */}
        <div 
          onClick={() => onNavigate('soil')}
          className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-emerald-600 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span>{t.dashboard.soilSummary}</span>
            <FlaskConical className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 tabular-nums">
            {latestSoil ? `pH ${latestSoil.ph}` : '7.1'}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>{latestSoil ? `NPK: ${latestSoil.nitrogen}/${latestSoil.phosphorus}/${latestSoil.potassium}` : 'Balanced soil'}</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>

        {/* Pest Warnings */}
        <div 
          onClick={() => onNavigate('pests')}
          className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-red-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
            <span>{t.dashboard.activeAlerts}</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700 tabular-nums">
            {alerts.filter(a => a.severity === 'High' || a.severity === 'Medium').length}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1 flex items-center justify-between">
            <span>Regional bollworm alert</span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 group-hover:text-red-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* Main Grid: Weather Card + Crop Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weather & Forecast (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Weather Summary Card */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Live Farm Micro-Climate ({weather?.locationName || 'Anand, Gujarat'})
                </h3>
              </div>
              <span className="text-[11px] text-neutral-500">
                Updated {weather?.lastUpdated || 'Just now'}
              </span>
            </div>

            {loadingWeather ? (
              <div className="py-8 text-center text-xs text-neutral-400">Loading live weather telemetry...</div>
            ) : (
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-neutral-900 tabular-nums">
                      {weather?.currentTemp}°C
                    </span>
                    <span className="text-xs text-neutral-500">
                      Feels like {weather?.feelsLike}°C · {weather?.condition}
                    </span>
                  </div>
                  <div className="text-right text-xs text-neutral-600 space-y-0.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      <span>Humidity: <strong>{weather?.humidity}%</strong></span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <Wind className="w-3.5 h-3.5 text-slate-500" />
                      <span>Wind: <strong>{weather?.windSpeed} km/h</strong></span>
                    </div>
                  </div>
                </div>

                {/* 7-Day Trend Chart */}
                <div className="pt-2">
                  <div className="text-xs font-semibold text-neutral-700 mb-2">
                    7-Day High Temperature (°C) & Rain Probability (%)
                  </div>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14532D" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#14532D" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="temp" stroke="#14532D" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" name="Temp (°C)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Agronomic advisory note */}
                {weather?.advisory && weather.advisory.length > 0 && (
                  <div className="bg-[#F8F7F0] p-3 rounded-lg border border-neutral-200 text-xs text-neutral-700 space-y-1">
                    <div className="font-bold text-[#14532D] flex items-center gap-1">
                      <span>Agronomic Advisory:</span>
                    </div>
                    <p>{weather.advisory[0]}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Farm Activities Timeline */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#14532D]" />
                <h3 className="text-sm font-bold text-neutral-900">
                  {t.dashboard.recentActivities}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('crops')}
                className="text-xs text-[#14532D] font-semibold hover:underline cursor-pointer"
              >
                {t.dashboard.viewAll}
              </button>
            </div>

            <div className="pt-4 divide-y divide-neutral-100">
              {activities.length === 0 ? (
                <div className="text-xs text-neutral-400 py-4 text-center">No activities recorded yet.</div>
              ) : (
                activities.slice(0, 4).map((act) => (
                  <div key={act.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{act.activityType}</div>
                      <p className="text-xs text-neutral-600 mt-0.5">{act.description}</p>
                      <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-2">
                        <span>{act.activityDate}</span>
                        {act.cost && (
                          <>
                            <span>·</span>
                            <span>Cost: ₹{act.cost.toLocaleString('en-IN')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium shrink-0">
                      Completed
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Crop Health Overview & Quick Links (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Crop Cards */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Wheat className="w-4 h-4 text-[#14532D]" />
                <h3 className="text-sm font-bold text-neutral-900">
                  {t.dashboard.cropHealthOverview}
                </h3>
              </div>
              <button
                onClick={() => onNavigate('crops')}
                className="text-xs text-[#14532D] font-semibold hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="pt-4 space-y-4">
              {crops.length === 0 ? (
                <div className="text-xs text-neutral-500 py-6 text-center">
                  {t.dashboard.noCropsYet}
                </div>
              ) : (
                crops.map((crop) => {
                  const sowing = new Date(crop.sowingDate);
                  const now = new Date();
                  const daysSinceSowing = Math.max(0, Math.floor((now.getTime() - sowing.getTime()) / (1000 * 60 * 60 * 24)));
                  const harvest = new Date(crop.expectedHarvestDate);
                  const daysToHarvest = Math.max(0, Math.floor((harvest.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

                  return (
                    <div key={crop.id} className="p-3 rounded-lg border border-neutral-200 bg-[#F8F7F0]/60 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900">{crop.name}</h4>
                          <p className="text-[11px] text-neutral-500">{crop.variety} · {crop.cultivatedArea} Acres</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          crop.healthStatus === 'Excellent' 
                            ? 'bg-emerald-100 text-[#14532D]' 
                            : crop.healthStatus === 'Good' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {crop.healthStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-neutral-200/60">
                        <div>
                          <span className="text-neutral-500">Days Since Sowing:</span>
                          <div className="font-bold text-neutral-900 tabular-nums">{daysSinceSowing} days</div>
                        </div>
                        <div>
                          <span className="text-neutral-500">Est. to Harvest:</span>
                          <div className="font-bold text-[#14532D] tabular-nums">{daysToHarvest} days</div>
                        </div>
                      </div>

                      <div className="text-[11px] text-neutral-600">
                        <span className="font-medium text-neutral-700">Stage:</span> {crop.growthStage}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Regional Alert Summary */}
          <div className="bg-white p-6 rounded-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Regional Pest Watch</span>
              </h3>
              <button
                onClick={() => onNavigate('pests')}
                className="text-xs text-[#14532D] font-semibold hover:underline cursor-pointer"
              >
                All Alerts
              </button>
            </div>

            <div className="pt-3 space-y-3">
              {alerts.slice(0, 2).map((a) => (
                <div key={a.id} className="p-3 bg-red-50/50 rounded-lg border border-red-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-900">{a.title}</span>
                    <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-semibold">
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 line-clamp-2">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
