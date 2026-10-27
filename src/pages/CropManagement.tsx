import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';
import { Crop, Farm, FarmActivity, CropGrowthStage } from '../types';
import { ASSET_IMAGES } from '../assets/images';
import { 
  Wheat, Plus, Calendar, Clock, AlertCircle, Edit2, 
  Trash2, X, Activity, Droplets, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const CropManagement: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [activities, setActivities] = useState<FarmActivity[]>([]);

  // Modals
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [selectedCropForActivity, setSelectedCropForActivity] = useState<Crop | null>(null);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);

  // Crop Form
  const [cropName, setCropName] = useState('Wheat');
  const [variety, setVariety] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [cultivatedArea, setCultivatedArea] = useState<number>(4.0);
  const [growthStage, setGrowthStage] = useState<CropGrowthStage>('Vegetative Growth');
  const [irrigationSchedule, setIrrigationSchedule] = useState('');
  const [fertilizerDetails, setFertilizerDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [healthStatus, setHealthStatus] = useState<Crop['healthStatus']>('Excellent');
  const [error, setError] = useState<string | null>(null);

  // Activity Form
  const [actType, setActType] = useState<FarmActivity['activityType']>('Irrigation');
  const [actDesc, setActDesc] = useState('');
  const [actDate, setActDate] = useState(new Date().toISOString().split('T')[0]);
  const [actCost, setActCost] = useState<number>(0);

  const loadData = () => {
    if (!user) return;
    const userFarms = StorageService.getFarms(user.role === 'admin' ? undefined : user.id);
    const userCrops = StorageService.getCrops(user.role === 'admin' ? undefined : user.id);
    const userActs = StorageService.getActivities(user.role === 'admin' ? undefined : user.id);
    setFarms(userFarms);
    setCrops(userCrops);
    setActivities(userActs);
    if (userFarms.length > 0 && !selectedFarmId) {
      setSelectedFarmId(userFarms[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openAddCropModal = () => {
    setEditingCrop(null);
    setCropName('Wheat');
    setVariety('WH-1105 High Yield');
    setSelectedFarmId(farms[0]?.id || '');
    const today = new Date().toISOString().split('T')[0];
    setSowingDate(today);
    const h = new Date();
    h.setDate(h.getDate() + 110);
    setHarvestDate(h.toISOString().split('T')[0]);
    setCultivatedArea(3.5);
    setGrowthStage('Sowing / Germination');
    setIrrigationSchedule('Every 7-9 days based on moisture readings');
    setFertilizerDetails('Basal DAP + Neem cake; top-dress urea at 30 days');
    setNotes('');
    setHealthStatus('Good');
    setError(null);
    setIsCropModalOpen(true);
  };

  const openEditCropModal = (c: Crop) => {
    setEditingCrop(c);
    setCropName(c.name);
    setVariety(c.variety);
    setSelectedFarmId(c.farmId);
    setSowingDate(c.sowingDate);
    setHarvestDate(c.expectedHarvestDate);
    setCultivatedArea(c.cultivatedArea);
    setGrowthStage(c.growthStage);
    setIrrigationSchedule(c.irrigationSchedule);
    setFertilizerDetails(c.fertilizerDetails);
    setNotes(c.notes);
    setHealthStatus(c.healthStatus);
    setError(null);
    setIsCropModalOpen(true);
  };

  const handleSaveCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!cropName.trim() || !variety.trim() || !selectedFarmId) {
      setError('Please provide crop name, variety, and select an active farm.');
      return;
    }

    try {
      if (editingCrop) {
        StorageService.updateCrop(
          editingCrop.id,
          {
            name: cropName,
            variety,
            farmId: selectedFarmId,
            sowingDate,
            expectedHarvestDate: harvestDate,
            cultivatedArea: Number(cultivatedArea),
            growthStage,
            irrigationSchedule,
            fertilizerDetails,
            notes,
            healthStatus,
          },
          user.id
        );
      } else {
        StorageService.addCrop({
          userId: user.id,
          farmId: selectedFarmId,
          name: cropName,
          variety,
          sowingDate,
          expectedHarvestDate: harvestDate,
          cultivatedArea: Number(cultivatedArea),
          growthStage,
          irrigationSchedule,
          fertilizerDetails,
          notes,
          healthStatus,
        });
      }
      setIsCropModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err?.message || 'Failed to save crop.');
    }
  };

  const handleDeleteCrop = (id: string) => {
    if (!user) return;
    if (window.confirm('Are you sure you want to delete this crop record?')) {
      StorageService.deleteCrop(id, user.id);
      loadData();
    }
  };

  const openLogActivityModal = (c: Crop) => {
    setSelectedCropForActivity(c);
    setActType('Irrigation');
    setActDesc(`Scheduled watering for ${c.name}`);
    setActDate(new Date().toISOString().split('T')[0]);
    setActCost(0);
    setIsActivityModalOpen(true);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCropForActivity) return;

    StorageService.addActivity({
      userId: user.id,
      cropId: selectedCropForActivity.id,
      farmId: selectedCropForActivity.farmId,
      activityType: actType,
      description: actDesc,
      activityDate: actDate,
      cost: Number(actCost),
    });

    setIsActivityModalOpen(false);
    loadData();
  };

  const STAGES: CropGrowthStage[] = [
    'Sowing / Germination',
    'Vegetative Growth',
    'Flowering & Tillering',
    'Maturity / Ripening',
    'Harvest Ready',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {t.nav.crops}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Monitor developmental phonological stages, track days since sowing, and record agronomic field activities.
          </p>
        </div>

        <button
          onClick={openAddCropModal}
          disabled={farms.length === 0}
          className="px-4 py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Crop</span>
        </button>
      </div>

      {crops.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center space-y-3">
          <Wheat className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-base font-bold text-neutral-800">No Active Crops</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {farms.length === 0
              ? 'Please register a farm first before adding crop records.'
              : 'Add your sowing details to start stage tracking and harvest countdowns.'}
          </p>
          {farms.length > 0 && (
            <button
              onClick={openAddCropModal}
              className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] cursor-pointer"
            >
              Add First Crop
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {crops.map((crop) => {
            const farm = farms.find(f => f.id === crop.farmId);
            const sowing = new Date(crop.sowingDate);
            const now = new Date();
            const daysSinceSowing = Math.max(0, Math.floor((now.getTime() - sowing.getTime()) / (1000 * 60 * 60 * 24)));
            const harvest = new Date(crop.expectedHarvestDate);
            const daysToHarvest = Math.max(0, Math.floor((harvest.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
            const currentStageIdx = STAGES.indexOf(crop.growthStage);
            const cropActivities = activities.filter(a => a.cropId === crop.id);

            return (
              <div key={crop.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
                {/* Crop Header */}
                <div className="p-6 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-neutral-900">{crop.name}</h3>
                      <span className="text-xs text-neutral-500 font-mono">({crop.variety})</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        crop.healthStatus === 'Excellent' 
                          ? 'bg-emerald-100 text-[#14532D]' 
                          : crop.healthStatus === 'Good' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        Status: {crop.healthStatus}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                      <span>Farm: <strong>{farm?.name || 'Assigned Farm'}</strong></span>
                      <span>·</span>
                      <span>Area: <strong>{crop.cultivatedArea} Acres</strong></span>
                      <span>·</span>
                      <span>Sown on: <strong>{crop.sowingDate}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openLogActivityModal(crop)}
                      className="px-3 py-1.5 bg-emerald-50 text-[#14532D] border border-emerald-200 text-xs font-semibold rounded-md hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Activity</span>
                    </button>
                    <button
                      onClick={() => openEditCropModal(crop)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 cursor-pointer"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCrop(crop.id)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Growth Stage Stepper */}
                <div className="px-6 py-4 bg-neutral-50/60 border-b border-neutral-100">
                  <div className="text-[11px] font-semibold text-neutral-600 mb-2">
                    Development Stage Progress
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {STAGES.map((stg, idx) => {
                      const isComplete = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;
                      return (
                        <div key={stg} className="text-center">
                          <div className={`h-1.5 rounded-full mb-1.5 ${
                            isComplete 
                              ? 'bg-[#14532D]' 
                              : isCurrent 
                              ? 'bg-[#84CC16]' 
                              : 'bg-neutral-200'
                          }`} />
                          <span className={`text-[10px] block leading-tight ${
                            isCurrent ? 'font-bold text-[#14532D]' : 'text-neutral-500'
                          }`}>
                            {stg}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sowing / Harvest Counters & Notes */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Metric 1 */}
                  <div className="p-4 rounded-lg bg-[#F8F7F0] border border-neutral-200">
                    <span className="text-xs text-neutral-500 block">Days Since Sowing</span>
                    <span className="text-2xl font-bold text-neutral-900 tabular-nums">
                      {daysSinceSowing} <span className="text-xs font-normal text-neutral-500">days</span>
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-1">
                      Target maturity ~110-120 days
                    </span>
                  </div>

                  {/* Metric 2 */}
                  <div className="p-4 rounded-lg bg-[#F8F7F0] border border-neutral-200">
                    <span className="text-xs text-neutral-500 block">Estimated Days to Harvest</span>
                    <span className="text-2xl font-bold text-[#14532D] tabular-nums">
                      {daysToHarvest} <span className="text-xs font-normal text-neutral-500">days</span>
                    </span>
                    <span className="text-[11px] text-neutral-500 block mt-1">
                      Projected harvest: {crop.expectedHarvestDate}
                    </span>
                  </div>

                  {/* Agronomic Plan */}
                  <div className="p-4 rounded-lg bg-[#F8F7F0] border border-neutral-200 text-xs space-y-1.5">
                    <div>
                      <span className="font-semibold text-neutral-700">Irrigation Plan:</span>
                      <p className="text-neutral-600 text-[11px]">{crop.irrigationSchedule || 'As per soil moisture'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-700">Fertilizer Schedule:</span>
                      <p className="text-neutral-600 text-[11px]">{crop.fertilizerDetails || 'Balanced N-P-K recommendation'}</p>
                    </div>
                  </div>
                </div>

                {/* Field Activity Log for this crop */}
                <div className="px-6 pb-6">
                  <div className="text-xs font-bold text-neutral-900 mb-2 flex items-center justify-between">
                    <span>Recent Activity Logs for {crop.name}</span>
                    <span className="text-[11px] font-normal text-neutral-500">
                      {cropActivities.length} logs recorded
                    </span>
                  </div>
                  {cropActivities.length === 0 ? (
                    <div className="text-xs text-neutral-400 bg-neutral-50 p-3 rounded text-center">
                      No activities logged for this crop yet. Click &quot;Log Activity&quot; above to log irrigation or spraying.
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-lg overflow-hidden">
                      {cropActivities.map(act => (
                        <div key={act.id} className="p-3 text-xs flex items-center justify-between bg-white hover:bg-neutral-50">
                          <div>
                            <span className="font-bold text-neutral-900">{act.activityType}: </span>
                            <span className="text-neutral-600">{act.description}</span>
                          </div>
                          <div className="text-neutral-400 text-[11px] flex items-center gap-2">
                            <span>{act.activityDate}</span>
                            {act.cost ? <span>· ₹{act.cost}</span> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                {editingCrop ? 'Edit Crop Record' : 'Register New Crop'}
              </h3>
              <button
                onClick={() => setIsCropModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCrop} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Crop Name *</label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Wheat / Cotton / Mustard"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Variety / Cultivar *</label>
                  <input
                    type="text"
                    required
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. WH-1105 / Bollgard II"
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Assigned Farm *</label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => setSelectedFarmId(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    {farms.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.area} {f.areaUnit})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Cultivated Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={cultivatedArea}
                    onChange={(e) => setCultivatedArea(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Sowing Date</label>
                  <input
                    type="date"
                    required
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Expected Harvest Date</label>
                  <input
                    type="date"
                    required
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Current Growth Stage</label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Health Status</label>
                  <select
                    value={healthStatus}
                    onChange={(e) => setHealthStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Attention Needed">Attention Needed</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Irrigation Schedule</label>
                <input
                  type="text"
                  value={irrigationSchedule}
                  onChange={(e) => setIrrigationSchedule(e.target.value)}
                  placeholder="e.g. Every 8 days via drip system"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Fertilizer Information</label>
                <input
                  type="text"
                  value={fertilizerDetails}
                  onChange={(e) => setFertilizerDetails(e.target.value)}
                  placeholder="e.g. Urea top-dressing and organic neem cake"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Crop Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Field notes on germination, tillering, weed density..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-md hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-md hover:bg-[#0f3e22] cursor-pointer"
                >
                  {editingCrop ? 'Save Changes' : 'Register Crop'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Activity Modal */}
      {isActivityModalOpen && selectedCropForActivity && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                Log Farm Activity for {selectedCropForActivity.name}
              </h3>
              <button
                onClick={() => setIsActivityModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveActivity} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Activity Type</label>
                <select
                  value={actType}
                  onChange={(e) => setActType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                >
                  <option value="Irrigation">Irrigation</option>
                  <option value="Fertilizer Application">Fertilizer Application</option>
                  <option value="Pesticide Spray">Pesticide Spray</option>
                  <option value="Weeding">Weeding</option>
                  <option value="Pruning">Pruning</option>
                  <option value="Harvesting">Harvesting</option>
                  <option value="Soil Tillage">Soil Tillage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Activity Description</label>
                <textarea
                  rows={3}
                  required
                  value={actDesc}
                  onChange={(e) => setActDesc(e.target.value)}
                  placeholder="Details of inputs applied, spray volume, or hours run..."
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Execution Date</label>
                  <input
                    type="date"
                    required
                    value={actDate}
                    onChange={(e) => setActDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Incurred Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={actCost}
                    onChange={(e) => setActCost(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsActivityModalOpen(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold rounded-md hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-md hover:bg-[#0f3e22] cursor-pointer"
                >
                  Save Activity Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
