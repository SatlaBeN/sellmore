
export type WhopMe = {
  id: string;
  email?: string;
  active_license?: { id: string; status: string; plan?: { name?: string } };
};

export async function verifyWhopToken(token: string): Promise<WhopMe | null> {
  const res = await fetch("https://api.whop.com/api/v2/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    return null;
  }
  return (await res.json()) as WhopMe;
}

export function buildWhopCheckoutUrl(slug: string, params?: Record<string, string | number>): string {
  const base = process.env.WHOP_CHECKOUT_BASE as string;
  const url = new URL(`${base}/${slug}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  return url.toString();
}
