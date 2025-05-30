// scripts/validate-gates.js
// Validates GATES configuration for proper access control

const fs = require('fs');
const path = require('path');

function loadGatesConfig() {
    try {
        const configPath = path.join(__dirname, '..', 'gates.config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config.gates;
    } catch (error) {
        console.error('❌ Failed to load GATES configuration:', error.message);
        process.exit(1);
    }
}

function validatePaths(config) {
    const results = {
        public: [],
        private: [],
        errors: []
    };

    // Check public paths exist
    config.access_control.public_paths.forEach(pattern => {
        const cleanPath = pattern.replace('/**', '');
        if (fs.existsSync(cleanPath)) {
            results.public.push(`✅ ${cleanPath}`);
        } else {
            results.errors.push(`❌ Public path not found: ${cleanPath}`);
        }
    });

    // Check private paths are protected
    config.access_control.private_paths.forEach(pattern => {
        const cleanPath = pattern.replace('/**', '');
        if (fs.existsSync(cleanPath)) {
            results.private.push(`🔒 ${cleanPath} (protected)`);
        }
    });

    // Check allowed files exist
    config.access_control.allowed_files.forEach(filePath => {
        if (fs.existsSync(filePath)) {
            results.public.push(`✅ ${filePath}`);
        } else {
            results.errors.push(`❌ Allowed file not found: ${filePath}`);
        }
    });

    return results;
}

function displayReport(results, config) {
    console.log('\n🚪 GATES Configuration Validation Report');
    console.log('=========================================\n');

    console.log(`📋 Configuration: ${config.name} v${config.version}`);
    console.log(`📝 Description: ${config.description}\n`);

    console.log('🌍 PUBLIC ACCESS (Allowed):');
    results.public.forEach(item => console.log(`  ${item}`));

    console.log('\n🔒 PRIVATE ACCESS (Protected):');
    results.private.forEach(item => console.log(`  ${item}`));

    if (results.errors.length > 0) {
        console.log('\n❌ ERRORS:');
        results.errors.forEach(error => console.log(`  ${error}`));
    }

    console.log('\n⚙️  SECURITY SETTINGS:');
    console.log(`  📁 Hide development files: ${config.security.hide_development_files}`);
    console.log(`  📂 Disable directory listing: ${config.security.disable_directory_listing}`);
    console.log(`  🚫 Blocked extensions: ${config.security.block_sensitive_extensions.join(', ')}`);
    console.log(`  ✅ Allowed extensions: ${config.security.allowed_extensions.join(', ')}`);

    console.log('\n🛡️  SECURITY HEADERS:');
    Object.entries(config.headers).forEach(([header, value]) => {
        console.log(`  ${header}: ${value}`);
    });

    console.log('\n📊 SUMMARY:');
    console.log(`  ✅ Public files accessible: ${results.public.length}`);
    console.log(`  🔒 Private files protected: ${results.private.length}`);
    console.log(`  ❌ Configuration errors: ${results.errors.length}`);

    if (results.errors.length === 0) {
        console.log('\n🎉 GATES configuration is valid and ready!');
        return true;
    } else {
        console.log('\n🚨 Please fix configuration errors before deployment.');
        return false;
    }
}

function main() {
    console.log('🔍 Validating GATES configuration...\n');

    const config = loadGatesConfig();
    const results = validatePaths(config);
    const isValid = displayReport(results, config);

    process.exit(isValid ? 0 : 1);
}

if (require.main === module) {
    main();
}

module.exports = { loadGatesConfig, validatePaths, displayReport };