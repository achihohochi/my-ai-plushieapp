/**
 * Environment Variable Validation
 * 
 * Validates that all required environment variables are present at startup.
 * Prevents the application from running with missing or invalid configuration.
 * 
 * Security: Ensures secrets are properly configured before processing requests.
 */

// Define required environment variables by category
const REQUIRED_ENV_VARS = {
  database: ['DATABASE_URL'],
  stripe: [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ],
  admin: ['ADMIN_KEY'],
  app: ['NEXT_PUBLIC_BASE_URL'],
} as const;

// Optional environment variables (warn if missing but don't fail)
const OPTIONAL_ENV_VARS = {
  email: ['RESEND_API_KEY'],
  googleSheets: ['GOOGLE_SERVICE_ACCOUNT_KEY', 'GOOGLE_SHEETS_SPREADSHEET_ID'],
  auth: ['NEXTAUTH_URL', 'NEXTAUTH_SECRET'],
} as const;

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate all required environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  Object.entries(REQUIRED_ENV_VARS).forEach(([category, vars]) => {
    vars.forEach((varName) => {
      const value = process.env[varName];
      
      if (!value) {
        errors.push(`Missing required ${category} variable: ${varName}`);
      } else if (value.includes('your_') || value.includes('change-this')) {
        errors.push(
          `${varName} is not configured (still contains placeholder value)`
        );
      }
    });
  });

  // Check optional variables (warnings only)
  Object.entries(OPTIONAL_ENV_VARS).forEach(([category, vars]) => {
    const allMissing = vars.every((varName) => !process.env[varName]);
    if (allMissing) {
      warnings.push(
        `${category} not configured: ${vars.join(', ')} - Some features may be unavailable`
      );
    }
  });

  // Validate specific formats
  validateDatabaseUrl(errors);
  validateStripeKeys(errors);
  validateAdminKey(errors);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate DATABASE_URL format
 */
function validateDatabaseUrl(errors: string[]): void {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.startsWith('postgresql://')) {
    errors.push('DATABASE_URL must be a valid PostgreSQL connection string');
  }
}

/**
 * Validate Stripe API keys format
 */
function validateStripeKeys(errors: string[]): void {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (secretKey && !secretKey.startsWith('sk_')) {
    errors.push('STRIPE_SECRET_KEY must start with "sk_"');
  }

  if (publishableKey && !publishableKey.startsWith('pk_')) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with "pk_"');
  }

  // Ensure we're using test keys in development
  if (process.env.NODE_ENV !== 'production') {
    if (secretKey && !secretKey.startsWith('sk_test_')) {
      errors.push(
        'Development environment must use Stripe test keys (sk_test_...)'
      );
    }
    if (publishableKey && !publishableKey.startsWith('pk_test_')) {
      errors.push(
        'Development environment must use Stripe test keys (pk_test_...)'
      );
    }
  }
}

/**
 * Validate ADMIN_KEY strength
 */
function validateAdminKey(errors: string[]): void {
  const adminKey = process.env.ADMIN_KEY;
  
  if (adminKey) {
    if (adminKey.length < 16) {
      errors.push('ADMIN_KEY must be at least 16 characters long');
    }
    
    if (adminKey === 'change-this-to-a-secure-random-key') {
      errors.push('ADMIN_KEY must be changed from default value');
    }
  }
}

/**
 * Print validation results to console
 */
export function printValidationResults(result: ValidationResult): void {
  if (result.errors.length > 0) {
    console.error('\n❌ Environment Validation Failed:\n');
    result.errors.forEach((error) => {
      console.error(`  - ${error}`);
    });
    console.error('\n💡 Fix: Update your .env file with proper values');
    console.error('📖 See: .env.example for template\n');
  }

  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Environment Warnings:\n');
    result.warnings.forEach((warning) => {
      console.warn(`  - ${warning}`);
    });
    console.warn('');
  }

  if (result.isValid && result.warnings.length === 0) {
    console.log('✅ Environment validation passed\n');
  }
}

/**
 * Validate environment and throw error if invalid
 * Use this in server startup code
 */
export function validateEnvironmentOrThrow(): void {
  const result = validateEnvironment();
  printValidationResults(result);

  if (!result.isValid) {
    throw new Error(
      'Environment validation failed. Please check your .env file and ensure all required variables are set.'
    );
  }
}

/**
 * Check if a specific feature is configured
 */
export function isFeatureConfigured(
  feature: keyof typeof OPTIONAL_ENV_VARS
): boolean {
  const vars = OPTIONAL_ENV_VARS[feature];
  return vars.some((varName) => !!process.env[varName]);
}

/**
 * Get safe environment info for logging (never includes actual values)
 */
export function getSafeEnvInfo() {
  const info: Record<string, boolean> = {};

  // Check which required vars are set
  Object.entries(REQUIRED_ENV_VARS).forEach(([category, vars]) => {
    vars.forEach((varName) => {
      info[varName] = !!process.env[varName];
    });
  });

  // Check which optional features are configured
  Object.entries(OPTIONAL_ENV_VARS).forEach(([category, vars]) => {
    const isConfigured = vars.some((varName) => !!process.env[varName]);
    info[`${category}_configured`] = isConfigured;
  });

  return info;
}
