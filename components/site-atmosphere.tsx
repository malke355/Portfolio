/**
 * Global atmospheric backdrop — decorative only.
 * Keeps page content untouched while giving the portfolio depth.
 */
export function SiteAtmosphere() {
  return (
    <div
      aria-hidden
      className="site-atmosphere pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      <div className="atmosphere-base absolute inset-0" />
      <div className="atmosphere-mesh absolute inset-0" />
      <div className="atmosphere-beam atmosphere-beam-a absolute" />
      <div className="atmosphere-beam atmosphere-beam-b absolute" />
      <div className="atmosphere-beam atmosphere-beam-c absolute" />
      <div className="atmosphere-vignette absolute inset-0" />
      <div className="atmosphere-noise absolute inset-0 opacity-[0.035] dark:opacity-[0.055]" />
    </div>
  )
}
