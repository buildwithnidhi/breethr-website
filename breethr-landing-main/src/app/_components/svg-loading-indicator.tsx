"use client";

/**
 * Simple background placeholder shown while video frames load.
 * Matches the page-loader's ice-blue so there's no flash on exit.
 */
export function SvgLoadingIndicator() {
  return (
    <div
      className="absolute inset-0"
      style={{ backgroundColor: "#D6F0F7" }}
    />
  );
}
