export function VisualPlaceholder({
  label,
  brief,
  aspect = '16 / 10',
}: {
  label: string;
  brief: string;
  aspect?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Image placeholder: ${label}. ${brief}`}
      className="relative grid w-full place-items-center overflow-hidden border border-inkBlack/15 bg-paperDeep/45 p-8 text-center"
      style={{ aspectRatio: aspect }}
    >
      <div aria-hidden className="absolute inset-4 border border-inkBlack/[0.08]" />
      <div className="relative max-w-[34rem]">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-inkBlack/40">Image placeholder</p>
        <p className="mt-3 font-serifDisplay text-[clamp(1.2rem,2.4vw,1.8rem)] leading-tight">{label}</p>
        <p className="mt-3 font-serifDisplay text-[15px] italic leading-relaxed text-inkBlack/55">{brief}</p>
      </div>
    </div>
  );
}
