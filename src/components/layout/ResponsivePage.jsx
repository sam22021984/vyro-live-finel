/**
 * ResponsivePage — Global mobile-first page wrapper
 * Wrap every page's root div with this to ensure:
 * - No horizontal overflow on any device
 * - Safe-area bottom padding
 * - Centered max-width for tablet/desktop
 * - Consistent font baseline
 *
 * Usage:
 *   <ResponsivePage>...</ResponsivePage>
 *   <ResponsivePage maxWidth={800} bg="#fff">...</ResponsivePage>
 */

export default function ResponsivePage({
  children,
  bg = "#FFFFFF",
  maxWidth = null,
  centered = false,
  className = "",
  style = {},
}) {
  return (
    <div
      className={className}
      style={{
        minHeight: "100dvh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        boxSizing: "border-box",
        fontFamily: "'Inter', system-ui, sans-serif",
        background: bg,
        paddingBottom: "max(90px, calc(90px + env(safe-area-inset-bottom, 0px)))",
        ...(centered && maxWidth
          ? { display: "flex", flexDirection: "column", alignItems: "center" }
          : {}),
        ...style,
      }}
    >
      {maxWidth ? (
        <div
          style={{
            width: "100%",
            maxWidth,
            marginLeft: "auto",
            marginRight: "auto",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}