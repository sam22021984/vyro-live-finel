/**
 * Shared responsive page wrapper styles
 * Enforces mobile-first, max-width centered layout across all pages
 */

export const pageWrapper = {
  minHeight: "100dvh",
  width: "100%",
  maxWidth: "100vw",
  overflowX: "hidden",
  boxSizing: "border-box",
};

export const pageInner = {
  width: "100%",
  maxWidth: 600,
  marginLeft: "auto",
  marginRight: "auto",
  boxSizing: "border-box",
};

export const stickyHeader = {
  position: "sticky",
  top: 0,
  zIndex: 50,
  width: "100%",
  boxSizing: "border-box",
};

export const safeBottomPad = {
  paddingBottom: "max(90px, calc(90px + env(safe-area-inset-bottom, 0px)))",
};