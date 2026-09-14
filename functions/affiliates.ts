export const affiliateRedirects: Record<string, string> = {
  "/swiffer": "https://amzn.to/4j3OP8D",
};

export function affiliateDestination(pathname: string): string | undefined {
  const normalized = pathname.replace(/\/+$/, "").toLowerCase() || "/";
  return affiliateRedirects[normalized];
}
