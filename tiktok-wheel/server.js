import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { ControlEvent, TikTokLiveConnection, WebcastEvent } from 'tiktok-live-connector';
import { loadConfig } from './lib/config.js';
import { normalizeGift, pickSegment, SpinCounter } from './lib/gifts.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(ROOT, 'public');
const RESULTS_FILE = path.join(ROOT, 'results.csv');
const RECONNECT_DELAY_MS = 30_000;

const config = loadConfig(path.join(ROOT, 'config.json'));
const counter = new SpinCounter(config);

// ---------- Spin queue ----------

const queue = [];
const recentResults = [];
let current = null;
let nextSpinId = 1;
let tiktokStatus = { state: 'idle', detail: '' };

function enqueueSpins(gift, coins, spins, { test = false } = {}) {
    for (let i = 1; i <= spins; i++) {
        queue.push({
            id: nextSpinId++,
            test,
            username: gift.username,
            nickname: gift.nickname,
            avatar: gift.avatar,
            giftName: gift.giftName,
            coins,
            spinNumber: i,
            spinsTotal: spins
        });
    }
    broadcastState();
    runNextSpin();
}

function runNextSpin() {
    if (current || queue.length === 0) return;
    current = queue.shift();
    current.segmentIndex = pickSegment(config.segments);
    current.result = config.segments[current.segmentIndex].label;
    broadcast({ type: 'spin', spin: current });
    broadcastState();

    const spin = current;
    setTimeout(() => recordResult(spin), config.spinDurationMs);
    setTimeout(() => {
        current = null;
        broadcast({ type: 'idle' });
        broadcastState();
        runNextSpin();
    }, config.spinDurationMs + config.resultDisplayMs);
}

function recordResult(spin) {
    const entry = { at: new Date().toISOString(), ...spin };
    recentResults.unshift(entry);
    recentResults.length = Math.min(recentResults.length, 50);
    console.log(`[wheel] ${spin.test ? '(test) ' : ''}@${spin.username || spin.nickname} -> ${spin.result}`);
    if (!spin.test) appendResultRow(entry);
    broadcastState();
}

function appendResultRow(entry) {
    const csv = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const header = fs.existsSync(RESULTS_FILE) ? '' : '﻿time,username,nickname,gift,coins,result\n';
    const row = [entry.at, entry.username, entry.nickname, entry.giftName, entry.coins, entry.result].map(csv).join(',');
    fs.appendFile(RESULTS_FILE, `${header}${row}\n`, (err) => err && console.error('[wheel] could not write results.csv:', err.message));
}

// ---------- TikTok LIVE ----------

function handleGift(data) {
    const gift = normalizeGift(data);
    const { coins, spins, banked } = counter.add(gift);
    if (!coins) return;
    console.log(`[gift] @${gift.username} sent ${gift.count}x ${gift.giftName} (${coins} coins) -> ${spins} spin(s), ${banked} banked`);
    if (spins > 0) enqueueSpins(gift, coins, spins);
}

function setTikTokStatus(state, detail = '') {
    tiktokStatus = { state, detail };
    console.log(`[tiktok] ${state}${detail ? `: ${detail}` : ''}`);
    broadcastState();
}

function startTikTok() {
    if (!config.tiktokUsername || config.tiktokUsername === 'your_tiktok_username') {
        setTikTokStatus('not-configured', 'set tiktokUsername in config.json');
        return;
    }

    const connection = new TikTokLiveConnection(config.tiktokUsername, {
        signApiKey: config.signApiKey || undefined
    });
    let reconnectTimer = null;

    const scheduleReconnect = () => {
        if (reconnectTimer) return;
        reconnectTimer = setTimeout(() => {
            reconnectTimer = null;
            connect();
        }, RECONNECT_DELAY_MS);
    };

    const connect = async () => {
        if (connection.isConnected || connection.isConnecting) return;
        setTikTokStatus('connecting', `@${config.tiktokUsername}`);
        try {
            const state = await connection.connect();
            setTikTokStatus('connected', `@${config.tiktokUsername} (room ${state.roomId})`);
        } catch (err) {
            setTikTokStatus('offline', `${err?.message || err} - retrying in ${RECONNECT_DELAY_MS / 1000}s`);
            scheduleReconnect();
        }
    };

    connection.on(WebcastEvent.GIFT, (data) => {
        try {
            handleGift(data);
        } catch (err) {
            console.error('[gift] failed to handle gift:', err);
        }
    });
    connection.on(WebcastEvent.STREAM_END, () => setTikTokStatus('offline', 'stream ended'));
    connection.on(ControlEvent.DISCONNECTED, () => {
        setTikTokStatus('offline', `disconnected - retrying in ${RECONNECT_DELAY_MS / 1000}s`);
        scheduleReconnect();
    });
    connection.on(ControlEvent.ERROR, (err) => console.error('[tiktok] error:', err?.info || err?.message || err));

    connect();
}

// ---------- Web server (overlay + control panel) ----------

const CONTENT_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
};

const server = http.createServer((req, res) => {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
        res.writeHead(400).end();
        return;
    }
    const file = path.join(PUBLIC_DIR, pathname === '/' ? '/control.html' : pathname);
    if (!file.startsWith(PUBLIC_DIR + path.sep)) {
        res.writeHead(403).end();
        return;
    }
    fs.readFile(file, (err, body) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
            return;
        }
        res.writeHead(200, {
            'Content-Type': CONTENT_TYPES[path.extname(file)] || 'application/octet-stream',
            'Cache-Control': 'no-store'
        });
        res.end(body);
    });
});

// Only pages served by this server may connect, so another website open in the browser can't fake spins.
const wss = new WebSocketServer({
    server,
    path: '/ws',
    verifyClient: ({ origin, req }) => {
        if (!origin) return true;
        try {
            return new URL(origin).host === req.headers.host;
        } catch {
            return false;
        }
    }
});

function publicConfig() {
    const { segments, spinDurationMs, resultDisplayMs, alwaysVisible, title, coinsPerSpin } = config;
    return { segments, spinDurationMs, resultDisplayMs, alwaysVisible, title, coinsPerSpin };
}

function stateMessage() {
    return {
        type: 'state',
        tiktok: tiktokStatus,
        queueLength: queue.length,
        current,
        recentResults
    };
}

function broadcast(message) {
    const payload = JSON.stringify(message);
    for (const client of wss.clients) {
        if (client.readyState === client.OPEN) client.send(payload);
    }
}

function broadcastState() {
    broadcast(stateMessage());
}

wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'config', config: publicConfig() }));
    socket.send(JSON.stringify(stateMessage()));

    socket.on('message', (raw) => {
        let message;
        try {
            message = JSON.parse(raw);
        } catch {
            return;
        }
        if (message.type === 'test') {
            const name = String(message.nickname || 'tester').slice(0, 40);
            const coins = Number(message.coins) || config.coinsPerSpin;
            const fakeGift = {
                msgId: null,
                userId: `test:${name}`,
                username: name,
                nickname: name,
                avatar: null,
                giftName: 'Test gift',
                coinsEach: coins,
                count: 1,
                streakInProgress: false
            };
            const { spins } = counter.add(fakeGift);
            if (spins > 0) enqueueSpins(fakeGift, coins, spins, { test: true });
        } else if (message.type === 'clearQueue') {
            queue.length = 0;
            broadcastState();
        }
    });
});

server.listen(config.port, config.host, () => {
    const base = `http://${config.host === '0.0.0.0' ? 'localhost' : config.host}:${config.port}`;
    console.log('');
    console.log(`  Control panel:  ${base}/control.html`);
    console.log(`  Overlay (add as a browser/link source):  ${base}/overlay.html`);
    console.log('');
    startTikTok();
});
