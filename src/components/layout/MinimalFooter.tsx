export default function MinimalFooter() {
  return (
    <footer className="w-full bg-gray-50 border-t z-10">
      <div className="mx-auto px-2 py-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Support
            </a>
          </div>
          <div>
            <img src="/images/logo/novaLearn-icon-80.png" alt="novaLearn Logo" className="h-8" />
          </div>
        </div>
      </div>
    </footer>
  );
} 