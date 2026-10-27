import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { StorageService } from '../services/storageService';
import { Expert, Consultation, ExpertSpecialization } from '../types';
import { 
  Users2, MessageSquare, Plus, CheckCircle2, Clock, 
  Send, AlertCircle, X, ShieldCheck, Award, GraduationCap 
} from 'lucide-react';

export const ExpertConsultationPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form Fields
  const [subject, setSubject] = useState('');
  const [cropRelated, setCropRelated] = useState('Sharbati Wheat');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Admin reply state
  const [replyText, setReplyText] = useState('');
  const [activeReplyingId, setActiveReplyingId] = useState<string | null>(null);

  const demoExperts: Expert[] = [
    {
      id: 'exp-1',
      name: 'Dr. Arvind Deshmukh',
      specialization: 'Soil Science',
      organization: 'ICAR - Indian Institute of Soil Science',
      experienceYears: 18,
      qualification: 'Ph.D. Soil Agronomy & Nutrient Dynamics',
      location: 'Bhopal / Anand',
      languages: ['English', 'Hindi', 'Gujarati'],
      isAvailable: true,
    },
    {
      id: 'exp-2',
      name: 'Dr. Sunita Rao',
      specialization: 'Pest & Disease Control',
      organization: 'National Centre for Integrated Pest Management (NCIPM)',
      experienceYears: 14,
      qualification: 'M.Sc. & Ph.D. Agricultural Entomology',
      location: 'New Delhi / Pune',
      languages: ['English', 'Hindi', 'Marathi'],
      isAvailable: true,
    },
    {
      id: 'exp-3',
      name: 'Prof. K. Ramanathan',
      specialization: 'Irrigation & Water',
      organization: 'Tamil Nadu Agricultural University & Micro-Irrigation Board',
      experienceYears: 22,
      qualification: 'Ph.D. Water Management & Hydraulics',
      location: 'Coimbatore',
      languages: ['English', 'Tamil', 'Hindi'],
      isAvailable: true,
    },
    {
      id: 'exp-4',
      name: 'Dr. Meenakshi Sundaram',
      specialization: 'Crop Management',
      organization: 'Central Arid Zone Research Institute (CAZRI)',
      experienceYears: 12,
      qualification: 'Ph.D. Agronomy & Dryland Farming',
      location: 'Jodhpur / Jaipur',
      languages: ['English', 'Hindi'],
      isAvailable: true,
    },
  ];

  const loadConsultations = () => {
    if (!user) return;
    setConsultations(
      StorageService.getConsultations(user.role === 'admin' ? undefined : user.id)
    );
  };

  useEffect(() => {
    loadConsultations();
  }, [user]);

  const openInquiryModal = (expert: Expert) => {
    setSelectedExpert(expert);
    setSubject('');
    setQuestion('');
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedExpert) return;
    if (!subject.trim() || !question.trim()) {
      setError('Please provide a subject line and detailed question.');
      return;
    }

    StorageService.createConsultation({
      userId: user.id,
      farmerName: user.name,
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      subject,
      cropRelated,
      question,
    });

    setIsModalOpen(false);
    loadConsultations();
  };

  const handleAdminAnswer = (consultationId: string) => {
    if (!replyText.trim()) return;
    StorageService.answerConsultation(consultationId, replyText);
    setActiveReplyingId(null);
    setReplyText('');
    loadConsultations();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            {t.nav.expert}
          </h1>
          <p className="text-xs text-neutral-600 mt-1">
            Connect with certified agronomy specialists, soil chemists, and pest management extension scientists.
          </p>
        </div>

        <div className="text-xs bg-emerald-50 text-[#14532D] font-semibold px-3 py-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
          <span>ICAR & Agricultural University Panel</span>
        </div>
      </div>

      {/* Expert Directory Cards */}
      <div>
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
          Available Agricultural Scientists
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {demoExperts.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div>
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#14532D] flex items-center justify-center font-bold text-base mb-3 group-hover:bg-[#14532D] group-hover:text-white transition-colors">
                  {exp.name.split(' ')[1]?.charAt(0) || 'E'}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {exp.specialization}
                </span>

                <h3 className="text-sm font-bold text-neutral-900 mt-2">{exp.name}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{exp.organization}</p>

                <div className="mt-3 pt-3 border-t border-neutral-100 space-y-1 text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Award className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{exp.experienceYears} Years Research & Extension</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="truncate">{exp.qualification}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 pt-1">
                    Languages: {exp.languages.join(', ')}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100">
                <button
                  onClick={() => openInquiryModal(exp)}
                  className="w-full py-2 bg-[#14532D] text-white text-xs font-semibold rounded-lg hover:bg-[#0f3e22] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask Question</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consultation History Section */}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <h3 className="text-sm font-bold text-neutral-900">
            {user?.role === 'admin' ? 'All Submitted Farm Inquiries' : 'My Consultation Requests & Responses'} ({consultations.length})
          </h3>
          <span className="text-[11px] text-neutral-500">
            Demonstration Consultation Workflow
          </span>
        </div>

        {consultations.length === 0 ? (
          <div className="text-xs text-neutral-400 py-8 text-center">
            No consultation inquiries submitted yet. Click &quot;Ask Question&quot; on any expert above to submit an agronomic query.
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-xl border border-neutral-200 bg-[#F8F7F0]/60 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{c.subject}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        c.status === 'Answered' 
                          ? 'bg-emerald-100 text-[#14532D]' 
                          : c.status === 'In Review' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                      <span>Expert: <strong>{c.expertName}</strong></span>
                      <span>·</span>
                      <span>Crop: <strong>{c.cropRelated}</strong></span>
                      <span>·</span>
                      <span>Farmer: <strong>{c.farmerName}</strong></span>
                      <span>·</span>
                      <span>{new Date(c.createdAt).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Farmer Question */}
                <div className="p-3 bg-white rounded-lg border border-neutral-200 text-xs text-neutral-700">
                  <span className="font-bold text-neutral-900 block mb-1">Farmer Inquiry:</span>
                  <p className="leading-relaxed">{c.question}</p>
                </div>

                {/* Expert Response if answered */}
                {c.response ? (
                  <div className="p-3.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Agronomist Response from {c.expertName}:</span>
                      </span>
                      {c.answeredAt && (
                        <span className="text-[10px] text-emerald-700 font-normal">
                          {new Date(c.answeredAt).toLocaleDateString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-neutral-700 leading-relaxed text-[11px] pt-1">{c.response}</p>
                  </div>
                ) : user?.role === 'admin' ? (
                  /* Admin Answer Interface */
                  <div className="pt-2 border-t border-neutral-200 space-y-2">
                    {activeReplyingId === c.id ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type expert agronomic advice and diagnosis..."
                          className="w-full text-xs p-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveReplyingId(null)}
                            className="px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-100 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleAdminAnswer(c.id)}
                            className="px-3 py-1.5 bg-[#14532D] text-white text-xs font-semibold rounded hover:bg-[#0f3e22]"
                          >
                            Publish Response
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveReplyingId(c.id);
                          setReplyText('');
                        }}
                        className="px-3 py-1.5 bg-white border border-neutral-300 rounded text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply as Admin / Agronomist</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] text-neutral-500 italic flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Inquiry currently undergoing agronomic review by extension panel.</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Modal */}
      {isModalOpen && selectedExpert && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900">
                Consult with {selectedExpert.name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitInquiry} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Subject / Crop Issue *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Chlorosis in wheat leaves after second irrigation"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Crop Concerned
                </label>
                <input
                  type="text"
                  required
                  value={cropRelated}
                  onChange={(e) => setCropRelated(e.target.value)}
                  placeholder="e.g. Sharbati Wheat (WH-1105)"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#14532D]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Detailed Question & Field Symptoms *
                </label>
                <textarea
                  rows={4}
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Describe soil type, watering cadence, fertilizer applied, and visible leaf symptoms..."
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
                  Submit Consultation Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
