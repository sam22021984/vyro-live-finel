export default function Home() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0D0D1A]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl">
          🎙️
        </div>
        <h1 className="text-white text-3xl font-bold tracking-wide">VYRO LIVE</h1>
        <p className="text-purple-400 text-sm">Fresh start — ready to build</p>
      </div>
    </div>
  );
}