export type DataType = 'API_KEY' | 'JWT' | 'EMAIL' | 'PII' | 'HEALTH' | 'PASSWORD' | 'PLAINTEXT';

export interface StorageFinding {
  path: string;
  type: DataType;
  contentSnippet: string;
  riskLevel: 'critical' | 'high' | 'medium';
  recommendation: string;
}

export interface StorageAuditResult {
  totalFindings: number;
  criticalIssues: number;
  findings: StorageFinding[];
  remediationPlan: string[];
}

export class StorageInspector {
  private static SENSITIVE_PATTERNS = [
    { type: 'JWT' as DataType, regex: /eyJ[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*/g },
    { type: 'EMAIL' as DataType, regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
    { type: 'API_KEY' as DataType, regex: /(AIza[0-9A-Za-z-_]{35})|(sk_live_[0-9a-zA-Z]{24})/g },
    { type: 'PASSWORD' as DataType, regex: /(password|passwd|secret|key|token)["\s:]+["']([^"']+)["']/gi },
  ];

  static inspect(files: Array<{ path: string, content: string }>): StorageAuditResult {
    const findings: StorageFinding[] = [];

    files.forEach(file => {
      this.SENSITIVE_PATTERNS.forEach(pattern => {
        const matches = file.content.match(pattern.regex);
        if (matches) {
          matches.forEach(match => {
            findings.push({
              path: file.path,
              type: pattern.type,
              contentSnippet: match.substring(0, 15) + '...',
              riskLevel: this.getRiskLevel(pattern.type),
              recommendation: this.getRecommendation(pattern.type, file.path)
            });
          });
        }
      });
    });

    const criticalIssues = findings.filter(f => f.riskLevel === 'critical').length;
    
    return {
      totalFindings: findings.length,
      criticalIssues,
      findings,
      remediationPlan: this.generateRemediationPlan(findings)
    };
  }

  private static getRiskLevel(type: DataType): 'critical' | 'high' | 'medium' {
    switch (type) {
      case 'JWT': return 'high';
      case 'API_KEY': return 'critical';
      case 'PASSWORD': return 'critical';
      case 'EMAIL': return 'medium';
      default: return 'medium';
    }
  }

  private static getRecommendation(type: DataType, path: string): string {
    if (path.includes('shared_prefs')) {
      return "Utilisez 'EncryptedSharedPreferences' de la librairie Jetpack Security.";
    }
    if (path.includes('.db')) {
      return "Utilisez SQLCipher avec Room pour le chiffrement au repos.";
    }
    return "Stockez cette donnée dans le Android Keystore ou utilisez un chiffrement AES-GCM.";
  }

  private static generateRemediationPlan(findings: StorageFinding[]): string[] {
    const plan = new Set<string>();
    findings.forEach(f => plan.add(f.recommendation));
    
    if (plan.size === 0) {
      return ["Aucune action requise. Toutes les données semblent sécurisées."];
    }

    return Array.from(plan);
  }
}
