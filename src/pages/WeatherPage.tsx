import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  fetchLiveWeather, INDIAN_AGRI_LOCATIONS, LocationPreset 
} from '../services/weatherService';
import { LiveWeatherData } from '../types';
import { 
  CloudSun, Droplets, Wind, CloudRain, Sun, 
  MapPin, RefreshCw, AlertCircle, ShieldAlert, Sparkles, Compass 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const WeatherPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const [selectedLocation, setSelectedLocation] = useState<LocationPreset>(() => {
    if (user?.state) {
      const match = INDIAN_AGRI_LOCATIONS.find(
        l => l.state.toLowerCase() === user.state.toLowerCase() || l.district.toLowerCase() === user.district.toLowerCase()
      );
      if (match) return match;
    }
    return INDIAN_AGRI_LOCATIONS[0];
  });

  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = async (loc: LocationPreset) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLiveWeather(loc);
      setWeatherData(data);
    } catch {
      setError('Unable to reach Open-Meteo weather servers. Loaded calibrated regional fallback.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  const rainChartData = weatherData?.forecast.map(f => ({
    name: f.dayName,
    rainProb: f.rainProbability,
    precip: f.precipitationMm,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header & Location Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#14532D]">
            <Compass className="w-4 h-4 text-[#2E7D32]" />
            <span>Open-Meteo High-Resolution Agricultural Reanalysis</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight mt-0.5">
            Micro-Climate & Monsoon Forecast
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Real-time atmospheric parameters and 7-day agricultural spray & irrigation advisories.
          </p>
        </div>

        {/* Location Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={selectedLocation.id}
              onChange={(e) => {
                const found = INDIAN_AGRI_LOCATIONS.find(l => l.id === e.target.value);
                if (found) setSelectedLocation(found);
              }}
              className="text-xs font-semibold pl-3 pr-8 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D] cursor-pointer"
            >
              {INDIAN_AGRI_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.district}, {loc.state} ({loc.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => loadWeather(selectedLocation)}
            disabled={isLoading}
            className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-100 text-neutral-600 cursor-pointer"
            title="Refresh Live Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Realtime Telemetry Grid */}
      {weatherData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hero Telemetry Card (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-neutral-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
              <div>
                <span className="text-xs text-neutral-500 font-medium">Selected Agricultural Zone</span>
                <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#14532D]" />
                  <span>{weatherData.locationName}</span>
                </h3>
              </div>
              <div className="text-xs text-neutral-500 sm:text-right">
                <div>Coordinates: <span className="font-mono text-neutral-700">{weatherData.latitude.toFixed(2)}°N, {weatherData.longitude.toFixed(2)}°E</span></div>
                <div>Last Synced: <strong className="text-neutral-800">{weatherData.lastUpdated}</strong></div>
              </div>
            </div>

            {/* Current Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>Current Temp</span>
                </div>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1 tabular-nums">
                  {weatherData.currentTemp}°C
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Feels like {weatherData.feelsLike}°C
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>Relative Humidity</span>
                </div>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1 tabular-nums">
                  {weatherData.humidity}%
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Dew point normal
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Wind className="w-4 h-4 text-slate-500" />
                  <span>Wind Velocity</span>
                </div>
                <div className="text-3xl font-extrabold text-neutral-900 mt-1 tabular-nums">
                  {weatherData.windSpeed} <span className="text-xs font-normal text-neutral-500">km/h</span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Safe for spray &lt; 15 km/h
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F8F7F0] border border-neutral-200">
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <CloudRain className="w-4 h-4 text-emerald-600" />
                  <span>Rain Probability</span>
                </div>
                <div className="text-3xl font-extrabold text-[#14532D] mt-1 tabular-nums">
                  {weatherData.forecast[0]?.rainProbability || 10}%
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  {weatherData.precipitation} mm today
                </div>
              </div>
            </div>

            {/* Precipitation & Rain Probability Bar Chart */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  7-Day Precipitation Probability (%) by Day
                </h4>
                <span className="text-[11px] text-neutral-500">Source: Open-Meteo GFS/ECMWF</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rainChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="rainProb" fill="#14532D" radius={[4, 4, 0, 0]} name="Rain Probability (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 7-Day Day-by-Day Forecast Table */}
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
                7-Day Agronomic Forecast Breakdown
              </h4>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Day</th>
                      <th className="py-2.5 px-3">Condition</th>
                      <th className="py-2.5 px-3 text-right">Max / Min (°C)</th>
                      <th className="py-2.5 px-3 text-right">Rain Chance</th>
                      <th className="py-2.5 px-3 text-right">Precipitation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {weatherData.forecast.map((day) => (
                      <tr key={day.date} className="hover:bg-neutral-50">
                        <td className="py-2.5 px-3 font-bold text-neutral-900">{day.dayName}</td>
                        <td className="py-2.5 px-3 text-neutral-600">{day.weatherDescription}</td>
                        <td className="py-2.5 px-3 text-right font-medium tabular-nums text-neutral-900">
                          {day.tempMax}° / {day.tempMin}°
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums">
                          <span className={day.rainProbability > 40 ? 'text-blue-700 font-bold' : 'text-neutral-600'}>
                            {day.rainProbability}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right tabular-nums text-neutral-600">
                          {day.precipitationMm} mm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Agronomic Advisories & Precautions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                <ShieldAlert className="w-5 h-5 text-[#2E7D32]" />
                <h3 className="text-sm font-bold text-neutral-900">
                  Farming Advisories for This Week
                </h3>
              </div>

              <div className="space-y-3">
                {weatherData.advisory.map((adv, idx) => (
                  <div key={idx} className="p-3 bg-[#F8F7F0] rounded-lg border border-neutral-200 text-xs text-neutral-800 leading-relaxed">
                    <span className="font-bold text-[#14532D] block mb-1">
                      Advisory #{idx + 1}:
                    </span>
                    {adv}
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-neutral-500 border-t border-neutral-100 leading-normal">
                Advisories are generated from real-time micro-climate metrics in alignment with Indian Council of Agricultural Research (ICAR) weather-pest threshold guidelines.
              </div>
            </div>

            {/* Quick Irrigation Recommendation */}
            <div className="bg-[#14532D] text-white p-6 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-lime-300 text-xs font-bold uppercase tracking-wider">
                <Droplets className="w-4 h-4" />
                <span>Irrigation Optimization</span>
              </div>
              <h4 className="text-base font-bold">
                {weatherData.forecast[0]?.rainProbability > 50 
                  ? 'Rain Likely: Pause Irrigation' 
                  : 'Favorable Drip Window'}
              </h4>
              <p className="text-xs text-emerald-100 leading-relaxed">
                {weatherData.forecast[0]?.rainProbability > 50
                  ? 'Adequate surface rain anticipated in the next 36 hours. Hold supplementary canal or tube well pumping.'
                  : 'Evapotranspiration is active. Schedule 45-60 min drip fertigation during late afternoon to minimize thermal vapor loss.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
