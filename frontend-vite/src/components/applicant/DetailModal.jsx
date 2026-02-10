import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaFilePdf, FaStar } from "react-icons/fa";
import { DateTime } from "luxon";
import { downloadPDF } from "../../integration/api";

export function DetailModal({ app, onClose, getScoreBadge, safeParse }) {
  const experience = app.experience
  const hardSkill = app.hard_skill
  const presentation = app.presentation_quality
  const breakdown = [
    { key: "exp", label: "Experience", data: experience },
    { key: "skill", label: "Hard Skills", data: hardSkill },
    // { key: "pres", label: "Presentation", data: presentation },
  ];

  const handleDownload = () => {
    const fileName = app.filename.split("/").pop();
    downloadPDF(fileName);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-slate-900/80 backdrop-blur-md flex justify-between items-center p-6 border-b border-slate-700 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <FaUser className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Applicant Profile</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Profile Header Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center">
            <img 
                src={`https://avatar.iran.liara.run/public/${app.id}`} 
                alt={app.name} 
                className="w-24 h-24 rounded-full border-4 border-slate-600 shadow-lg" 
            />
            <div className="flex-1 text-center md:text-left">
              <h4 className="text-2xl font-bold text-white mb-2">{app.name}</h4>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                <span className="flex items-center text-slate-300"><FaEnvelope className="mr-2 text-blue-400"/> {app.email}</span>
                <span className="flex items-center text-slate-300"><FaPhone className="mr-2 text-blue-400"/> {app.telp}</span>
                <span className="flex items-center text-slate-400"><FaCalendar className="mr-2"/> Applied: {DateTime.fromISO(app.created_at).toFormat("DD")}</span>
              </div>
            </div>
            <div className="text-center">
              <div className={`${getScoreBadge(app.score).bg} ${getScoreBadge(app.score).text} border ${getScoreBadge(app.score).border} rounded-2xl p-4 min-w-25`}>
                <p className="text-3xl font-black">{app.score}</p>
                <p className="text-xs uppercase tracking-wider font-bold opacity-70">Final Score</p>
              </div>
            </div>
          </div>

          {/* AI Analysis */}
          <section>
            <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">AI Analysis Summary</h5>
            <div className="bg-blue-600/5 border border-blue-500/20 rounded-xl p-5">
              <p className="text-slate-300 leading-relaxed italic">"{app.explanation}"</p>
            </div>
          </section>

          {/* Breakdown Grid */}
          <section>
            <h5 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Score Breakdown</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {breakdown.map((item) => (
                <div key={item.key} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-semibold">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getScoreBadge(item.data.score).bg} ${getScoreBadge(item.data.score).text}`}>
                      {item.data.score}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs line-clamp-3 hover:line-clamp-none transition-all">{item.data.feedback}</p>
                  {item.data.issues && (
                    <div className="mt-2 pt-2 border-t border-slate-700">
                      <p className="text-[10px] text-yellow-500 font-bold uppercase">Issues:</p>
                      <p className="text-slate-500 text-[11px] italic">{item.data.issues}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* CV Document */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400">
                <FaFilePdf size={24} />
              </div>
              <div>
                <p className="text-white font-medium truncate max-w-50 md:max-w-xs">{app.filename.split("/").pop()}</p>
                <p className="text-slate-500 text-xs">Curriculum Vitae • PDF</p>
              </div>
            </div>
            <button 
              onClick={handleDownload}
              className="px-4 py-2 bg-slate-700 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}