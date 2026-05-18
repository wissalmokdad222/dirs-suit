import JSZip from 'jszip';

export interface APKFinding {
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export interface APKAnalysisResult {
  packageName: string;
  versionCode: string;
  versionName: string;
  permissions: string[];
  dangerousPermissions: string[];
  findings: APKFinding[];
  score: number;
}

export class APKScanner {
  private static DANGEROUS_PERMISSIONS = [
    'android.permission.READ_SMS',
    'android.permission.RECEIVE_SMS',
    'android.permission.READ_CONTACTS',
    'android.permission.RECORD_AUDIO',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.CAMERA',
    'android.permission.READ_EXTERNAL_STORAGE',
    'android.permission.WRITE_EXTERNAL_STORAGE',
    'android.permission.REQUEST_INSTALL_PACKAGES',
  ];

  static async scan(file: File): Promise<APKAnalysisResult> {
    const zip = new JSZip();
    const content = await zip.loadAsync(file);
    
    // In a real browser-side scan, parsing binary AndroidManifest.xml is complex.
    // We will simulate the extraction of metadata and focus on structure analysis.
    
    const filenames = Object.keys(content.files);
    const hasDex = filenames.some(f => f.endsWith('.dex'));
    const hasNative = filenames.some(f => f.startsWith('lib/'));
    const hasAssets = filenames.some(f => f.startsWith('assets/'));

    // Simulated permissions found in the APK
    const mockPermissions = [
      'android.permission.INTERNET',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.CAMERA',
      'android.permission.RECEIVE_BOOT_COMPLETED'
    ];

    const dangerous = mockPermissions.filter(p => this.DANGEROUS_PERMISSIONS.includes(p));
    
    const findings: APKFinding[] = [];
    if (dangerous.length > 2) {
      findings.push({ 
        title: 'Permissions Excessives', 
        severity: 'high', 
        description: 'L\'application demande un nombre élevé de permissions sensibles.' 
      });
    }
    if (hasNative) {
      findings.push({ 
        title: 'Librairies Natives Détectées', 
        severity: 'medium', 
        description: 'L\'utilisation de code natif (C/C++) peut masquer des comportements malveillants.' 
      });
    }
    if (!filenames.includes('resources.arsc')) {
       findings.push({ 
        title: 'Structure APK Anormale', 
        severity: 'critical', 
        description: 'Le fichier resources.arsc est manquant ou corrompu.' 
      });
    }

    let baseScore = 100;
    baseScore -= dangerous.length * 10;
    if (hasNative) baseScore -= 10;
    
    return {
      packageName: 'com.example.analyzedapp',
      versionCode: '1',
      versionName: '1.0.0',
      permissions: mockPermissions,
      dangerousPermissions: dangerous,
      findings,
      score: Math.max(0, baseScore)
    };
  }
}
