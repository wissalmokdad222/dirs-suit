export interface IntegritySignals {
  debugEnabled: boolean;
  buildTags: 'release-keys' | 'test-keys' | 'dev-keys';
  integrityBase: boolean; // System partition integrity
  dangerousConfig: boolean; // e.g. permissive SELinux, custom kernels
  permissions: {
    excessiveRuntime: boolean;
    accessibilityAbuse: boolean;
    overlayActive: boolean;
  };
  hookDetected: boolean; // Frida/Xposed
  rootDetected: boolean;
}

export interface IntegrityReport {
  score: number;
  level: 'secure' | 'warning' | 'critical';
  explanation: string;
  signals: IntegritySignals;
}

export class IntegrityScorer {
  static analyze(signals: IntegritySignals): IntegrityReport {
    let baseScore = 100;
    const deductions: string[] = [];

    if (signals.rootDetected) {
      baseScore -= 40;
      deductions.push("L'accès Root compromet totalement l'isolation des processus.");
    }

    if (signals.hookDetected) {
      baseScore -= 35;
      deductions.push("Des frameworks de hook (Frida/Xposed) ont été détectés en mémoire.");
    }

    if (signals.debugEnabled) {
      baseScore -= 15;
      deductions.push("Le mode Debug (ADB) est activé, facilitant l'exploitation locale.");
    }

    if (signals.buildTags !== 'release-keys') {
      baseScore -= 10;
      deductions.push(`Build non officiel détecté (${signals.buildTags}).`);
    }

    if (!signals.integrityBase) {
      baseScore -= 25;
      deductions.push("L'intégrité de la partition système est compromise.");
    }

    if (signals.dangerousConfig) {
      baseScore -= 20;
      deductions.push("Configuration kernel ou SELinux dangereuse détectée.");
    }

    const finalScore = Math.max(0, baseScore);
    
    let level: 'secure' | 'warning' | 'critical' = 'secure';
    if (finalScore < 50) level = 'critical';
    else if (finalScore < 85) level = 'warning';

    // AI Explanation Generator (Simulated)
    const explanation = this.generateAIExplanation(signals, deductions);

    return {
      score: finalScore,
      level,
      explanation,
      signals
    };
  }

  private static generateAIExplanation(signals: IntegritySignals, deductions: string[]): string {
    if (deductions.length === 0) {
      return "L'appareil présente un profil d'intégrité excellent. Aucun indicateur de compromission n'a été détecté.";
    }

    const aiSummary = `L'audit a identifié ${deductions.length} signaux critiques. ${deductions.join(' ')} `;
    
    if (signals.rootDetected && signals.hookDetected) {
      return aiSummary + "Avertissement : L'appareil semble être configuré pour une analyse offensive ou est activement compromis par un attaquant expérimenté.";
    }

    if (signals.buildTags === 'test-keys' && !signals.rootDetected) {
      return aiSummary + "Note : Il s'agit probablement d'une ROM personnalisée légitime, mais son niveau de confiance reste inférieur à une version certifiée constructeur.";
    }

    return aiSummary;
  }
}
