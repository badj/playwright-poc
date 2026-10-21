/*********************************************************************************************************************
 * Postinstall patch for playwright-ai-reporter (v0.1.3).
 * The Anthropic provider always sends `temperature`, which current Claude models reject with:
 *   400 invalid_request_error: "`temperature` is deprecated for this model."
 * This stops it being sent unless ANTHROPIC_SEND_TEMPERATURE=true. Remove this script once the reporter is fixed upstream.
 *********************************************************************************************************************/
const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, '..', 'node_modules', 'playwright-ai-reporter', 'dist', 'providers', 'ai', 'AnthropicProvider.js');
const original = 'if (config.temperature !== undefined)\n';
const patched = 'if (config.temperature !== undefined && process.env.ANTHROPIC_SEND_TEMPERATURE === "true")\n';

if (!fs.existsSync(file)) {
    console.log('[patch-ai-reporter] playwright-ai-reporter not installed - skipping');
    process.exit(0);
}

const source = fs.readFileSync(file, 'utf8');
if (source.includes(patched)) {
    console.log('[patch-ai-reporter] already patched');
} else if (source.includes(original)) {
    fs.writeFileSync(file, source.replace(original, patched));
    console.log('[patch-ai-reporter] patched AnthropicProvider to omit temperature');
} else {
    console.warn('[patch-ai-reporter] expected code not found - reporter may have changed upstream; check whether this patch is still needed');
}
