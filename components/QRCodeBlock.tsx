export default function QRCodeBlock({ url, size = 220 }: { url: string; size?: number }) {
  const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(
    url
  )}`;
  return (
    <div className="bg-card rounded-xl p-3 inline-block shadow-stamp">
      {/* External QR generator: convenience only, board data never leaves the player's device via this. */}
      <img src={src} alt="QR code to join the game" width={size} height={size} />
    </div>
  );
}
