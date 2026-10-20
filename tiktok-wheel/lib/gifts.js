// Turns raw TikTok gift events into wheel spins.

const STREAKABLE_GIFT_TYPE = 1;

// Flattens a WebcastGiftMessage (tiktok-live-connector v2) into the fields the wheel needs.
// Also accepts the older "legacy" shape (giftDetails / uniqueId) so a library downgrade keeps working.
export function normalizeGift(data) {
    const gift = data.gift ?? data.giftDetails ?? {};
    const user = data.user ?? {};
    const giftType = gift.type ?? gift.giftType ?? data.giftType;
    const username = user.displayId || user.uniqueId || '';

    return {
        msgId: data.common?.msgId || null,
        userId: String(user.id || user.userId || username || 'unknown'),
        username,
        nickname: user.nickname || username || 'viewer',
        avatar: user.avatarThumb?.urlList?.[0] ?? user.avatarThumb?.url?.[0] ?? null,
        giftName: gift.name ?? gift.giftName ?? data.extendedGiftInfo?.name ?? '',
        coinsEach: Number(gift.diamondCount ?? data.extendedGiftInfo?.diamond_count ?? 0) || 0,
        count: Math.max(1, Number(data.repeatCount) || 1),
        // Streakable gifts fire repeatedly while the combo runs; only the final event carries the full count.
        streakInProgress: giftType === STREAKABLE_GIFT_TYPE && !data.repeatEnd
    };
}

export class SpinCounter {
    constructor({ coinsPerSpin, accumulateGifts, maxSpinsPerGift }) {
        this.coinsPerSpin = coinsPerSpin;
        this.accumulate = accumulateGifts;
        this.maxSpinsPerGift = maxSpinsPerGift;
        this.banks = new Map();
        this.seen = new Set();
    }

    // Returns how many spins a finished gift earns. Coins below coinsPerSpin are banked per
    // viewer (when accumulateGifts is on); coins beyond maxSpinsPerGift are dropped.
    add(gift) {
        if (gift.streakInProgress || this.isDuplicate(gift.msgId)) return { coins: 0, spins: 0, banked: this.banks.get(gift.userId) ?? 0 };

        const coins = gift.coinsEach * gift.count;
        const total = (this.accumulate ? this.banks.get(gift.userId) ?? 0 : 0) + coins;
        let spins = Math.floor(total / this.coinsPerSpin);
        const banked = this.accumulate ? total - spins * this.coinsPerSpin : 0;
        if (this.maxSpinsPerGift > 0) spins = Math.min(spins, this.maxSpinsPerGift);
        if (this.accumulate) this.banks.set(gift.userId, banked);
        return { coins, spins, banked };
    }

    isDuplicate(msgId) {
        if (!msgId) return false;
        if (this.seen.has(msgId)) return true;
        this.seen.add(msgId);
        if (this.seen.size > 1000) this.seen.delete(this.seen.values().next().value);
        return false;
    }
}

// Picks a segment index with probability weight / totalWeight, matching the slice sizes on screen.
export function pickSegment(segments, random = Math.random) {
    const total = segments.reduce((sum, s) => sum + s.weight, 0);
    let r = random() * total;
    for (let i = 0; i < segments.length; i++) {
        r -= segments[i].weight;
        if (r < 0) return i;
    }
    return segments.length - 1;
}
