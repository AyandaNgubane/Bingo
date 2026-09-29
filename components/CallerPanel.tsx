export default function CallerPanel({
  calledItems,
  totalItems,
  onDraw,
  drawDisabled,
}: {
  calledItems: string[];
  totalItems: number;
  onDraw: () => void;
  drawDisabled: boolean;
}) {
  const current = calledItems[calledItems.length - 1];
  const history = calledItems.slice(0, -1).reverse();

  return (
    <div className="max-w-lg mx-auto">
      <div className="parlor-card rounded-2xl p-8 shadow-card text-center mb-6">
        <div className="text-inkdeep/50 text-sm font-body mb-2">
          Call {calledItems.length} of {totalItems}
        </div>
        <div className="font-display font-black text-inkdeep text-3xl sm:text-4xl min-h-[3ch] break-words">
          {current ?? "—"}
        </div>
      </div>

      <button
        onClick={onDraw}
        disabled={drawDisabled}
        className="w-full rounded-xl bg-gold text-inkdeep font-display font-bold text-lg py-4 shadow-stamp hover:bg-goldbright transition-colors disabled:opacity-50 mb-6"
      >
        {drawDisabled ? "All items called" : current ? "Draw next" : "Draw first item"}
      </button>

      {history.length > 0 && (
        <div>
          <h3 className="font-display font-bold text-card mb-2 text-sm">Previously called</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((item, i) => (
              <span
                key={i}
                className="text-xs bg-card/10 border border-card/15 text-card rounded-full px-3 py-1"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
