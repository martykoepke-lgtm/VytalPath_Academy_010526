export function StickyBanner() {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center">
          <img
            src="/vp-long-logo.png"
            alt="VytalPath Academy"
            className="h-14 w-auto"
          />
        </div>
      </div>
    </div>
  );
}
