import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Code, Database, Server, ShieldCheck, Terminal, 
  ExternalLink, Layers, CheckCircle2, Cloud, Cpu 
} from 'lucide-react';

export const ProjectDocsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 max-w-5xl pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#14532D]">
          <Layers className="w-4 h-4 text-[#2E7D32]" />
          <span>Academic & Mentor Evaluation Specification</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          AgriTech Architecture & System Documentation
        </h1>
        <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
          Complete project blueprint covering database models, Express REST endpoints, live weather telemetries, and multi-tenant security rules. Full standalone Node.js/MongoDB source files are stored in the <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded text-neutral-800">/backend</span> directory.
        </p>
      </div>

      {/* Evaluation Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold">
            <Cloud className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-neutral-900">Live Weather Telemetry</h3>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Zero mock numbers: Integrated with Open-Meteo&apos;s real-time agricultural reanalysis API for real Indian district weather.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-neutral-900">Mongoose & Atlas Ready</h3>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Relational ownership on Farms, Crops, Soil Cards, and Orders with complete Express routes in <span className="font-mono">/backend</span>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-neutral-200 space-y-1.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#14532D] flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-neutral-900">Role-Based Access (RBAC)</h3>
          <p className="text-[11px] text-neutral-600 leading-relaxed">
            Distinct Farmer and Administrator roles with server-side authorization patterns, bcrypt hashing, and JWT tokens.
          </p>
        </div>
      </div>

      {/* Backend API Endpoints Catalog */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#14532D]" />
            <h2 className="text-sm font-bold text-neutral-900">
              RESTful Backend API Endpoint Catalog
            </h2>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">Express.js 4.x / JSON API</span>
        </div>

        <div className="border border-neutral-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Endpoint Route</th>
                <th className="py-2.5 px-3">Role / Auth</th>
                <th className="py-2.5 px-3">Description & Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3 text-blue-700 font-bold">POST</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/auth/register</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Public</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Creates farmer or admin account; hashes password with bcrypt (salt 10).</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-blue-700 font-bold">POST</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/auth/login</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Public</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Validates credentials and returns signed JWT (expires in 7 days).</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">GET</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/farms</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Bearer JWT</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Returns farms owned by authenticated farmer (or all if admin).</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-blue-700 font-bold">POST</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/farms</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Bearer JWT</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Registers new cadastral farm plot with soil type and irrigation unit.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">GET</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/crops</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Bearer JWT</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Returns crop records with computed days since sowing and harvest delta.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-blue-700 font-bold">POST</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/soil-reports</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Bearer JWT</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Saves soil test values and generates educational NPK balance guide.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-emerald-700 font-bold">GET</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/alerts</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Public</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Retrieves verified university alerts and peer pest advisories.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-amber-700 font-bold">PATCH</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/alerts/:id/verify</td>
                <td className="py-2.5 px-3 font-sans text-purple-700 font-bold">Admin Only</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Extension scientist verification of crowdsourced farmer warnings.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-blue-700 font-bold">POST</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/orders</td>
                <td className="py-2.5 px-3 font-sans text-neutral-500">Bearer JWT</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Submits farm supply order with simulated payment on delivery.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-amber-700 font-bold">PATCH</td>
                <td className="py-2.5 px-3 text-neutral-900 font-semibold">/api/orders/:id/status</td>
                <td className="py-2.5 px-3 font-sans text-purple-700 font-bold">Admin Only</td>
                <td className="py-2.5 px-3 font-sans text-neutral-600">Updates dispatch logistics (Confirmed, Dispatched, Delivered).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Schema Specification */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Database className="w-5 h-5 text-[#14532D]" />
          <h2 className="text-sm font-bold text-neutral-900">
            MongoDB Atlas Relational Collections & Schemas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-neutral-900 text-neutral-200 rounded-lg overflow-x-auto space-y-1">
            <span className="text-lime-400 font-bold">// Farm Schema (models/Farm.js)</span>
            <pre className="text-[11px] leading-tight text-neutral-300">
{`const FarmSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  area: { type: Number, required: true },
  areaUnit: { type: String, enum: ['Acres','Hectares','Bigha','Guntha'], default: 'Acres' },
  soilType: { type: String, required: true },
  irrigationMethod: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });`}
            </pre>
          </div>

          <div className="p-4 bg-neutral-900 text-neutral-200 rounded-lg overflow-x-auto space-y-1">
            <span className="text-lime-400 font-bold">// Crop Schema (models/Crop.js)</span>
            <pre className="text-[11px] leading-tight text-neutral-300">
{`const CropSchema = new mongoose.Schema({
  userId: { type: ObjectId, ref: 'User', required: true },
  farmId: { type: ObjectId, ref: 'Farm', required: true, index: true },
  name: { type: String, required: true },
  variety: { type: String, required: true },
  sowingDate: { type: Date, required: true },
  expectedHarvestDate: { type: Date, required: true },
  cultivatedArea: { type: Number, required: true },
  growthStage: { 
    type: String, 
    enum: ['Sowing / Germination','Vegetative Growth','Flowering & Tillering','Maturity / Ripening','Harvest Ready'],
    default: 'Sowing / Germination'
  },
  irrigationSchedule: String,
  fertilizerDetails: String,
  healthStatus: { type: String, default: 'Good' }
}, { timestamps: true });`}
            </pre>
          </div>
        </div>
      </div>

      {/* Deployment & Setup Instructions */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
          <Terminal className="w-5 h-5 text-[#14532D]" />
          <h2 className="text-sm font-bold text-neutral-900">
            Local Deployment & MongoDB Atlas Setup Instructions
          </h2>
        </div>

        <div className="space-y-4 text-xs text-neutral-700">
          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900">1. Local Frontend Run:</h4>
            <div className="bg-neutral-900 text-neutral-200 p-3 rounded-lg font-mono text-[11px]">
              npm install <br />
              npm run dev
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900">2. Standalone Express Backend Run (Optional for Live DB):</h4>
            <div className="bg-neutral-900 text-neutral-200 p-3 rounded-lg font-mono text-[11px]">
              cd backend <br />
              npm install <br />
              cp .env.example .env <br />
              # Add MONGODB_URI and JWT_SECRET <br />
              npm start
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-neutral-900">3. Creating the Initial System Administrator:</h4>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              In production mode, run <span className="font-mono bg-neutral-100 px-1 py-0.5 rounded">node scripts/seedAdmin.js</span> inside the backend folder, or use the pre-configured administrator account:
              <br />
              <strong className="text-neutral-900">Email:</strong> admin@agritech.in · <strong className="text-neutral-900">Password:</strong> Admin@1234
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
