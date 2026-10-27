import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';
import { Farm, Crop, SoilType, IrrigationMethod } from '../types';
import { MapPin, Plus, Edit2, Trash2, X, AlertCircle, Droplets, Mountain, CheckCircle2 } from 'lucide-react';

export const FarmManagement: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('Gujarat');
  const [district, setDistrict] = useState('Anand');
  const [area, setArea] = useState<number>(5.0);
  const [areaUnit, setAreaUnit] = useState<Farm['areaUnit']>('Acres');
  const [soilType, setSoilType] = useState<SoilType>('Sandy Loam');
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>('Drip Irrigation');
  const [description, setDescription] = useState('');

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = () => {
    if (!user) return;
    const userFarms = StorageService.getFarms(user.role === 'admin' ? undefined : user.id);
    const userCrops = StorageService.getCrops(user.role === 'admin' ? undefined : user.id);
    setFarms(userFarms);
    setCrops(userCrops);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const openAddModal = () => {
    setEditingFarm(null);
    setName('');
    setLocation('');
    setState(user?.state || 'Gujarat');
    setDistrict(user?.district || 'Anand');
    setArea(5.0);
    setAreaUnit('Acres');
    setSoilType('Sandy Loam');
    setIrrigationMethod('Drip Irrigation');
    setDescription('');
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (farm: Farm) => {
    setEditingFarm(farm);
    setName(farm.name);
    setLocation(farm.location);
    setState(farm.state);
    setDistrict(farm.district);
    setArea(farm.area);
    setAreaUnit(farm.areaUnit);
    setSoilType(farm.soilType);
    setIrrigationMethod(farm.irrigationMethod);
    setDescription(farm.description);
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim() || !location.trim()) {
      setError('Farm name and location are required.');
      return;
    }

    try {
      if (editingFarm) {
        StorageService.updateFarm(
          editingFarm.id,
          {
            name,
            location,
            state,
            district,
            area: Number(area),
            areaUnit,
            soilType,
            irrigationMethod,
            description,
          },
          user.id
        );
      } else {
        StorageService.addFarm({
          userId: user.id,
          name,
          location,
          state,
          district,
          area: Number(area),
          areaUnit,
          soilType,
          irrigationMethod,
          description,
        });
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err?.message || 'Failed to save farm record.');
    }
  };

  const handleDelete = (id: string) => {
    if (!user) return;
    StorageService.deleteFarm(id, user.id);
    setConfirmDeleteId(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {t.nav.farms}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Maintain your cadastral land parcels, soil profiles, and irrigation infrastructure.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Farm</span>
        </button>
      </div>

      {/* Farm Cards Grid */}
      {farms.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center space-y-3">
          <MapPin className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-base font-bold text-neutral-800">No Farms Registered</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Add your agricultural land parcel to enable soil analysis, localized weather, and crop tracking.
          </p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] cursor-pointer"
          >
            Add Your First Farm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => {
            const activeCrops = crops.filter(c => c.farmId === farm.id);

            return (
              <div
                key={farm.id}
                className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-neutral-900">{farm.name}</h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{farm.location}, {farm.district}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(farm)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded hover:bg-neutral-100 cursor-pointer"
                        title="Edit Farm"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(farm.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded hover:bg-red-50 cursor-pointer"
                        title="Delete Farm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="my-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-neutral-500 block text-[11px]">Area Dimension</span>
                      <span className="font-bold text-neutral-900 tabular-nums">
                        {farm.area} {farm.areaUnit}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-500 block text-[11px]">Soil Type</span>
                      <span className="font-semibold text-neutral-800 flex items-center gap-1">
                        <Mountain className="w-3.5 h-3.5 text-amber-700" />
                        <span>{farm.soilType}</span>
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-neutral-500 block text-[11px]">Irrigation Setup</span>
                      <span className="font-semibold text-neutral-800 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-600" />
                        <span>{farm.irrigationMethod}</span>
                      </span>
                    </div>
                  </div>

                  {farm.description && (
                    <p className="text-[11px] text-neutral-600 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100 leading-relaxed mb-3">
                      {farm.description}
                    </p>
                  )}
                </div>

                {/* Active Crops in Farm */}
                <div className="pt-3 border-t border-neutral-100">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1.5">
                    Cultivated Crops ({activeCrops.length})
                  </span>
                  {activeCrops.length === 0 ? (
                    <span className="text-xs text-neutral-400 italic">No crops assigned to this plot</span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {activeCrops.map(c => (
                        <span key={c.id} className="text-[11px] bg-emerald-50 text-[#14532D] border border-emerald-200 px-2 py-0.5 rounded font-medium">
                          {c.name} ({c.cultivatedArea} ac)
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Delete Confirmation Modal Overlay */}
                {confirmDeleteId === farm.id && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-xl p-4 flex flex-col justify-center items-center text-center z-10 space-y-3">
                    <p className="text-xs font-bold text-neutral-900">
                      Are you sure you want to delete &quot;{farm.name}&quot;?
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      This will remove the plot and its associated telemetry.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(farm.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded hover:bg-red-700 cursor-pointer"
                      >
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded hover:bg-neutral-200 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Farm Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                {editingFarm ? 'Edit Farm Parcel' : 'Register New Agricultural Farm'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Farm Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ganga Kripa Farm No. 1"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Plot Location / Village Survey No. *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Survey No. 42, Vasad-Tarapur Highway"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">State</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
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
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Plot Area</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={area}
                    onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Unit</label>
                  <select
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    <option value="Acres">Acres</option>
                    <option value="Hectares">Hectares</option>
                    <option value="Bigha">Bigha</option>
                    <option value="Guntha">Guntha</option>
                  </select>
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
                    <option value="Alluvial">Alluvial</option>
                    <option value="Black (Regur)">Black (Regur)</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Red & Yellow">Red & Yellow</option>
                    <option value="Laterite">Laterite</option>
                    <option value="Clay">Clay</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Irrigation Method</label>
                  <select
                    value={irrigationMethod}
                    onChange={(e) => setIrrigationMethod(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                  >
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Sprinkler System">Sprinkler System</option>
                    <option value="Canal / Furrow">Canal / Furrow</option>
                    <option value="Tube Well">Tube Well</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Description / Field Notes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes on water source, soil history, or previous rotations..."
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
                  {editingFarm ? 'Save Changes' : 'Create Farm Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
