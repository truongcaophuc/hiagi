export function getAuthToken(): string | null {
  try {
    // Prefer localStorage, then sessionStorage
    const ls = typeof localStorage !== "undefined" ? localStorage.getItem("bestlist_jwt") : null;
    if (ls) return ls;
    const ss = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("bestlist_jwt") : null;
    if (ss) return ss;

    // Fallback: try common cookie names
    if (typeof document !== "undefined") {
      const raw = document.cookie || "";
      const pairs = raw.split(";").map((s) => s.trim());
      const getCookie = (name: string): string | null => {
        const p = pairs.find((c) => c.startsWith(`${name}=`));
        return p ? decodeURIComponent(p.split("=")[1]) : null;
      };
      const candidates = ["bestlist_jwt", "token", "jwt", "access_token"];
      for (const k of candidates) {
        const v = getCookie(k);
        if (v) return v;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  try {
    if (typeof localStorage !== "undefined") localStorage.setItem("bestlist_jwt", token);
    // Also mirror to a cookie for broader availability (non-HTTP-only)
    if (typeof document !== "undefined") document.cookie = `bestlist_jwt=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}`;
  } catch {}
}