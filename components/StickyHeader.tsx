// Deprecated. The active sticky header is `StickyHeader.client.tsx`, which is
// mounted via `StickyHeaderWrapper`. This file used to contain a separate
// timer implementation that competed with the inline countdown in
// `app/layout.tsx` -- it is kept as a thin re-export so any stale import
// continues to render the correct (single) header.
export { default } from './StickyHeader.client';
