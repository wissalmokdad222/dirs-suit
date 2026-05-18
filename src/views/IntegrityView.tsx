import React, { useState, useEffect } from 'react';
import { IntegrityScorer, IntegritySignals, IntegrityReport } from '../engine/IntegrityScorer';
import { ShieldAlert, ShieldCheck, Activity, Cpu, Search, AlertTriangle } from 'lucide-react';

const IntegrityView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<IntegrityReport | null>(null);

  const runAudit = () => {
    setLoading(true);
    // Simulate scan delay
    setTimeout(() => {
      const mockSignals: IntegritySignals = {
        rootDetected: true,
        hookDetected: true,
        debugEnabled: true,
        buildTags: 'test-keys',
        integrityBase: false,
        dangerousConfig: true,
        permissions: {
          excessiveRuntime: true,
          accessibilityAbuse: false,
          overlayActive: true
        }
      };
      const result = IntegrityScorer.analyze(mockSignals);
      setReport(result);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Integrity Risk Scorer</h1>
          <p className="text-gray-500 mt-2">Évaluation approfondie de l'intégrité environnementale du terminal.</p>
        </div>
        <button 
          onClick={runAudit}
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50"
        >
          {loading ? <Activity className="animate-spin" /> : <Search size={20} />}
          {loading ? 'Audit en cours...' : 'Lancer l\'Audit Complet'}
        </button>
      </div>

      {!report && !loading && (
        <div className="card p-20 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2">
          <div className="w-16 h-16 bg-beige-dark rounded-full flex items-center justify-center text-text-secondary">
            <Cpu size={32} />
          </div>
          <div className="max-w-md">
            <h3 className="text-xl font-bold">Prêt pour l'analyse</h3>
            <p className="text-text-secondary mt-2">Cliquez sur le bouton ci-dessus pour scanner les signaux de compromission, les hooks et les indicateurs root.</p>
          </div>
        </div>
      )}

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <div className={`card p-8 lg:col-span-1 flex flex-col items-center justify-center text-center space-y-6 ${
            report.level === 'critical' ? 'border-red-200 bg-red-50/30' : 'border-green-200 bg-green-50/30'
          }`}>
            <h2 className="text-lg font-bold uppercase tracking-widest text-text-secondary">Score d'Intégrité</h2>
            <div className="relative">
               <svg className="w-48 h-48">
                  <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="80" cx="96" cy="96" />
                  <circle 
                    className={report.level === 'critical' ? 'text-red-500' : 'text-green-500'}
                    strokeWidth="10" strokeDasharray={502} strokeDashoffset={502 - (502 * report.score) / 100}
                    strokeLinecap="round" stroke="currentColor" fill="transparent" r="80" cx="96" cy="96" 
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black">{report.score}</span>
                  <span className="text-xs font-bold uppercase">/ 100</span>
               </div>
            </div>
            <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
              report.level === 'critical' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              Niveau : {report.level}
            </div>
          </div>

          {/* AI Explanation & Signals */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-8 bg-white/60 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Activity size={20} />
                </div>
                <h3 className="text-xl font-bold">Analyse Intelligence Artificielle</h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-700 italic">
                "{report.explanation}"
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SignalItem label="Root Access" active={report.signals.rootDetected} />
              <SignalItem label="Runtime Hooks (Frida)" active={report.signals.hookDetected} />
              <SignalItem label="ADB Debugging" active={report.signals.debugEnabled} />
              <SignalItem label="System Integrity" active={!report.signals.integrityBase} danger={!report.signals.integrityBase} inverted />
              <SignalItem label="Custom Build Tags" active={report.signals.buildTags !== 'release-keys'} />
              <SignalItem label="Dangerous Config" active={report.signals.dangerousConfig} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SignalItem = ({ label, active, danger = true, inverted = false }: { label: string, active: boolean, danger?: boolean, inverted?: boolean }) => {
  const isBad = inverted ? !active : active;
  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between ${
      active ? (danger ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100') : 'bg-white border-gray-100'
    }`}>
      <span className="font-medium text-gray-700">{label}</span>
      {active ? (
        <AlertTriangle className={danger ? 'text-red-500' : 'text-orange-500'} size={18} />
      ) : (
        <ShieldCheck className="text-green-500" size={18} />
      )}
    </div>
  );
};

export default IntegrityView;
