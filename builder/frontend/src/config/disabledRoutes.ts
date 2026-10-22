// Pages that are not implemented yet. Remove a path from this list to turn the page back on.
// Disabled pages: no route is registered (URL shows the 404 page) and the sidebar link is hidden.
export const DISABLED_ROUTES: string[] = ["/ai", "/analytics", "/settings"];

export const isRouteDisabled = (path: string): boolean =>
  DISABLED_ROUTES.includes(path);
