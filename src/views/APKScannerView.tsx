import React, { useState, useRef } from 'react';
import { APKScanner, APKAnalysisResult } from '../engine/APKScanner';
import { Upload, FileCode, ShieldAlert, CheckCircle, Activity, AlertTriangle, Info } from 'lucide-react';

const APKScannerView: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<APKAnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const startScan = async () => {
    if (!file) return;
    setAnalyzing(true);
    try {
      const scanResult = await APKScanner.scan(file);
      // Simulate network/AI delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(scanResult);
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">APK Analyzer</h1>
        <p className="text-gray-500 mt-2">Analysez statiquement vos fichiers APK pour détecter des vulnérabilités et permissions abusives.</p>
      </header>

      {!result && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`card p-16 border-dashed border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-beige-light/50 ${
            file ? 'border-primary' : 'border-beige-dark'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".apk"
          />
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <Upload size={32} />
          </div>
          {file ? (
            <div className="text-center">
              <p className="text-xl font-bold">{file.name}</p>
              <p className="text-text-secondary text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              <button 
                onClick={(e) => { e.stopPropagation(); startScan(); }}
                disabled={analyzing}
                className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg"
              >
                {analyzing ? <Activity className="animate-spin" /> : <ShieldAlert size={20} />}
                {analyzing ? 'Analyse en cours...' : 'Démarrer l\'Analyse'}
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl font-bold">Cliquez ou glissez un APK ici</p>
              <p className="text-text-secondary mt-2">Le fichier sera analysé localement dans votre navigateur.</p>
            </div>
          )}
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`card p-8 flex flex-col items-center justify-center text-center ${
              result.score < 50 ? 'bg-red-50' : result.score < 80 ? 'bg-orange-50' : 'bg-green-50'
            }`}>
              <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-4">Risk Score</h2>
              <div className="text-6xl font-black mb-2">{result.score}</div>
              <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                result.score < 50 ? 'bg-red-200 text-red-800' : result.score < 80 ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'
              }`}>
                {result.score < 50 ? 'Critique' : result.score < 80 ? 'Avertissement' : 'Sain'}
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="font-bold flex items-center gap-2">
                <Info size={18} className="text-primary" />
                Détails APK
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-beige-dark pb-2">
                  <span className="text-text-secondary">Package</span>
                  <span className="font-mono font-bold">{result.packageName}</span>
                </div>
                <div className="flex justify-between border-b border-beige-dark pb-2">
                  <span className="text-text-secondary">Version</span>
                  <span className="font-mono font-bold">{result.versionName} ({result.versionCode})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <AlertTriangle className="text-orange-500" />
                Vulnérabilités Statiques
              </h3>
              <div className="space-y-4">
                {result.findings.map((finding, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex items-start gap-4 ${
                    finding.severity === 'critical' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'
                  }`}>
                    <div className={`p-2 rounded-lg ${finding.severity === 'critical' ? 'bg-red-200 text-red-700' : 'bg-orange-200 text-orange-700'}`}>
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{finding.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{finding.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileCode className="text-primary" />
                Permissions Dangereuses ({result.dangerousPermissions.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.dangerousPermissions.map((perm, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="font-mono truncate">{perm.replace('android.permission.', '')}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-all"
            >
              Scanner un autre APK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default APKScannerView;
