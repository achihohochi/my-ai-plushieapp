#!/usr/bin/env node

/**
 * Security Scanner - Check for exposed secrets in codebase
 * 
 * Scans for common patterns of API keys, passwords, and tokens
 * Run before commits to ensure no secrets are exposed
 */

const fs = require('fs');
const path = require('path');

// Patterns to detect secrets
const SECRET_PATTERNS = [
  {
    name: 'Resend API Key',
    pattern: /RESEND_API_KEY\s*=\s*['"]?re_[A-Za-z0-9]+/gi,
    severity: 'HIGH',
  },
  {
    name: 'Stripe Secret Key',
    pattern: /STRIPE_SECRET_KEY\s*=\s*['"]?sk_[A-Za-z0-9]+/gi,
    severity: 'HIGH',
  },
  {
    name: 'Stripe Webhook Secret',
    pattern: /STRIPE_WEBHOOK_SECRET\s*=\s*['"]?whsec_[A-Za-z0-9]+/gi,
    severity: 'HIGH',
  },
  {
    name: 'Admin Key',
    pattern: /ADMIN_KEY\s*=\s*['"][A-Za-z0-9+\/=]{16,}['"]/gi,
    severity: 'MEDIUM',
  },
  {
    name: 'Generic API Key',
    pattern: /api[_-]?key\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/gi,
    severity: 'MEDIUM',
  },
  {
    name: 'Generic Secret',
    pattern: /secret\s*[:=]\s*['"][A-Za-z0-9+\/=]{16,}['"]/gi,
    severity: 'MEDIUM',
  },
  {
    name: 'Password',
    pattern: /password\s*[:=]\s*['"][^'"]+['"]/gi,
    severity: 'HIGH',
  },
  {
    name: 'Private Key',
    pattern: /-----BEGIN [A-Z ]+PRIVATE KEY-----/gi,
    severity: 'CRITICAL',
  },
];

// Files and directories to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  'build',
  'dist',
  'coverage',
  '.env.example',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.husky',
  'scripts/check-secrets.js',
  'SECURITY.md',
];

// File extensions to scan
const SCAN_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.md',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.txt',
  '.yml',
  '.yaml',
];

class SecretScanner {
  constructor() {
    this.findings = [];
    this.filesScanned = 0;
  }

  shouldIgnore(filePath) {
    return IGNORE_PATTERNS.some((pattern) => filePath.includes(pattern));
  }

  shouldScan(filePath) {
    return SCAN_EXTENSIONS.some((ext) => filePath.endsWith(ext));
  }

  scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);

      SECRET_PATTERNS.forEach((pattern) => {
        const matches = content.match(pattern.pattern);
        if (matches) {
          matches.forEach((match) => {
            this.findings.push({
              file: relativePath,
              pattern: pattern.name,
              severity: pattern.severity,
              match: this.maskSecret(match),
              line: this.getLineNumber(content, match),
            });
          });
        }
      });

      this.filesScanned++;
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error.message);
    }
  }

  maskSecret(text) {
    // Show first and last 4 characters, mask the rest
    if (text.length <= 8) return '****';
    return text.slice(0, 4) + '*'.repeat(text.length - 8) + text.slice(-4);
  }

  getLineNumber(content, match) {
    const lines = content.substring(0, content.indexOf(match)).split('\n');
    return lines.length;
  }

  scanDirectory(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (this.shouldIgnore(fullPath)) {
        continue;
      }

      if (entry.isDirectory()) {
        this.scanDirectory(fullPath);
      } else if (entry.isFile() && this.shouldScan(fullPath)) {
        this.scanFile(fullPath);
      }
    }
  }

  printResults() {
    console.log('\n🔍 Secret Scan Results\n');
    console.log(`Files scanned: ${this.filesScanned}\n`);

    if (this.findings.length === 0) {
      console.log('✅ No secrets detected in codebase\n');
      return 0;
    }

    console.log(`❌ Found ${this.findings.length} potential secret(s):\n`);

    // Group by severity
    const bySeverity = {
      CRITICAL: [],
      HIGH: [],
      MEDIUM: [],
    };

    this.findings.forEach((finding) => {
      bySeverity[finding.severity].push(finding);
    });

    // Print by severity
    Object.entries(bySeverity).forEach(([severity, findings]) => {
      if (findings.length === 0) return;

      const icon = severity === 'CRITICAL' ? '🚨' : severity === 'HIGH' ? '⚠️' : '⚡';
      console.log(`${icon} ${severity} Severity (${findings.length}):`);

      findings.forEach((finding, index) => {
        console.log(`  ${index + 1}. ${finding.file}:${finding.line}`);
        console.log(`     Type: ${finding.pattern}`);
        console.log(`     Match: ${finding.match}`);
        console.log('');
      });
    });

    console.log('📖 Recommendations:');
    console.log('  1. Remove secrets from source code');
    console.log('  2. Store secrets in .env file (gitignored)');
    console.log('  3. Use environment variables');
    console.log('  4. Revoke any exposed API keys');
    console.log('  5. See SECURITY.md for more info\n');

    return 1; // Exit code 1 to fail CI/CD
  }

  run(directory = process.cwd()) {
    console.log('🔒 Scanning for exposed secrets...\n');
    this.scanDirectory(directory);
    return this.printResults();
  }
}

// Run scanner
const scanner = new SecretScanner();
const exitCode = scanner.run();
process.exit(exitCode);
