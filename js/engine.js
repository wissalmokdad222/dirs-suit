/**
 * engine.js — Moteur de sécurité DIRS Elite
 * Logique de scoring, CVE database, Compliance NIST/OWASP
 */
const Engine = (function() {

    const CVE_DATABASE = [
        { id: 'CVE-2023-40121', title: 'RCE in System Component',      severity: 'Critical', score: 9.8, category: 'System',    date: '2023-11' },
        { id: 'CVE-2023-21214', title: 'Privilege Escalation in Kernel', severity: 'High',     score: 8.8, category: 'Kernel',    date: '2023-10' },
        { id: 'CVE-2023-21145', title: 'Info Disclosure in Framework',  severity: 'Medium',   score: 6.5, category: 'Framework', date: '2023-09' },
        { id: 'CVE-2022-20421', title: 'Denial of Service in Radio',    severity: 'Low',      score: 3.5, category: 'Hardware',  date: '2022-06' },
        { id: 'CVE-2024-0012',  title: 'Sandbox Escape in Runtime',     severity: 'Critical', score: 9.1, category: 'Runtime',   date: '2024-01' },
        { id: 'CVE-2023-45781', title: 'TrustZone Data Access',         severity: 'High',     score: 8.2, category: 'TEE',       date: '2023-12' }
    ];

    const ACADEMY_ARTICLES = [
        { id: 'boot-1',   icon: 'lock',   title: 'Sécurité du Bootloader',  desc: 'Pourquoi le verrouillage est la clé de voûte du Verified Boot et de la chaîne de confiance.', content: 'Le bootloader est le premier programme qui s\'exécute au démarrage. S\'il est déverrouillé, n\'importe quel système d\'exploitation, même malveillant, peut être chargé sur le terminal, brisant intégralement la chaîne de confiance.' },
        { id: 'root-1',   icon: 'unlock', title: 'Les Risques du Rooting',  desc: 'Comment le super-utilisateur brise le bac à sable Android et détruit l\'isolation des données.', content: 'Le rooting donne un accès root (UID 0) à l\'appareil. Cela désactive les protections SELinux et le bac à sable des applications (sandbox), permettant à n\'importe quel malware d\'accéder à toutes les données, y compris les clés cryptographiques.' },
        { id: 'crypto-1', icon: 'cpu',    title: 'Chiffrement & TEE',       desc: 'L\'importance du Trusted Execution Environment pour la sécurisation matérielle des données.', content: 'Le chiffrement basé sur le TEE (Trusted Execution Environment) stocke les clés dans une enclave sécurisée (ARM TrustZone). Même si le processeur principal est compromis, les clés restent physiquement inaccessibles.' }
    ];

    const REMEDIATION = {
        perm:       { title: 'Réduire les Permissions', impact: '+25 PTS SÉCURITÉ', steps: [{ text: 'Supprimez les permissions READ_SMS et ACCESS_FINE_LOCATION si non essentielles.' }, { text: 'Utilisez des Intents pour déléguer les actions au système.' }] },
        native:     { title: 'Audit du Code Natif', impact: '+15 PTS SÉCURITÉ', steps: [{ text: 'Analysez les fichiers .so avec un outil comme Ghidra ou IDA Pro.' }, { text: 'Vérifiez l\'absence de fonctions de debug ou de backdoors dans les libs C++.' }] },
        signature:  { title: 'Vérifier la Signature', impact: '+30 PTS SÉCURITÉ', steps: [{ text: 'Assurez-vous que l\'APK est signé avec V3 ou V4 (APK Signature Scheme).' }, { text: 'Vérifiez que le certificat n\'est pas expiré ou auto-signé par une autorité inconnue.' }] }
    };

    function computeScores(data) {
        let system = 100, privilege = 100, network = 90, crypto = 100;
        if (data.isApk) {
            if (data.permissionsCount > 10) privilege -= 30;
            if (data.hasNativeCode) system -= 15;
            if (parseFloat(data.fileSize) > 50) system -= 10;
        }
        const global = Math.round((system + privilege + network + crypto) / 4);
        return { categoryScores: { system, privilege, network, crypto }, globalScore: global };
    }

    function generateVulnerabilities(data) {
        const v = [];
        if (data.permissionsCount > 10) v.push({ id: 'perm', title: 'Permissions Excessives', desc: 'L\'APK demande plus de 10 permissions, augmentant la surface d\'attaque.', severity: 'high', cvss: '7.5' });
        if (data.hasNativeCode) v.push({ id: 'native', title: 'Librairies Natives Détectées', desc: 'L\'utilisation de code C/C++ (.so) peut masquer des comportements malveillants indétectables par scan Dalvik.', severity: 'medium', cvss: '5.8' });
        return v;
    }

    function getRiskLevel(score) {
        if (score >= 80) return { level: 'SÛR',      cssClass: 'safe',    color: '#4B6E4B' };
        if (score >= 60) return { level: 'SUSPECT',  cssClass: 'warning', color: '#C48D2A' };
        return              { level: 'DANGEREUX', cssClass: 'danger',  color: '#A64B4B' };
    }

    function getCompliance(data) {
        return [
            { std: 'OWASP',  control: 'MASVS-STORAGE',   desc: 'Data at rest protection',        ok: true },
            { std: 'OWASP',  control: 'MASVS-CRYPTO',    desc: 'Proper use of cryptographic APIs', ok: data.permissionsCount < 15 },
            { std: 'OWASP',  control: 'MASVS-NETWORK',   desc: 'Encrypted communication channels', ok: true },
            { std: 'OWASP',  control: 'MASVS-PLATFORM',  desc: 'Secure use of Android platform',   ok: !data.hasNativeCode }
        ];
    }

    return { CVE_DATABASE, ACADEMY_ARTICLES, REMEDIATION, computeScores, generateVulnerabilities, getRiskLevel, getCompliance };
})();
window.Engine = Engine;
