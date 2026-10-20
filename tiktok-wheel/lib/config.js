import fs from 'node:fs';

const DEFAULTS = {
    tiktokUsername: '',
    signApiKey: '',
    host: '127.0.0.1',
    port: 8080,
    coinsPerSpin: 1000,
    accumulateGifts: true,
    maxSpinsPerGift: 3,
    spinDurationMs: 7000,
    resultDisplayMs: 6000,
    alwaysVisible: false,
    title: '',
    segments: []
};

export function loadConfig(file) {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
    const config = { ...DEFAULTS, ...raw };

    // Environment variables win over the file so the same folder can serve several accounts.
    if (process.env.TIKTOK_USERNAME) config.tiktokUsername = process.env.TIKTOK_USERNAME;
    if (process.env.SIGN_API_KEY) config.signApiKey = process.env.SIGN_API_KEY;
    if (process.env.PORT) config.port = Number(process.env.PORT);

    config.tiktokUsername = String(config.tiktokUsername || '').trim().replace(/^@/, '');
    validate(config);
    return config;
}

function validate(config) {
    const problems = [];
    if (!(config.coinsPerSpin > 0)) problems.push('coinsPerSpin must be a positive number');
    if (!(config.maxSpinsPerGift >= 0)) problems.push('maxSpinsPerGift must be 0 (no limit) or more');
    if (!(config.spinDurationMs >= 1000)) problems.push('spinDurationMs must be at least 1000');
    if (!(config.resultDisplayMs >= 0)) problems.push('resultDisplayMs must be 0 or more');
    if (!Array.isArray(config.segments) || config.segments.length < 2) {
        problems.push('segments needs at least 2 entries');
    } else {
        config.segments.forEach((s, i) => {
            if (!s || typeof s.label !== 'string' || !s.label.trim()) problems.push(`segments[${i}].label is missing`);
            // Every slice must be winnable: the slice size on screen is drawn from its weight.
            if (!(s?.weight > 0)) problems.push(`segments[${i}].weight must be greater than 0`);
        });
    }
    if (problems.length) throw new Error(`config.json is invalid:\n  - ${problems.join('\n  - ')}`);
}
