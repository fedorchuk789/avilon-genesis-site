/**
 * URL of a file in `public/`, respecting the site's base path.
 * On the normal build the base is `/`; the GitHub Pages build sets it to
 * `/<repo-name>/`, so hard-coded "/images/..." paths would 404 there.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
