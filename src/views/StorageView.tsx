import React, { useState } from 'react';
import { StorageInspector, StorageAuditResult } from '../engine/StorageInspector';
import { Database, FileText, Lock, AlertCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

const StorageView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StorageAuditResult | null>(null);

  const runStorageAudit = () => {
    setLoading(true);
    setTimeout(() => {
      const mockFiles = [
        { path: '/data/user/0/com.app/shared_prefs/user_session.xml', content: '<?xml version="1.0"?><map><string name="auth_token">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsub...</string></map>' },
        { path: '/data/user/0/com.app/databases/local.db', content: 'password="admin_secret_123"; api_key="AIzaSyA1B2C3D4E5F6G7H8I9J0" ' },
        { path: '/data/user/0/com.app/cache/temp_log.txt', content: 'User email: admin@company.com - Login successful' },
      ];
      const audit = StorageInspector.inspect(mockFiles);
      setResult(audit);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Secure Storage Inspector</h1>
          <p className="text-gray-500 mt-2">Vérification de la conformité du stockage des données locales.</p>
        </div>
        <button 
          onClick={runStorageAudit}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
        >
          {loading ? <Zap className="animate-spin" /> : <Database size={20} />}
          {loading ? 'Analyse des données...' : 'Analyser le Stockage'}
        </button>
      </div>

      {!result && !loading && (
        <div className="card p-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-400">
            <Lock size={32} />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold">Audit de Confidentialité</h3>
            <p className="text-text-secondary mt-2">Analysez les SharedPrefs, bases de données Room et fichiers cache pour détecter des fuites de données sensibles.</p>
          </div>
        </div>
      )}

      {result && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard label="Fuites Détectées" value={result.totalFindings} color="text-indigo-600" />
            <StatsCard label="Niveau Critique" value={result.criticalIssues} color="text-red-600" />
            <StatsCard label="Conformité" value={result.criticalIssues > 0 ? "Non-Conforme" : "Conforme"} color={result.criticalIssues > 0 ? "text-red-600" : "text-green-600"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Findings List */}
            <div className="card overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold flex items-center gap-2">
                  <AlertCircle size={18} className="text-orange-500" />
                  Détails des Vulnérabilités
                </h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                {result.findings.map((f, i) => (
                  <div key={i} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                        f.riskLevel === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {f.type} • {f.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-mono text-gray-500 mb-2 truncate">
                      <FileText size={14} />
                      {f.path}
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      Snippet: <code className="bg-gray-100 px-1 rounded">{f.contentSnippet}</code>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Remediation Plan */}
            <div className="space-y-6">
              <div className="card p-8 bg-indigo-900 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Zap className="text-yellow-400" />
                  Plan de Remédiation IA
                </h3>
                <div className="space-y-4">
                  {result.remediationPlan.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start bg-white/10 p-4 rounded-xl border border-white/10">
                      <div className="p-1 bg-green-400 rounded-full text-indigo-900 mt-1">
                        <CheckCircle2 size={16} />
                      </div>
                      <p className="text-indigo-50 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6 border-indigo-100 bg-indigo-50/30">
                <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
                  <ChevronRight size={18} />
                  Prochaines étapes recommandées
                </h4>
                <p className="text-sm text-indigo-700">
                  Implémentez ces changements et relancez l'audit pour valider le chiffrement des données au repos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ label, value, color }: { label: string, value: string | number, color: string }) => (
  <div className="card p-6 flex flex-col items-center justify-center text-center">
    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{label}</span>
    <span className={`text-3xl font-black ${color}`}>{value}</span>
  </div>
);

export default StorageView;
