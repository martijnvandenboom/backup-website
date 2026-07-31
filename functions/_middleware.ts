const canonicalHostname = "vandenboom.icu";
const pagesHostname = "backup-website.pages.dev";

function requiresCanonicalRedirect(hostname: string): boolean {
  return (
    hostname === "www.vandenboom.icu" ||
    hostname === pagesHostname ||
    hostname.endsWith(`.${pagesHostname}`)
  );
}

export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);

  if (!requiresCanonicalRedirect(url.hostname)) {
    return context.next();
  }

  url.protocol = "https:";
  url.hostname = canonicalHostname;
  url.port = "";

  return Response.redirect(url, 301);
};
