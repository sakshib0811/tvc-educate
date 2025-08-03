const requiredEnvVars = [
  'DB_USER',
  'DB_PASSWORD', 
  'DB_NAME',
  'JWT_KEY',
  'COOKIE_KEY',
  'NODE_ENV',
  'CLIENT_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET'
];

const optionalEnvVars = [
  'GOOGLE_API_KEY',
  'GH_CLIENT_ID',
  'GH_CLIENT_SECRET',
  'TWITTER_CONSUMER_KEY',
  'TWITTER_CONSUMER_SECRET',
  'PORT'
];

const validateEnvironment = () => {
  const missing = [];
  const warnings = [];

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  // Check optional variables and warn if missing
  optionalEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  });

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('⚠️  Missing optional environment variables:');
    warnings.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('\nThese are optional but may be needed for full functionality.\n');
  }

  console.log('✅ Environment validation passed');
};

module.exports = { validateEnvironment }; 