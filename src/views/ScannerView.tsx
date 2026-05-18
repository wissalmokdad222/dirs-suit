import React, { useState, useRef } from 'react';
import { APKScanner, APKAnalysisResult } from '../engine/APKScanner';
import { Upload, FileCode, ShieldAlert, Activity, AlertTriangle, Info, Package, Download } from 'lucide-react';

const ScannerView: React.FC = () => {
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
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult(scanResult);
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fade-in max-w-5xl mx-auto space-y-10">
      <header className="border-b border-beige-dark pb-6">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Audit Scanner</h1>
        <p className="text-text-secondary text-lg mt-2">Analyse de sécurité multidimensionnelle des fichiers APK.</p>
      </header>

      {!result && (
        <div className="space-y-8">
          {/* Main Upload Zone */}
          <div 
            className={`card p-16 border-dashed border-2 flex flex-col items-center justify-center transition-all bg-white/50 ${
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
            
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
              <Package size={44} />
            </div>

            {file ? (
              <div className="text-center space-y-4">
                <p className="text-2xl font-bold text-gray-900">{file.name}</p>
                <p className="text-text-secondary">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-2xl font-serif font-bold">Sélectionnez votre application</p>
                <p className="text-text-secondary max-w-md">Glissez-déposez le fichier .apk ici ou utilisez le bouton ci-dessous.</p>
              </div>
            )}
          </div>

          {/* Action Button - Specifically requested "bouton pour telecharger le fichier apk" */}
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-10 py-4 bg-beige-dark text-gray-900 rounded-xl font-bold flex items-center gap-3 hover:bg-beige-light transition-all shadow-md border border-beige-dark/20"
            >
              <Download size={24} />
              TÉLÉCHARGER LE FICHIER APK À ANALYSER
            </button>

            {file && (
              <button 
                onClick={startScan}
                disabled={analyzing}
                className="btn-primary px-12 py-5 text-xl shadow-xl shadow-primary/30 flex items-center gap-3 disabled:opacity-50 mt-4"
              >
                {analyzing ? <Activity className="animate-spin" /> : <ShieldAlert size={28} />}
                {analyzing ? 'ANALYSE EN COURS...' : 'LANCER L\'EXPERTISE APK'}
              </button>
            )}
          </div>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className={`card p-10 flex flex-col items-center justify-center text-center shadow-xl ${
              result.score < 50 ? 'bg-risk-danger/5 border-risk-danger/20' : result.score < 80 ? 'bg-risk-warning/5 border-risk-warning/20' : 'bg-risk-safe/5 border-risk-safe/20'
            }`}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-6">Expertise Security Score</h2>
              <div className={`text-8xl font-black mb-4 ${
                 result.score < 50 ? 'text-risk-danger' : result.score < 80 ? 'text-risk-warning' : 'text-risk-safe'
              }`}>{result.score}</div>
              <div className={`px-6 py-2 rounded-full text-xs font-bold uppercase ${
                result.score < 50 ? 'bg-risk-danger text-white' : result.score < 80 ? 'bg-risk-warning text-white' : 'bg-risk-safe text-white'
              }`}>
                {result.score < 50 ? 'RISQUE CRITIQUE' : result.score < 80 ? 'À SURVEILLER' : 'VÉRIFIÉ / SAIN'}
              </div>
            </div>

            <div className="card p-8">
              <h3 className="font-bold text-lg mb-6 border-b border-beige-light pb-4 flex items-center gap-2">
                <Info size={20} className="text-primary" />
                Détails du Binaire
              </h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase">Nom du Package</span>
                  <p className="font-mono text-sm font-bold break-all">{result.packageName}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase">Version Logicielle</span>
                  <p className="font-mono text-sm font-bold">{result.versionName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-8 bg-white/60 backdrop-blur-md border-none shadow-lg">
              <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                <ShieldAlert className="text-risk-danger" />
                Vérification des Menaces
              </h3>
              <div className="space-y-6">
                {result.findings.map((finding, i) => (
                  <div key={i} className="p-6 bg-white rounded-2xl border border-beige-dark/30 shadow-sm flex items-start gap-5">
                    <div className={`p-3 rounded-xl ${finding.severity === 'critical' ? 'bg-risk-danger text-white' : 'bg-risk-warning text-white'}`}>
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{finding.title}</h4>
                      <p className="text-sm text-text-secondary mt-2 leading-relaxed">{finding.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-8">
              <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3 text-gray-900">
                <FileCode className="text-primary" />
                Permissions Critiques ({result.dangerousPermissions.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.dangerousPermissions.map((perm, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-beige-light/30 rounded-xl border border-beige-dark/20">
                    <div className="w-2 h-2 bg-risk-danger rounded-full" />
                    <span className="font-mono text-sm font-bold text-gray-700">{perm.replace('android.permission.', '')}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full py-5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl"
            >
              ANALYSER UN AUTRE FICHIER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerView;
